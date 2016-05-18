import config from './config/config'
import { ConnectDB, CloseDB, GetUsers, GetRooms, GetReservations } from './db/mongo'
import DeviceRoutine from './routine/device'
import colors from 'colors';

export default async()=>{
  try{
    const date = getNowDateString();

    console.log(colors.white('Time : ' + date ));
    console.log(colors.green('WORKER ROUTINE START'));

    const db = await ConnectDB(config.mongodb);
    await DeviceRoutine(await GetRooms(db));
    CloseDB(db);

    console.log(colors.green('WORKER ROUTINE END'));
    console.log();
  }catch(e){
    console.log(colors.red(e));
    console.log();
  }
};

function getNowDateString(){
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() >= 10 ? now.getMonth() : '0' + now.getMonth();
  const date = now.getDate() >= 10 ? now.getDate() : '0' + now.getDate();
  const hour = now.getHours() >= 10 ? now.getHours() : '0' + now.getHours();
  const min = now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes();
  return `${year}-${month}-${date} ${hour}:${min}`;
}
