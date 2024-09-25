export class User {
  private _id?: number;
  private _email: string;
  private _password: string;

  constructor(email: string, password: string) {
    this._email = email;
    this._password = password;
  }

  public set id(id: number) {
    this._id = id;
  }

  public set password(pwd: string) {
    this._password = pwd;
  }

  public get email(): string {
    return this._email;
  }

  public get password(): string {
    return this._password;
  }

  public get id(): number {
    return this._id!;
  }
}
