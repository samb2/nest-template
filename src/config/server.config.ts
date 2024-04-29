const serverConfig = {
  service_name: process.env.SERVICE_NAME,
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  endpoint: process.env.ENDPOINT,
  debug: process.env.DEBUG || false,
};

export { serverConfig as server };
