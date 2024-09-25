const bcrypt = require("bcrypt");

export abstract class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const hashedPassword: string = await bcrypt.hash(password, 10);

    return hashedPassword;
  }

  static async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const match: boolean = await bcrypt.compare(password, hashedPassword);

    return match;
  }
}
