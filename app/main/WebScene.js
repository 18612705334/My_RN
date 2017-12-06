import React, {Component} from 'react';
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
    WebView,
    BackAndroid
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../utils/PixelUtils';
const Pixel = new PixelUtil();
import NavigationView from '../component/AllNavigationView';
import * as fontAndColor from '../constant/FontAndColor';
import BaseComponent from '../component/BaseComponent';
let oldUrl = '';
import WebViewTitle from '../mine/accountManage/component/WebViewTitle';
import CarInfoScene from '../carSource/CarInfoScene';
import MainPage from './MainPage'
import MyBaseComponent from "../component/MyBaseComponent";

export default class WebScene extends BaseComponent{
    constructor(props){
        super(props)
        this.state = {
            renderPlaceHolderOnly:'loading'
        }
    }

    initFinish = ()=>{
        oldUrl = this.props.webUrl;
        this.setState({
            //renderPlaceHolderOnly:'success'
           renderPlaceholderOnly:'success'
        })

    }

    handleBack = ()=>{
        this.props.showModal(false)
        if (oldUrl == this.props.webUrl) {
            this.backPage();
        } else {
            this.refs.www.goBack();
        }
        return true;
    }


    render(){
        if (this.state.renderPlaceholderOnly!=='success') {
            return (
                <View style={{flex:1, backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR}}>
                    <NavigationView
                        title="公告"
                        backIconClick={()=>{
                            this.props.showModal(false);
                            this.backPage();
                        }}
                    />
                </View>
            );
        }

        return(
            <View style={{flex:1,backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR}}>
                <NavigationView
                    title="公告"
                    backIconClick={()=>{
                        this.props.showModal(false);
                        if(oldUrl==this.props.webUrl){
                            this.backPage();
                        }else{
                            this.refs.www.goBack();
                        }
                    }}
                />
                <WebViewTitle ref={'webviewtitle'} />
                <WebView
                    ref='www'
                    style = {{flex:1, backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR}}
                    source={{uri:this.props.webUrl, method:'GET'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={false}
                    onLoadStart={()=>{
                        this.refs.webviewtitle.firstProgress();
                    }}
                    onLoadEnd={()=>{
                        this.refs.webviewtitle.lastProgress();
                    }}
                    onNavigationStateChange={this.onNavigationStateChange.bind(this)}

                />

            </View>



        )


    }

    onNavigationStateChange = (navState)=>{
        oldUrl = navState.url;
        let urls = oldUrl.split('?')

        if (urls[0]== 'http://dycd.tocarsource.com/'){
            let id = urls[1].replace('id=','');
            let navigatorParams = {
                name: "CarInfoScene",
                component: CarInfoScene,
                params: {
                    carID: id,
                    from:'webview'
                }
            };
            let mainParams = {
                name: "MainPage",
                component: MainPage,
                params: {
                }
            };
         //   this.loginPage(navigatorParams,mainParams)
        }


    }




}