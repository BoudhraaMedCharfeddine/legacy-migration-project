import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import { MSG, CreatePaymentDto, UpdatePaymentDto } from '@app/shared';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern(MSG.PAYMENTS_FIND_ALL)
  findAll() { return this.paymentsService.findAll(); }

  @MessagePattern(MSG.PAYMENTS_FIND_ONE)
  findOne(@Payload() id: number) { return this.paymentsService.findOne(id); }

  @MessagePattern(MSG.PAYMENTS_CREATE)
  create(@Payload() dto: CreatePaymentDto) { return this.paymentsService.create(dto); }

  @MessagePattern(MSG.PAYMENTS_UPDATE)
  update(@Payload() data: { id: number; dto: UpdatePaymentDto }) {
    return this.paymentsService.update(data.id, data.dto);
  }

  @MessagePattern(MSG.PAYMENTS_DELETE)
  remove(@Payload() id: number) { return this.paymentsService.remove(id); }
}
