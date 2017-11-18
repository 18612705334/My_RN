import React, {Component, PropTypes, PureComponent} from "react";
import {AppRegistry, StyleSheet, View, Text} from "react-native";

import MyButton from './MyButton';
import * as FontAndColor from "../constant/FontAndColor";
import PixelUtil from "../utils/PixelUtils";
import {request} from "../utils/RequestUtil";

var Platform = require('Platform');
var Pixel = new PixelUtil;


export default class NavigationBar extends PureComponent{

    static defaultProps = {
        leftTextShow:false,
        leftImageShow:true,
        centerTextShow:true,
        rightTextShow:true,
        rightImageShow:false,

        leftText:"",
        leftImage:require('../../image/login/navigotion_back.png'),
        rightImage:require('../../image/login/add.png'),
        centerText: "注册",
        rightText: "提交",
    };

    static propTypes = {
        leftTextShow:PropTypes.bool,
        leftImageShow: PropTypes.bool,
        centerTextShow: PropTypes.bool,
        rightTextShow: PropTypes.bool,
        rightImageShow: PropTypes.bool,

        leftText: PropTypes.string,
        leftImage: PropTypes.number,
        rightImage: PropTypes.number,
        centerText: PropTypes.string,
        rightText: PropTypes.string,

        leftTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        leftImageStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        rightImageStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        centerTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        rightTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        titleVeiwSytle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

        leftTextCallBack: PropTypes.func,
        leftImageCallBack: PropTypes.func,
        rightImageCallBack: PropTypes.func,
        // centerTextCallBack: PropTypes.func,
        rightTextCallBack: PropTypes.func,
    }

    render(){
        return(
            <View  style = {(Platform.OS === 'android')?styles.style_android_navi_bar:styles.style_ios_navi_bar}>
                {
                    this.props.leftTextShow?
                        <MyButton buttonType={MyButton.TEXTBUTTON}
                                  content={this.props.leftText}
                                  childStyle = {styles.leftTextStyle}
                                  mOnPress ={this.props.leftTextCallBack}
                        />
                        :null
                }

                {
                    this.props.leftImageShow?
                        <MyButton
                            buttonType = {MyButton.IMAGEBUTTON}
                            content = {this.props.leftImage}
                            parentStyle = {styles.buttonStyle}
                            childStyle = {[styles.leftImageStyle]}
                            mOnPress = {this.props.leftImageCallBack}
                        />
                        :null

                }

                <Text allowFontScaling={false} style = {[styles.centerTextStyle, this.props.centerTextStyle]} >{this.props.centerText}</Text>

                {
                    this.props.rightTextShow?
                        <MyButton buttonType={MyButton.TEXTBUTTON}
                                  content={this.props.rightText}
                                  childStyle = {styles.rightTextStyle}
                                  mOnPress ={this.props.rightTextCallBack}
                        />
                        :null
                }
                {
                    this.props.rightImageShow?
                        <MyButton buttonType={MyButton.IMAGEBUTTON}
                                  content={this.props.leftText}
                                  childStyle = {styles.leftImageStyle}
                                  parentStyle={styles.buttonStyle}
                                  mOnPress ={this.props.rightTextCallBack}
                        />
                        :null
                }
            </View>

        )
    }
}


const styles = StyleSheet.create({

    style_ios_navi_bar:{
        height:Pixel.getTitlePixel(64),
        flexDirection:'row',
        paddingTop:Pixel.getTitlePixel(20),
        justifyContent:'center',
        backgroundColor:FontAndColor.NAVI_BAR_COLOR,
        //alignItems:'center'
    },
    style_android_navi_bar:{
        height:Pixel.getTitlePixel(64),
        flexDirection:'row',
        justifyContent:'center',
        backgroundColor:FontAndColor.NAVI_BAR_COLOR,
    },

    leftImageStyle: {
        width: Pixel.getPixel(20),
        height: Pixel.getPixel(20),
    },

    buttonStyle:{
        width:Pixel.getPixel(100),
        paddingVertical:Pixel.getPixel(12),
        paddingHorizontal:Pixel.getPixel(15),
    },

    centerTextStyle:{
        color:'white',
        fontSize:Pixel.getFontPixel(FontAndColor.NAVIGATORFONT),
        textAlign:'center',
        flex:1,
        paddingTop:Pixel.getPixel(10),
    },

    leftTextStyle:{
        textAlign: 'left',
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT),
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
        paddingTop: Pixel.getPixel(5),
        paddingBottom: Pixel.getPixel(5),
        color: FontAndColor.THEME_BACKGROUND_COLOR,
        width: Pixel.getPixel(100),
    },

    rightTextStyle:{
        width:Pixel.getPixel(100),
        fontSize:Pixel.getFontPixel(FontAndColor.BUTTONFONT),
        color:FontAndColor.THEME_BACKGROUND_COLOR,
        textAlign:'right',
        paddingRight:Pixel.getPixel(15),
        paddingTop:Pixel.getPixel(15),
    },



})