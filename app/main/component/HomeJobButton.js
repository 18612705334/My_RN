import React, {Component, PureComponent} from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    Dimensions,
} from 'react-native';

let {height, width} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtils'
import * as fontAndColor from '../../constant/FontAndColor'

var Pixel = new PixelUtil();

export default class HomeJobButton extends PureComponent {

    constructor(props) {
        super(props);

    }

    componentWillMount() {


    }

    render() {

        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.click();
                }}
                activeOpacity={0.8}
                style={{
                    width: 67,
                    height: 67,
                    marginHorizontal: (width - Pixel.getPixel(67) * 4) / 8,
                    marginVertical:10,
                    alignItems: 'center',

                }}>

                <Image style={{
                    resizeMode: 'stretch', height: Pixel.getPixel(48),
                    width: Pixel.getPixel(48),
                }} source={this.props.image}/>
                <Text
                    allowFontScaling={false}
                    style={{
                        fontSize: Pixel.getFontPixel(13), color: '#000',
                        marginTop: Pixel.getPixel(7)
                    }}
                >{this.props.name}</Text>
            </TouchableOpacity>
        )
    }

}