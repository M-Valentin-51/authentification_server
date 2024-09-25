import { User } from "../entities/user";

export interface UserRepository {
  save(user: User): Promise<any>;
  findByEmail(email: string): Promise<User | null>;
  deleteUser(id: number): Promise<any>;
}
