import { User } from "../src/domaine/entities/user";
import { AuthUseCase } from "../src/domaine/useCase/authUseCase";
import { AuthService } from "../src/services/authService";

describe("test auth", () => {
  let hashedPassword: string;

  it("hash password", async () => {
    hashedPassword = await AuthService.hashPassword("valentin");
    expect(typeof hashedPassword).toBe("string");
  });

  it("verify password with bad password", async () => {
    let passwordValid = await AuthService.verifyPassword(
      "valentin1",
      hashedPassword
    );
    expect(passwordValid).toBe(false);
  });

  it("verify password with good password", async () => {
    let passwordValid = await AuthService.verifyPassword(
      "valentin",
      hashedPassword
    );
    expect(passwordValid).toBe(true);
  });
});
