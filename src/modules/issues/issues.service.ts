import { pool } from "../../db";
import type {
  IIssue,
  INewIssue,
  IUpdateIssuePayload,
  IReporterLite,
  IIssueWithReporter,
  IQueryFilters,
} from "./issues.interface";
import type { IRequestUser } from "../../types";

const createIssue = async (payload: INewIssue): Promise<IIssue> => {
  const text = `INSERT INTO issues (title, description, type, status, reporter_id, created_at, updated_at) VALUES ($1,$2,$3,'open',$4,now(),now()) RETURNING *`;
  const values = [
    payload.title,
    payload.description,
    payload.type,
    payload.reporter_id,
  ];
  const res = await pool.query<IIssue>(text, values);
  if (!res.rows[0]) {
    throw new Error("Failed to create issue");
  }

  return res.rows[0];
};

const getAllIssues = async (queryParams: IQueryFilters): Promise<IIssueWithReporter[]> => {
  const { sort, type, status } = queryParams;
  let text = `SELECT * FROM issues`;
  const conditions: string[] = [];
  const values: Array<any> = [];
  let idx = 1;
  if (type) {
    conditions.push(`type = $${idx++}`);
    values.push(type);
  }
  if (status) {
    conditions.push(`status = $${idx++}`);
    values.push(status);
  }
  if (conditions.length) text += ` WHERE ` + conditions.join(" AND ");
  if (sort === "oldest") text += ` ORDER BY created_at ASC`;
  else text += ` ORDER BY created_at DESC`;

  const res = await pool.query<IIssue>(text, values);
  const issues = res.rows;

  // batch fetch reporters
  const reporterIds = Array.from(new Set(issues.map((i) => i.reporter_id)));
  if (reporterIds.length === 0) {
    return issues.map((issue) => ({
      ...issue,
      reporter: null,
    }));
  }
  const usersRes = await pool.query<IReporterLite>(
    `SELECT id, name, role FROM users WHERE id = ANY($1::int[])`,
    [reporterIds],
  );
  const userMap = new Map(usersRes.rows.map((u) => [u.id, u]));
  return issues.map((issue) => ({
    ...issue,
    reporter: userMap.get(issue.reporter_id) || null,
  }));
};

const getIssueById = async (id: number): Promise<IIssueWithReporter | null> => {
  const res = await pool.query<IIssue>(`SELECT * FROM issues WHERE id = $1`, [id]);
  const issue = res.rows[0];
  if (!issue) return null;
  const userRes = await pool.query<IReporterLite>(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id],
  );
  return {
    ...issue,
    reporter: userRes.rows[0] || null,
  };
};

const updateIssue = async (
  id: number,
  user: IRequestUser,
  payload: IUpdateIssuePayload,
): Promise<IIssue> => {
  const existing = await pool.query<IIssue>(
    `SELECT * FROM issues WHERE id = $1`,
    [id],
  );
  const issue = existing.rows[0];
  if (!issue) {
    const err = new Error("Issue not found") as Error & { status?: number };
    err.status = 404;
    throw err;
  }

  // maintainers can update any issue
  if (user.role !== "maintainer") {
    // contributors can update only their own issues when status is open
    if (issue.reporter_id !== user.id || issue.status !== "open") {
      const err = new Error("Forbidden") as Error & { status?: number };
      err.status = 403;
      throw err;
    }
  }

  const fields: string[] = [];
  const values: Array<any> = [];
  let idx = 1;
  if (payload.title) {
    fields.push(`title = $${idx++}`);
    values.push(payload.title);
  }
  if (payload.description) {
    fields.push(`description = $${idx++}`);
    values.push(payload.description);
  }
  if (payload.type) {
    fields.push(`type = $${idx++}`);
    values.push(payload.type);
  }
  if (payload.status && user.role === "maintainer") {
    fields.push(`status = $${idx++}`);
    values.push(payload.status);
  }

  if (fields.length === 0) return issue;
  const text = `UPDATE issues SET ${fields.join(", ")}, updated_at = now() WHERE id = $${idx} RETURNING *`;
  const queryValues = [...values, id];
  const res = await pool.query<IIssue>(text, queryValues);
  if (!res.rows[0]) {
    throw new Error("Failed to update issue");
  }

  return res.rows[0];
};

const deleteIssue = async (id: number, user: IRequestUser): Promise<void> => {
  const existing = await pool.query<IIssue>(
    `SELECT * FROM issues WHERE id = $1`,
    [id],
  );
  const issue = existing.rows[0];
  if (!issue) {
    const err = new Error("Issue not found") as Error & { status?: number };
    err.status = 404;
    throw err;
  }

  if (user.role !== "maintainer") {
    const err = new Error("Forbidden") as Error & { status?: number };
    err.status = 403;
    throw err;
  }
  await pool.query(`DELETE FROM issues WHERE id = $1`, [id]);
};

export const issuesService = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
};
