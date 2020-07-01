import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  // Criar um array de appointments para ser o BD Fake
  private appointments: Appointment[] = [];

  public async FindByDate(
    ReceivedDate: Date,
  ): Promise<Appointment | undefined> {
    const FoundAppointment = this.appointments.find(eachAppointment =>
      isEqual(eachAppointment.date, ReceivedDate),
    );
    return FoundAppointment;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const newAppointment = new Appointment();
    // É o mesmo que newAppoitment.date=date,newAppointment.provider=provider etc
    Object.assign(newAppointment, { id: uuid(), date, provider_id, user_id });

    this.appointments.push(newAppointment);
    return newAppointment;
  }

  public async FindAllInMonthFromProvider({
    month,
    provider_id,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      eachAppointment =>
        eachAppointment.provider_id === provider_id &&
        getMonth(eachAppointment.date) + 1 === month &&
        getYear(eachAppointment.date) === year,
    );
    return appointments;
  }

  public async FindAllInDayFromProvider({
    month,
    provider_id,
    year,
    day,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      eachAppointment =>
        eachAppointment.provider_id === provider_id &&
        getMonth(eachAppointment.date) + 1 === month &&
        getYear(eachAppointment.date) === year &&
        getDate(eachAppointment.date) === day,
    );
    return appointments;
  }
}

export default AppointmentsRepository;
