import { User } from "../src/domaine/entities/user";
import { AuthUseCase } from "../src/domaine/useCase/authUseCase";
import { PrismaUserRepository } from "../src/infrastructure/sqlite/prismaUserRepository";
import { PrismaTokenRepository } from "../src/infrastructure/sqlite/prismaTokenRepository";
import { Token } from "../src/domaine/entities/token";

describe("User use case ", () => {
  let email = "test@abl.fr";
  let password = "valentin";

  let idUserCreated: number | undefined;

  const userRepository = new PrismaUserRepository();
  const tokenRepository = new PrismaTokenRepository();
  const auth = new AuthUseCase(userRepository, tokenRepository);
  it("create User", async () => {
    let register = await auth.register(email, password);
    idUserCreated = register?.id;
    expect(register).toBeInstanceOf(User);
  });

  it("Login User", async () => {
    let login = await auth.login(email, password);
    expect(login).toBeInstanceOf(Token);
  });

  it("Delete User", async () => {
    let userDelete = await auth.deleteUser(idUserCreated!);
    expect(userDelete).toBeTruthy();
  });
});
