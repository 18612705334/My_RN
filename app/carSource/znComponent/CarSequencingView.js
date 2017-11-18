import React, {Component} from 'react';

import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    Modal,

} from 'react-native';

import * as fontAndColor    from '../../constant/FontAndColor';
import PixelUtil            from '../../utils/PixelUtils';
const Pixel = new PixelUtil();

const {width, height} = Dimensions.get('window');

export class SequencingButton extends Component{
    render(){
        return(
            <TouchableOpacity
                onPress = {this.props.onPress}
                activeOpacity = {.6}
                style = {styles.button_container}
            >
                <Image  source={require('../../../image/carSourceImages/sort.png')}/>
                <Text allowFontScaling={false} style = {{color:'white', marginLeft:5,}}>排序</Text>
            </TouchableOpacity>

        )
    }
}



const styles = StyleSheet.create({
    button_container:{
        width:80,
        height:40,
        backgroundColor:fontAndColor.COLORB1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        right:20,
        bottom:60,
        borderRadius:20,

    }



})