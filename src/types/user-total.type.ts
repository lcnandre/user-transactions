/**
 * Internal type (VO) to hold the summary of
 * all users transactions.
 *
 * @export
 * @typedef {UserTotal}
 */
export type UserTotal = {
  user_email: string;
  total_inflow: number;
  total_outflow: number;
};
