import React from 'react';
import SQLiteStorage from 'react-native-sqlite-storage';

SQLiteStorage.DEBUG(true);
let db;
const Collection_TABLE_NAME = "CarName";//收藏表
const PUBLISH_TABLE_NAME = "publishCar"; //发布编辑
const CAR_TYPE_LIST = 'carTypeList'; // 车型列表
const MESSAGE_BACK_LOG_MODEL = 'messageBackLogModel'; // 待办事项缓存表
const MESSAGE_HEAD_LINE_MODEL = 'messageHeadLineModel'; // 车市头条缓存表
const MESSAGE_SYSTEM_MODEL = 'messageSystemModel'; // 系统消息缓存表

const SQLite = React.createClass({
    render(){
        return null
    },

    componentWillUnmount(){
        if(!db){
            this._successCB('close');
            db.close()
        }else {
            console.log("SQLiteStorage not open");
        }


    },


    createTable(){
        if(!db){
            this.open()
        }

        db.transaction((tx)=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS'+PUBLISH_TABLE_NAME + '('
                + 'vin VARCHAR(17) PRIMARY KEY NOT NULL,'
                +'model VARCHAR default "",'
                +'pictures VARCHAR default "",'
                +'v_type VARCHAR default "",'
                +'manufacture VARCHAR default "",'
                +'init_reg VARCHAR default "",'
                +'mileage VARCHAR default "",'
                +'plate_number VARCHAR default "",'
                +'emission VARCHAR default "",'
                +'label VARCHAR default "",'
                +'nature_use VARCHAR default "",'
                +'car_color VARCHAR default "",'
                +'trim_color VARCHAR default "",'
                +'transfer_number VARCHAR default "",'
                +'dealer_price VARCHAR default "",'
                +'describe VARCHAR default "",'
                +'modify VARCHAR default ""'
                + ');'
                ,[], ()=>{
                    this._successCB('executeSql');
                }, (err)=>{
                    this._errorCB('executeSql', err);
                }
            )},
            (err)=>{
                this._errorCB('transaction',err)
            }, ()=>{
                this._successCB('transaction')
            })


        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + CAR_TYPE_LIST + '('
                +'car_name VARCHAR default ""'
                + ');'
                , [], () => {
                    this._successCB('executeSql');
                }, (err) => {
                    this._errorCB('executeSql', err);
                });
        }, (err) => {
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        })
        //创建待办事项列缓存表
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + MESSAGE_BACK_LOG_MODEL + '('
                +'id INTEGER PRIMARY KEY ,'
                +'content TEXT ,'
                +'contentType TEXT ,'
                +'createTime TEXT ,'
                +'enable INTEGER NOT NULL ,'
                +'pushFrom TEXT ,'
                +'pushStatus INTEGER NOT NULL,'
                +'pushTo TEXT,'
                +'roleName TEXT,'
                +'taskId INTEGER ,'
                +'mendianId INTEGER ,'
                +'baoyouId INTEGER,'
                +'title TEXT,'
                +'isRead BOOLEAN NOT NULL,'
                +'tel TEXT'
                + ');'
                , [], () => {
                    this._successCB('executeSql');
                }, (err) => {
                    this._errorCB('executeSql', err);
                });
        }, (err) => {
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        })

        //创建车市头条缓存表
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + MESSAGE_HEAD_LINE_MODEL + '('
                +'id INTEGER PRIMARY KEY ,'
                +'content TEXT ,'
                +'contentType TEXT ,'
                +'createTime TEXT ,'
                +'enable INTEGER NOT NULL ,'
                +'pushFrom TEXT ,'
                +'pushStatus INTEGER NOT NULL,'
                +'pushTo TEXT,'
                +'roleName TEXT,'
                +'taskId INTEGER ,'
                +'title TEXT,'
                +'isRead BOOLEAN NOT NULL,'
                +'tel TEXT'
                + ');'
                , [], () => {
                    this._successCB('executeSql');
                }, (err) => {
                    this._errorCB('executeSql', err);
                });
        }, (err) => {
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        })

        //创建系统消息缓存表
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + MESSAGE_SYSTEM_MODEL + '('
                +'id INTEGER PRIMARY KEY ,'
                +'content TEXT ,'
                +'contentType TEXT ,'
                +'createTime TEXT ,'
                +'enable INTEGER NOT NULL ,'
                +'pushFrom TEXT ,'
                +'pushStatus INTEGER NOT NULL,'
                +'pushTo TEXT,'
                +'roleName TEXT,'
                +'taskId INTEGER ,'
                +'title TEXT,'
                +'isRead BOOLEAN NOT NULL,'
                +'tel TEXT'
                + ');'
                , [], () => {
                    this._successCB('executeSql');
                }, (err) => {
                    this._errorCB('executeSql', err);
                });
        }, (err) => {
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        })


    },

    open(){
        db = SQLiteStorage.openDatabase(
            {name:'mydata', creatFromLocation:'~data/mydata.db'},
            ()=>{
                this._successCB('open')
            },
            (err)=>{
                this._errorCB('open', err)
            }
        )

    },

    close(){
        if(db){
            db.close()
            this._successCB('close')
        }else {

        }
        db = null;
    },

    selectData(sql, array, callBack){
        if (!db){
            this.open();
        }
        db.executeSql(sql, array, function(result){
            callBack({code:1, result:result})
        }, function (error) {
            callBack({code:-1, result:error})
        })
    },

    changeData(sql, array){
        if (db){
            this.open()
        }
        db.transaction((tx)=>{
            tx.executeSql(sql, array);
        }, (error)=>{

        }, ()=>{

        })
    },

    changeDataBatch(batch){
        if(!db){
            this.open()
        }
        db.transaction(
            (tx)=>{
                for(let i = 0; i<batch.length; i++){
                    tx.executeSql(batch[i].sql, batch[i].array)
                }
            }
        )
    },


    _successCB(name){
         console.log("SQLiteStorage " + name + " success");
    },
    _errorCB(name, err){
         console.log("SQLiteStorage " + name + " error:" + err);
    },

})




module.exports = SQLite
