import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * Represents a summary for all the transactions of a user.
 *
 * @export
 * @class UserSummaryDto
 * @typedef {UserSummaryDto}
 */
export class UserSummaryDto {
  /**
   * Sum of all of the user's inflow transactions per category.
   *
   * @type {{ [category: string]: string }}
   */
  @Transform(
    ({ value }) =>
      Object.entries(value).reduce((obj, [k, v]: [string, number]) => Object.assign(obj, { [k]: v.toFixed(2) }), {}),
    {
      toClassOnly: true,
    },
  )
  @ApiProperty()
  inflow: { [category: string]: string };

  /**
   * Sum of all of the user's outflow transactions per category.
   *
   * @type {{ [category: string]: string }}
   */
  @Transform(
    ({ value }) =>
      Object.entries(value).reduce((obj, [k, v]: [string, number]) => Object.assign(obj, { [k]: v.toFixed(2) }), {}),
    {
      toClassOnly: true,
    },
  )
  @ApiProperty()
  outflow: { [category: string]: string };
}
