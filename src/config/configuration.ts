import 'dotenv/config';

export default () => ({
  app: {
    name: process.env.APP_NAME,
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    cors: process.env.APP_CORS === 'true' || false,
    origin: process.env.APP_ORIGIN,
    system: {
      name: process.env.APP_SYSTEM_NAME,
      email: process.env.APP_SYSTEM_EMAIL,
      email_address:
        '"' +
        process.env.APP_SYSTEM_NAME +
        '" <' +
        process.env.APP_SYSTEM_EMAIL +
        '>',
    },
    admin: {
      name: process.env.APP_ADMIN_NAME,
      email: process.env.APP_ADMIN_EMAIL,
      email_address:
        '"' +
        process.env.APP_ADMIN_NAME +
        '" <' +
        process.env.APP_ADMIN_EMAIL +
        '>',
    },
  },
  auth: {
    secret: process.env.AUTH_SECRET,
    expiresIn: process.env.AUTH_EXPIRESIN,
    google_oauth: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl: process.env.GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
    },
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dbname: process.env.DATABASE_DBNAME,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 3306,
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth:
      process.env.SMTP_SECURE === 'true'
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : null,
  },
  storage: {
    region: process.env.STORAGE_REGION,
    endpoint: process.env.STORAGE_ENDPOINT,
    forcePathStyle: process.env.STORAGE_FORCEPATHSTYLE === 'true' || false,
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
    bucketName: process.env.STORAGE_BUCKET_NAME,
    pathPrefix: process.env.STORAGE_PATH_PREFIX,
  },
  stripe: {
    publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
    secret_key: process.env.STRIPE_SECRET_KEY,
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  },
});
