import { createClient, SchemaFieldTypes } from 'redis';
import { userJSONkey } from '../../../shared/keys/user-keys';
import { userIndexKey } from '@shared/keys/index-keys';



if (!process.env.REDIS_PORT || !process.env.REDIS_HOST) {
  throw new Error('REDIS_PORT is not defined');
}

export const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
  password: '',
});

let isConnected = false;

export async function ensureRedisConnectedAndIndexed() {


  //! The only reason why I wrap this into a function is because my test did not allow top level awaits.
  if (!isConnected) {

  
    try {
      await client.connect();
      isConnected = true;
      await createIndex();
    } catch (err) {
      console.error('❌ Redis connection failed:', err);
    }
  }
}

(async () => {
    //! The only reason why I wrap this into a function is because my test did not allow top level awaits.
  await ensureRedisConnectedAndIndexed();
})();

async function createIndex() {
  const existing = await client.ft._list();
  if (existing.includes(userIndexKey)) return;

  await client.ft.create(
    userIndexKey,
    {
      '$.userId': { type: SchemaFieldTypes.TAG, AS: 'userId' },
      '$.data.username': { type: SchemaFieldTypes.TEXT, AS: 'username', SORTABLE: true },
    },
    {
      ON: 'JSON',
      PREFIX: userJSONkey(''),
    }
  );

}