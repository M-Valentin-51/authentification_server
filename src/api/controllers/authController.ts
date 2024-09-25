import { TokenService } from "../../services/tokenService";
import { TokenRepository } from "../../domaine/repository/tokenRepository";
import { UserRepository } from "../../domaine/repository/userRepository";
import { AuthUseCase } from "../../domaine/useCase/authUseCase";
import { Request, Response } from "express";

export class AuthController {
  protected authUseCase: AuthUseCase;
  constructor(
    userRepository: UserRepository,
    tokenRepository: TokenRepository
  ) {
    this.authUseCase = new AuthUseCase(userRepository, tokenRepository);
  }

  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const token = await this.authUseCase.login(email, password);

      res.cookie("refreshToken", token?.refreshToken, {
        httpOnly: true,
        path: "/",
        domain: "localhost",
        expires: new Date(token?.expiryDate! * 1000),
      });
      res.send(token);
    } catch (error) {
      console.error(error);
      res.sendStatus(401);
    }
  }

  public async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await this.authUseCase.register(email, password);
      delete user._password;
      res.send(user);
    } catch (error) {
      console.error(error);
      res.sendStatus(400);
    }
  }

  public async refresh(req: Request, res: Response) {
    try {
      // recupere l'access token
      const accessTokenHeader = req.headers.authorization;

      // extraire l'id user
      const tokenDecoded = TokenService.decodeAccessToken(accessTokenHeader!);

      const token = await this.authUseCase.updateAccessToken(
        tokenDecoded.userId,
        req.cookies.refreshToken
      );

      res.send({ accessToken: token.accessToken });
    } catch (error) {
      console.error(error);
      res.sendStatus(400);
    }
  }

  public async testToken(req: Request, res: Response) {
    const token = req.headers.authorization;

    const tokenValide = TokenService.verifyAccessToken(token!);

    if (tokenValide) {
      res.send({ date: new Date().toString() });
    } else {
      res.sendStatus(401);
    }
  }
}
