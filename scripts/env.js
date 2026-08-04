function required(key) {
  const value = process.env[key];
  if (!value || !value.trim()) {
    throw new Error(`[ENV] Missing required bootstrap environment variable: ${key}`);
  }
  return value.trim();
}

module.exports = { bootstrapEnv: { OMNIXYS_TOKEN: required("OMNIXYS_TOKEN") } };
