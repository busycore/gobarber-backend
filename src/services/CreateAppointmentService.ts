import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import AppError from '../errors/AppError';

interface Request {
  provider_id: string;
  date: Date;
}

// Dependency Inversion(SOLID)

class CreateAppointmentServices {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointmentDate = startOfHour(date);

    const findAppointmenttsInSameDate = await appointmentsRepository.FindByDate(
      appointmentDate,
    );

    // Service nao tem acesso a request,response então temos que fazer um throw
    if (findAppointmenttsInSameDate) {
      throw new AppError('This Appointment is already booked');
    }

    const newAppointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(newAppointment);

    return newAppointment;
  }
}
export default CreateAppointmentServices;
