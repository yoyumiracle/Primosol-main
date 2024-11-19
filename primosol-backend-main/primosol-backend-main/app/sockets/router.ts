import WebSocket from 'ws';

// Define the type for the handler function
type HandlerFunction = (payload: any, ws: WebSocket, wss: WebSocket.Server) => void;

// Define a type for your handlers map
type HandlersMap = Record<string, HandlerFunction>;

/**
 * SocketRouter
 * @class
 */
class SocketRouter {
  private _type: string | null = null;
  private _types: HandlersMap = {};

  /**
   * Add sub-router
   * @param {string} type
   * @param {SocketRouter} router
   * @returns {void}
   */
  use(type: string, router: SocketRouter): void {
    const handlers = router._getHandlers();
    for (const [key, handler] of Object.entries(handlers)) {
      const newType = `${type}:${key}`;
      this._types[newType] = handler;
    }
  }

  /**
   * Register a new type of message
   * @param {string} type
   * @param {HandlerFunction} handler
   * @returns {void}
   */
  type(type: string, handler: HandlerFunction): void {
    this._types[type] = handler;
  }

  /**
   * Handle a message
   * @param {string} type
   * @param {any} payload
   * @param {WebSocket} ws
   * @param {WebSocketServer} wss
   */
  handle(type: string, payload: any, ws: WebSocket, wss: WebSocket.Server): void {
    const handler = this._types[type];
    if (handler) {
      handler(payload, ws, wss);
    } else {
      ws.send(JSON.stringify(["error", `No type found for ${type}`]));
    }
  }

  private _getHandlers(): HandlersMap {
    return this._types;
  }
}

export default SocketRouter;