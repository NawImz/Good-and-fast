/** Lance les trois scripts de QA à la suite et agrège le code de sortie. */
import { spawnSync } from "node:child_process";

let code = 0;
for (const script of ["qa/shoot.mjs", "qa/check.mjs", "qa/check-motion.mjs"]) {
  const res = spawnSync(process.execPath, [script], { stdio: "inherit" });
  code ||= res.status ?? 1;
}
process.exit(code);
