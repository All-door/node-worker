import Redis from 'ioredis'
import config from '../config/config'

const redis = new Redis(config.redis);

export function GetDeviceInfoByRoom(room){
  const device_id = room.device_id;
  return redis.hget('device_info',device_id);
}
