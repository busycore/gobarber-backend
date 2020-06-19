import { EntityRepository, Repository, getRepository } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

// @EntityRepository(Appointment)
class AppointmentsRepository implements IAppointmentsRepository {
  // Aqui criamos uma variavel coringa que vai ser do tipo uma instancia do repository
  // Neste caso do typeorm, e vai ter todas as funcionalidades do typeorm
  // se um dia migrassemos teriamos de alterar aqui
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async FindByDate(
    ReceivedDate: Date,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date: ReceivedDate },
    });
    return findAppointment;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, date });
    await this.ormRepository.save(appointment);
    return appointment;
  }
}

export default AppointmentsRepository;
