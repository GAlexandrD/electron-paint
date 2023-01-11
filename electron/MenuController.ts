import { BrowserWindow } from 'electron';
import FileService from './FileService';

export class MenuController {
  async onSaveAs(win: BrowserWindow) {
    const path = await FileService.savePath({
      filters: [
        { name: '', extensions: ['png'] },
        { name: '', extensions: ['jpg'] },
      ],
    });
    if (!path.filePath) return;
    win.webContents.send('save-as', path.filePath);
  }

  async onOpenFile(win: BrowserWindow) {
    if (!win) return;
    const {file, path} = await FileService.openFile({});
    const extantion = path.split('.')[1]
    win.webContents.send('open-img', file, extantion);
  }

  async onSave(win: BrowserWindow) {
    if (!FileService.currentFilePath) {
      this.onSaveAs(win);
      return;
    }
    win.webContents.send('save-as', FileService.currentFilePath);
  }

  async onCreate(win: BrowserWindow) {
    win.webContents.send('create');
  }
}
