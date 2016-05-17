import config from './config/config'
import { ConnectDB, CloseDB, GetUsers, GetRooms, GetReservations } from './db/mongo'
import { GetDeviceInfoByRoom } from './db/redis'
import colors from 'colors';

export default async()=>{
  try{
    const now = new Date();
    const current = now.getTime();

    console.log(colors.white('Time : ' + now.getFullYear() + "-" + now.getMonth()+ "-" + now.getDate() + " " + now.getHours()+":"+now.getMinutes()));
    console.log(colors.green('WORKER ROUTINE START'));

    const db = await ConnectDB(config.mongodb);
    let users = await GetUsers(db);
    let rooms = await GetRooms(db);

    for(let i=0,len=rooms.length;i<len;i++){
      let status = await GetDeviceInfoByRoom(rooms[i]);
      if(status != null){
        status = JSON.parse(status);
        let updatedAt = new Date(status.updatedAt).getTime();
        let diff = Math.round((current - updatedAt)/(1000*60));

        if( diff >= 30 && diff < 60){ // 30분 이상
          console.log("[ " + rooms[i].title + " / " + rooms[i].device_id + " ] - 디바이스가 30분 이상 연결이 되지 않았습니다.");
        }
        else if( diff >= 120 && diff < 150){ //2시간 이상
          console.log("[ " + rooms[i].title + " / " + rooms[i].device_id + " ] - 디바이스가 2시간 이상 연결이 되지 않았습니다.");
        }
        else if( diff >= 600 && diff < 630){ // 10시간 이상
          console.log("[ " + rooms[i].title + " / " + rooms[i].device_id + " ] - 디바이스가 10시간 이상 연결이 되지 않았습니다.");
        }
        else if( diff >= 720 && now.getHours() == 9 && now.getMinutes() > 0 && now.getMinutes() <= 30){ // 12 시간 이상 - 아침 9시 알람
          console.log("[ " + rooms[i].title + " / " + rooms[i].device_id + " ] - 디바이스가 12시간 이상 연결이 되지 않았습니다. ");
        }
        else if( diff >= 720 && now.getHours() == 20 && now.getMinutes() > 30 && now.getMinutes() <= 59){ // 12시간 이상 - 저녁 8시 알람
          console.log("[ " + rooms[i].title + " / " + rooms[i].device_id + " ] - 디바이스가 12시간 이상 연결이 되지 않았습니다. ");
        }
      }else{
        console.log("[ " + rooms[i].title + " / " + rooms[i].device_id + " ] - 디바이스가 서버에 연길이 되지 않았습니다. ");
      }
    }
    CloseDB(db);

    console.log(colors.green('WORKER ROUTINE END'));
    console.log();
  }catch(e){
    console.log(colors.red(e));
    console.log();
  }
};
