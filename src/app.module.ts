import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AccountModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
