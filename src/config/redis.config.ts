const redisConfig: object = {
  host_auth: process.env.REDIS_HOST,
  port_auth: process.env.REDIS_PORT,
  password_auth: process.env.REDIS_PASSWORD,
};

export { redisConfig as redis };
