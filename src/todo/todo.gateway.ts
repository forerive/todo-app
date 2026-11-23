import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://127.0.0.1:5500',
  },
})
export class TodoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
    
  handleConnection(client: Socket) {
    console.log('接続しました:', client.id);
    client.emit('hello', 'NestJSからこんにちは!');
  }

  handleDisconnect(client: Socket) {
    console.log('切断しました:', client.id);
  }

  notifyTodoChanged() {
    this.server.emit('todoChanged');
  }
}
