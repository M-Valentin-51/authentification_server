import { PrismaClient } from "@prisma/client";
import { Token } from "../../domaine/entities/token";
import { TokenRepository } from "src/domaine/repository/tokenRepository";

export class PrismaTokenRepository implements TokenRepository {
  prisma = new PrismaClient();

  async update(token: Token) {
    await this.prisma.token.update({
      where: {
        userId: token.userId,
      },
      data: {
        refreshToken: token.refreshToken,
        expiryDate: token.expiryDate,
      },
    });
  }

  async save(token: Token): Promise<Token | null> {
    const insert = await this.prisma.token.create({
      data: {
        refreshToken: token.refreshToken!,
        userId: token.userId!,
        expiryDate: token.expiryDate!,
        revoqued: token.isRevoqued,
      },
    });

    if (insert.id) {
      token.userId = insert.userId;
      return token;
    } else {
      return null;
    }
  }

  async deleteToken(id: number): Promise<any> {
    const response = await this.prisma.token.delete({
      where: {
        id: id,
      },
    });

    if (response.id) {
      return true;
    } else {
      return false;
    }
  }

  async findByUserId(id: number): Promise<Token | null> {
    const response = await this.prisma.token.findFirst({
      where: {
        userId: id,
      },
    });

    if (response) {
      let token = new Token();
      token.expiryDate = response.expiryDate;
      token.id = response.id;
      token.refreshToken = response.refreshToken;
      token.userId = response.userId;
      token.isRevoqued = response.revoqued;

      return token;
    } else {
      return null;
    }
  }
}
