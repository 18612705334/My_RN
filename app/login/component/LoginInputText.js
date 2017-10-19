import React, {Component, PropTypes} from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    TouchableWithoutFeedback,
    ActivityIndicator,
    PixelRatio
} from "react-native";

import * as FontAndColor from "../../constant/FontAndColor";
import SendMsgCountDown from "./SendMsgCountDown";
import PixelUtil from "../../utils/PixelUtils";
import MyButton from "../../component/MyButton";

var Pixel = new PixelUtil();
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
let onePT = 1 / PixelRatio.get(); //一个像素

export default class LoginInputText extends Component{
    constructor(props){
        super(props)
        this.state={
            values:'',
            rightIconLoading:false
        }

    }

    static defaultProps ={
        leftIcon: true,
        rightIcon: true,
        rightButton: false,
        clearValue: false,
        import: false,
        editable: true,

        maxLength:1000,

        leftIconUri:require('../../../image/welcome.jpg'),
        rightIconSource:{uri:'https://facebook.github.io/react/img/logo_og.png'},

        textPlaceholder: '请输入',
        keyboardType: 'default',

        leftText:null,
        secureTextEntry: false,//设置是否为密码安全输入框

    }

    static propTypes = {
        leftIcon:PropTypes.bool,
        rightIcon:PropTypes.bool,
        rightButton: PropTypes.bool,
        secureTextEntry: PropTypes.bool,
        clearValue: PropTypes.bool,//清除输入框内容
        import: PropTypes.bool,//是否为必填项
        editable: PropTypes.bool,

        leftIconUri:PropTypes.number,
        rightIconSource:PropTypes.object,
        maxLength: PropTypes.number,//限制文本输入框最大的输入字符长度
        textPlaceholder: PropTypes.string,
        leftText: PropTypes.string,
        keyboardType: PropTypes.string,  //键盘类型：用来选择默认弹出键盘类型

        inputTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        leftIconStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        rightIconStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        viewStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

        rightIconClick: PropTypes.func,//定义搜索结果控件
        callBackSms: PropTypes.func,//发送短语验证码
    }



    loadingState=(val)=>{
        this.setState({
            rightIconLoading:val
        })
    }

    clickBtn=()=>{

    }

    clearValue=()=>{


    }


    renderLoading=()=>{
        return(
            <ActivityIndicator
                size="small"
                style = {[styles.iconStyle, {width: Pixel.getPixel(45)}, this.props.rightIconStyle]}
            />
        )
    }

    getInputTextValue = ()=>{
        return this.state.values;
    }

    setInputTextValue = (value)=>{
        this.setState({
            values : value
        })
    }


    _startCountDown = ()=>{
        if(this.props.rightButton){
            this.refs.sendMms.startCountDown()
        }else{
            alert('没开启')
        }

    }

    render(){
        return(
            <View style = {[styles.componentStyle, this.props.viewStyle]} >
                {
                    this.props.leftIcon?
                        <Image style = {[styles.iconStyle, this.props.leftIconStyle]} source = {this.props.leftIconUri} />
                        :null

                }
                {this.props.leftText ?
                    <Text allowFontScaling={false}  style={styles.leftTextStyle}>{this.props.leftText}</Text>
                    : null
                }

                {
                    this.props.import?
                        <Text allowFontScaling = {false} style = {{color:FontAndColor.COLORB2, fontSize:FontAndColor.BUTTONFONT, paddingRight:Pixel.getPixel(2)}} >*</Text>
                        :null
                }

                <View style = {{flex:1, flexDirection:'row', alignItems:'center'}}>

                    <TextInput
                        ref="inputText"
                        underlineColorAndroid={'#00000000'}
                        placeholder={this.props.textPlaceholder}
                        placeholderTextColor={FontAndColor.COLORA1}
                        keyboardType={this.props.keyboardType}
                        style = {[styles.textInputStyle, this.props.inputTextStyle]}
                        onChangeText={(text)=> {
                            this.setState({
                                values: text
                            })
                            }
                        }

                        editable = {this.props.editable}
                        secureTextEntry={this.props.secureTextEntry}

                        value = {this.state.values}

                        onFocus = {this.props.focusChange?this.props.focusChange:()=>{}}
                        maxLength = {this.props.maxLength}
                    />

                    {   // 验证码按钮
                        this.props.rightIcon?
                            !this.state.rightIconLoading?
                                <TouchableWithoutFeedback
                                    onPress = {this.props.rightIconClick?this.props.rightIconClick:this.clickBtn}

                                >
                                    <Image  style = {[styles.iconStyle, { width: Pixel.getPixel(100), height: Pixel.getPixel(32), resizeMode: 'stretch'}]}
                                            source = {this.props.rightIconSource?this.props.rightIconSource:require('./../../../image/login/loadingf_fali.png')}
                                    />
                                </TouchableWithoutFeedback>
                                : this.renderLoading()

                            :null

                    }

                    { //获取验证按钮
                        this.props.rightButton?

                            <SendMsgCountDown
                                ref="sendMms"
                                callBackSms={this.props.callBackSms}
                            />
                            :null

                    }

                    {
                        this.props.clearValue&&this.state.values.length>0?
                            <MyButton
                                buttonType={MyButton.IMAGEBUTTON}
                                content={require("../../../image/login/clear.png")}
                                parentStyle={
                                    {padding: Pixel.getPixel(5)}
                                }
                                childStyle={{
                                    width: Pixel.getPixel(17),
                                    height: Pixel.getPixel(17)
                                }}
                                mOnPress = {this.clearValue}
                            />
                            :null
                    }

                </View>

            </View>
        )
    }

}

const styles = StyleSheet.create({

    textInputStyle:{
        flex:1,
        height:Pixel.getPixel(44),
        textAlign:'left',
        fontSize:Pixel.getPixel(FontAndColor.LITTLEFONT),
        paddingLeft:Pixel.getPixel(15),
        color:FontAndColor.COLORA0,
        //backgroundColor:'red'
    },

    componentStyle:{
        flexDirection:'row',
        alignItems:'center',   //副轴方向
        borderBottomWidth:onePT,
        borderBottomColor:FontAndColor.COLORA4,
        height:Pixel.getPixel(45),
    },

    iconStyle: {
        width: Pixel.getPixel(25),
        height: Pixel.getPixel(25),
    },

})
