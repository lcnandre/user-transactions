import Joi, { ObjectSchema } from 'joi';

/**
 * Joi Schema for the app configuration.
 * Validates the environment variables on initialization.
 *
 * @export
 * @type {ObjectSchema}
 */
export const schema: ObjectSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),

  APP_PORT: Joi.number().default(3000),
  DB_NAME: Joi.string().default('user-transactions.sqlite3'),
});

/**
 * Configuration values for the app.
 *
 * @export
 * @returns {object}
 */
export default (): object => ({
  env: process.env.NODE_ENV,
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
  },
  db: {
    name: process.env.DB_NAME || 'user-transactions.sqlite3',
  },
});
