
import {
    AsyncStorage
} from 'react-native'

export  default class StorageUtil{

    static ERRORCODE = '236407'

    static  mSetItem(key, value){
        AsyncStorage.setItem(key, value, (errs)=>{
            if (errs) {
                // console.log('存储错误');
            }
            if (!errs) {
                // console.log('存储无误');
            }
        })
    }

    static  mGetItem(key, callBack){
        AsyncStorage.getItem(key, (errs, result)=>{
            if (!errs) {
                callBack({code:1,result:result});
            } else {
                callBack({code:-1,error:StorageUtil.ERRORCODE});
            }
        })

    }

    static mRemoveItem(key){
        AsyncStorage.removeItem(key, (errs)=>{
            if (!errs) {
                // console.log('移除成功');
            }
        })

    }
}