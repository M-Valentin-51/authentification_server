import { PrismaClient } from "@prisma/client";
import { User } from "../../domaine/entities/user";
import { UserRepository } from "../../domaine/repository/userRepository";

export class PrismaUserRepository implements UserRepository {
  prisma = new PrismaClient();

  async save(user: User): Promise<User | null> {
    const insert = await this.prisma.user.create({
      data: {
        email: user.email,
        hashPassword: user.password,
      },
    });
    const newUser = new User(insert.email, insert.hashPassword);
    newUser.id = insert.id;
    return newUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    let response = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (response == null) {
      return null;
    }

    const user = new User(response.email, response.hashPassword);
    user.id = response.id;

    return user;
  }

  async deleteUser(id: number): Promise<number> {
    const userDelete = await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    if (userDelete.id) {
      return 1;
    } else {
      return 0;
    }
  }
}
