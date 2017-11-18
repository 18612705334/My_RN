import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback,
    InteractionManager,
    KeyboardAvoidingView,
    TouchableOpacity,
} from "react-native";
import BaseComponent from "../component/BaseComponent";
import MyButton from "../component/MyButton";
import * as FontAndColor from "../constant/FontAndColor";
import LoginInputText from "./component/LoginInputText";
import NavigationBar from "../component/NavigationBar";
import PixelUtil from "../utils/PixelUtils";
import ImagePicker from "react-native-image-picker";
import {request} from "../utils/RequestUtil";
import * as AppUrls from "../constant/appUrls";
import md5 from "react-native-md5";
import LoginAndRegister from "./LoginAndRegister";
import * as ImageUpload from "../utils/ImageUpload";
import ImageSource from "../publish/component/ImageSource";

let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
let Pixel = new PixelUtil();

let imgSrc: '';
let imgSid: '';
let smsCode: '';
let uid: '';
let idcardf: '';
let idcardback: '';
let businessid: '';
let confirm = false;

const dismissKeyboard = require('dismissKeyboard');

var Platform = require('Platform');

const options = {
    title: '请选择',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '从相册选取',
    allowsEditing: false,
    noData: false,
    quality: 1.0,
    maxWidth: 480,
    maxHeight: 800,
    storageOption: {
        skipBackup: true,
        path: 'images'
    }

}


export default class Register extends BaseComponent {


    constructor(props) {
        super(props)
        this.state = {
            idcard: null,
            idcardBack: null,
            businessLicense: null,
            verifyCode: null,
            renderPlaceholderOnly: true,
        }

        this.id;
        this.timer = null;
    }

