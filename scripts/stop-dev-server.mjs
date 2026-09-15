// Frees local dev/preview ports before a fresh build+serve cycle, so a
// server left running from a previous run can't block the new one with
// EADDRINUSE. Cross-platform (Windows via netstat/taskkill, POSIX via
// lsof/kill). Usage: node scripts/stop-dev-server.mjs [port ...]
//
// Defaults cover this project's three local ports: 4200 (ng serve),
// 4173 (scripts/lighthouse.mjs' own static server) and 5000
// (scripts/serve-static.mjs' preview server).
import { execSync } from 'node:child_process';

const explicitPorts = process.argv.slice(2).map(Number).filter(Boolean);
const targets = explicitPorts.length ? explicitPorts : [4200, 4173, 5000];
const isWindows = process.platform === 'win32';

for (const port of targets) {
  try {
    if (isWindows) {
      const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' }).trim();
      const pids = new Set(
        out
          .split('\n')
          .map((line) => line.trim().split(/\s+/).pop())
          .filter((pid) => pid && pid !== '0'),
      );
      for (const pid of pids) {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        console.log(`Stopped process ${pid} on port ${port}`);
      }
    } else {
      const out = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' }).trim();
      for (const pid of out.split('\n').filter(Boolean)) {
        execSync(`kill -9 ${pid}`);
        console.log(`Stopped process ${pid} on port ${port}`);
      }
    }
  } catch {
    // Nothing listening on this port — nothing to stop.
  }
}
