/**
 * Created by lhc on 2017/2/15.
 */
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
import PixelUtil from '../../utils/PixelUtils';
const Pixel = new PixelUtil();
import NavigationView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/FontAndColor';
import BaseComponent from '../../component/BaseComponent';
export  default class WebScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: true,
        };
    }

    componentDidMount() {
        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {

        } finally {
            //InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
            //});
        }
    }


    render() {
        if (this.state.renderPlaceholderOnly) {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <WebView
                    style={{width:width,height:height,backgroundColor:fontAndColor.COLORA3,marginTop:Pixel.getTitlePixel(64)}}
                    source={{uri:this.props.webUrl,method: 'GET'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={false}
                />
                <NavigationView
                    title="车辆位置"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                <NavigationView
                    title="车辆位置"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }


}
const styles = StyleSheet.create({

    image: {
        width: 43,
        height: 43,
    },
    Separator: {
        backgroundColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(10),

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})