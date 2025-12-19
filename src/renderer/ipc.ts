type IpcUnsubscribe = () => void;

export type RendererIpc = {
  on: (channel: string, callback: (event: any, data: any) => void) => IpcUnsubscribe;
  send: (channel: string, data?: any) => void;
};

const mockIPC: RendererIpc = {
  on: () => () => {},
  send: (channel: string, data?: any) => {
    if (channel === 'log:message') return;
    // eslint-disable-next-line no-console
    console.log(`IPC Send [${channel}]:`, data);
  }
};

export const ipc: RendererIpc = (window as any).electron ? (window as any).electron : mockIPC;

