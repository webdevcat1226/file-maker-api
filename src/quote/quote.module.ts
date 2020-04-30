import { Module, HttpModule } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';

@Module({
  imports: [HttpModule],
  controllers: [QuoteController],
  providers: [QuoteService]
})
export class QuoteModule {}
