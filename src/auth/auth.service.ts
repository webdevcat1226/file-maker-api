import {
  Injectable,
  HttpService,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import * as Faker from 'faker';
interface SessionDTO {
  response: {
    token: string;
  };
  messages: [
    {
      code: string;
      message: string;
    },
  ];
}

interface RefreshPair {
  token: string;
  refresh: string;
}

@Injectable()
export class AuthService {
  private fmDBSessionPath: string;

  private arrRefreshTokens: Array<RefreshPair> = [];

  constructor(private httpService: HttpService) {
    this.fmDBSessionPath = `${process.env.FM_SERVER}/fmi/data/${process.env.FM_DB_VERSION}/databases/${process.env.FM_DATABASE}/sessions`;
  }

  async GetToken(): Promise<string> {
    const strBasicBase64 = `Basic ${Buffer.from(
      `${process.env.FM_DB_USERNAME}:${process.env.FM_DB_PASSWORD}`,
    ).toString('base64')}==`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: strBasicBase64,
      },
    };
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    try {
      const resToken = await this.httpService
        .post<SessionDTO>(this.fmDBSessionPath, {}, config)
        .toPromise();
      return resToken.data.response.token;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async ClearToken(token: string): Promise<boolean> {
    try {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      await this.httpService
        .delete<SessionDTO>(`${this.fmDBSessionPath}/${token}`)
        .toPromise();
      return true;
    } catch (e) {
      // console.log(e);
      // throw new ServiceUnavailableException();
      return true;
    }
  }

  async Login(email: string, password: string): Promise<any> {
    const token = await this.GetToken();
    if (!token) {
      throw new ServiceUnavailableException();
    }
    // Check if user exist ...
    const user = true;
    if (!user) {
      throw new UnauthorizedException();
    }
    const curRefreshTokenPair = { token, refresh: Faker.random.uuid() };
    this.arrRefreshTokens.push(curRefreshTokenPair);
    return curRefreshTokenPair;
  }

  async Logout(token: string): Promise<boolean> {
    return this.ClearToken(token);
  }

  async ValidateToken(token: string): Promise<boolean> {
    const curTokenPair = this.arrRefreshTokens.find(
      element => element.token === token,
    );
    return !!curTokenPair;
  }
}
