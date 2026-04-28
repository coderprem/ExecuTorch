/**
 * Replaces `process.env.HF_INFERENCE_API_KEY` with the value from the repo-root `.env` file
 * at bundle time so secrets are not committed in TS source (keep `.env` gitignored).
 *
 * Only this key is inlined (whitelist) to avoid leaking other env vars into the JS bundle.
 */
const fs = require('fs');
const path = require('path');

const DOTENV_PATH = path.join(__dirname, '..', '.env');
const WHITELIST = new Set([
  'HF_INFERENCE_API_KEY',
  'HF_API_KEY',
  'HF_TOKEN',
]);

let parsedCache;

function parseDotEnv() {
  if (parsedCache != null) {
    return parsedCache;
  }
  parsedCache = {};
  try {
    const raw = fs.readFileSync(DOTENV_PATH, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }
      const eq = trimmed.indexOf('=');
      if (eq === -1) {
        continue;
      }
      const key = trimmed.slice(0, eq).trim();
      if (!WHITELIST.has(key)) {
        continue;
      }
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      parsedCache[key] = val;
    }
  } catch (_) {
    parsedCache = {};
  }
  return parsedCache;
}

module.exports = function inlineEnvFromDotenv(api) {
  const { types: t } = api;

  return {
    name: 'inline-env-from-dotenv',
    visitor: {
      MemberExpression(memberPath) {
        const node = memberPath.node;
        if (
          !t.isMemberExpression(node.object) ||
          !t.isIdentifier(node.object.object, { name: 'process' }) ||
          !t.isIdentifier(node.object.property, { name: 'env' }) ||
          !t.isIdentifier(node.property)
        ) {
          return;
        }
        const key = node.property.name;
        if (!WHITELIST.has(key)) {
          return;
        }
        const env = parseDotEnv();
        const value = env[key] ?? '';
        memberPath.replaceWith(t.stringLiteral(value));
      },
    },
  };
};
