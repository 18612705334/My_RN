import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    InteractionManager,
    TouchableWithoutFeedback
} from "react-native";

import BaseComponent from "../component/BaseComponent";
import NavigationBar from "../component/NavigationBar";
import * as FontAndColor from "../constant/FontAndColor";
import PixelUtil from "../utils/PixelUtils";
import MyButton from "../component/MyButton";
import LoginInputText from "./component/LoginInputText";
import {request} from "../utils/RequestUtil";
import * as AppUrls from "../constant/appUrls";
import md5 from "react-native-md5";
import StorageUtil from "../utils/StorageUtil";
import SetLoginPwdGesture from "./SetLoginPwdGesture";
import MainPage from "../main/MainPage";
import * as StorageKeyNames from "../constant/storageKeyNames";
import LoginGesture from './LoginGesture';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Pixel = new PixelUtil();
var Platform = require('Platform');

export default class LoginFailPwd extends BaseComponent{

    constructor(props){
        super(props)

        this.state = {
            renderPlaceholderOnly: true,
        }
    }

    initFinish = ()=>{

        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceHolderOnly: false});
            this.refs.phone.setInputTextValue(this.props.userName)
        });

    }




    setPwd = ()=>{
        let phone = this.refs.phone.getInputTextValue();
        let newPassword = this.refs.password.getInputTextValue();
        let newPasswordAgain = this.refs.password.getInputTextValue();
        if (typeof(phone) == "undefined" || phone == "") {
            this.props.showToast("手机号不能为空");
        } else if (phone.length != 11) {
            this.props.showToast("请输入正确的手机号");
        } else if (typeof(newPassword) == "undefined" || newPassword == "") {
            this.props.showToast("新密码不能为空");
        } else if (newPassword.length < 6) {
            this.props.showToast("密码必须为6~16位");
        } else if (typeof(newPasswordAgain) == "undefined" || newPasswordAgain == "") {
            this.props.showToast("再次确认密码不能为空");
        } else if (newPassword !== newPasswordAgain) {
            this.props.showToast("两次密码输入不一致");
        } else {
            let device_code = '';

            if (Platform.OS === 'android') {
                device_code = 'dycd_platform_android';
            } else {
                device_code = 'dycd_platform_ios';
            }

            let maps = {
                device_code:device_code,
                confirm_pwd:md5.hex_md5(newPasswordAgain),
                pwd:md5.hex_md5(newPassword)
            }

            this.setState({
                loading:true
            })

            request(AppUrls.SETPWD, 'post', maps).then((response)=>{
                this.setState({
                    loading:false
                })
                if (response.mycode == '1'){
                    StorageUtil.mGetItem(response.mjson.data.phone+'', (data)=>{
                        if (data.code == 1){
                            StorageUtil.mSetItem(StorageKeyNames.ISLOGIN, 'true');
                            if(data.result != null){   //有记录 不是第一次，
                               this.loginPage(this.loginSuccess)
                            }else {
                                this.loginPage(this.setLoginGesture)
                            }
                        }
                    })
                }else {
                    this.props.showToast(response.mjson.msg+'')
                }


            }, (error)=>{
                this.setState({
                    loading:false
                })
                if (error.mycode == -300 || error.mycode == -500) {
                    this.props.showToast("设置失败");
                } else {
                    this.props.showToast(error.mjson.msg + "");
                }
            })
        }


    }

    setLoginGesture = {
        name: 'SetLoginPwdGesture',
        component: SetLoginPwdGesture,
        params: {
            from: 'login'
        }
    }

    loginSuccess = {
        name: 'LoginGesture',
        component: LoginGesture,
        params: {}
    }

    loginPage = (mProps)=>{
        const navigator = this.props.navigator;
        if (navigator){
            navigator.immediatelyResetRouteStack([{...mProps}])
        }
    }

    render(){

        if (this.state.renderPlaceHolderOnly == true){

            return ( <TouchableWithoutFeedback onPress={() => {
                this.setState({
                    show: false,
                });
            }}>
                <View style={{flex: 1, backgroundColor: FontAndColor.THEME_BACKGROUND_COLOR}}>
                    <NavigationBar
                        leftImageShow={false}
                        lefttextshow={true}
                        leftText={""}
                        centerText={"设置短信密码"}
                        rightText={""}
                    />
                </View>
            </TouchableWithoutFeedback>);
        }

        return(
            <View style={styles.container}>
                <NavigationBar
                    leftImageShow={false}
                    leftTextShow={true}
                    leftText={""}
                    centerText={"设置登录密码"}
                    rightText={""}
                />
                <LoginInputText
                    ref = 'phone'
                    textPlaceholder="请输入手机号码"
                    leftIconUri={require('./../../image/login/phone.png')}
                    maxLength={11}
                    rightButton={false}
                    rightIcon={false}
                    editable = {false}

                    clearValue={false}
                    viewStyle={[styles.itemStyle, {borderBottomWidth:0}]}
                />


                <LoginInputText
                    ref = 'password'
                    textPlaceholder="请设置登录密码"
                    leftIconUri={require('./../../image/login/password.png')}
                    maxLength={16}
                    rightButton={false}
                    rightIcon={false}
                    keyboardType="default"
                    clearValue={true}
                    viewStyle={[styles.itemStyle, {borderBottomWidth:0, marginTop:13}]}
                    secureTextEntry={true}
                />


                <LoginInputText
                    ref = 'repassword'
                    textPlaceholder="请再次设置登录密码"
                    leftIconUri={require('./../../image/login/password.png')}
                    maxLength={16}
                    rightButton={false}
                    rightIcon={false}
                    keyboardType="default"
                    clearValue={true}
                    viewStyle={[styles.itemStyle, {borderBottomWidth:0, marginTop:1}]}
                    secureTextEntry={true}
                />

                <MyButton
                    parentStyle = {styles.buttonStyle}
                    childStyle = {styles.buttonTextStyle}
                    buttonType = {MyButton.TEXTBUTTON}
                    content = "确认"
                    mOnPress = {this.setPwd}
                />

                {this.loadingView()}


            </View>


        )
    }


}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: FontAndColor.THEME_BACKGROUND_COLOR,
    },

    itemStyle:{
        marginTop:20,
        backgroundColor:'white',
        paddingHorizontal:15,

    },
    buttonStyle: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: FontAndColor.NAVI_BAR_COLOR,
        marginTop: Pixel.getPixel(50),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
    },
    buttonTextStyle: {
        color: FontAndColor.THEME_BACKGROUND_COLOR,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },


})