import {MongoClient} from 'mongodb'
import config from '../config/config';

function ConnectDB(url){
  return new Promise(function(resolve, reject) {
    MongoClient.connect(url, (err,db)=>{
      if(err) reject(err);
      else resolve(db);
    });
  });
};

function CloseDB(db){
  return db.close();
};

export async function GetUsers(){
  let db = await ConnectDB(config.mongodb);
  return new Promise(function(resolve, reject) {
    db.collection('users').find().toArray((err,docs)=>{
      CloseDB(db);
      if(err) reject(err);
      else resolve(docs);
    });
  });
};

export async function GetRooms(){
  let db = await ConnectDB(config.mongodb);
  return new Promise(function(resolve, reject) {
    db.collection('rooms').find().toArray((err,docs)=>{
      CloseDB(db);
      if(err) reject(err);
      else resolve(docs);
    });
  });
};

export async function GetReservations(){
  let db = await ConnectDB(config.mongodb);
  return new Promise(function(resolve, reject) {
    db.collection('reservations').find().toArray((err,docs)=>{
      CloseDB(db);
      if(err) reject(err);
      else resolve(docs);
    });
  });
};

export async function GetUserByID(userid){
  let db = await ConnectDB(config.mongodb);
  return new Promise(function(resolve, reject) {
    db.collection('users').find({ _id : userid}).toArray((err,docs)=>{
      CloseDB(db);
      if(err) reject(err);
      else resolve(docs[0]);
    });
  });
}
