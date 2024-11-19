import { io, Socket } from 'socket.io-client';
import { isJson } from '../utils/global_utils';

export enum WebSocketClientStatus {
  CONNECTED = 1,
  DISCONNECTED,
  CONNECTING,
}

export class SocketIOClient {
  url: string;
  options?: any;
  status: WebSocketClientStatus;
  socket: Socket | null = null;
  messageQueue: any[] = [];

  listeners: { id: number; event: { name: string; uniqueName: string }; fn: (payload: any) => void }[];
  lastListenerId: number;

  constructor(url: string, options?: any) {
    this.url = url;
    this.options = options;
    this.listeners = [];
    this.lastListenerId = 0;
    this.status = WebSocketClientStatus.DISCONNECTED;

    this.open();
  }

  open() {
    if (!this.socket && this.status == WebSocketClientStatus.DISCONNECTED) {
      console.log(`[SocketIOClient] Instance created. Trying to connect`);
      this.socket = io(this.url, this.options);

      this.socket.on('connect', () => this.onConnect());
      this.socket.on('disconnect', () => this.onDisconnect());
      this.socket.on('error', (error) => this.onError(error));
      this.setListeners();
    }
  }

  close() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.status = WebSocketClientStatus.DISCONNECTED;
      console.log('[SocketIOClient] Disconnected');
    }
  }

  onConnect() {
    console.log('[SocketIOClient] Connected');
    this.status = WebSocketClientStatus.CONNECTED;
    this.processMessageQueue();
  }

  onDisconnect() {
    console.log('[SocketIOClient] Disconnected');
    this.status = WebSocketClientStatus.DISCONNECTED;
  }

  onError(error: any) {
    console.log('[SocketIOClient] Error:', error);
  }

  setListeners() {
    if (this.socket) {
      this.listeners.forEach(listener => {
        this.socket!.on(listener.event.name, (data: any) => {
          const parsedData = isJson(data) ? JSON.parse(data) : data;
          listener.fn(parsedData);
        });
      });
    }
  }

  processMessageQueue() {
    while (this.messageQueue.length > 0 && this.status === WebSocketClientStatus.CONNECTED) {
      const data = this.messageQueue.shift();
      this.sendMessage(data[0], data[1]);
    }
  }

  registerListener(eventType: string, callback: (message: any) => void) {
    const id = this.lastListenerId++;
    const listenerIndex = this.listeners.findIndex(listener => listener.event.uniqueName === eventType);
    if (listenerIndex === -1) {
      this.listeners.push({ id, event: { name: eventType, uniqueName: `${eventType}-${id}` }, fn: callback });
      if (this.socket) {
        this.socket.on(eventType, callback);
      }
      return id;
    }
    return this.listeners[listenerIndex].id;
  }

  removeListener(listenerId: number) {
    const listener = this.listeners.find(listener => listener.id === listenerId);
    if (listener && this.socket) {
      this.socket.off(listener.event.name, listener.fn);
    }
    this.listeners = this.listeners.filter(listener => listener.id !== listenerId);
  }

  sendMessage(callMethod: string, data: any) {
    if (this.status === WebSocketClientStatus.CONNECTED && this.socket) {
      this.socket.emit(callMethod, data);
      console.log(`[SocketIOClient] Sending emit:${callMethod} ${JSON.stringify(data)}`);
    } else {
      console.log('[SocketIOClient] Cannot emit, socket not connected');
      this.messageQueue.push([callMethod, data]);
    }
  }
}