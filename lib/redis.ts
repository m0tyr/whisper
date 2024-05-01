import { Redis } from 'ioredis'

const getRedisURL = () => {
    if (process.env.REDIS_PRIVATE_URL) {
        return process.env.REDIS_PRIVATE_URL 
    }
    throw new Error('Redis url is not defined')

}

export const redis = new Redis(getRedisURL())