import { Token } from "../entities/token";

export interface TokenRepository {
  save(token: Token): Promise<any>;
  deleteToken(id: number): Promise<any>;
  findByUserId(id: number): Promise<Token | null>;
  update(token: Token): any;
}
