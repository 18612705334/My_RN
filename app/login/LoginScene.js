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


var Pixel = new PixelUtil();
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Platform = require('Platform')
var imgSrc: '';
var imgSid: '';

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

    ///获取图形验证码
    verifyCode = () => {
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
        } else if (typeof(verifyCode) == 'undefine' || verifyCode == '') {
            this.props.showToast('验证码不能为空')
        } else {   //发起请求
            let maps = {
                img_sid: imgSid,
                phone: userName,
                type: '2'
            }

            this.setState({
                loading: true,
            })


            request(AppUrls.SEND_SMS, 'post', maps).then((response) => {
                this.setState({
                    loading: false,
                })

                if (response.mycode == '1') {
                    this.ref.loginSmsCode.startCountDown()
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

    login = () => {


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
                        lefttextcallback={this.backPage}
                        righttextcallback={() => {
                            this.toNextPage({
                                // 去注册

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
                            ref="loginVerifyCode"
                            textPlaceholder={'请输入验证码'}
                            leftIconUri={require('./../../image/login/virty.png')}
                            viewStyle={styles.itemStyle}
                            keyboardType={'number-pad'}
                            rightIconClick={this.verifyCode}
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
                        myOnPress={this.login}
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
