import ApplicationError from '../loader/error-handler/ApplicationError';
import redis, { cache } from '../loader/database/redis'
import moment from 'moment';
import ForbiddenError from '../loader/error-handler/ForbiddenError';

const WINDOW_SIZE = 1; // minutes
const MAX_WINDOW_REQUEST_COUNT = 100;
const WINDOW_LOG_INTERVAL = 1; // minutes
const period = 'minutes'


export const RateLimiter = async (req, res, next) => {
    try {
        const partner = res.locals.partner
        const key = `merchant_${partner.id}` //_${req.ip}
        // check that redis client exists

        // fetch records of current user using IP address, returns null when no record is found
        const record = await cache.get(key);
        const currentRequestTime = moment();
        //   console.log('my rl key', record);

        //  if no record is found , create a new record for user and store to redis
        if (record == null || !record) {
            console.log('found record')
            let newRecord: any = [];
            let requestLog = {
                requestTimeStamp: currentRequestTime.unix(),
                requestCount: 1,
            };
            newRecord.push(requestLog);
            await cache.set(key, newRecord);
            return next();
        }

        /* 
         * if record is found, parse it's value and calculate the
         * number of requests users has made within the last window
         */
        let data = record;
        let windowStartTimestamp = moment().subtract(WINDOW_SIZE, period).unix();
        let requestsWithinWindow = data.filter((entry) => {
            return entry.requestTimeStamp > windowStartTimestamp;
        });

        console.log('requestsWithinWindow', requestsWithinWindow);


        let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
            return accumulator + entry.requestCount;
        }, 0);

        if (requestsWithinWindow.length === 0 || totalWindowRequestsCount == 0) {
            cache.delete(key)
            return next();
        }

        /*
         * if number of requests made is greater than or 
         * equal to the desired maximum, return error
         */
        if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
            return next(new ForbiddenError(`You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE} ${period} limit!`));
        } else {

            // if number of requests made is less than allowed maximum, log new entry
            let lastRequestLog = data[data.length - 1];
            let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime.subtract(WINDOW_LOG_INTERVAL, period).unix();

            //  if interval has not passed since last request log, increment counter
            if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                lastRequestLog.requestCount++;
                data[data.length - 1] = lastRequestLog;
            } else {
                //  if interval has passed, log new entry for current user and timestamp
                data.push({
                    requestTimeStamp: currentRequestTime.unix(),
                    requestCount: 1,
                });
            }
            await cache.set(key, data);
            return next();
        }
    } catch (error) {
        return next(`error occured ${error}`);
    }
};