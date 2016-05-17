import Worker from './worker'
import config from './config/config'
(()=>{
  console.log('ALL DOOR SERVICE - WORKER');
  Worker();
  setInterval(Worker,config.interval);
})();
