import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    InteractionManager,
    TouchableWithoutFeedback
} from "react-native";

import BaseComponent from "../component/BaseComponent";
import NavigationBar from "../component/NavigationBar";
import * as FontAndColor from "../constant/FontAndColor";
import PixelUtil from "../utils/PixelUtils";
import MyButton from "../component/MyButton";
import LoginInputText from "./component/LoginInputText";
import LoginFailPwd from "./LoginFailPwd";
import {request} from "../utils/RequestUtil";
import * as AppUrls from "../constant/appUrls";
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Pixel = new PixelUtil();
var Platform = require('Platform');

var imgSrc: '';
var imgSid: '';
var smsCode: '';


export default  class LoginFailSmsVerify extends BaseComponent{

    constructor(props){
        super(props)

        this.state = {
            verifyCodeUrl:null,
            renderPlaceHolderOnly:true,
        }
    }

    initFinish = ()=>{
        InteractionManager.runAfterInteractions(()=>{
            this.setState({renderPlaceHolderOnly:false})
            this.getVerifyCode();
        })
    }


    getVerifyCode = () => {
        this.refs.verifyCode.loadingState(true);
        let maps = {}
        request(AppUrls.IDENTIFYING, 'Post', maps).then((response) => {
            this.refs.verifyCode.loadingState(false);
            imgSid = response.mjson.data.img_sid;
            imgSrc = response.mjson.data.img_src;
            this.setState({
                verifyCodeUrl: {uri: imgSrc}
            })
        }, (error) => {
            this.refs.verifyCode.loadingState(false);
            this.setState({
                verifyCodeUrl: null
            })

            if (error.mycode == -300 || error.mycode == -500) {
                this.props.showToast("获取失败");
            } else {
                this.props.showToast(error.mjson.msg + "");
                console.log(error.mjson.msg + "");
            }
        })
    }

    smsCode = () => {  //获取短信验证码

        let userName = this.refs.userName.getInputTextValue();
        let verifyCode = this.refs.verifyCode.getInputTextValue();

        if (userName == '') {
            this.props.showToast("请输入正确的用户名");
        } else if (typeof(verifyCode) == 'undefined' || verifyCode == '') {
            this.props.showToast('验证码不能为空');
        } else {   //发起请求

            let device_code = '';
            if (Platform.OS === 'android') {
                device_code = 'dycd_platform_android';
            } else {
                device_code = 'dycd_platform_ios';
            }

            let maps = {
                device_code: device_code,
                img_sid: imgSid,
                phone: userName,
                type: '2',
                img_code:verifyCode,
            }

            this.setState({
                loading: true,
            })


            request(AppUrls.SEND_SMS, 'post', maps).then((response) => {
                this.setState({
                    loading: false,
                })

                if (response.mycode == '1') {
                    this.refs.smsCode.startCountDown()
                } else {
                    this.props.showToast(response.mjson.msg + '');
                }


            }, (error) => {
                this.setState({
                    loading: false
                });

                if (error.mycode == -300 || error.mycode == -500) {
                    this.props.showToast('获取验证码失败')
                } else if (error.mycode == 7040012) {
                    this.verifyCode();
                    this.props.showToast(error.mjson.msg + '')
                } else {
                    this.props.showToast(error.mjson.msg + '')
                }

            })
        }
    }



    loginPage = (mProps)=>{
        const navigator = this.props.navigator;
        if (navigator){
            navigator.immediatelyResetRouteStack([{...mProps}])
        }
    }

