module.exports = async (req, res) => {
  const { default: handler } = await import("../dist/serverless.js");
  return handler(req, res);
};
