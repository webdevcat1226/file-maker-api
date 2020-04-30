import { Controller, Get, Query } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { FindQuotesDto } from './quote.dto';

@Controller('quote')
export class QuoteController {
  constructor(private quoteService: QuoteService) {}
  @Get('quotes')
  async quotes(@Query() query: FindQuotesDto): Promise<any> {
    return this.quoteService.quotes(query.token);
  }
}
