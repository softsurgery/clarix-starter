import { app, BrowserWindow, nativeImage } from 'electron';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const DESKTOP_ID = 'clarix-desktop';

export function resolveAppIconPath(): string {
  const fileName = process.platform === 'win32' ? 'icon.ico' : 'icon.png';
  const candidates = [
    path.join(app.getAppPath(), 'resources', fileName),
    path.join(__dirname, '..', 'resources', fileName),
    path.join(process.cwd(), 'resources', fileName),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[0];
}

/**
 * On GNOME/Wayland the window `icon` option is ignored. The shell looks up a
 * .desktop file by app id (`CHROME_DESKTOP` / `--class`). Must run before ready.
 */
export function registerAppIdentity(): void {
  process.env.CHROME_DESKTOP = `${DESKTOP_ID}.desktop`;
  app.commandLine.appendSwitch('class', DESKTOP_ID);

  if (process.platform !== 'linux') {
    return;
  }

  const iconPath = resolveAppIconPath();
  if (!fs.existsSync(iconPath)) {
    return;
  }

  const applicationsDir = path.join(os.homedir(), '.local/share/applications');
  const iconDir = path.join(os.homedir(), '.local/share/icons/hicolor/512x512/apps');
  fs.mkdirSync(applicationsDir, { recursive: true });
  fs.mkdirSync(iconDir, { recursive: true });

  const iconDest = path.join(iconDir, `${DESKTOP_ID}.png`);
  const image = nativeImage.createFromPath(iconPath);
  if (!image.isEmpty()) {
    fs.writeFileSync(iconDest, image.resize({ width: 512, height: 512 }).toPNG());
  } else {
    fs.copyFileSync(iconPath, iconDest);
  }

  const execPath = process.execPath;
  const appPath = app.getAppPath();
  const execLine = app.isPackaged
    ? `"${execPath}"`
    : `"${execPath}" --no-sandbox --class=${DESKTOP_ID} "${appPath}"`;

  const desktopEntry = `[Desktop Entry]
Type=Application
Name=Clarix
Comment=AI-Powered Analytics Platform
Exec=${execLine}
Icon=${iconDest}
Terminal=false
Categories=Office;
StartupWMClass=${DESKTOP_ID}
`;

  fs.writeFileSync(path.join(applicationsDir, `${DESKTOP_ID}.desktop`), desktopEntry);
}

export function applyWindowIcon(win: BrowserWindow): void {
  const iconPath = resolveAppIconPath();
  if (!fs.existsSync(iconPath)) {
    return;
  }

  const icon = nativeImage.createFromPath(iconPath);
  if (icon.isEmpty()) {
    return;
  }

  if (process.platform !== 'darwin') {
    win.setIcon(icon);
  } else {
    app.dock?.setIcon(icon);
  }
}