    initFinish = () => {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceHolderOnly: false})
            this.Verifycode()
        })
    }

    dismissKeyboard = () => {
        dismissKeyboard()
    }

    render() {

        if (this.state.renderPlaceHolderOnly) {
            return (
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.setState({
                            show: false
                        })
                    }}
                >
                    <View style={styles.container_view}>
                        <NavigationBar
                            leftImageShow={false}
                            leftTextShow={true}
                            leftText={''}
                            rightText={''}
                        />
                    </View>
                </TouchableWithoutFeedback>
            )
        }

        return (

            <TouchableWithoutFeedback
                onPress={this.dismissKeyboard}
            >
                <View style={styles.container_view}>
                    <ImageSource
                        galleryClick={this._galleryClick}
                        cameraClick={this._cameraClick}
                        ref={(modal) => {
                            this.imageSource = modal
                        }}
                    />

                    <NavigationBar
                        leftImageCallBack={this.backPage}
                        rightText={""}
                    />

                    <ScrollView>
                        <KeyboardAvoidingView>
                            <View style={styles.separator_container}>
                                <LoginInputText
                                    ref='userName'
                                    textPlaceholder={'请输入手机号'}
                                    viewStyle={styles.itemStyle}
                                    inputTextStyle={styles.inputTextStyle}
                                    leftIcon={false}
                                    clearValue={true}
                                    maxLength={11}
                                    import={true}
                                    rightIcon={false}
                                    keyboardType={'phone-pad'}
                                />
                                <LoginInputText
                                    ref='verifycode'
                                    textPlaceholder={'请输入验证码'}
                                    viewStyle={styles.itemStyle}
                                    inputTextStyle={styles.inputTextStyle}
                                    leftIcon={false}
                                    clearValue={false}
                                    maxLength={11}
                                    import={true}
                                    rightIcon={true}
                                    rightIconClick={this.Verifycode}
                                    rightIconStyle={{width: 100}}
                                    rightIconSource={this.state.verifyCode ? this.state.verifyCode : null}
                                    keyboardType={'phone-pad'}
                                />
                                <LoginInputText
                                    ref='smsCode'
                                    textPlaceholder={'请输入短信验证码'}
                                    viewStyle={[styles.itemStyle, {borderBottomColor:'white'}]}
                                    inputTextStyle={styles.inputTextStyle}
                                    leftIcon={false}
                                    clearValue={false}
                                    maxLength={11}
                                    import={true}
                                    rightIcon={false}
                                    rightButton={true}
                                    callBackSms={this.sendSms}
                                    keyboardType={'phone-pad'}

                                />

                            </View>

                            <View style={styles.separator_container}>
                                <LoginInputText
                                    ref='password'
                                    textPlaceholder={'请输入密码'}
                                    viewStyle={styles.itemStyle}
                                    inputTextStyle={styles.inputTextStyle}
                                    leftIcon={false}
                                    clearValue={true}
                                    maxLength={18}
                                    import={true}
                                    rightIcon={false}
                                    secureTextEntry={true}
                                    keyboardType={'default'}

                                />

                                <LoginInputText
                                    ref='passwordAgain'
                                    textPlaceholder={'请输再次输入密码'}
                                    viewStyle={[styles.itemStyle, {borderBottomColor:'white'}]}
                                    inputTextStyle={styles.inputTextStyle}
                                    leftIcon={false}
                                    clearValue={true}
                                    maxLength={18}
                                    import={true}
                                    rightIcon={false}
                                    secureTextEntry={true}
                                    keyboardType={'default'}
                                />

                            </View>

                            <View style={styles.separator_container}>
                                <LoginInputText
                                    ref='name'
                                    textPlaceholder={'请输入姓名'}
                                    viewStyle={styles.itemStyle}
                                    inputTextStyle={styles.inputTextStyle}
                                    leftIcon={false}
                                    clearValue={true}
                                    import={true}
                                    rightIcon={false}
                                    keyboardType={'default'}
                                />

                                <LoginInputText
                                    ref='businessName'
                                    textPlaceholder={'请输商家名称'}
                                    viewStyle={[styles.itemStyle, {borderBottomColor:'white'}]}
                                    inputTextStyle={styles.inputTextStyle}
                                    leftIcon={false}
                                    clearValue={true}
                                    import={true}
                                    rightIcon={false}
                                    secureTextEntry={false}
                                    keyboardType={'default'}
                                />

                            </View>

                        </KeyboardAvoidingView>

                        <View style = {styles.idcardContainer}>
                            <Text allowsFontScaling = {false} style = {{flex:1, marginLeft:15, color:FontAndColor.COLORA1}}>添加身份证照片</Text>
                            <View  >
                                <MyButton
                                    buttonType={MyButton.IMAGEBUTTON}
                                    content={this.state.idcard === null ? require('../../image/login/idcard.png') : this.state.idcard}
                                    parentStyle={[styles.buttonStyle]}
                                    childStyle={styles.imageButtonStyle}
                                    mOnPress={this.selectPhotoTapped.bind(this, 'idcard')}
                                />

                                {
                                    this.state.idcard?
                                        <MyButton
                                            buttonType={MyButton.IMAGEBUTTON}
                                            parentStyle={[styles.clearButtonStyle]}
                                            childStyle={styles.clearButtonImageStyle}
                                            content={require('../../image/login/clear.png')}
                                            mOnPress={()=>{
                                                this.setState({
                                                    idcard:null
                                                })
                                            }}
                                            />:null

                                }
                            </View>
                            <View style= {{marginRight:15}} >
                                <MyButton
                                    buttonType={MyButton.IMAGEBUTTON}
                                    content={this.state.idcardBack === null ? require('../../image/login/idcard_back.png') : this.state.idcardBack}
                                    parentStyle={[styles.buttonStyle]}
                                    childStyle={styles.imageButtonStyle}
                                    mOnPress={this.selectPhotoTapped.bind(this, 'idcardBack')}
                                />

                                {
                                    this.state.idcardBack?
                                        <MyButton
                                            buttonType={MyButton.IMAGEBUTTON}
                                            parentStyle={[styles.clearButtonStyle]}
                                            childStyle={styles.clearButtonImageStyle}
                                            content={require('../../image/login/clear.png')}
                                            mOnPress={()=>{
                                                this.setState({
                                                    idcardBack:null
                                                })
                                            }}
                                        />:null

                                }
                            </View>


                        </View>


                        <View style = {styles.idcardContainer}>
                            <Text allowsFontScaling = {false} style = {{flex:1, marginLeft:15, color:FontAndColor.COLORA1}}>添加营业执照</Text>
                            <View style = {{marginRight:15}} >
                                <MyButton
                                    buttonType={MyButton.IMAGEBUTTON}
                                    content={this.state.businessLicense === null ? require('../../image/login/idcard.png') : this.state.businessLicense}
                                    parentStyle={[styles.buttonStyle]}
                                    childStyle={styles.imageButtonStyle}
                                    mOnPress={this.selectPhotoTapped.bind(this, 'businessLicense')}
                                />

                                {
                                    this.state.businessLicense?
                                        <MyButton
                                            buttonType={MyButton.IMAGEBUTTON}
                                            parentStyle={[styles.clearButtonStyle]}
                                            childStyle={styles.clearButtonImageStyle}
                                            content={require('../../image/login/clear.png')}
                                            mOnPress={()=>{
                                                this.setState({
                                                    idcard:null
                                                })
                                            }}
                                        />:null

                                }
                            </View>

                        </View>

                        <MyButton
                            buttonType={MyButton.TEXTBUTTON}
                            content={'提交'}
                            parentStyle={[styles.commitButton]}
                            childStyle={styles.commitButtonText}
                            mOnPress={()=>{
                                this.register();
                            }}

                        />

                    </ScrollView>
                    {this.loadingView()}
                </View>
            </TouchableWithoutFeedback>
        )
    }

    register = ()=>{
        let userName = this.refs.userName.getInputTextValue()
        let smsCode = this.refs.smsCode.getInputTextValue();
        let password = this.refs.password.getInputTextValue();
        let passwordAgain = this.refs.passwordAgain.getInputTextValue();
        let name = this.refs.name.getInputTextValue();
        let businessName = this.refs.businessName.getInputTextValue();
        if (typeof(userName) == "undefined" || userName == "") {
            this.props.showToast("手机号码不能为空");
        } else if (userName.length != 11) {
            this.props.showToast("请输入正确的手机号");
        } else if (typeof(smsCode) == "undefined" || smsCode == "") {
            this.props.showToast("验证码不能为空");
        } else if (typeof(password) == "undefined" || password == "") {
            this.props.showToast("密码不能为空");
        } else if (typeof(password) == "undefined" || password == "") {
            this.props.showToast("密码不能为空");
        } else if (passwordAgain.length < 6) {
            this.props.showToast("密码必须为6~16位");
        } else if (typeof(name) == "undefined" || name == "") {
            this.props.showToast("用户名不能为空");
        } else if (typeof(businessName) == "undefined" || businessName == "") {
            this.props.showToast("商家名称不能为空");
        } else if (password !== passwordAgain) {
            this.props.showToast("两次密码输入不一致");
        } else {

            let device_code = '';
            if(Platform.OS === 'andriod'){
                device_code = 'dycd_platform_android'
            }else{
                device_code = 'dycd_platform_ios'
            }

            let maps = {
                device_code:device_code,
                user_name:name,
                phone:userName,
                pwd:md5.hex_md5(password),
                confirm_pwd:md5.hex_md5(passwordAgain),
                merchant_name:businessName,
                code:smsCode,
                idcard_img:idcardf+','+idcardback,
                license_img:businessid,
            }

            this.setState({
                loading:true,
            })
            request(AppUrls.REGISTER, 'POST', maps).then((response)=>{
                this.setState({
                    loading: false
                })
                console.log(response);
                if (response.mycode == '1'){
                    uid = response.mjson.data.uid;
                    this.props.showToast('注册成功');
                    this.resetRoute({
                        name:'LoginAndRegister',
                        component:LoginAndRegister,
                        parms:{}
                    })

                }else {
                    this.props.showToast(response.mycode.msg+'')
                }

            }, (error)=>{

                this.setState({
                    loading: false,
                });
                if (error.mycode == -300 || error.mycode == -500) {
                    this.props.showToast("注册失败");
                } else if (error.mycode == 7040004) {
                    this.Verifycode();
                    this.props.showToast(error.mjson.msg + "");
                } else {
                    this.props.showToast(error.mjson.msg + "");
                }

            })
        }
    }


    exitPage = (mProps) => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.immediatelyResetRouteStack([{
                ...mProps
            }])
        }
    }

    _rePhoto = () => {
        this.imageSource.openModal();
    };

    selectPhotoTapped = (id) => {
        if (Platform.OS === 'android') {
            this.id = id;
            this._rePhoto();
        } else {
            ImagePicker.showImagePicker(options, (response) => {
                if (response.didCancel) {
                } else if (response.error) {
                } else if (response.customButton) {
                } else {
                    this.uploadImage(response, id);
                }
            })
        }
    }

    _galleryClick = () => {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
            } else {
                this.uploadImage(response, this.id);
            }
        });
    }

    _cameraClick = () => {
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
            } else {
                this.uploadImage(response, this.id);
            }
        });
    }

    uploadImage = (response, id) => {
        let params = {
            base64_file: 'data:image/jpeg;base64,' + encodeURI(response.data).replace(/\+/g, '%2B')
        };
        this.setState({
            loading: true,
        });
        ImageUpload.request(AppUrls.AUTH_UPLOAD_FILE, 'Post', params)
            .then((response) => {
                console.log(response)
                this.setState({
                    loading: false,
                });
                if (response.mycode == 1) {
                    let source = {uri: response.mjson.data.url};
                    if (id === 'idcard') {
                        idcardf = response.mjson.data.file_id;
                        if (idcardf != "") {
                            this.setState({
                                idcard: source
                            });
                        } else {
                            this.props.showToast("id 为空 图片上传失败");
                        }
                    } else if (id === 'idcardBack') {
                        idcardback = response.mjson.data.file_id;
                        if (idcardback != "") {
                            this.setState({
                                idcardBack: source
                            });
                        } else {
                            this.props.showToast("id 为空 图片上传失败");
                        }
                    } else if (id === 'businessLicense') {
                        businessid = response.mjson.data.file_id;
                        if (businessid != "") {
                            this.setState({
                                businessLicense: source
                            });
                        } else {
                            this.props.showToast("id 为空 图片上传失败");
                        }
                    }
                } else {
                    this.props.showToast(response.mjson.msg + "!");
                }
            }, (error) => {
                // this.props.showModal(false);
                this.setState({
                    loading: false,
                });
                console.log(error);
                this.props.showToast("图片上传失败");
            });
    }


