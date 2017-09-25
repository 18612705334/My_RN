import React, {Component, PureComponent} from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    Image
} from 'react-native'

var nowTime = (new Date()).valueOf()
export default class MyButton extends PureComponent{

    constructor(props){
        super(props)
        this.oldTime = 0;
        this.newTime = 10000;
    }

    static TEXTBUTTON = "textbutton";
    static IMAGEBUTTON = "imagebutton";


    render(){
        if (this.props.buttonType == MyButton.TEXTBUTTON){
            return(
                <TouchableOpacity
                    style = {this.props.parentStyle}
                     onPress = {this.onPress}
                     activeOpacity = {this.props.opacity == null?0.5:this.props.opacity}
                >
                    <Text allowFontScaling={false} style = {this.props.childStyle}>{this.props.content}</Text>

                </TouchableOpacity>
            )
        }else{
            return(
                <TouchableOpacity
                    style = {this.props.parentStyle}
                    onPress = {this.onPress}
                    activeOpacity = {this.props.opacity == null?0.5:this.props.opacity}
                >
                    <Image style={this.props.childStyle} source = {this.props.content} />
                </TouchableOpacity>
            )

        }

    }


    onPress=()=>{
        this.newTime = (new Date()).valueOf();
        if ((this.newTime - this.oldTime)>500){
            this.oldTime = this.newTime;
            if (this.props.mOnPress){
                this.props.mOnPress();
            }
        }
    }

}