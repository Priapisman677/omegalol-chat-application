import { RedisClientType } from 'redis';
import { rateLimitKey } from '../keys/user-keys';

export const rateLimiter = async ({
	client,
    userId,
	actionKey,
	limit,
	windowSizeSecs,
}: {
	client: RedisClientType;
    userId: string;
	actionKey: string;
	limit: number;
	windowSizeSecs: number;
}) => {
	const key = rateLimitKey(userId, actionKey);
    const now = Date.now();

    const  windowStart = now - windowSizeSecs * 1000; //let's  say now: 999s - 10s = 989s.

    // So we want to remove all values from 0 to 989s.

    await  client.zRemRangeByScore(key, 0, windowStart);

    //Add new entry.
    await client.zAdd(key, [{score: now, value: `req-${now}` }]) //$ value can be ATYHING unique.

    const count = await client.zCard(key)

    await client.expire(key, windowSizeSecs) // (optional) Let's send someone sends numOfAllowedRequests -1 in the allowed time, if we don't expire, it will exist forever

	return count > limit;
};