    // 登录
    login = () => {
        let userName = this.refs.userName.getInputTextValue();
        let verifyCode = this.refs.verifyCode.getInputTextValue();
        let smsCode = this.refs.smsCode.getInputTextValue();
        if (typeof(userName) == "undefined" || userName == "") {
            this.props.showToast("用户名不能为空");
        } else if (userName.length != 11) {
            this.props.showToast("请输入正确的用户名");
        } else if (typeof(verifyCode) == "undefined" || verifyCode == "") {
            this.props.showToast("验证码不能为空");
        } else if (typeof(smsCode) == "undefined" || smsCode == "") {
            this.props.showToast("短信验证码不能为空");
        } else {
            let device_code = '';
            if (Platform.OS === 'android') {
                device_code = 'dycd_platform_android';
            } else {
                device_code = 'dycd_platform_ios';
            }
            let maps = {
                device_code: device_code,
                code: smsCode,
                login_type: "1",
                phone: userName,
                pwd: "",
            };
            // this.props.showModal(true);
            this.setState({
                loading: true,
            });
            request(AppUrls.LOGIN, 'POST', maps).then((response) => {
                    // this.props.showModal(false);
                    this.setState({
                        loading: false,
                    });
                    if (response.mycode == "1") {
                        if (response.mjson.data.user_level == 2) {
                            if (response.mjson.data.enterprise_list == [] || response.mjson.data.enterprise_list == "") {
                                this.props.showToast("无授信企业");
                            } else {
                                // 保存用户登录状态
                                StorageUtil.mSetItem(StorageKeyNames.LOGIN_TYPE, '1');
                                StorageUtil.mSetItem(StorageKeyNames.USER_INFO, JSON.stringify(response.mjson.data));
                                // 保存用户信息
                                StorageUtil.mSetItem(StorageKeyNames.BASE_USER_ID, response.mjson.data.base_user_id + "");
                                StorageUtil.mSetItem(StorageKeyNames.ENTERPRISE_LIST, JSON.stringify(response.mjson.data.enterprise_list));
                                StorageUtil.mSetItem(StorageKeyNames.HEAD_PORTRAIT_URL, response.mjson.data.head_portrait_url + "");
                                StorageUtil.mSetItem(StorageKeyNames.IDCARD_NUMBER, response.mjson.data.idcard_number + "");
                                StorageUtil.mSetItem(StorageKeyNames.PHONE, response.mjson.data.phone + "");
                                StorageUtil.mSetItem(StorageKeyNames.REAL_NAME, response.mjson.data.real_name + "");
                                StorageUtil.mSetItem(StorageKeyNames.TOKEN, response.mjson.data.token + "");
                                StorageUtil.mSetItem(StorageKeyNames.USER_LEVEL, response.mjson.data.user_level + "");
                                this.setLoginPwd.params.userName = userName;
                                this.loginPage(this.setLoginPwd);
                            }
                        } else {
                            // 保存用户登录状态
                            StorageUtil.mSetItem(StorageKeyNames.LOGIN_TYPE, '1');
                            StorageUtil.mSetItem(StorageKeyNames.USER_INFO, JSON.stringify(response.mjson.data));
                            // 保存用户信息
                            StorageUtil.mSetItem(StorageKeyNames.BASE_USER_ID, response.mjson.data.base_user_id + "");
                            StorageUtil.mSetItem(StorageKeyNames.ENTERPRISE_LIST, JSON.stringify(response.mjson.data.enterprise_list));
                            StorageUtil.mSetItem(StorageKeyNames.HEAD_PORTRAIT_URL, response.mjson.data.head_portrait_url + "");
                            StorageUtil.mSetItem(StorageKeyNames.IDCARD_NUMBER, response.mjson.data.idcard_number + "");
                            StorageUtil.mSetItem(StorageKeyNames.PHONE, response.mjson.data.phone + "");
                            StorageUtil.mSetItem(StorageKeyNames.REAL_NAME, response.mjson.data.real_name + "");
                            StorageUtil.mSetItem(StorageKeyNames.TOKEN, response.mjson.data.token + "");
                            StorageUtil.mSetItem(StorageKeyNames.USER_LEVEL, response.mjson.data.user_level + "");
                            this.setLoginPwd.params.userName = userName;
                            this.loginPage(this.setLoginPwd);
                        }
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    // this.props.showModal(false);
                    this.setState({
                        loading: false,
                    });
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast("登录失败");
                    } else if (error.mycode == 7040004) {
                        this.Verifycode();
                        this.props.showToast(error.mjson.msg + "");
                    } else {
                        this.props.showToast(error.mjson.msg + "");
                    }
                });
        }
    }

    render(){

        if (this.state.renderPlaceHolderOnly){

            return ( <TouchableWithoutFeedback onPress={() => {
                this.setState({
                    show: false,
                });
            }}>
                <View style={{flex: 1, backgroundColor: FontAndColor.COLORA3}}>
                    <NavigationBar
                        leftImageShow={false}
                        leftTextShow={true}
                        leftText={""}
                        centerText={"短信验证"}
                        rightText={""}
                    />
                </View>
            </TouchableWithoutFeedback>);
        }
        return(
            <View style = {styles.container}>
                <NavigationBar
                    leftimageshow={true}
                    lefttextshow={false}
                    centerText="短信验证"
                    rightText="   "
                    leftImageCallBack={this.backPage}

                />

                <LoginInputText
                    ref = 'userName'
                    textPlaceholder="请输入手机号码"
                    leftIconUri={require('./../../image/login/phone.png')}
                    maxLength={11}
                    rightButton={false}
                    rightIcon={false}
                    keyboardType="number-pad"
                    clearValue={true}
                    viewStyle={[styles.itemStyle, {borderBottomWidth:0}]}
                />


                <LoginInputText
                    ref = 'verifyCode'
                    textPlaceholder="请输入验证码"
                    leftIconUri={require('./../../image/login/virty.png')}
                    maxLength={4}
                    rightButton={false}
                    rightIcon={true}
                    keyboardType="number-pad"
                    clearValue={false}
                    viewStyle={[styles.itemStyle, {borderBottomWidth:0, marginTop:13}]}
                    rightIconClick={this.getVerifyCode}
                    rightIconSource={this.state.verifyCodeUrl?this.state.verifyCodeUrl:null}
                    rightIconStyle={{width:100, height:32}}
                />


                <LoginInputText
                    ref = 'smsCode'
                    textPlaceholder="请输入短信验证码"
                    leftIconUri={require('./../../image/login/sms.png')}
                    maxLength={6}
                    rightButton={true}
                    rightIcon={false}
                    keyboardType="number-pad"
                    clearValue={false}
                    viewStyle={[styles.itemStyle, {borderBottomWidth:0, marginTop:1}]}
                    callBackSms={this.smsCode}

                />

                <MyButton
                    parentStyle = {styles.buttonStyle}
                    childStyle = {styles.buttonTextStyle}
                    buttonType = {MyButton.TEXTBUTTON}
                    content = "提交"
                    mOnPress = {this.login}
                />

                {this.loadingView()}

            </View>
        )

    }

    setLoginPwd = {
        name: 'LoginFailPwd',
        component: LoginFailPwd,
        params: {
            from: 'login',
            userName: '18612705334'
        }
    }


}

const styles = StyleSheet.create({
    container:{
        backgroundColor:FontAndColor.COLORA3,
        flex:1,
        alignItems:'center'
    },

    itemStyle:{
        marginTop:20,
        backgroundColor:'white',
        paddingHorizontal:15,

    },
    buttonStyle: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: FontAndColor.COLORB0,
        marginTop: Pixel.getPixel(50),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
    },
    buttonTextStyle: {
        color: FontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },

})