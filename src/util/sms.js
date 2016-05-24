import https from 'https'
import {SMS as config} from '../config/config'
const credential = 'Basic '+new Buffer(config.APPID+':'+config.APIKEY).toString('base64');

export function sendSMS(sender,receiver,content){
  const body = JSON.stringify({
    "sender" : config.SENDER,
    "receivers" : [receiver],
    "content" : content
  });

  const options = {
    host: 'api.bluehouselab.com',
    port: 443,
    path: '/smscenter/v1.0/sendsms',
    headers: {
      'Authorization': credential,
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body)
    },
    method: 'POST'
  };

  return new Promise((resolve, reject)=>{
    const req = https.request(options,(res)=>{
      let body = "";
      res.on('data',(d)=>{
        body += d;
      });
      res.on('end',(d)=>{
        if(res.statusCode == 200){
          resolve(JSON.parse(body));
        }else{
          reject({ status : res.statusCode , body : body });
        }
      });
    });

    req.write(body);
    req.end();
    req.on('error',(e)=>{
      reject(e);
    });
  });
}
