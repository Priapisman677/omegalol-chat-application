import { userJSONkey } from "@shared/keys/user-keys.js";
import { prisma } from "src/lib/db.js";
import { client } from "../lib/redis-clients.js";

const users = await prisma.user.findMany({})


for(const user of users){
    await client.json.set(userJSONkey(user.id), '$', {
        userId: user.id.replace('#', ''),
        data: {
            username: user.username
        }
    })
}



