import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';
@Injectable()
export class CacheService {
    constructor(
        @Inject('REDIS_CLIENT') private readonly client:RedisClientType
    ){}
    
    async get<T = any>(key: string): Promise<T | null> {
        const v = await this.client.get(key);
        if (v == null) return null;
        try {
            return await JSON.parse(v) as T; // handles strings stored via JSON.stringify
        } catch {
            return v as unknown as T;  // fallback if value wasn't JSON
        }
    }

    async set(key: string, value: any, ttl?: number) {
        const payload = JSON.stringify(value);
        if (ttl) await this.client.setEx(key, ttl, payload);
        else await this.client.set(key, payload);
    }

    async del(key:string){
        await this.client.del(key);
    }

    // Optional: get raw string without JSON parsing
    async getRaw(key: string): Promise<string | null> {
        return this.client.get(key);
    }
}
