import {
  Injectable,
  HttpService,
  ServiceUnavailableException,
  UnauthorizedException,
  InternalServerErrorException,
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

  async getQuotes(token: string): Promise<any> {
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

  async getSubmittedApplications(token: string): Promise<any> {
    const body = {
      query: [
        {
          Status: 'Processing',
        },
        {
          Status: 'Applicatin Received',
        },
        {
          Status: 'Submitted',
        },
        {
          Status: 'Reviewing',
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
      console.log(e.response.status);
      const errorStatus = e.response ? e.response.status : null;
      if (errorStatus === 401) {
        throw new UnauthorizedException();
      } else if (errorStatus === 503 ){
        throw new ServiceUnavailableException();
      } else { // null
        throw new InternalServerErrorException();
      }
    }
  }

  async getAllData(token: string): Promise<any> {
    const quotes = await this.getQuotes(token);
    const submittedApplications = await this.getSubmittedApplications(token);
    return { quotes, submittedApplications };
  }
}
