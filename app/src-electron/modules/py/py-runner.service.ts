import * as path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { app } from 'electron';
import * as fs from 'fs';

const execFileAsync = promisify(execFile);

export class PyRunnerService {
  private get interpreterPath() {
    const venvPath = path.join(app.getAppPath(), 'assets', 'scripts', 'venv', 'bin', 'python3');
    return process.env.PYTHON_PATH || (fs.existsSync(venvPath) ? venvPath : 'python3');
  }

  private readonly scriptsDir = path.join(app.getAppPath(), 'assets', 'scripts');

  async runScript(script: string, args: string[]): Promise<string> {
    const safeScript = path.basename(script);
    const pyScript = path.join(this.scriptsDir, safeScript);

    const { stdout, stderr } = await execFileAsync(
      this.interpreterPath,
      [pyScript, ...args.map(String)],
      { timeout: 10_000 },
    );

    if (stderr) {
      console.warn(`Python stderr: ${stderr}`);
    }

    return stdout;
  }
}
