/* eslint-disable @typescript-eslint/no-var-requires */

export default function registerRequireHooks() {
  // In pure ESM, we don't need runtime compilation hooks
  // TypeScript compilation is handled at build time
  if (process.env.MM_DEV) return;
  
  // For development, tsx is already handling TypeScript compilation
  // via the dev.js entry point
}
