import React, {Component, PureComponent} from 'react';
import {

    View,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
    Dimensions,
} from 'react-native';

let {height, width} = Dimensions.get('window');
import  PixelUtil from '../../utils/PixelUtils'
import  * as fontAndColor from '../../constant/FontAndColor'
var Pixel = new PixelUtil();

export default class HomeAdvertisementButton extends PureComponent{

    render() {
        return (
            <TouchableOpacity
                onPress={this.props.click}
            >
                <Image style = {{width:width, height:120, resizeMode:'stretch', marginVertical:10, backgroundColor:'white'}}
                       source = {require('../../../image/mainImage/homeAdvertisement.png')}/>
            </TouchableOpacity>

        )
    }


}