import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  // encontrar por email, como encontrammos varias repetições
  // podemos criar um metodo chamado findbyemail
  // -findbyId
  // -findbyemail
  // -Create(cria e salva)
  findById(id: string): Promise<User | undefined>;
  findByEmail(Email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
