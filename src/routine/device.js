import { GetDeviceInfoByRoom } from '../db/redis'

export default async(rooms)=>{
  const now = new Date();
  const current = now.getTime();

  for(let i=0,len=rooms.length;i<len;i++){
    let status = await GetDeviceInfoByRoom(rooms[i]);
    if(isValidStatus(status)){
      status = JSON.parse(status);

      const updatedAt = getUpdatedAtFromStatus(status);
      const diff = getDiffMinute(current,updatedAt);

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
};

function isValidStatus(status){
  return status != null;
}

function getUpdatedAtFromStatus(status){
  return new Date(status.updatedAt).getTime();
}

function getDiffMinute(current,updatedAt){
  return Math.round((current - updatedAt)/(1000*60));
}
