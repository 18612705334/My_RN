import React from  'react';
import {
    PixelRatio,
    Platform,
    Dimensions
} from 'react-native'

const {width, height} = Dimensions.get('window');

const PixelUtil = React.createClass({

    render(){return null;},

    getPixel(px){

        if (Platform.OS === 'android') {
            return ((px / 375.0) * width);
        } else {
            return ((px / 375.0) * width);
        }
    },
    getFontPixel(px){
        if (Platform.OS === 'android') {
            return ((px / 375.0) * width);
        } else {
            return ((px / 375.0) * width) ;

        }
    },
    getTitlePixel(px){
        if (Platform.OS === 'android') {
            return (((px - 20) / 375.0) * width);
        } else {
            return ((px / 375.0) * width);

        }
    },

    getBottomPixel(px){
        if (Platform.OS === 'android') {
            return (((px + 20) / 375.0) * width);
        } else {
            return ((px / 375.0) * width);

        }
    }


})

module.exports = PixelUtil;