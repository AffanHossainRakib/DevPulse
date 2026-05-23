export interface IIssue {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status: "open" | "in_progress" | "resolved";
  reporter_id: number;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface INewIssue {
  title: string;
  description: string;
  type: "bug" | "feature_request";
  reporter_id: number;
}

export interface IUpdateIssuePayload {
  title?: string;
  description?: string;
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
}

export interface IReporterLite {
  id: number;
  name: string;
  role: string;
}

export interface IIssueWithReporter extends IIssue {
  reporter: IReporterLite | null;
}

export interface IQueryFilters {
  sort?: string;
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
}
