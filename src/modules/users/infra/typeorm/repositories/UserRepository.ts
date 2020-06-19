import { EntityRepository, Repository, getRepository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

// @EntityRepository(Appointment)
class UsersRepository implements IUserRepository {
  // Aqui criamos uma variavel coringa que vai ser do tipo uma instancia do repository
  // Neste caso do typeorm, e vai ter todas as funcionalidades do typeorm
  // se um dia migrassemos teriamos de alterar aqui
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
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