//获取图形验证码
    Verifycode = () => {
        this.refs.verifycode.loadingState(true);
        let device_code = '';
        if (Platform.OS === 'android') {
            device_code = 'dycd_platform_android';
        } else {
            device_code = 'dycd_platform_ios';
        }
        let maps = {
            device_code: device_code,
        };
        request(AppUrls.IDENTIFYING, 'Post', maps)
            .then((response) => {
                this.refs.verifycode.loadingState(false);
                imgSrc = response.mjson.data.img_src;
                imgSid = response.mjson.data.img_sid;

                this.setState({
                    verifyCode: {uri: imgSrc},
                });
            }, (error) => {
                this.refs.verifycode.loadingState(false);
                this.setState({
                    verifyCode: null,
                });
                if (error.mycode == -300 || error.mycode == -500) {
                    this.props.showToast("获取失败");
                } else {
                    this.props.showToast(error.mjson.msg + "");
                }
            });
    }
    //获取短信验证码
    sendSms = () => {
        let userName = this.refs.userName.getInputTextValue();
        let verifyCode = this.refs.verifycode.getInputTextValue();
        if (typeof(verifyCode) == "undefined" || verifyCode == "") {
            this.props.showToast("验证码不能为空");
        } else if (typeof(userName) == "undefined" || userName == "") {
            this.props.showToast("请输入手机号");
        } else {
            let device_code = '';
            if (Platform.OS === 'android') {
                device_code = 'dycd_platform_android';
            } else {
                device_code = 'dycd_platform_ios';
            }
            let maps = {
                device_code: device_code,
                img_code: verifyCode,
                img_sid: imgSid,
                phone: userName,
                type: "1",
            };
            // this.props.showModal(true);
            this.setState({
                loading: true,
            });
            request(AppUrls.SEND_SMS, 'Post', maps)
                .then((response) => {
                    // this.props.showModal(false);
                    this.setState({
                        loading: false,
                    });
                    if (response.mjson.code == "1") {
                        this.refs.smsCode.startCountDown();
                        // this.refs.smsCode.setInputTextValue(response.mjson.data.code + "");
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    // this.props.showModal(false);
                    this.setState({
                        loading: false,
                    });
                    this.Verifycode();
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast("短信验证码获取失败");
                    } else if (error.mycode == 7040012) {
                        this.Verifycode();
                        this.props.showToast(error.mjson.msg + "");
                    } else {
                        this.props.showToast(error.mjson.msg + "");
                    }
                });
        }
    }
}

