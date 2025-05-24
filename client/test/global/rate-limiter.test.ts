import { client } from "@/lib/redis-clients";
import { rateLimiter } from "@shared/functions/ratelimiter";
import { rateLimitKey } from "@shared/keys/user-keys";
import { RedisClientType } from "redis";


const userId = '1abc'
const actionKey =  'searchUserJSON'

afterEach(() => {
    jest.restoreAllMocks(); // ✅ restores all spyOn overrides
  });


test('Should call zAdd with the correct params', async ()=>{

    
    const now = Date.now()
    const windowSizeSecs = 10;
    
    // const  windowStart = now - windowSizeSecs * 1000; //let's  say now: 999s - 10s = 989s.
    
    //$ Use spies to mock methods of classes and objects.
    //$ The Date.now() METHOD will be called in the action (randomly), all  we can do to assert is mock its return value.
    jest.spyOn(global.Date, 'now').mockReturnValue(now)  //! Remember to call spy.mockRestore OR jest.restoreAllMocks() if you don't want to overwrite the method forever.
    
    //$  This is another thing we can do with spies . Instead of looking up the Redis key, We can assert that the METHOD was called correctly without connecting to Redis.
    const zAddSPY  = jest.spyOn(client, 'zAdd')

    //$ Why not jest.mock? Because we cannot replace or keep  track of a MEHTOD with a mock, only module export functions.

    await rateLimiter({
        client: client as RedisClientType,
        userId,
        actionKey,
        limit: 20,
        windowSizeSecs
    });

    const key = rateLimitKey(userId, actionKey)

    //$ Spy assertion.
    expect(zAddSPY).toHaveBeenCalledWith(key, [{score: now, value: `req-${now}` }])
})




test("Rate limiter should not fail if only one request", async () => {
    const isRateLimited = await rateLimiter({
        client: client as RedisClientType,
        userId: '123',
        actionKey,
        limit: 20,
        windowSizeSecs: 10
    });

    expect(isRateLimited).toBeFalsy()

})

test('Rate limiter should kick in if more requests than usual.', async ()=>{

    let isRateLimited = false

    for (let i = 0; i < 7; i++){

        isRateLimited = await rateLimiter({
            client: client as RedisClientType,
            userId: '123',
            actionKey,
            limit: 5,
            windowSizeSecs: 10

        })

    }

    expect(isRateLimited).toBeTruthy()

})