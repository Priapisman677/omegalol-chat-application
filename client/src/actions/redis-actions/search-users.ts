"use server"
import { headers } from 'next/headers';
import { rateLimiter } from '@shared/functions/ratelimiter';
import { RedisClientType } from 'redis';
import { userIndexKey } from '@shared/keys/index-keys';
import { client } from '@/lib/redis-clients';

const fuzzyParser: Parser = (term) => `%${term}%`;
const globbingParserMiddle: Parser = (term) => `*${term}*`;

export const searchUsersRedis = async (searchInput: string): Promise<UserSearchActionResponse> => {

	const headerStore = await headers();
  	const userId = headerStore.get('userId')

	if(!userId){
		return {success: false, msg: 'No userId found.', foundUsers: null}
	}

	const isRateLimited = await rateLimiter({
		client: client as RedisClientType,
		userId,
		actionKey: 'searchUserJSON',
		limit: 20,
		windowSizeSecs: 10
	});

	if(isRateLimited ){
		return {success: false, msg: 'Too many search requests', foundUsers: null}
	}



	const parsers = [fuzzyParser, globbingParserMiddle];
	const cleanedArray = searchInput
		.replaceAll(/[^a-zA-Z0-9 #]/g, '')
		.trim()
		.split(' ')
		.filter(Boolean); // Remove empty strings

	console.log({cleanedArray}); //! DO NOT remove this log because it is being used in Jest tests.
	// ! If it bothers you you can wrap it in  process.env.NODE_ENV === 'development'.
	


	if (cleanedArray.length === 0 || cleanedArray[0] === '#') {
		return { success: true, msg: 'Omitting search term', foundUsers: [] };
	}

	for (const parser of parsers) {
		let query = '';
		if (cleanedArray[0].startsWith('#')) {
			query = `@userId:{${cleanedArray[0].replace('#', '')}}`;
		} else {
			query = `@username:(${cleanedArray.map(parser).join(' | ').replaceAll('#', '')})`; //$ In the "cleaner" we accept "#" to accept user ID but they cause errors in the search so we remove them.
		}
 
		console.log({query});  //! DO NOT remove this log because it is being used in Jest tests.
		// ! If it bothers you you can wrap it in  process.env.NODE_ENV === 'development'.
		
		let documents
		try{
			const redisRawResult = await client.ft.search(userIndexKey, query, {
				SORTBY: {
					BY: 'username',
					DIRECTION: 'DESC',
				},
			});
			documents = redisRawResult.documents
		}catch(e){
			console.log(e);	
			return {success: false, msg: 'Something went wrong.', foundUsers: null}
		}

		const resultsNoHash = documents.map((doc) => {
			return Object.fromEntries(Object.entries(doc.value));
		}) as RedisJsonUserResult[];

		//*Just adding a hash at the beginning:
		const resultsWithHash = resultsNoHash.map((result)=>{
			return {
				...result,
				userId: '#' + result.userId
			}
		})

		//* Remove self-user
		const results = resultsWithHash.filter((user)=> user.userId !== userId)

        if(results.length > 0){ //$ If no results, for-loop again until no more parsers.

            return {success: true, msg: 'Success', foundUsers: results}; //$ If there are results, break out of loop and return them.
        }
	}

	return {success: true, msg: 'No results', foundUsers: []};
};