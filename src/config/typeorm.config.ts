import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmModuleOptions = (configService: ConfigService) =>
  ({
    type: 'postgres',
    host: configService.get<string>('HOST'),
    port: +configService.get<string>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_USERNAME'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  } as TypeOrmModuleOptions);
