import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  getVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;
  toggleTheme: () => Promise<boolean>;
  onAppEvent: (callback: (event: string) => void) => () => void;
}

const api: ElectronAPI = {
  getVersion: () => ipcRenderer.invoke('app:version'),
  getPlatform: () => ipcRenderer.invoke('app:platform'),
  toggleTheme: () => ipcRenderer.invoke('theme:toggle'),
  onAppEvent: (callback) => {
    const listener = (_: unknown, event: string) => callback(event);
    ipcRenderer.on('app-event', listener);
    return () => {
      ipcRenderer.removeListener('app-event', listener);
    };
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);
