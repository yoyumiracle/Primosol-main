import { Context, createContext, useContext, useEffect, useState } from 'react';
import { WebsocketClient , WebsocketProviderProps } from '../helpers/websocket';
import { SocketIOClient } from '../helpers/socket_io';

export enum WsClientType {
  API = 'apiWs',
  BIRDEYE = 'ws',
}
export type WebsocketContextType = {
  ws_pool: SocketIOClient  | undefined;
  ws_search: SocketIOClient  | undefined;
  apiWs: WebsocketClient  | undefined;
};

export const WebsocketContext = createContext<{
  ws_pool: SocketIOClient  | undefined;
  ws_search: SocketIOClient  | undefined;
  apiWs: WebsocketClient  | undefined;
}>({
  ws_pool: undefined,
  ws_search: undefined,
  apiWs: undefined,
});

export function WebsocketProvider({ children }: WebsocketProviderProps) {
  const [ws_poolClient, setPoolClient] = useState<SocketIOClient  | undefined>(undefined);
  const [ws_searchClient, setSearchClient] = useState<SocketIOClient  | undefined>(undefined);
  const [apiClient, setApiClient] = useState<WebsocketClient  | undefined>(undefined);

  useEffect(() => {
    const ws_pool = new SocketIOClient (`${import.meta.env.VITE_TOKEN_SOCKET_URL}/socket.io/tx`);
    const ws_search = new SocketIOClient(`${import.meta.env.VITE_TOKEN_SOCKET_URL}/socket.io/st`);
    const apiWs = new WebsocketClient (import.meta.env.VITE_APP_SOCKET_URL as string);

    setPoolClient(ws_pool);
    setApiClient(apiWs);
    setSearchClient(ws_search)

    return () => {
      ws_pool.close();
      apiWs.close();
      setPoolClient(undefined);
      setApiClient(undefined);
    };
  }, []);

  return <WebsocketContext.Provider value={{ ws_pool: ws_poolClient, ws_search: ws_searchClient, apiWs: apiClient }}>{children}</WebsocketContext.Provider>;
}

export function useWebsocket(): WebsocketContextType {
  const context = useContext(WebsocketContext as Context<WebsocketContextType | undefined>);
  if (!context) throw Error('useWebsocket can only be used within the WebsocketProvider component');
  return context;
}
