export type UserSummary = {
  inflow: {
    [category: string]: number;
  };
  outflow: {
    [category: string]: number;
  };
};
