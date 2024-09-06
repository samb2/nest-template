import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ForgotPasswordEvent, UserRegisteredEvent } from './dto';
import { EventEnum } from './enum/event.enum';
import { EmailService } from '../email/email.service';

@Injectable()
export class EventsService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly emailService: EmailService,
    private eventEmitter: EventEmitter2,
  ) {}

  onModuleInit(): void {
    // user-registered
    this.eventEmitter.on(
      EventEnum.USER_REGISTERED,
      (event: UserRegisteredEvent) => {
        Logger.log(event);
        // Here you can add logic to send an email or perform other actions
      },
    );

    // forgot-password
    this.eventEmitter.on(
      EventEnum.FORGOT_PASSWORD,
      async (event: ForgotPasswordEvent) => {
        // Here you can add logic to send a password reset email
        await this.emailService.sendEmail({
          to: event.email,
          subject: 'Forgot Password',
          text: `Your token is : ${event.token}`,
        });
      },
    );
  }

  onModuleDestroy(): void {
    // user-registered
    this.eventEmitter.off(EventEnum.USER_REGISTERED, async () => {});

    // forgot-password
    this.eventEmitter.off(EventEnum.FORGOT_PASSWORD, async () => {});
  }
}
