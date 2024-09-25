import { AuthService } from "../../services/authService";
import { Token } from "../entities/token";
import { User } from "../entities/user";
import { TokenRepository } from "../repository/tokenRepository";
import { UserRepository } from "../repository/userRepository";
import { TokenService } from "../../services/tokenService";
export class AuthUseCase {
  constructor(
    private userRepository: UserRepository,
    private tokenRepository: TokenRepository
  ) {}

  public async login(email: string, password: string): Promise<Token | null> {
    let userStored = await this.userRepository.findByEmail(email);

    if (!userStored) {
      throw new Error("User not find");
    }

    // Verifier si le mot de passe correspond
    let passwordIsValid = await AuthService.verifyPassword(
      password,
      userStored.password
    );

    if (passwordIsValid == false) {
      throw new Error("Bad password");
    }

    // genere le token
    let accessToken = TokenService.generateAccessToken({
      userId: userStored.id,
    });

    let token = new Token();
    token.userId = userStored.id;
    token.accessToken = accessToken;
    token.generateToken();

    /**
     * Si une entre dans la table token existe update avec le nouveau refresh token
     * sinon le creer
     */

    const tokenUser = await this.tokenRepository.findByUserId(userStored.id);

    if (tokenUser) {
      this.tokenRepository.update(token);
    } else {
      this.tokenRepository.save(token);
    }

    return token;
  }

  public async register(email: string, password: string) {
    let hashedPassword = await AuthService.hashPassword(password);

    const user = new User(email, hashedPassword);

    return await this.userRepository.save(user);
  }

  public async deleteUser(id: number): Promise<boolean | number> {
    let row = await this.userRepository.deleteUser(id);
    return row;
  }

  public async updateAccessToken(userId: number, refreshToken: string) {
    // Recupere le refresh en bdd
    const refreshStored = await this.tokenRepository.findByUserId(userId);
    if (!refreshStored) {
      throw new Error("Token not find");
    }
    // Verifie si le token a ete revoquer

    if (refreshStored.isRevoqued) {
      throw new Error("Token is revoqued");
    }
    // Verifier la correspondance des refresh token

    if (refreshToken != refreshStored.refreshToken) {
      throw new Error("Token invalid");
    }
    // Verifier la validité du refresh token
    const refreshIsValid = TokenService.verifyRefreshToken(refreshToken);

    if (refreshIsValid == false) {
      throw new Error("Refresh token has expired");
    }

    // Generer nouveau access token
    const accesToken = TokenService.generateAccessToken({
      userId: refreshStored.userId,
    });

    refreshStored.accessToken = accesToken;

    return refreshStored;
  }
}
