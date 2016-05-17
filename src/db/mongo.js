import {MongoClient} from 'mongodb'

export function ConnectDB(url){
  return new Promise(function(resolve, reject) {
    MongoClient.connect(url, (err,db)=>{
      if(err) reject(err);
      else resolve(db);
    });
  });
};

export function CloseDB(db){
  return db.close();
};

export function GetUsers(db){
  return new Promise(function(resolve, reject) {
    db.collection('users').find().toArray((err,docs)=>{
      if(err) reject(err);
      else resolve(docs);
    });
  });
};

export function GetRooms(db){
  return new Promise(function(resolve, reject) {
    db.collection('rooms').find().toArray((err,docs)=>{
      if(err) reject(err);
      else resolve(docs);
    });
  });
};

export function GetReservations(db){
  return new Promise(function(resolve, reject) {
    db.collection('reservations').find().toArray((err,docs)=>{
      if(err) reject(err);
      else resolve(docs);
    });
  });
};
