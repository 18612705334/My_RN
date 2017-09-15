import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    BackAndroid,
    InteractionManager,
    Text,
    AppState,
} from 'react-native'

import BaseComponent from '../component/BaseComponent'
import MyButton from '../component/MyButton';
let {height, width} = Dimensions.get('window');
import MainPage from '../main/MainPage'



export default class RootScene extends BaseComponent{

    render() {
        return (

            <Image style = {styles.style_image}
                   source = {require('../../image/splash.png')}
            >



            </Image>

        )
    }
}

const styles = StyleSheet.create({
    style_image:{
        backgroundColor:'#00000000',
        alignItems:'flex-end',
        resizeMode:'contain',
        width:width,
        flex:1,
    },



})


