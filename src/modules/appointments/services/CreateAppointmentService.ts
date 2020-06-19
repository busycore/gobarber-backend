import { startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
// import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface IRequest {
  provider_id: string;
  date: Date;
}

// Dependency Inversion(SOLID)
@injectable()
class CreateAppointmentServices {
  // Observe que usamos um hack do typescript para criar a variavel privada dentro do construtor
  // será necessário alterar a regra do ESLIN para que pare de dar erro
  // po
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmenttsInSameDate = await this.appointmentsRepository.FindByDate(
      appointmentDate,
    );

    // Service nao tem acesso a request,response então temos que fazer um throw
    if (findAppointmenttsInSameDate) {
      throw new AppError('This Appointment is already booked');
    }

    const newAppointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return newAppointment;
  }
}
export default CreateAppointmentServices;
