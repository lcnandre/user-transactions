import { Transform } from 'class-transformer';

export class UserSummaryDto {
  @Transform(
    ({ value }) =>
      Object.entries(value).reduce((obj, [k, v]: [string, number]) => Object.assign(obj, { [k]: v.toFixed(2) }), {}),
    {
      toClassOnly: true,
    },
  )
  inflow: { [category: string]: string };

  @Transform(
    ({ value }) =>
      Object.entries(value).reduce((obj, [k, v]: [string, number]) => Object.assign(obj, { [k]: v.toFixed(2) }), {}),
    {
      toClassOnly: true,
    },
  )
  outflow: { [category: string]: string };
}
