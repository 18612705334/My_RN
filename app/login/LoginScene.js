import React, {Component} from 'react'

import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    BackAndroid,
    NativeModules,
    InteractionManager,
    Image,
    TouchableWithoutFeedback,
} from 'react-native'


import PixelUtil from "../utils/PixelUtils";
import BaseComponent from "../component/BaseComponent";
import NavigationBar from '../component/NavigationBar'
import * as FontAndColor from "../constant/FontAndColor";
import LoginAutoSearchInputText from "./component/LoginAutoSearchInputText";
import LoginInputText from "./component/LoginInputText";
import {request} from "../utils/RequestUtil";
import * as AppUrls from "../constant/appUrls";
import MyButton from '../component/MyButton'
import LoginFailSmsYes from "./LoginFailSmsYes";
import md5 from 'react-native-md5';
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";
import LoginGesture from "./LoginGesture";
import SetLoginPwdGesture from "./SetLoginPwdGesture";
import Register from './Register';

var Pixel = new PixelUtil();
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Platform = require('Platform')
var imgSrc: '';
var imgSid: '';
var userNames=[];
let andriodPhoneVersion = '';




export default class LoginScene extends BaseComponent {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            renderPlaceHolderOnly: true,
            verifyCode: null,
            value: '',
        }

    }


    componentDidMount(){
        super.componentDidMount();
        if (Platform.OS === 'andriod'){
            NativeModules.VinScan.getPhoneVersion((version)=>{
                andriodPhoneVersion = version;
            })
        }
    }


    initFinish = ()=>{
        StorageUtil.mGetItem(StorageKeyNames.USERNAME, (data)=>{
            if(data.code == 1 && data.result != null){
                userNames = data.result.split(',')
            }
        })
        this.getVerifyCode();
    }

    setLoginGesture={
        name:'SetLoginPwdGesture',
        component:SetLoginPwdGesture,
        params:{
            from:'login'
        }
    }


    ///获取图形验证码
    getVerifyCode = () => {
        this.refs.loginVerifyCode.loadingState(true);
        let maps = {}
        request(AppUrls.IDENTIFYING, 'Post', maps).then((response) => {
            this.refs.loginVerifyCode.loadingState(false);
            imgSid = response.mjson.data.img_sid;
            imgSrc = response.mjson.data.img_src;
            this.setState({
                verifyCode: {uri: imgSrc}
            })
        }, (error) => {
            this.refs.loginVerifyCode.loadingState(false);
            this.setState({
                verifyCode: null
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

        let userName = this.refs.loginUsername.getInputTextValue();
        let verifyCode = this.refs.loginVerifyCode.getInputTextValue();

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
                    this.refs.loginSmsCode._startCountDown()
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
                    this.getVerifyCode();
                    this.props.showToast(error.mjson.msg + '')
                } else {
                    this.props.showToast(error.mjson.msg + '')
                }

            })
        }
    }

    login = () => {
        let userName = this.refs.loginUsername.getInputTextValue();
        let passWord = this.refs.loginPassword.getInputTextValue();
        let verifyCode = this.refs.loginVerifyCode.getInputTextValue();
        let smsCode = this.refs.loginSmsCode.getInputTextValue();

        if (userName == '' || userName.length != 11){
            this.props.showToast('请输入正确的用户名'); return;
        }
        if (typeof (passWord) == 'undefined' || passWord == ''){
            this.props.showToast('密码不能为空'); return;
        }
        if (passWord.length<6){
            this.props.showToast('密码必须为6~16位'); return;
        }
        if (typeof (verifyCode) == 'undefined' || verifyCode == ''){
            this.props.showToast('验证码不能为空'); return;
        }
        if (typeof (smsCode) == 'undefined'|| smsCode == ''){
            this.props.showToast('短信验证码不能为空'); return;
        }

        let device_code = '';
        let device_type = '';


        if (Platform.OS === 'andriod'){
            device_code = 'dycd_platform_andriod'
            device_type = andriodPhoneVersion
        }else {
            device_code = 'dycd_platform_ios'
            device_type = 'phoneVersion=' + phoneVersion + ',phoneModel='+phoneModel+',appVersion='+appVersion;
        }

        let maps = {
            device_code:device_code,
            code:smsCode,
            login_type:2,
            phone:userName,
            pwd:md5.hex_md5(passWord),
            device_type:device_type,
        }

        this.setState({
            loading:true
        })

        request(AppUrls.LOGIN, 'POST', maps).then((response)=>{
            try{
                if (Platform.OS === 'andriod'){
                    NativeModules.GrowingIOModule.setCS1('user_id', userName)
                }else {

                }
                this.setState({loading:false})

                this.props.showToast('登录成功 哈哈')
                if(response.mjson.data.user_level == 2 || response.mjson.data.user_level == 1){   //1和2表示什么
                    if(response.mjson.data.enterprise_list == []|| response.mjson.data.enterprise_list == ''){
                        this.props.showToast("您的账号未绑定企业");
                    }else{
                        StorageUtil.mSetItem(StorageKeyNames.LOGIN_TYPE, '2');
                        StorageUtil.mGetItem(StorageKeyNames.USERNAME, (data)=>{
                            if(data.code==1){
                                if (data.result == null|| data.result == ''){
                                    StorageUtil.mSetItem(StorageKeyNames.USERNAME, userName);
                                }else if (data.result.indexOf(userName) == -1){
                                    StorageUtil.mSetItem(StorageKeyNames.USERNAME, userName+','+data.result)
                                }else if(data.result == userName){
                                }else {
                                    let names;
                                    if (data.result.indexOf(userName+',') == -1){
                                        if(data.result.indexOf(','+ userName) == -1){
                                            name = data.result.replace(userName, '')
                                        }else {
                                            names = data.result.replace(','+ userName, '')
                                        }
                                    }else {
                                        names = data.result.replace(userName+'', '')
                                    }
                                    StorageUtil.mSetItem(StorageKeyNames.USERNAME, userName+','+names);

                                }
                            }
                        })

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

                        StorageUtil.mGetItem(response.mjson.data.phone +'', (data)=>{
                            if (data.code == 1){
                                if(data.result != null){
                                    this.loginPage({
                                        name:'LoginGesture',
                                        component:LoginGesture,
                                        params:{from:'RootScene'}
                                    })
                                    StorageUtil.mSetItem(StorageKeyNames.ISLOGIN, 'true');
                                }else {
                                    this.loginPage(this.setLoginGesture)
                                }
                            }


                        })


                    }




                }else {

                    // 保存用户登录状态
                    StorageUtil.mSetItem(StorageKeyNames.LOGIN_TYPE, '2');
                    // 保存登录成功后的用户信息
                    StorageUtil.mGetItem(StorageKeyNames.USERNAME, (data) => {
                        if (data.code == 1) {
                            if (data.result == null || data.result == "") {
                                StorageUtil.mSetItem(StorageKeyNames.USERNAME, userName);
                            } else if (data.result.indexOf(userName) == -1) {
                                StorageUtil.mSetItem(StorageKeyNames.USERNAME, userName + "," + data.result);
                            } else if (data.result == userName) {
                            } else {
                                let names;
                                if (data.result.indexOf(userName + ",") == -1) {
                                    if (data.result.indexOf("," + userName) == -1) {
                                        names = data.result.replace(userName, "")
                                    } else {
                                        names = data.result.replace("," + userName, "")
                                    }
                                } else {
                                    names = data.result.replace(userName + ",", "")
                                }
                                StorageUtil.mSetItem(StorageKeyNames.USERNAME, userName + "," + names);
                            }
                        }
                    })

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
                    StorageUtil.mGetItem(response.mjson.data.phone + "", (data) => {
                        if (data.code == 1) {
                            if (data.result != null) {
                                // if (response.mjson.data.user_level == 2) {
                                //     if (response.mjson.data.enterprise_list[0].role_type == '2') {
                                this.loginPage({
                                    name: 'LoginGesture',
                                    component: LoginGesture,
                                    params: {from: 'RootScene'}
                                })
                                //     } else {
                                //         this.loginPage(this.loginSuccess)
                                //     }
                                // } else {
                                //     this.loginPage(this.loginSuccess)
                                // }
                                StorageUtil.mSetItem(StorageKeyNames.ISLOGIN, 'true');
                            } else {
                                this.loginPage(this.setLoginGesture)
                            }
                        }
                    })


                }


            }catch (e){

                this.props.showToast('数据错误');


            }finally {

            }




        }, (error)=>{

            this.setState({
                loading:false
            })

            this.setState({
                loading: false,
            });
            if (error.mycode == -300 || error.mycode == -500) {
                this.props.showToast("登录失败");
            } else if (error.mycode == 7040004) {
                this.getVerifyCode();
                this.props.showToast(error.mjson.msg + "");
            } else {
                this.props.showToast(error.mjson.msg + "");
            }
            // 保存用户登录状态
            StorageUtil.mSetItem(StorageKeyNames.ISLOGIN, 'false');

        })

    }


    loginPage = (mProps)=>{
        const navigator = this.props.navigator;
        if (navigator){
            navigator.immediatelyResetRouteStack([{...mProps}])
        }
    }

    render() {
        return (


            <TouchableWithoutFeedback
                onPress={() => {
                    this.setState({show: false})
                }}
            >

                <View style={{backgroundColor: FontAndColor.COLORA3, flex: 1}}>

                    <NavigationBar
                        leftImageShow={true}
                        leftTextShow={false}
                        rightTextShow={true}
                        rightImageShow={false}
                        centerText='登录'
                        rightText='注册'
                        leftImageCallBack={this.backPage}
                        rightTextCallBack={() => {
                            this.toNextPage({
                                // 去注册
                                component:Register,
                                name:'Register',
                                params:{}
                            })
                        }}
                    />

                    <View style={styles.inputTextStyle}>
                        <LoginAutoSearchInputText
                            leftImageShow={true}
                            inputPlaceHolder={"请输入用户名"}
                            keyboardType={'number-pad'}
                            clearValue={true}
                            ref='loginUsername'
                            callBackSearchResult={(result) => {
                                this.setState({
                                    show: result,
                                })
                            }}

                        />

                        <LoginInputText
                            ref="loginPassword"
                            textPlaceholder={'请输入密码'}
                            rightIcon={false}
                            secureTextEntry={true}
                            clearValue={true}
                            maxLength={16}
                            leftIconUri={require('./../../image/login/password.png')}
                            viewStytle={styles.itemStyel}
                        />
                        <LoginInputText
                            ref='loginVerifyCode'
                            textPlaceholder={'请输入验证码'}
                            leftIconUri={require('./../../image/login/virty.png')}
                            viewStyle={styles.itemStyle}
                            keyboardType={'number-pad'}
                            rightIconClick={this.getVerifyCode}
                            rightIconSource={this.state.verifyCode ? this.state.verifyCode : null}
                            rightIconStyle={{width: Pixel.getPixel(100), height: Pixel.getPixel(32)}}
                        />
                        <LoginInputText
                            ref="loginSmsCode"
                            textPlaceholder={'请输入短信验证码'}
                            leftIconUri={require('./../../image/login/sms.png')}
                            viewStyle={[styles.itemStyle, {borderBottomWidth: 0}]}
                            keyboardType="number-pad"
                            rightButton={true}
                            rightIcon={false}
                            callBackSms={this.smsCode}

                        />

                    </View>

                    <MyButton
                        buttonType={MyButton.TEXTBUTTON}
                        content='登录'
                        parentStyle={styles.loginButtonStyle}
                        childStyle={styles.loginButtonTextStyle}
                        mOnPress={this.login}
                    />


                    <TouchableOpacity
                        onPress={() => {
                            this.toNextPage({
                                component: LoginFailSmsYes,
                                name: 'LoginFailSmsYes',
                                parms: {}
                            })

                        }}

                        style={styles.problemTextContainer}
                    >
                        <Text allowFontScaling={false} style = {styles.problemText} >登录遇到问题 > </Text>

                    </TouchableOpacity>


                    <View style={{flex: 1}}></View>
                    <Image styel={styles.backgroundImage} source={require('./../../image/login/login_bg.png')}/>

                </View>

            </TouchableWithoutFeedback>


        )
    }
}

const styles = StyleSheet.create({

    problemTextContainer:{
        marginHorizontal:15,



    },
    problemText: {
        marginLeft:width-150,
        textAlign:'right',
        color:FontAndColor.COLORA2,
        fontSize:FontAndColor.LITTLEFONT
    },

    backgroundImage: {
        width: width,
        height: 175,
        bottom: 0,
        position: 'absolute'
    },

    loginButtonStyle: {
        height: 44,
        width: width - 30,
        backgroundColor: FontAndColor.COLORB0,
        margin: 15,
        marginTop: 25,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',

    },

    loginButtonTextStyle: {
        color: 'white',
        fontSize: FontAndColor.BUTTONFONT
    },

    inputTextStyle: {
        width: width,
        backgroundColor: '#ffffff',
        marginTop: Pixel.getPixel(15),
        paddingHorizontal: Pixel.getPixel(15),
    },

    itemStyle: {
        width: width - Pixel.getPixel(30)
    }

})
