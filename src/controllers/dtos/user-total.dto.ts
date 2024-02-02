import { Transform } from 'class-transformer';

export class UserTotalDto {
  user_email: string;

  @Transform(({ value }) => value.toFixed(2), {
    toClassOnly: true,
  })
  total_inflow: string;

  @Transform(({ value }) => value.toFixed(2), {
    toClassOnly: true,
  })
  total_outflow: string;
}
