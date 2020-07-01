import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { getDaysInMonth, getDate, getHours, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { Index } from 'typeorm';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.FindAllInDayFromProvider(
      { provider_id, year, month, day },
    );

    const HourStart = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + HourStart,
    );

    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map(eachHour => {
      const hasAppointmentInHour = appointments.find(
        eachAppointment => getHours(eachAppointment.date) === eachHour,
      );

      const compareDate = new Date(year, month - 1, day, eachHour);

      return {
        hour: eachHour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
