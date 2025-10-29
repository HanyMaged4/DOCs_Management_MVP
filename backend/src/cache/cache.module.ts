import { Module, Global } from '@nestjs/common';
import { createClient } from 'redis';
import { CacheService } from './cache.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
    providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (config:ConfigService) => {
        const url = config.get<string>('REDIS_URL') ?? 'redis://localhost:6379';
        const client = createClient({ url});
        await client.connect();
        return client;
        },
    },
    CacheService
    ],
    exports: ['REDIS_CLIENT', CacheService],
  })
export class CacheModule {}
