import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Linking,
    InteractionManager,
    Dimensions,

} from 'react-native';

import *as fontAndColor from '../constant/FontAndColor';
import ImagePageView from 'react-native-viewpager';
import *as weChat from 'react-native-wechat';
import PixelUtil from '../utils/PixelUtils';


let Platform = require('Platform');
const Pixel = new PixelUtil();

import {request} from "../utils/RequestUtil";
import * as AppUrls from "../constant/appUrls";
import MyBaseComponent from "../component/MyBaseComponent";
import SaasText from "../component/SaasText";

let {width, height} = Dimensions.get('window');
let resolveAssetSource = require('resolveAssetSource');
const IS_ANDROID = Platform.OS === 'android';


const carParameterViewColor = [
    'rgba(5, 197, 194,0.15)',
    'rgba(58, 200, 126,0.15)',
    'rgba(47, 155, 250,0.15)',
];

const IMGS = [
    'https://images.unsplash.com/photo-1441260038675-7329ab4cc264?h=1024',
    'https://images.unsplash.com/photo-1441126270775-739547c8680c?h=1024',
    'https://images.unsplash.com/photo-1440964829947-ca3277bd37f8?h=1024',
    'https://images.unsplash.com/photo-1441126270775-739547c8680c?h=1024',
    'https://images.unsplash.com/photo-1440964829947-ca3277bd37f8?h=1024',
    'https://images.unsplash.com/photo-1440964829947-ca3277bd37f8?h=1024'
];

let dataSource =  new ImagePageView.DataSource({pageHasChanged: (r1, r2) => r1 !== r2})


export default class TestViewPage extends Component{

    constructor(props){
        super(props)

        this.state = {
            imageArray:dataSource.cloneWithPages(IMGS)
        }

    }



    _renderPage = (data, pageID)=> {

        if (data.ret_img == ''){

            return(
                <Image style={styles.postPosition}
                       source={require('../../image/mainImage/homebanner.png')}
                />
            )

        }


        return (
            <TouchableOpacity
                onPress = {()=>{
                    if(data.ret_url=='finance'){
                        this.props.toNext();
                    }else if(data.ret_url){
                        this.props.callBack(data.ret_url);
                    }
                }}
                activeOpacity = {1}
            >
                <Image style={styles.postPosition} source={{uri: data}}/>
            </TouchableOpacity>



        )
    }


    render(){

        return(
            <View style={{flex:1, backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR}}>


                <ImagePageView
                    dataSource={this.state.imageArray}    //数据源（必须）
                    renderPage={this._renderPage}     //page页面渲染方法（必须）
                    isLoop={true}                        //是否可以循环
                    autoPlay={true}                      //是否自动
                    locked={false}                        //为true时禁止滑动翻页

                />


            </View>
        )

    }



}



const styles = StyleSheet.create({
    postPosition: {
        width: width,
        height: Pixel.getPixel(225),
        resizeMode: 'stretch'
    },
});

