import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

for (const outer of [false, true]) for (let run = 1; run <= 3; run++) {
  const result = spawnSync(process.execPath, ['--conditions=solid', '--conditions=development', new URL('repro.mjs', import.meta.url).pathname, ...(outer ? ['--outer'] : [])], { encoding: 'utf8', timeout: 10000 });
  const failed = result.stderr.includes('did not converge after 10001 passes');
  console.log(JSON.stringify({ outer, run, status: result.status, failed, waterfall: result.stderr.includes('SSR_BOUNDARY_WATERFALL'), ready: result.stdout.includes('SESSION_READY'), stderr: result.stderr }));
  assert.equal(result.error, undefined);
  assert.equal(result.status, outer ? 0 : 1);
  assert.equal(failed, !outer);
  assert.equal(result.stderr.includes('SSR_BOUNDARY_WATERFALL'), !outer);
  assert.ok(result.stdout.includes('SESSION_READY'));
  if (outer) assert.equal(result.stderr, '');
}
