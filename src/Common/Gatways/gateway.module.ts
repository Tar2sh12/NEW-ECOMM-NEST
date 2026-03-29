
import { Module } from '@nestjs/common';
import { RealTimeEventsGateway } from './gateways'

@Module({
    providers: [RealTimeEventsGateway],
    exports: [RealTimeEventsGateway]
})
export class EventsModule { }
