import React from 'react';
import {
    PixelRatio,
    Platform,
    Dimensions
} from 'react-native';
let canshow = true;
const {width, height} = Dimensions.get('window');
const ConsoleUtils = React.createClass({

    render(){
        return null;
    },
    showConsole(content){
        if (canshow) {
            console.log(content);
        }
    }
});

module.exports = ConsoleUtils;