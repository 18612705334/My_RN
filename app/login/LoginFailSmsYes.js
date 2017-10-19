import React, {Component} from "react";
import {
    AppRegistry,
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
import LoginFailSmsVerify from "./LoginFailSmsVerify";
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Pixel = new PixelUtil();

export default class LoginFailSmsYes extends BaseComponent {

    constructor(props) {
        super(props)

        this.state = {
            renderPlaceHolderOnly: true,
        }

    }

    initFinish = () => {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceHolderOnly: false});
        });
    }

    buttonAction = () => {
        this.toNextPage({
            name: 'LoginFailSmsVerify',
            component: LoginFailSmsVerify,
            params: {},
        })

    }


    render() {
        if (this.state.renderPlaceHolderOnly == true) {
            return (
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.setState({
                            show: false,

                        })
                    }}
                >
                    <View style={{flex: 1, backgroundColor: FontAndColor.COLORA3}}>
                        <NavigationBar
                            leftImageShow={false}
                            leftTextShow={true}
                            leftText=""
                            centerText="登录遇到问题"
                            rightText=""
                        />
                    </View>
                </TouchableWithoutFeedback>
            );
        }

        return(
            <View style={{flex: 1, backgroundColor: FontAndColor.COLORA3, alignItems:'center'}}>
                <NavigationBar
                    leftImageShow={true}
                    leftTextShow={false}
                    centerText="登录遇到问题"
                    rightText="   "
                    leftImageCallBack={this.backPage}
                />

                <View style = {{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text allowFontScaling = {false} style = {styles.text} >
                        您可以通过
                        <Text allowFontScaling = {false} style = {[styles.text, styles.coloredText]}>手机+短信验证码</Text>
                    </Text>
                    <Text allowFontScaling = {false} style = {styles.text} >登录第1车贷APP</Text>
                </View>
                <MyButton
                    buttonType={MyButton.TEXTBUTTON}
                    content={'用短信验证码登录'}
                    mOnPress={this.buttonAction}
                    parentStyle={styles.buttonStyle}
                    childStyle={styles.buttonTextStyle}
                />
            </View>

        )

    }
}

const styles = StyleSheet.create({

    text:{
      color:'black',
      fontSize:  FontAndColor.NAVIGATORFONT34
    },
    coloredText:{
        color:FontAndColor.COLORB0,
    },


    buttonStyle:{
        width:width - 30,
        height:44,
        backgroundColor:FontAndColor.COLORB0,
        marginBottom:30,
        borderRadius:4,
        justifyContent:'center',
        alignItems:'center'
    },

    buttonTextStyle:{
        color:FontAndColor.COLORA3,
        fontSize:FontAndColor.BUTTONFONT
    }
})