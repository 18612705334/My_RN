
import StorageUtil from './StorageUtil';

var Platform = require('Platform');
import * as StorageKeyNames from "../constant/storageKeyNames";
import {all} from '../constant/AllBackLogin';
import LoginScene from '../login/LoginScene';

const request = (url, method, params, backToLogin)=>{

    let loginSuccess ={
        name:'LoginScene',
        componet:LoginScene,
        params:{}
    }

    let isOk;
    let body = '';
    for (let key of Object.keys(params)){
        body += key;
        body += '=';
        body += params[key]
        body += '&';
    }

    if(body.length>0){
        body = body.substring(0, body.length-1);
    }

    return new Promise((resolve, reject)=>{
        StorageUtil.mGetItem(StorageKeyNames.TOKEN, (data)=>{  //获取token
            let token = '';
            if (data.code === 1){
                token = data.result;
            }
            //token = 'f435995d2c7a5d860b308ff7ab6dc6e2';

            let device_code = '';
            if (Platform.OS === 'android') {  //设备类型
                device_code = 'dycd_platform_android';
            } else {
                device_code = 'dycd_platform_ios';
            }

            url = url+'?token='+token+'&device_code='+device_code + '&version='+StorageKeyNames.VERSON_CODE+'&'+body;
            console.log(url);
            fetch(url, {method, body}).then((response)=>{
                if (response.ok){
                    isOk = true;
                }else {
                    isOk = false;
                }

                return response.json();

            }).then((responseJsonData)=>{
                if(isOk){
                    for(let key of Object.keys(params)){
                        console.log(key+'==='+params[key])
                    }
                    console.log(responseJsonData)

                    if (responseJsonData.code === 1){
                        resolve({mjson:responseJsonData, mycode:1})
                    }else {
                        if(responseJsonData.code == 7040011||responseJsonData.code == 7040020){
                            StorageUtil.mSetItem(StorageKeyNames.ISLOGIN,'');
                            StorageUtil.mSetItem(StorageKeyNames.NEED_TOAST_ERROR, responseData.msg + '');
                            if(all){
                                all.immediatelyResetRouteStack([{...loginSuccess}])
                            }
                        }else {
                            reject({mycode:responseJsonData.code, mjson:responseJsonData});
                        }
                    }

                }else {
                    console.log('error----'+JSON.stringify(responseJsonData))
                    reject({mycode:-300})
                }
            }).catch((error)=>{
                console.log("error----------error" + error);
                reject({mycode:-500, error:error});
            })

        })
    })
}

export {request}