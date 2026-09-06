import { Module } from '@nestjs/common';
import { EventEmitterBus } from './EventEmitterBus';

export const EVENT_BUS = 'EVENT_BUS';

@Module({
  providers: [{ provide: EVENT_BUS, useClass: EventEmitterBus }],
  exports: [EVENT_BUS],
})
export class EventBusModule {}
