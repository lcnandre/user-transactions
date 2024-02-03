import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * Represents a summary of all transactions per user.
 *
 * @export
 * @class UserTotalDto
 * @typedef {UserTotalDto}
 */
export class UserTotalDto {
  /**
   * User's e-mail address.
   *
   * @type {string}
   */
  @ApiProperty()
  user_email: string;

  /**
   * Sum of all of the user's inflow transactions.
   *
   * @type {string}
   */
  @Transform(({ value }) => value.toFixed(2), {
    toClassOnly: true,
  })
  @ApiProperty()
  total_inflow: string;

  /**
   * Sum of all of the user's outflow transactions.
   *
   * @type {string}
   */
  @Transform(({ value }) => value.toFixed(2), {
    toClassOnly: true,
  })
  @ApiProperty()
  total_outflow: string;
}
