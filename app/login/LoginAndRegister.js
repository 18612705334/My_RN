import React , {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    NativeModules,


} from 'react-native'

import BaseComponent from '../component/BaseComponent'
import MyButton from "../component/MyButton";
import * as FontAndColor from "../constant/FontAndColor";
import LoginScene from "./LoginScene";
import Register from "./Register";
import PixelUtil from "../utils/PixelUtils";
import QuotaApplication from './QuotaApplication';

var Pixel = new PixelUtil();
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');


export default class LoginAndRegister extends BaseComponent{

    constructor(props){
        super(props)
        this.state ={
            renderPlaceHolderOnly:true,
        }
    }

    componentDidMount(){
        try{

        }catch (e){

        }finally {
            this.setState({renderPlaceHolderOnly:false})
        }


    }

    initFinish = ()=>{
        this.setState({renderPlaceHolderOnly:false})
    }

    render(){
        if (this.state.renderPlaceHolderOnly){
            return(
                <TouchableOpacity
                    onPress={()=>{
                      this.setState({
                            show:false,
                      })
                    }}
                >
                    <View/>
                </TouchableOpacity>
            )
        }

        return(

            <Image style = {styles.style_background_image} source = {require('../../image/login/loginAndRegist.png')}>
                <MyButton
                    buttonType = {MyButton.TEXTBUTTON}
                    mOnPress = {this.login}
                    content = '登录'
                    parentStyle = {[styles.style_button_parent, styles.style_login_button]}
                    childStyle = {styles.style_button_child}
                />

                <MyButton
                    buttonType = {MyButton.TEXTBUTTON}
                    mOnPress = {this.register}
                    content = '注册'
                    parentStyle = {[styles.style_button_parent, styles.style_register_button]}
                    childStyle = {styles.style_button_child}
                />

            </Image>

        )
    }


    register = ()=>{
        this.toNextPage({
            name:'Register',
            component:Register,
            params:{}
        })
    }

    login = ()=>{
        this.toNextPage({
            name:'LoginScene',
            component:LoginScene,
            params:{}
        })
    }

}

const styles = StyleSheet.create({

    style_background_image:{
        width:width,
        flex:1,
        alignItems:'center',
        resizeMode:'contain'

    },
    style_button_parent:{
        position:'absolute',
        alignItems:'center',
        justifyContent:'center'
    },
    style_button_child:{
        backgroundColor:'transparent',
        width:width - Pixel.getPixel(80),
        height:Pixel.getPixel(44),
        borderColor:'white',
        borderWidth:Pixel.getPixel(1),
        fontSize: Pixel.getFontPixel(18),
        color: FontAndColor.COLORA3,
        textAlign:'center',
        textAlignVertical:'bottom',  // 只支持Android
        paddingTop:Pixel.getPixel(12)

    },

    style_login_button:{
        bottom :Pixel.getPixel(150)
    },
    style_register_button:{
        bottom:Pixel.getPixel(80),
    }

})