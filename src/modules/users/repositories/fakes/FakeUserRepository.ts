import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import { th } from 'date-fns/locale';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

// @EntityRepository(Appointment)
class FakeUsersRepository implements IUserRepository {
  private users: User[] = [];

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;
    if (except_user_id) {
      users = this.users.filter(eachUser => eachUser.id !== except_user_id);
    }
    return users;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(eachUser => eachUser.id === id);
    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(eachUser => eachUser.email === email);
    return findUser;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(eachUser => eachUser.id === user.id);
    this.users[findIndex] = user;
    return user;
  }

  public async create(userdata: ICreateUserDTO): Promise<User> {
    const user = new User();
    const { email, password, name } = userdata;
    Object.assign(user, { id: uuid(), email, password, name });
    this.users.push(user);
    return user;
  }
}

export default FakeUsersRepository;
