import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisConfig } from './Config/redis.config';

@Module({
  // registerAsync because we may connect to a cache server on a cloud provider like redis or memcached, so we need to register it asynchronously
  imports: [
    CacheModule.registerAsync({
      isGlobal: true, // to be seen by all modules
      ...redisConfig,
    }),
  ],
})
export class CoreModule {}
