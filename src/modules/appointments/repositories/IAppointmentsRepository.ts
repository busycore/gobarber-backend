import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

export default interface IAppointmentsRepository {
  // Notar que trocamos o null por undefined, a explicação disso é que o TYPEORM
  // Quando não encontra retorna undefined ao invés de null
  // Na prática não há muita diferença pois ambos retornam false
  FindByDate(ReceivedDate: Date): Promise<Appointment | undefined>;
  create(request: ICreateAppointmentDTO): Promise<Appointment>;
}
