import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './ws-jwt.guard';
import { WsUser } from './ws-user.decorator';

@WebSocketGateway({
  namespace: 'boards',
  cors: { origin: '*', credentials: true },
})
@UseGuards(WsJwtGuard)
export class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  private logger = new Logger('BoardGateway');

  handleConnection(client: Socket) {
    const user = client.data.user;
    this.logger.log(`Client ${client.id} connected as user ${user?.uuid}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  // Подписка на комнату конкретной доски
  @SubscribeMessage('joinBoard')
  handleJoinBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { boardId: string },
    @WsUser() user: any,
  ) {
    const room = `board:${data.boardId}`;
    client.join(room);
    this.logger.log(`User ${user.uuid} joined room ${room}`);
    client.emit('joinedBoard', { boardId: data.boardId });
  }

  // Отписка от комнаты
  @SubscribeMessage('leaveBoard')
  handleLeaveBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { boardId: string },
  ) {
    const room = `board:${data.boardId}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} left room ${room}`);
    client.emit('leftBoard', { boardId: data.boardId });
  }

  // Публичный метод для отправки событий в комнату (вызывать из хендлеров)
  emitToBoard(boardId: string, event: string, payload: any) {
    this.server.to(`board:${boardId}`).emit(event, payload);
  }
}
