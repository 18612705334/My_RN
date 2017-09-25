import React, {Component, PropTypes} from "react";
import {StyleSheet, Text, View, TextInput, Image, PixelRatio} from "react-native";
import MyButton from "../../component/MyButton";
import * as FontAndColor from "../../constant/FontAndColor";
import PixelUtil from "../../utils/PixelUtils";
var Pixel = new PixelUtil();

const TIME = 60;

export default class SendMsgCountDown extends Component{
    constructor(){
        super()
        this.state={
            countDown:false,
            value:'获取验证码'
        }
        this.countTime = TIME;
        this.timer = null;
        this.oldTime = 0;
        this.newTime = 10000;

    }


    componentWillUnmount(){
        if (this.timer!=null){
            clearInterval(this.timer)
            this.timer = null
        }
    }


    static propTypes ={
        callBackSms:PropTypes.func,
    }

    onSendPress=()=>{
        this.props.callBackSms();

    }

    startCountDown = ()=>{
        if (!this.state.countDown){
            this.setState({
                countDown:true,
            })

        }else {
            console.log('正在倒计时');
        }

    }

    render() {
        return (
            <View style={styles.container}>

                <MyButton
                    buttonType ={MyButton.TEXTBUTTON}
                    content = {this.state.value}
                    parentStyle = {this.state.countDown?styles.pressButtonStyle:styles.buttonStyle}
                    childStyle = {this.state.countDown?styles.pressTextStyle:styles.textStyle}
                    mOnPress={this.onSendPress}

                />

            </View>

        )
    }
}
const styles = StyleSheet.create({

    container:{
        width:Pixel.getPixel(100),
        height:Pixel.getPixel(32),

    },

    pressButtonStyle:{
        borderColor:FontAndColor.COLORA1,
        borderWidth:1,
        width:Pixel.getPixel(100),
        height:Pixel.getPixel(32),
        alignItems:'center',
        justifyContent:'center',
    },
    buttonStyle:{
        borderColor:FontAndColor.COLORB0,
        borderWidth:1,
        width:Pixel.getPixel(100),
        height:Pixel.getPixel(32),
        alignItems:'center',
        justifyContent:'center',
    },
    pressTextStyle:{
        color:FontAndColor.COLORA1,
        fontSize:Pixel.getFontPixel(FontAndColor.LITTLEFONT),

    },
    textStyle:{
        color:FontAndColor.COLORB0,
        fontSize:Pixel.getPixel(FontAndColor.LITTLEFONT)

    },
})