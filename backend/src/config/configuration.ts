export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    url: String(process.env.DATABASE_URL),
  },
  redis: {
    host: String(process.env.REDIS_HOST),
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    username: String(process.env.REDIS_USERNAME),
    password: String(process.env.REDIS_PASSWORD),
  },
  jwt: {
    accessSecret: String(process.env.JWT_ACCESS_SECRET),
    refreshSecret: String(process.env.JWT_REFRESH_SECRET),
  },
  aws: {
    region: String(process.env.AWS_REGION),
    accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
    secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
    s3Bucket: String(process.env.AWS_S3_BUCKET),
  },
});

export type AppConfig = ReturnType<typeof import('./configuration').default>;
