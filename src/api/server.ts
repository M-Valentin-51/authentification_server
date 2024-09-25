import express from "express";
import { AuthController } from "./controllers/authController";
import { PrismaTokenRepository } from "../../src/infrastructure/sqlite/prismaTokenRepository";
import { PrismaUserRepository } from "../../src/infrastructure/sqlite/prismaUserRepository";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
const userRepository = new PrismaUserRepository();
const tokenRepository = new PrismaTokenRepository();
const authController = new AuthController(userRepository, tokenRepository);
app.post("/login", authController.login.bind(authController));
app.post("/register", authController.register.bind(authController));
app.get("/refresh", authController.refresh.bind(authController));
app.get("/test", authController.testToken.bind(authController));
app.listen(port, () => {
  console.log(`Server runing on port ${port}`);
});
