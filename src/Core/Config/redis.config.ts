import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv, createKeyv } from '@keyv/redis';

export const redisConfig: CacheModuleAsyncOptions = {
  useFactory: () => {
    // option 2
    const redisStore = new KeyvRedis(process.env.REDIS_URL);
    return {
      //option 1 
      //store: createKeyv(process.env.REDIS_URL), // use redis as a cache store

      // option 2
      store: new Keyv({ store: redisStore }),
    };
  },
};


// connecting directly with redis without using keyv

// import { redisStore } from 'cache-manager-redis-store'
// export const RedisOptions: CacheModuleAsyncOptions = {
//     useFactory: async () => {
//      //? password : undefined, // if you have a password for your redis server, you can add it here
//         const store = await redisStore({
//             socket: {
//                 host: 'localhost',
//                 port: 6379
//             }
//         })
//         return {
//             store: () => store
//         }
//     }
// }