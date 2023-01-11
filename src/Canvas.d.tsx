export interface IElectronAPI {
  onSaveAs: () => Promise<void>,
}

declare global {
  interface Window {
    electron: any
  }
}