const styles = StyleSheet.create({
    container_view: {
        flex: 1,
        backgroundColor: FontAndColor.THEME_BACKGROUND_COLOR,
    },

    separator_container: {
        marginTop: 10,
        paddingHorizontal: 15,
        width: width,
        backgroundColor: '#ffffff'
    },

    itemStyle: {},
    inputTextStyle: {
        backgroundColor: '#ffffff',
        paddingLeft: 0,
        paddingRight: 0,
        margin: 0,
    },
    imageButtonStyle:{
        width:80,
        height:60
    },
    buttonStyle:{
        marginTop:10,
        marginBottom:10,
        marginLeft:10,
    },
    clearButtonStyle:{
        marginTop:0,
        marginLeft:0,
        position:'absolute'
    },
    clearButtonImageStyle:{
        width:20,
        height:20,
        resizeMode:'contain'
    },

    idcardContainer:{
        backgroundColor:'#ffffff',
        flexDirection:'row',
        marginTop:10,
        alignItems:'center',

    },

    commitButton:{
        marginVertical:35,
        marginHorizontal:15,
        backgroundColor:FontAndColor.NAVI_BAR_COLOR,
        justifyContent:'center',
        alignItems:'center',
        height: 44,
    },
    commitButtonText:{
        color:'#ffffff',

    }

})







