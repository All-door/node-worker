export default {
  interval : 1000 * 60 * 30,
  mongodb : "mongodb://localhost:27017/alldoor",
  redis : {

  }
};

export const SMS = {
  "APPID" : process.env.ALL_DOOR_SMS_APP_ID || "APIID",
  "APIKEY" : process.env.ALL_DOOR_SMS_API_KEY || "APIKEY"
};
