import { EntityRepository, Repository, getRepository, Not } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

// @EntityRepository(Appointment)
class UsersRepository implements IUserRepository {
  // Aqui criamos uma variavel coringa que vai ser do tipo uma instancia do repository
  // Neste caso do typeorm, e vai ter todas as funcionalidades do typeorm
  // se um dia migrassemos teriamos de alterar aqui
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: { id: Not(except_user_id) },
      });
    } else {
      users = await this.ormRepository.find();
    }
    return users;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });
    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async create(userdata: ICreateUserDTO): Promise<User> {
    const appointment = this.ormRepository.create(userdata);
    await this.ormRepository.save(appointment);
    return appointment;
  }
}

export default UsersRepository;
