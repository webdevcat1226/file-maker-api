import {
  Injectable,
  HttpService,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

interface QuotesResponseDTO {
  response: {
    data: [];
  };
  messages: [
    {
      code: string;
      message: string;
    },
  ];
}

@Injectable()
export class QuoteService {
  private fmDBQuotePath: string;

  constructor(private httpService: HttpService) {
    this.fmDBQuotePath = `${process.env.FM_SERVER}/fmi/data/${process.env.FM_DB_VERSION}/databases/${process.env.FM_DATABASE}/layouts/${process.env.FM_DB_LOCAL_NEW_APP_QUOTE}`;
  }

  async quotes(token: string): Promise<any> {
    const body = {
      query: [
        {
          Status: 'Unsubmitted',
        },
        {
          Status: 'Pending',
        },
        {
          Status: 'Quote Received',
        },
      ],
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    try {
      const result = await this.httpService
        .post<QuotesResponseDTO>(`${this.fmDBQuotePath}/_find`, body, config)
        .toPromise();
      return result.data.response.data;
    } catch (e) {
      if (e.response && e.response.status && e.response.status === 401) {
        throw new UnauthorizedException();
      } else {
        throw new ServiceUnavailableException();
      }
    }
  }
}
