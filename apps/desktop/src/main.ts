import { app, BrowserWindow, shell, ipcMain, Menu, nativeTheme } from 'electron';
import { join } from 'path';
import log from 'electron-log';

const isDev = process.argv.includes('--dev');

const WINDOW_WIDTH = 1600;
const WINDOW_HEIGHT = 1000;
const WINDOW_MIN_WIDTH = 1280;
const WINDOW_MIN_HEIGHT = 800;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    minWidth: WINDOW_MIN_WIDTH,
    minHeight: WINDOW_MIN_HEIGHT,
    title: 'Tech Canvas Studio',
    backgroundColor: '#0a0a0f',
    darkTheme: true,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  // Set a consistent WM_CLASS for Plasma window-manager matching.
  mainWindow.setTitle('Tech Canvas Studio');

  // Load the Next.js app.
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    // Next.js static export lives under resources/web.
    const indexPath = join(process.resourcesPath, 'web', 'out', 'index.html');
    log.info('Loading production app from:', indexPath);
    mainWindow.loadFile(indexPath).catch((err) => {
      log.error('Failed to load app:', err);
      // Fallback to bundled html if Next.js export is missing.
      const fallbackPath = join(process.resourcesPath, 'web', 'index.html');
      mainWindow.loadFile(fallbackPath).catch((err2) => {
        log.error('Failed to load fallback:', err2);
      });
    });
  }

  // Keep the splash / loading UX tidy.
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) mainWindow.focus();
  });

  // Open external links in the user's default browser.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (isDev && url.startsWith('http://localhost:3000')) return;
    event.preventDefault();
    shell.openExternal(url);
  });

  return mainWindow;
}

function buildMenu(): Menu {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Tech Canvas Studio',
      submenu: [
        { role: 'about', label: 'About Tech Canvas Studio' },
        { type: 'separator' },
        { role: 'quit', label: 'Quit' },
      ],
    },
    {
      label: 'File',
      submenu: [
        { label: 'New Project', accelerator: 'CmdOrCtrl+N', click: () => emitAppEvent('new-project') },
        { label: 'Open Project', accelerator: 'CmdOrCtrl+O', click: () => emitAppEvent('open-project') },
        { type: 'separator' },
        { label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => emitAppEvent('save-project') },
        { label: 'Export', accelerator: 'CmdOrCtrl+Shift+E', click: () => emitAppEvent('export') },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Documentation', click: () => shell.openExternal('https://github.com/techengineerworkstation/tech-canvas-studio') },
      ],
    },
  ];

  return Menu.buildFromTemplate(template);
}

function emitAppEvent(event: string) {
  const focused = BrowserWindow.getFocusedWindow();
  if (focused) {
    focused.webContents.send('app-event', event);
  }
}

app.name = 'tech-canvas-studio';

app.whenReady().then(() => {
  log.info('Tech Canvas Studio starting...');
  Menu.setApplicationMenu(buildMenu());
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Safe IPC surface exposed through the preload script.
ipcMain.handle('app:version', () => app.getVersion());
ipcMain.handle('app:platform', () => process.platform);
ipcMain.handle('theme:toggle', async () => {
  nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark';
  return nativeTheme.shouldUseDarkColors;
});
