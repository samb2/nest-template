import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EventEmitterModule.forRoot(), EmailModule],
  providers: [EventsService],
})
export class EventsModule {}
