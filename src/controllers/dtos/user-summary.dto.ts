import { Transform } from 'class-transformer';

export class UserSummary {
  @Transform(({ value }) => Object.values(value).map((v) => `${v}`), {
    toClassOnly: true,
  })
  inflow: { [category: string]: string };

  @Transform(({ value }) => Object.values(value).map((v) => `${v}`), {
    toClassOnly: true,
  })
  outflow: { [category: string]: string };
}
