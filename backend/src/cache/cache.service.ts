import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';
@Injectable()
export class CacheService {
    constructor(
        @Inject('REDIS_CLIENT') private readonly client:RedisClientType
    ){}
    
    async get(key:string){
        return this.client.get(key);
    }
    
    async set( key:string , value :any , ttl?:number){
        if(ttl)
            await this.client.setEx(key , ttl , JSON.stringify(value));
        else
            await this.client.set(key , JSON.stringify(value));
    }

    async del(key:string){
        await this.client.del(key);
    }
}
