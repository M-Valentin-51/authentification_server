import { TokenService } from "../../services/tokenService";

export class Token {
  private _id: number | undefined;
  private _refreshToken: string | undefined;
  private _accessToken: string | undefined;
  private _expiryDate: number | undefined;
  private _userId: number | undefined;
  private _isRevoqued: boolean = false;

  public set id(id: number) {
    this._id = id;
  }

  public set refreshToken(token: string) {
    this._refreshToken = token;
  }

  public set accessToken(token: string) {
    this._accessToken = token;
  }

  public set expiryDate(date: number) {
    this._expiryDate = date;
  }

  public set userId(userId: number) {
    this._userId = userId;
  }

  public set isRevoqued(isRevoqued: boolean) {
    this._isRevoqued = isRevoqued;
  }

  public get refreshToken(): string {
    return this._refreshToken!;
  }

  public get accessToken(): string {
    return this._accessToken!;
  }

  public get expiryDate(): number | undefined {
    return this._expiryDate;
  }

  public get userId(): number | undefined {
    return this._userId;
  }

  public get isRevoqued(): boolean {
    return this._isRevoqued!;
  }

  public generateToken() {
    let tokenService = TokenService.generateRefreshToken();
    this._expiryDate = tokenService.validity;
    this._refreshToken = tokenService.token;
  }
}
