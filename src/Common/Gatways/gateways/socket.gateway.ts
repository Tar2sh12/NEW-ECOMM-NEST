import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Types } from "mongoose";
import { from, map, Observable } from "rxjs";
import { TokenService } from "src/Common/Services";
import { ProductType } from "src/DB/Models";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class RealTimeEventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private clients: Map<string, string> = new Map();

    constructor(private readonly tokenService: TokenService) { }

    @WebSocketServer()
    io: Server;


    //================================ Way One to handle client [ registration - disconnection ] ====================================//
    // in this way the class will implement the  OnModuleInit interface
    // onModuleInit() {
    //     this.io.on('connection', async (socket) => {
    //         try {
    //             await this.regitserSocketId(socket)
    //             socket.on('disconnect', async () => {
    //                 await this.clearSocketConnection(socket)
    //             })
    //         } catch (error) {
    //             console.log(error);
    //             socket.emit('socket-exception', error.message)
    //         }
    //     })
    // }


    // async regitserSocketId(@ConnectedSocket() socket: Socket) {
    //     const authUser = await this.tokenService.validateAndVerifyToken(socket.handshake.auth.accesstoken)
    //     this.clients.set(authUser?.user?._id?.toString() || '', socket.id);
    //     console.log('The client after registerain', this.clients);
    // }

    // async clearSocketConnection(@ConnectedSocket() socket: Socket) {
    //     const authUser = await this.tokenService.validateAndVerifyToken(socket.handshake.auth.accesstoken)
    //     this.clients.delete(authUser?.user?._id?.toString() || '');
    //     console.log('The client after unregisterain', this.clients);
    // }


    //============================= Way Two to handle client [registration -  disconnection ] ====================================//
    async handleConnection(@ConnectedSocket() client: Socket) {
        try {
            //console.log(client.handshake.auth.accesstoken);
            const authUser = await this.tokenService.validateAndVerifyToken(client.handshake.auth.accesstoken)
            this.clients.set(authUser?.user?._id?.toString() || '', client.id);
            console.log('The client after registerain', this.clients);
        } catch (error) {
            console.log('Error in handle connection',error);
            client.emit('socket-exception', error.message)
        }
    }

    async handleDisconnect(@ConnectedSocket() client: Socket) {
        try {
            const authUser = await this.tokenService.validateAndVerifyToken(client.handshake.auth.accesstoken)
            this.clients.delete(authUser?.user?._id?.toString() || '');
            console.log('The client after unregisterain', this.clients);
        } catch (error) {
            console.log('Error in handle dis-connection');
            client.emit('socket-exception', error.message)
        }
    }

    // test listening on event
    @SubscribeMessage('hello-from-fe')
    handleEvent(@MessageBody() data: string, @ConnectedSocket() socket: Socket): string {
        console.log(data);
        socket.emit('hello-from-be', 'Hello from back-end side');
        return data;
    }


    @SubscribeMessage('hello-fe')
    handleHelloEvent(
        @MessageBody() data: string,
        @ConnectedSocket() socket: Socket
    ): string {
        console.log(socket.id);
        socket.emit('hello-be', 'emit response')
        return data
    }

    // If we use the parameteres instead of decorators,  This approach is not recommended though, because it requires mocking the socket instance in each unit test.
    @SubscribeMessage('way-2')
    handleWay2Event(socket: Socket, args: []) {
        console.log(socket.id);
        console.log(args);
        return false;
    }


    // Async Socker response
    @SubscribeMessage('async-event')
    onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
        const event = 'async-event';
        const response = [1, 2, 3];

        return from(response).pipe(
            map(data => ({ event, data })),
        );
    }


    // emit stock updates
    emitStockUpdates(productId: string | Types.ObjectId, newStock: number) {
        this.io.emit('stock-updated', { productId, newStock })
    }


    //emit when new product added 
    emitNewProduct(product:ProductType){
        this.io.emit('new-product',{product})
    }

}