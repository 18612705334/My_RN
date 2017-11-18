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
        this.newTime = (new Date()).valueOf();
        if ((this.newTime - this.oldTime)>2000){
            this.oldTime = this.newTime;
            if (this.countTime == TIME){
                this.props.callBackSms()
            }
        }
    }

    startCountDown = ()=>{
        if (!this.state.countDown && this.timer == null){
            this.timer = setInterval(()=>{
                if(this.countTime <= 0){
                    this.setState({
                        countDown:false,
                        value:'获取验证码'
                    })
                    this.countTime=TIME;
                }else {

                    this.setState({
                        value: --this.countTime+'S后重发',
                    })
                }
            },(1000))

            this.setState({
                countDown:true,
            })

        }

    }

    endCountDown = ()=>{
        if(this.timer != null){
            clearInterval(this.timer);
            this.timer == null;
        }
        this.countTime =TIME;
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
        borderColor:FontAndColor.NAVI_BAR_COLOR,
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
        color:FontAndColor.NAVI_BAR_COLOR,
        fontSize:Pixel.getPixel(FontAndColor.LITTLEFONT)

    },
})