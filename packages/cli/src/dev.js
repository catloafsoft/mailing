#!/usr/bin/env node

// This script can be used for quick cli development without compilation steps.

// Make stack traces really big!
Error.stackTraceLimit = Infinity;

process.env.MM_DEV = 1;

// In ESM with tsx, we can directly import TypeScript files
await import('./index.ts');
