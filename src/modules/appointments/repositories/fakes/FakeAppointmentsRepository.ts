import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

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
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const newAppointment = new Appointment();
    // É o mesmo que newAppoitment.date=date,newAppointment.provider=provider etc
    Object.assign(newAppointment, { id: uuid(), date, provider_id });

    this.appointments.push(newAppointment);
    return newAppointment;
  }
}

export default AppointmentsRepository;
