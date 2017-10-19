import StorageUtil from './StorageUtil'
var Platform = require('Platform')
import * as StorageKeyNames from "../constant/storageKeyNames";

const request = (url , method, params)=>{
    let isOK;
    let body = '';
    for (let key of Object.keys(params)){
        body += key;
        body += '=';
        body += params[key];
        body += '&';
    }

    if (body.length > 0) {
        body = body.substring(0, body.length - 1);
    }

    // resolve, reject 是两个回调方法
    return new Promise((resolve, reject)=>{
        StorageUtil.mGetItem(StorageKeyNames.TOKEN, (data)=>{
            let token = ""
            if(data.code === 1){
                token = data.result;
            }

            let device_code = '';
            if(Platform.OS == 'android'){
                device_code = 'dycd_dms_manage_android'
            }else{
                device_code = 'dycd_dms_manage_ios'
            }

            console.log(url + '?token=' + '0dee763feb648e3b901af57146d428a3'+'&device_code='+device_code)
            fetch(url + '?token=' + '0dee763feb648e3b901af57146d428a3'+'&device_code='+device_code, {
                method,
                body
            })
                .then((response)=>{

                if (response.ok){
                    isOK = true;
                }else {
                    isOK = false;
                }
                return response.json();

            }).then((responseDate)=>{

                if (isOK){
                    if (responseDate.code == 1){
                        resolve({mjson:responseDate, mycode:1})
                    }else {
                        reject({mycode:responseDate.code , mjson:responseDate})
                    }
                }
                reject({mycode:-300})

            }).catch((error)=>{

                reject({mycode:-500, error:error})
            })


        })



    })

}

export {request}