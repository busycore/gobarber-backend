import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

export default interface IAppointmentsRepository {
  // Notar que trocamos o null por undefined, a explicação disso é que o TYPEORM
  // Quando não encontra retorna undefined ao invés de null
  // Na prática não há muita diferença pois ambos retornam false
  FindByDate(
    ReceivedDate: Date,
    provider_id: string,
  ): Promise<Appointment | undefined>;
  create(request: ICreateAppointmentDTO): Promise<Appointment>;
  FindAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  FindAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>;
}
