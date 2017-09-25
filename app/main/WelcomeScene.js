import React, {Component} from 'react'

import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    NativeModules,
    BackAndroid
} from 'react-native'

const {width, heighe} = Dimensions.get('window');
import ScrollableTabView from 'react-native-scrollable-tab-view';
import BaseComponent from '../component/BaseComponent';
import PixelUtil from '../utils/PixelUtils';
import LoginAndRegister from '../login/LoginAndRegister';
let Pixel = new PixelUtil();
import StorageUtil from '../utils/StorageUtil';
import * as KeyNames from '../constant/storageKeyNames';

export default class WelcomeScene extends BaseComponent{

    handleBack = ()=>{
        NativeModules.VinScan.goBack();
        return true;
    }

    componentDidMount(){
        try{
            BackAndroid.addEventListener('', this.handleBack)
        }catch (e){

        }finally{

        }

    }

    render(){
        return(
            <View style = {{flex:1, backgroundColor:'white'}} >
                <ScrollableTabView
                    style = {{flex:1}}
                    renderTabBar = {()=><View/>}
                    initialPage={0}
                    prerenderingSiblingsNumber={Infinity}
                >

                    <Image style={styles.style_image} source = {require('../../image/welcomFirst.png')}/>

                    <Image style={styles.style_image} source = {require('../../image/welcomSecond.png')}/>
                    <Image style={styles.style_image} source = {require('../../image/welcomThird.png')}/>
                    <View style = {{flex:1, alignItems:'center'}}>
                        <Image style={styles.style_image} source = {require('../../image/welcomFourth.png')}/>
                        <TouchableOpacity
                            style={{position:'absolute', bottom:Pixel.getPixel(20)}}

                            onPress={()=>{
                                StorageUtil.mSetItem(KeyNames.FIRST_INTO, 'false');

                                const navigator = this.props.navigator;
                                if (navigator){
                                    navigator.immediatelyResetRouteStack([{name:'LoginAndRegister', componet:LoginAndRegister, params:{}}])
                                }

                            }}
                            activeOpacity={0.6}

                        >
                            <Image style = {{width:Pixel.getPixel(100), height:Pixel.getPixel(30), resizeMode:'contain'}} source = {require('../../image/welcomButton.png')}/>
                        </TouchableOpacity>


                    </View>


                </ScrollableTabView>


            </View>
        )
    }


}

const styles = StyleSheet.create({

    style_image:{
        resizeMode:'stretch',
        width:width,
        flex:1,
    }

})
