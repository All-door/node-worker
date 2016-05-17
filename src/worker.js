import config from './config/config'
import { ConnectDB, CloseDB, GetUsers, GetRooms, GetReservations } from './db/mongo'
import DeviceRoutine from './routine/device'
import colors from 'colors';

export default async()=>{
  try{
    const now = new Date();
    const date = + now.getFullYear() + "-" + now.getMonth()+ "-" + now.getDate() + " " + now.getHours()+":"+now.getMinutes();
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
