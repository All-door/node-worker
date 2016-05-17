import Worker from './worker'
import config from './config/config'
import colors from 'colors'

(()=>{
  console.log('ALL DOOR SERVICE - WORKER'.underline.white);
  console.log();
  
  Worker();
  setInterval(Worker,config.interval);
})();
