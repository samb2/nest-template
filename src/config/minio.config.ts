const minioConfig = {
  endPoint: process.env.MINIO_ENDPOINT,
  port: process.env.MINIO_PORT,
  useSSL: JSON.parse(process.env.MINIO_USE_SSL),
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  synchronize: JSON.parse(process.env.MINIO_SYNCHRONIZE),
};

export { minioConfig as minio };
