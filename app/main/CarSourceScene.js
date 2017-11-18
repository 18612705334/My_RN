import  React, {Component, PropTypes} from  'react'
import  {

    View,
    Text,
    ListView,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    InteractionManager,
    RefreshControl,
    BackAndroid,
    NativeModules
} from  'react-native'

import * as fontAndClolr from '../constant/FontAndColor';
import  PixelUtil from '../utils/PixelUtils'
import BaseComponent from "../component/BaseComponent";
var Pixel = new PixelUtil();
let page = 1;
let status = 1;


export default  class CarSourceScene extends BaseComponent{


    render(){
        return(
            <View style = {{flex:1, backgroundColor:'red'}}>



            </View>
        )
    }



}