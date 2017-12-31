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
    NativeModules
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtils';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/FontAndColor';
import BaseComponent from '../../component/BaseComponent';
import NavigationView from '../../component/AllNavigationView';
import {request} from '../../utils/RequestUtil';
import * as MyUrl from '../../constant/appUrls';
export  default class SelectScene extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        // 初始状态
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            renderPlaceholderOnly: 'blank',
            source: ds.cloneWithRows(this.props.regShowData)
        };
    }

    /**
     *
     **/
    initFinish = () => {
        this.setState({
            renderPlaceholderOnly: 'success',
        });
    }

    /**
     *
     **/
    render() {
        if (this.state.renderPlaceholderOnly != 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR, flex: 1}}>
                <ListView
                    removeClippedSubviews={false}
                    style={{marginTop: Pixel.getTitlePixel(79)}}
                    dataSource={this.state.source}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                />
                <NavigationView
                    title={this.props.title}
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

    /**
     *
     **/
    _renderRow = (movie, sectionId, rowId) => {
        return (
            <TouchableOpacity onPress={() => {
                this.props.callBack(movie);
                this.backPage();
            }} activeOpacity={0.8} style={{
                width: width,
                height: Pixel.getPixel(44),
                paddingRight: Pixel.getPixel(15),
                paddingLeft: Pixel.getPixel(15),
                backgroundColor: '#fff',
                flexDirection: 'row'
            }}>
                <View style={{flex: 2, justifyContent: 'center'}}>
                    <Text allowFontScaling={false}
                          style={{color: '#000', fontSize: Pixel.getFontPixel(14)}}>{movie}</Text>
                </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
                    <Image style={{width: Pixel.getPixel(14), height: Pixel.getPixel(14)}}
                           source={require('../../../image/mainImage/celljiantou.png')}/>
                </View>
            </TouchableOpacity>
        )
    }

    /**
     *
     **/
    _renderSeparator(sectionId, rowId) {

        return (
            <View style={styles.Separator} key={sectionId + rowId}>
            </View>
        )
    }

    /**
     *
     **/
    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height, backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR}}>
                {this.loadView()}
                <NavigationView
                    title={this.props.title}
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
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
        height: Pixel.getPixel(1),

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})