/**
 * Created by lhc on 2017/2/15.
 */
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
    TextInput,
    KeyboardAvoidingView
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtils';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/FontAndColor';
export default class ClientInfoSelected extends PureComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        let value = '请选择' + this.props.items.name;
        this.state = {
            value: this.props.defValue ? this.props.defValue.substring(0, 10) : value
        }
    }

    /**
     *
     **/
    setValue = (values) => {
        this.setState({
            value: values
        });
    }

    /**
     *
     **/
    render() {
        return (<View style={{width: width, height: Pixel.getPixel(45), backgroundColor: '#fff'}}>
            <View style={{
                width: width, height: Pixel.getPixel(44), backgroundColor: '#00000000', flexDirection: 'row',
                paddingLeft: Pixel.getPixel(15), paddingRight: Pixel.getPixel(15)
            }}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text allowFontScaling={false}
                          style={{fontSize: Pixel.getFontPixel(14), color: '#000'}}>{this.props.items.name}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    this.props.toSelect();
                }} activeOpacity={0.8} style={{
                    flex: 2,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <Text allowFontScaling={false} style={{
                        fontSize: Pixel.getFontPixel(14),
                        color: fontAndColor.COLORA2,
                        marginRight: Pixel.getPixel(5)
                    }}>
                        {this.state.value}</Text>
                    <Image style={{width: Pixel.getPixel(14), height: Pixel.getPixel(14)}}
                           source={require('../../../../image/mainImage/celljiantou.png')}/>
                </TouchableOpacity>
            </View>
            <View style={{width: width, height: Pixel.getPixel(1), backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR}}>

            </View>
        </View>);
    }

}