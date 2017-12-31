import React, {Component, PropTypes} from 'react'
import {
    View,
    WebView,
    BackAndroid,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    InteractionManager
} from 'react-native'

import PixelUtil from '../utils/PixelUtils'

var Pixel = new PixelUtil();
import {request} from '../utils/RequestUtil';
import * as fontAndColor from '../constant/FontAndColor';
import BaseComponent from "../component/BaseComponent";
import MyBaseComponent from "../component/MyBaseComponent";
import MyBaseNaviComponent from "../component/MyBaseNaviComponent";
import NavigationView from '../component/AllNavigationView';
import * as AppUrls from '../constant/appUrls';
import WebViewTitle from "../mine/accountManage/component/WebViewTitle";
/*
 * 获取屏幕的宽和高
 **/
const {width, height} = Dimensions.get('window');
let oldUrl = '';


export default class SoftArticlesCenterScene extends MyBaseNaviComponent {


    initFinish() {
        this.setState({
            renderPlaceholderOnly: 'success',
            title: '段子中心'

        })
    }

    renderView() {
        return (
            <View style={styles.container}>
                <WebViewTitle ref="webviewtitle"/>
                <WebView
                    ref="www"
                    style={{width: width, height: height, backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR}}
                    source={{uri: AppUrls.SOFT_ARTICLES_CENTER, method: 'GET'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={false}
                    onLoadStart={() => {
                        this.refs.webviewtitle.firstProgress();
                    }}
                    onLoadEnd={() => {
                        this.refs.webviewtitle.lastProgress();
                    }}
                    onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                />

            </View>
        );

    }

    onNavigationStateChange = (navState) => {
        oldUrl = navState.url;
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
    }
});

