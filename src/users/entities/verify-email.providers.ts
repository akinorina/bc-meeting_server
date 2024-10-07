import { DataSource } from 'typeorm';
import { VerifyingEmail } from './verify-email.entity';

export const verifyingEmailProviders = [
  {
    provide: 'VERIFYING_EMAIL_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(VerifyingEmail),
    inject: ['DATA_SOURCE'],
  },
];
