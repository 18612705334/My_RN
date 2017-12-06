import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    BackAndroid,
    InteractionManager,
    Text,
    AppState,
} from 'react-native'

import BaseComponent from '../component/BaseComponent'
import MyButton from '../component/MyButton';
import MainPage from '../main/MainPage'
import  PixelUtil from '../utils/PixelUtils'
import StorageUtil from '../utils/StorageUtil';
import * as KeyNames from '../constant/storageKeyNames';
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import WelcomeScene from './WelcomeScene';
import LoginAndRegister from '../login/LoginAndRegister';
import LoginGesture from '../login/LoginGesture';
import SQLiteUtil from "../utils/SQLiteUtil";
const SQLite = new SQLiteUtil();
let Platform = require('Platform');


let {height, width} = Dimensions.get('window');
var Pixel = new PixelUtil;




export default class RootScene extends BaseComponent{

    componentDidMount(){
        super.componentDidMount()
        // StorageUtil.mGetItem(KeyNames.NEED_TOAST_ERROR, (data)=>{
        //     console.log(data);
        // });
        //
        // ErrorUtils.setGlobalHandler((e)=>{
        //     this.props.showToast(''+JSON.stringify(e));
        //     StorageUtil.mGetItem(KeyNames.PHONE, (res)=>{
        //         let maps = {
        //             phone:res.result,
        //             message:''+JSON.stringify(e)
        //         }
        //
        //         requset(Urls.ADDACCOUNTMESSAGEINFO, 'Post', maps).then(()=>{
        //
        //         }, (error)=>{
        //
        //         })
        //     })
        // })


        this.timer = setTimeout(()=>{
            this.toJump();
        },1000)





    }


    initFinish = ()=>{

        SQLite.createTable()
        let d = this.dateFormat(new Date, 'yyyy-MM-dd hh:mm:ss')
        StorageUtil.mSetItem(KeyNames.INTO_TIME, d);
        let map = {
            type:'6',
            api:'api/v1/App/Update'
        };

        request(Urls.APP_UPDATE, 'POST', map).then((response)=>{
            if (response.mjson.data.versioncode > versionCode) {
                this.navigatorParams.component = UpLoadScene;
                this.navigatorParams.params = {url: response.mjson.data.downloadurl}
                this.toNextPage(this.navigatorParams);
            } else {
                this.toJump();
            }
        }, (error)=>{
            this.toJump();
        })



    }




    toJump=()=>{
        this.onPress()
    }



    onPress = ()=>{

        let that = this;

        StorageUtil.mSetItem(KeyNames.NEED_GESTURE, 'true');  //存储需要手势密码标识
        StorageUtil.mGetItem(KeyNames.FIRST_INTO, (res)=>{
            if(res.result == null){  //判断是不是第一次登录， 第一次登录跳转到欢迎页
                that.navigatorParams.component = WelcomeScene;
                that.toNextPage(that.navigatorParams);
            }else {  //不是第一次登录 判断是否登录
                StorageUtil.mGetItem(KeyNames.ISLOGIN, (res)=>{
                    if(res.result !== StorageUtil.ERRORCODE){ //获取标识成功
                        if(res.result == null) { //未登录， 跳转到登录注册页
                            that.navigatorParams.component = LoginAndRegister;
                            that.toNextPage(that.navigatorParams);
                        }else{
                            if(res.result == 'true'){  //已登录
                                StorageUtil.mGetItem(KeyNames.USER_INFO, (data)=>{  //获取本地存储的用户信息
                                    let datas = JSON.parse(data.result);
                                    //if (datas.user_level == 2){ //？代码一样，这么判断有毛用
                                        if (datas.enterprise_list == null||datas.enterprise_list.length <= 0){
                                            that.navigatorParams.component = LoginAndRegister;
                                            that.toNextPage(that.navigatorParams);
                                        }else {
                                            that.navigatorParams.component = LoginGesture;
                                            that.navigatorParams.parms = {from:'RootScene'};
                                            that.toNextPage(that.navigatorParams);
                                        }
                                    //}else{


                                   // }

                                })
                            }else {  //未登录
                                that.navigatorParams.component = LoginAndRegister;
                                that.toNextPage(that.navigatorParams);
                            }

                        }


                    }
                })

            }

        })

    }

    toNextPage = (mProps)=>{
        const navigator = this.props.navigator;
        if (navigator){
            navigator.replace({
                ...mProps
            })
        }

    }

    navigatorParams = {
        name:'MainPage',
        component:MainPage,
        parms:{}
    }

    render() {
        return (

            <Image style = {styles.style_image}
                   source = {require('../../image/splash.png')}
            >
                <TouchableOpacity onPress = {this.onPress} style = {styles.style_cancel} >
                    <Text allowFontScaling={false} style={{color:'#fff', fontSize:Pixel.getPixel(12)}}>取消</Text>
                </TouchableOpacity>

            </Image>

        )
    }

    /**
     *   日期格式化
     **/
    dateFormat = (date, fmt) => {
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
}


const styles = StyleSheet.create({
    style_image:{
        backgroundColor:'#00000000',
        alignItems:'flex-end',
        resizeMode:'contain',
        width:width,
        flex:1,
    },
    style_cancel:{
        width:Pixel.getPixel(30),
        height:Pixel.getPixel(30),
        marginRight:Pixel.getPixel(35),
        marginTop:Pixel.getPixel(35),
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(0,0,0,.2)',
        borderRadius:15

    }
})


