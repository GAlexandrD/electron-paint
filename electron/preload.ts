const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  onSaveAs: (callback: any) => ipcRenderer.on('save-as', callback),
  onOpenFile: (callback: any) => ipcRenderer.on('open-img', callback),
  onCreate: (callback: any) => ipcRenderer.on('create', callback),
});
