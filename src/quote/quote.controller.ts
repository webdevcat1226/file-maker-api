import { Controller, Get, Query } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { FindQuotesDto } from './quote.dto';

@Controller('quote')
export class QuoteController {
  constructor(private quoteService: QuoteService) {}

  @Get('all-quotes')
  async intialize(@Query() query: FindQuotesDto): Promise<any> {
    return this.quoteService.getAllData(query.token);
  }

  @Get('quotes')
  async quotes(@Query() query: FindQuotesDto): Promise<any> {
    return this.quoteService.getQuotes(query.token);
  }

  @Get('submitted-applications')
  async submittedQuotes(@Query() query: FindQuotesDto): Promise<any> {
    return this.quoteService.getSubmittedApplications(query.token);
  }
}
