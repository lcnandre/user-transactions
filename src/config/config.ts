import Joi from 'joi';

export const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),

  APP_PORT: Joi.number().default(3000),
});

export default () => ({
  env: process.env.NODE_ENV,
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
  },
});
