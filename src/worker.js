import config from './config/config'
import { ConnectDB, CloseDB, GetUsers, GetRooms, GetReservations } from './db/mongo'
import { GetDeviceInfoByRoom } from './db/redis'

export default async()=>{
  console.log('WORKER ROUTINE START');
  try{
    const now = new Date();
    const current = now.getTime();
    const db = await ConnectDB(config.mongodb);
    let users = await GetUsers(db);
    let rooms = await GetRooms(db);

    for(let i=0,len=rooms.length;i<len;i++){
      let status = await GetDeviceInfoByRoom(rooms[i]);
      if(status != null){
        status = JSON.parse(status);
        let updatedAt = new Date(status.updatedAt).getTime();
        let diff = Math.round((current - updatedAt)/(1000*60));

        if( diff > 30 && diff < 60){ // 30분 이상
          console.log(rooms[i].title + "/" + rooms[i].device_id + " - 디바이스 30분 이상 연결이 되지 않았습니다.");
        }
        else if( diff > 120 && diff < 150){ //2시간 이상
          console.log(rooms[i].title + "/" + rooms[i].device_id + " - 디바이스 2시간 이상 연결이 되지 않았습니다.");
        }
        else if( diff > 600 && diff < 660){ // 10시간 이상
          console.log(rooms[i].title + "/" + rooms[i].device_id + " - 디바이스 10시간 이상 연결이 되지 않았습니다.");
        }
        else if( diff > 720 && now.getHour() == 9 && now.getMintue() > 0 && now.getMintue() <= 30){ // 10시간 이상 - 아침 9시 알람
          console.log(rooms[i].title + "/" + rooms[i].device_id + " - 디바이스 12시간 이상 연결이 되지 않았습니다. ");
        }
      }else{
        console.log(rooms[i].title +" - 디바이스 에러! 디바이스 WIFI 확인 요망");
      }
    }
    CloseDB(db);
    console.log('WORKER ROUTINE END');
  }catch(e){
    console.log(e);
  }
};
