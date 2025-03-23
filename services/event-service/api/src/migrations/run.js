// This file is just a simple wrapper to run the TypeScript migrations
// through ts-node or after transpilation

import('./run.js').then(module => {
  // The default export is the run function
  const run = module.default;
  run();
}).catch(error => {
  console.error('Failed to run migrations:', error);
  process.exit(1);
});