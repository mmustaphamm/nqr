"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const ioredis_1 = require("ioredis");
const db_1 = __importDefault(require("../../config/db"));
const redis = new ioredis_1.Redis(db_1.default.redisOptions);
(() => __awaiter(void 0, void 0, void 0, function* () {
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
    redis;
}))();
/**
 * https://www.npmjs.com/package/ioredis
 */
class cache {
    static get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cacheResults = yield redis.get(key);
                if (cacheResults && typeof cacheResults == 'string') {
                    return JSON.parse(cacheResults);
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error('redis get error', error);
                return null;
            }
        });
    }
    static set(key, value, ttl = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ttl) {
                yield redis.set(key, JSON.stringify(value), "EX", ttl); // await redis.expire(key, ttl)
                console.log(yield redis.ttl(key));
            }
            else {
                yield redis.set(key, JSON.stringify(value));
            }
        });
    }
    static delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield redis.del(key);
            console.log(`${key} is deleted`);
        });
    }
    static getExpiry(key) {
        return __awaiter(this, void 0, void 0, function* () {
            redis.ttl(key, (err, result) => {
                if (err) {
                    console.error(err);
                }
                else {
                    console.log('TTL:', result);
                }
            });
        });
    }
}
exports.cache = cache;
exports.default = redis;
