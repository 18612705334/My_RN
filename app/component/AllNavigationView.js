import React, {Component, PureComponent} from 'react';

import {

    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,

} from 'react-native';

import *as fontAndColor from '../constant/FontAndColor';
import PixelUtil from '../utils/PixelUtils';
const Pixel = new PixelUtil();

export default class CarInfoNavigationView extends PureComponent{

    constructor(){
        super()

        this.state ={
            navigationBackgroundColor:null
        }
    }

    setNaviBackgroundColor = (color) => {
        this.setState({
            navigationBackgroundColor:color
        })
    }


    render(){

        const {title, backIconClick, renderRightFootView,wrapStyle } = this.props;

        return(
            <View style = {[styles.navigation ,{backgroundColor:this.state.navigationBackgroundColor?this.state.navigationBackgroundColor:fontAndColor.NAVI_BAR_COLOR}]}>

                <View style = {{marginTop:20,flex:1, flexDirection:'row', alignItems:'center',justifyContent:'space-between'}}>
                    <TouchableOpacity
                        style = {{flex:1,}}
                        onPress = {backIconClick}
                    >
                        <Image style = {{marginLeft:15}} source = {backIconClick?require('../../image/mainImage/navigatorBack.png'):null}/>
                    </TouchableOpacity>

                    <Text style = {{color:'white', fontSize:fontAndColor.NAVIGATORFONT34, textAlign:'center'}}>{title}</Text>
                    <View style = {{flex:1}}>
                        {
                            renderRightFootView&&renderRightFootView()
                        }
                    </View>
                </View>

            </View>
        )
    }

}

const styles = StyleSheet.create({

    navigation: {
        height: Pixel.getTitlePixel(64),
        backgroundColor: fontAndColor.NAVI_BAR_COLOR,
        left: 0,
        right: 0,
        position: 'absolute',
        flex: 1
    }


})


