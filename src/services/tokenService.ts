import { jwtDecode } from "jwt-decode";

const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();

interface IgenerateRefreshToken {
  token: string;
  validity: number;
}

export abstract class TokenService {
  static generateAccessToken(data: {}): string {
    const secret = fs.readFileSync("./.cert/private.pem", "utf8");
    const token = jwt.sign(data, secret, {
      expiresIn: process.env.VALIDITY_ACCESS_TOKEN,
      algorithm: "RS256",
    });

    return token;
  }

  static generateRefreshToken(data = {}): IgenerateRefreshToken {
    const secret = fs.readFileSync("./.cert/private.pem", "utf8");
    const token = jwt.sign(data, secret, {
      expiresIn: `${process.env.VALIDITY_REFRESH_TOKEN}`,
      algorithm: "RS256",
    });

    let validity = jwt.decode(token).exp;

    return { token, validity };
  }

  static verifyAccessToken(bearerToken: string): boolean {
    const [type, token] = bearerToken.split(" ");

    if (type == "Bearer" && token) {
      const secret = fs.readFileSync("./.cert/public.pem");

      try {
        jwt.verify(token, secret, { algorithms: ["RS256"] });

        return true;
      } catch (error) {
        return false;
      }
    }

    return false;
  }

  static decodeAccessToken(bearerToken: string): any {
    try {
      const [type, token] = bearerToken.split(" ");

      if (type == "Bearer" && token) {
        const secret = fs.readFileSync("./.cert/public.pem");

        const tokenDecoded = jwtDecode(token);

        return tokenDecoded;
      }
    } catch (error) {
      return false;
    }
  }

  static verifyRefreshToken(token: string): boolean {
    if (token) {
      const secret = fs.readFileSync("./.cert/public.pem");

      try {
        jwt.verify(token, secret, { algorithms: ["RS256"] });

        return true;
      } catch (error) {
        return false;
      }
    }

    return false;
  }
}
