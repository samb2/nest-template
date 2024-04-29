const jwtConfig: object = {
  access_key: process.env.JWT_ACCESS_KEY,
  refresh_key: process.env.JWT_REFRESH_KEY,
  email_key: process.env.JWT_EMAIL_KEY,
};

export { jwtConfig as jwt };
