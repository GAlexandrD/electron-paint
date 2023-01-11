import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import * as path from 'path';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import fileService from './FileService';
import { MenuController} from './MenuController';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 1024,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const MenuControl = new MenuController();

  ipcMain.on('image-data', (event, data, path) => {
    fileService.saveFile(data, path);
  });


  const isMac = process.platform === 'darwin';

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'open',
          submenu: [
            {
              label: 'create',
              click: () => MenuControl.onCreate(win),
            },
            {
              label: 'open image',
              click: () => MenuControl.onOpenFile(win),
            },
          ],
        },
        {
          label: 'save',
          click: () => MenuControl.onSave(win),
        },
        {
          label: 'save as',
          click: () => MenuControl.onSaveAs(win),
        },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {},
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template as any);
  Menu.setApplicationMenu(menu);

  ipcMain.on('save-img', (e, data, path) => {
    fileService.saveFile(data, path);
  });

  if (app.isPackaged) {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  } else {
    win.loadURL('http://localhost:3000/index.html');

    win.webContents.openDevTools();

    // Hot Reloading on 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(
        __dirname,
        '..',
        '..',
        'node_modules',
        '.bin',
        'electron' + (process.platform === 'win32' ? '.cmd' : '')
      ),
      forceHardReset: true,
      hardResetMethod: 'exit',
    });
  }
}

app.whenReady().then(() => {
  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});
