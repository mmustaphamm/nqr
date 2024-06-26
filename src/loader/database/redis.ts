import { Redis } from 'ioredis'
import db from "../../config/db";

const redis = new Redis();

(async () => {
    if (!redis) {
        throw new Error('Redis client does not exist!');
        process.exit(1);
    }
    redis.on('connect', () => {
        console.log('Redis client is initiating a connection to the server.');
    });

    redis.on('ready', () => {
        console.log('Redis client successfully initiated connection to the server.');
    });

    redis.on('reconnecting', () => {
        console.log('Redis client is trying to reconnect to the server...');
    });

    redis.on('error', (err) => console.log('Redis Client Error', err));
    redis
})()

/**
 * https://www.npmjs.com/package/ioredis
 */
export class cache {

    static async get(key: string) {
        try {
          const cacheResults = await redis.get(key);
          if (cacheResults && typeof cacheResults == 'string') {
            return JSON.parse(cacheResults);
          } else {
            return null;
          }
        } catch (error) {
          console.error('redis get error', error);
          return null;
        }
      }
      

    static async set(key: string, value:any, ttl?: string | number | null) {
        if (ttl === undefined || ttl === null) {
            await redis.set(key, JSON.stringify(value)); 
            console.log(await redis.ttl(key));
        } else {
            await redis.setex(key, ttl, value);
        }
    }

    static async delete(key) {
        await redis.del(key);
        console.log(`${key} is deleted`)
    }

    static async getExpiry(key) {
        redis.ttl(key, (err, result) => {
            if (err) {
                console.error(err);
            } else {
                console.log('TTL:', result);
            }
        });
    }
}


export default redis