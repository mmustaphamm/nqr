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
exports.RateLimiter = void 0;
const redis_1 = require("../loader/database/redis");
const moment_1 = __importDefault(require("moment"));
const ForbiddenError_1 = __importDefault(require("../loader/error-handler/ForbiddenError"));
const WINDOW_SIZE = 1; // minutes
const MAX_WINDOW_REQUEST_COUNT = 100;
const WINDOW_LOG_INTERVAL = 1; // minutes
const period = 'minutes';
const RateLimiter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partner = res.locals.partner;
        const key = `merchant_${partner.id}`; //_${req.ip}
        // check that redis client exists
        // fetch records of current user using IP address, returns null when no record is found
        const record = yield redis_1.cache.get(key);
        const currentRequestTime = (0, moment_1.default)();
        //   console.log('my rl key', record);
        //  if no record is found , create a new record for user and store to redis
        if (record == null || !record) {
            console.log('found record');
            let newRecord = [];
            let requestLog = {
                requestTimeStamp: currentRequestTime.unix(),
                requestCount: 1,
            };
            newRecord.push(requestLog);
            yield redis_1.cache.set(key, newRecord);
            return next();
        }
        /*
         * if record is found, parse it's value and calculate the
         * number of requests users has made within the last window
         */
        let data = record;
        let windowStartTimestamp = (0, moment_1.default)().subtract(WINDOW_SIZE, period).unix();
        let requestsWithinWindow = data.filter((entry) => {
            return entry.requestTimeStamp > windowStartTimestamp;
        });
        console.log('requestsWithinWindow', requestsWithinWindow);
        let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
            return accumulator + entry.requestCount;
        }, 0);
        if (requestsWithinWindow.length === 0 || totalWindowRequestsCount == 0) {
            redis_1.cache.delete(key);
            return next();
        }
        /*
         * if number of requests made is greater than or
         * equal to the desired maximum, return error
         */
        if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
            return next(new ForbiddenError_1.default(`You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE} ${period} limit!`));
        }
        else {
            // if number of requests made is less than allowed maximum, log new entry
            let lastRequestLog = data[data.length - 1];
            let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime.subtract(WINDOW_LOG_INTERVAL, period).unix();
            //  if interval has not passed since last request log, increment counter
            if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                lastRequestLog.requestCount++;
                data[data.length - 1] = lastRequestLog;
            }
            else {
                //  if interval has passed, log new entry for current user and timestamp
                data.push({
                    requestTimeStamp: currentRequestTime.unix(),
                    requestCount: 1,
                });
            }
            yield redis_1.cache.set(key, data);
            return next();
        }
    }
    catch (error) {
        return next(`error occured ${error}`);
    }
});
exports.RateLimiter = RateLimiter;
