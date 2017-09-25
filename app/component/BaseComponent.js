import React, {Component} from "react";
import {
    AppRegistry,
    StyleSheet,
    View,
    TouchableOpacity,
    Navigator,
    TouchableHighlight,
    BackAndroid,
    InteractionManager,
    TouchableWithoutFeedback,
    Dimensions,
    Image,
    Text,
} from "react-native";

import PixelUtil from "../utils/PixelUtils";
import * as fontAndColor from "../constant/FontAndColor";
import MyButton from "./MyButton";
const {width, height} = Dimensions.get('window');
const Pixel = new PixelUtil();

export default class BaseComponent extends Component{

    handleBack = ()=>{
         this.goBack();
         return true;
    }

    componentDidMount(){
        try{
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack)
        }catch (e){

        }finally {
            this.setState({renderPlaceHolderOnly:'loading'})
            this.initFinish();
        }
    }

    initFinish = ()=>{

    }

    backPage = ()=>{
        const navigator = this.props.navigator
        if (navigator){
            navigator.pop();
        }
    }

    backToTop = ()=>{
        const navigator = this.props.navigator
        if (navigator){
            navigator.popToTop();
        }
    }

    toNextPage = (mProps) =>{
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.push({...mProps})
        }
    }

    backToLogin = (mProps)=>{
        const navigator = this.props.navigator;
        if (navigator){
            navigator.immediatelyResetRouteStack([{...mProps}])
        }
    }

    showConsole = (content)=>{
        Content.showConsole(content);
    }

    allRefreshParams = {
        buttonType:MyButton.TEXTBUTTTON,
        parentStyle:{
            height:Pixel.getPixel(40),
            width:Pixel.getPixel(140),
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:fontAndColor.COLORB0,
            marginTop:Pixel.getPixel(66)
        },

        childStyle:{
            fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
            color:'#fffff',
        },
        opacity: 0.8,
        content: '刷新',
        mOnPress: () => {
            this.allRefresh();
        }

    }

    allRefresh = () => {

    }


    loadView=()=>{
        let view;
        let marginTop = 0;

        if (this.state.loadingMarginTop) {
            margintop = this.state.loadingMarginTop;
        }

        if (this.state.renderPlaceHolderOnly == 'blank'){
            view = <View/>
        }else if(this.state.renderPlaceHolderOnly == 'loading'){
            view = <View style = {styles.style_load_view}>
                <Image style = {styles.style_load_image} soruce = {require('../../image/loading.gif')}/>
                <Text allowFontScaling = {false} style ={styles.style_load_text}>加载中...</Text>
            </View>

        }else if (this.state.renderPlaceHolderOnly == 'error'){
            view = <View style = {styles.style_load_view}>
                <Image styel = {styles.style_load_image} source = {require('../../image/loadingError.png')}/>
                <Text allowFontScaling = {false}  style = {styles.style_load_text}>网络错误</Text>
                <Text allowFontScaling = {false}  style = {styles.style_load_text}>当网络环境较差</Text>
                <MyButton {...this.allRefreshParams} />
            </View>
        }else {
            view = <View style = {styles.style_load_view}>
                <Image styel = {styles.style_load_image} source = {require('../../image/noData.png')}/>
                <Text allowFontScaling = {false} style ={styles.style_load_text}>暂无数据</Text>
            </View>
        }
        return view;
    }

    loadingView=()=>{
        let view;

        if (this.state.loading == true){
            view = <View style={styles.style_loading_view}>
                    <Image style = {{width:60, height:60}} srouce = {require('../../image/setDataLoading.gif')} />
            </View>

        }else {
            view = null;
        }
        return view;

    }

}

const styles = StyleSheet.create({

    style_loading_view:{
        justifyContent:'center',
        alignItems:'center',
        flex:1,
        position: 'absolute',
        width: width,
        height: height,
    },
    style_load_view:{
        flex:1,
        alignItems:'center',
    },
    style_load_image:{
        width:Pixel.getPixel(150),
        height:Pixel.getPixel(159),
        marginTop:Pixel.getPixel(189)
    },
    style_load_text:{
        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
        marginTop:Pixel.getPixel(30),
    }

})