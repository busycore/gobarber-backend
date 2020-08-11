import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
// import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
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
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('This date already past');
    }

    if (user_id === provider_id) {
      throw new AppError('You can not create an appointment with yourself');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only create appointments between 8AM and 5PM',
      );
    }

    const findAppointmenttsInSameDate = await this.appointmentsRepository.FindByDate(
      appointmentDate,
      provider_id,
    );

    // Service nao tem acesso a request,response então temos que fazer um throw
    if (findAppointmenttsInSameDate) {
      throw new AppError('This Appointment is already booked');
    }

    const newAppointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const formatedDate = format(date, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo Agendamento para dia ${formatedDate}`,
    });

    const cacheKey = `provider-appointments:${provider_id}-${format(
      appointmentDate,
      'yyyy-M-d',
    )}`;

    await this.cacheProvider.invalidate(cacheKey);

    return newAppointment;
  }
}
export default CreateAppointmentServices;
