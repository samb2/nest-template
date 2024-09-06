import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TokenService } from '../../token/token.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../auth/entities';
import { UserService } from '../../user/user.service';
import { CustomClient } from '../interface/custom-client.interface';
import { SocketClientEventEnum, SocketServerEventEnum } from '../enum';
import { JwtAccessPayload } from '../../common/interfaces';
import { MessageService } from '../message.service';
import { ChatBodyDto } from '../dto/chat-body.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@WebSocketGateway({
  cors: {
    origin: '*', // Replace with your client's origin
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
})
export class ChatsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {}

  @WebSocketServer()
  server: Server;
  onlineUsers: User[] = [];

  afterInit(server: any): any {
    server.use(async (socket: CustomClient, next) => {
      const token: string =
        socket.handshake.headers.authorization?.split(' ')[1];
      if (token) {
        try {
          const decoded: JwtAccessPayload =
            this.tokenService.verify<JwtAccessPayload>(
              token,
              this.configService.get('jwt.access_key'),
            );

          const user: User = await this.userService.validateUserByIdForWS(
            decoded.id,
          );
          if (!user) {
            return next(new Error('user not found!'));
          }
          socket.user = user;
          next();
        } catch (error) {
          return next(new Error('Invalid token'));
        }
      } else {
        next(new Error('Empty Token!'));
      }
    });
  }

  handleConnection(client: any): any {
    // Join Client to Rooms
    client.join(client.user.id);

    // Set User in online user list
    this.onlineUsers.push(client.user);
    this.server.emit('user:list', this.onlineUsers);
  }

  handleDisconnect(client: any): any {
    if (client.user) {
      // Find the index of the user in the onlineUsers array
      const index: number = this.onlineUsers.findIndex((user) => {
        return user.email === client.user.email;
      });

      // Check if the user was found in the array
      if (index !== -1) {
        // Remove the user from the onlineUsers array
        this.onlineUsers.splice(index, 1);

        // Emit an event to update the list of online users
        this.server.emit('user:list', this.onlineUsers);
      }
    }
  }

  @SubscribeMessage(SocketServerEventEnum.PRIVATE_MESSAGE)
  async privateMessage(
    @MessageBody() data: ChatBodyDto,
    @ConnectedSocket() client: CustomClient,
  ) {
    const chatBodyDtoInstance = plainToClass(ChatBodyDto, data);
    const errors = await validate(chatBodyDtoInstance);
    if (errors.length > 0) {
      return;
    }
    // Handle received message
    await this.messageService.create({
      sender: client.user,
      recipient: { id: data.to } as User,
      contentType: data.contentType,
      content: data.content,
    });

    this.server
      .to(data.to)
      .emit(SocketClientEventEnum.PRIVATE_MESSAGE, data.content);
  }
}
