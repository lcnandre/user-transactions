/**
 * Internal type (VO) to hold the summary of a
 * single user's transactions.
 *
 * @export
 * @typedef {UserSummary}
 */
export type UserSummary = {
  inflow: {
    [category: string]: number;
  };
  outflow: {
    [category: string]: number;
  };
};
