declare module "ws" {
  import { Server as HttpServer, IncomingMessage } from "http";
  import { Duplex } from "stream";
  import { EventEmitter } from "events";

  export class WebSocket extends EventEmitter {
    static OPEN: number;
    static CLOSED: number;
    static CLOSING: number;
    static CONNECTING: number;

    readyState: number;
    isAlive?: boolean;
    send(data: any, cb?: (err?: Error) => void): void;
    close(code?: number, data?: string): void;
    terminate(): void;
    ping(data?: any, mask?: boolean, cb?: (err?: Error) => void): void;
    pong(data?: any, mask?: boolean, cb?: (err?: Error) => void): void;
    on(event: string, listener: (...args: any[]) => void): this;
    on(event: "message", listener: (data: any, isBinary: boolean) => void): this;
    on(event: "close", listener: (code: number, reason: Buffer) => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: "open", listener: () => void): this;
    on(event: "ping" | "pong", listener: (data: Buffer) => void): this;
  }

  export class WebSocketServer extends EventEmitter {
    constructor(options?: any);
    clients: Set<WebSocket>;
    close(cb?: (err?: Error) => void): void;
    handleUpgrade(
      request: IncomingMessage,
      socket: Duplex,
      head: Buffer,
      callback: (client: WebSocket) => void
    ): void;
    emit(event: string | symbol, ...args: any[]): boolean;
    on(event: string, listener: (...args: any[]) => void): this;
    on(event: "connection", listener: (socket: WebSocket, request: IncomingMessage) => void): this;
    on(event: "error", listener: (error: Error) => void): this;
    on(event: "close", listener: () => void): this;
  }

  export default WebSocket;
}
