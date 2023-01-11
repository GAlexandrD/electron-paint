import { dialog, FileFilter, SaveDialogReturnValue } from 'electron';
import { readFile, writeFile } from 'fs/promises';

interface openFileArgs {
  title?: string;
  filters?: FileFilter[];
}

interface saveFileArgs {
  filters?: FileFilter[];
}

class FileService {
  currentFilePath: string = '';
  async openFile({
    title,
    filters,
  }: openFileArgs): Promise<any> {
    const path = await dialog.showOpenDialog({ filters, title });
    if (!path.filePaths[0]) return;
    this.currentFilePath = path.filePaths[0];
    const file = await readFile(path.filePaths[0], 'base64');
    return {file, path: path.filePaths[0]};
  }

  async savePath({ filters }: saveFileArgs): Promise<SaveDialogReturnValue> {
    const path = await dialog.showSaveDialog({ filters });
    return path;
  }

  async saveFile(data: string | Buffer, path: string) {
    writeFile(path, data, 'base64');
  }
}

export default new FileService();
