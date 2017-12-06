import React, {Component, PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ListView,
    InteractionManager,
    Animated
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtils';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/FontAndColor';

export default class WebViewTitle extends PureComponent{

    constructor(props){
        super(props)
        this.state = {
            isOpen: false,
            fadeAnim: new Animated.Value(0),
            height: Pixel.getPixel(4)
        }
    }

    firstProgress = ()=>{
        this.setState({
            height:4
        })

        Animated.timing(this.state.fadeAnim, {toValue:width-width/4, duration:200}).start()
    }

    lastProgress = ()=>{
           Animated.timing(this.state.fadeAnim, {toValue:width}).start(()=>{
               this.setState({
                   height:0,
                   fadeAnim: new Animated.Value(0)
               })
           })
    }

    render(){
        return(
            <Animated.View
                style = {{width:this.state.fadeAnim,height:this.state.height, backgroundColor:'#1cef53',marginTop:Pixel.getTitlePixel(64)}}
            >
            </Animated.View>
        )
    }




}