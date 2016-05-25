import { GetDeviceInfoByRoom } from '../db/redis'
import { GetUserByID, GetUsers } from '../db/mongo'
import { sendSMS } from '../util/sms'

export default async(rooms)=>{
  for(let i=0,len=rooms.length;i<len;i++){
    let status = await GetDeviceInfoByRoom(rooms[i]);
    let user = await GetUserByID(rooms[i].user_id);
    let phoneNumber = user.phoneNumber ? user.phoneNumber.replace(new RegExp('-','g'),'') : null;

    if(isValidStatus(status)){
      status = JSON.parse(status);

      const updatedAt = getUpdatedAtFromStatus(status);
      const diff = getDiffMinuteFromNow(updatedAt);

      if( diff >= 60 && diff < 90){ //1시간 이상
        console.log("[ " + rooms[i].title + " / " + rooms[i].device_id + " ] - All-Door 디바이스가 1시간 이상 연결이 되지 않았습니다. All-Door Service to " + phoneNumber);
        await sendSMS(phoneNumber,`[${getRoomTitle(rooms[i])}] 디바이스가 1시간 이상 연결이 되지 않았습니다. 연결 상태를 확인해주세요. All-Door Service`);
      }
      else if( diff >= 600 && diff < 630){ // 10시간 이상
        console.log("[ " + rooms[i].title + " / " + rooms[i].device_id + " ] - All-Door 디바이스가 10시간 이상 연결이 되지 않았습니다. All-Door Service to " + phoneNumber);
        await sendSMS(phoneNumber,`[${getRoomTitle(rooms[i])}] 디바이스가 10시간 이상 연결이 되지 않았습니다. 연결 상태를 확인해주세요. All-Door Service`);
      }
      else if( diff >= 24*60 && isNowHour(9)){ // 하루 이상 - 저녁 8시 알람
        console.log("[ " + rooms[i].title + " / " + rooms[i].device_id + " ] - All-Door 디바이스가 하루 이상 연결이 되지 않았습니다. All-Door Service to " + phoneNumber);
        await sendSMS(phoneNumber,`[${getRoomTitle(rooms[i])}] 디바이스가 하루 이상 연결이 되지 않았습니다. 연결 상태를 확인해주세요. All-Door Service`);
      }
    }else if(isNowHour(9)){ // 인터넷 연결 문제
      console.log("[ " + rooms[i].title + " / " + rooms[i].device_id + " ] - All-Door 디바이스가 서버 연결이 되지 않았습니다. All-Door Service to " + phoneNumber);
      await sendSMS(phoneNumber,`[${getRoomTitle(rooms[i])}] 디바이스가 서버 연결이 되지 않았습니다. 연결 상태를 확인해주세요. All-Door Service`);
    }
  }
};

function isValidStatus(status){
  return status != null;
}

function getUpdatedAtFromStatus(status){
  return new Date(status.updatedAt).getTime();
}

function getDiffMinuteFromNow(updatedAt){
  const now = new Date();
  const current = now.getTime();
  return Math.round((current - updatedAt)/(1000*60));
}

function isNowHour(hour){
  const now = new Date();
  return now.getHours() == hour && now.getMinutes() > 0 && now.getMinutes() <= 30;
}

function getRoomTitle(room){
  if( room.title.length > 10){
    return room.title.substring(0,10)+"...";
  }else {
    return room.title;
  }
}
