import React from 'react';
import {
    View,
    Image,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    NativeModules,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
}from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';
import * as fontAndColor from '../constant/FontAndColor';
import PixelUtil from '../utils/PixelUtils';
import {CarConfigurationView}   from './../carSource/znComponent/CarInfoAllComponent';
import MyBaseComponent from "../component/MyBaseComponent";

const Pixel = new PixelUtil();

import * as Net from '../utils/RequestUtil';
import * as AppUrls from '../constant/appUrls';

const config_no_data = require('../../image/noData.png');

export default class AutoConfig extends MyBaseComponent{


    
    constructor(props){
        super(props)
    }
    
    initFinish = () =>{
        this.setState({
            renderPlaceholderOnly:"success"
        })
    }



    backPage = ()=>{
        
        let navi = this.props.navigator
        
        if(this.props.from == 'CarUpkeepScene'){
            if(navi){
                for(let i = 0; navi.getCurrentRoutes().length; i++){
                    if(navi.getCurrentRoutes()[i].name == 'CarUpkeepScene'){
                        navi.popToRoute(navi.getCurrentRoutes()[i])
                        break;
                    }
                }
            }
        }else {
            if(navi){
                navi.pop()
            }
        }
    }
    
    

    renderView(){
        return(
                
            <View style={{flex:1, backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR}}>

                <CarConfigurationView carConfigurationData={this.props.carConfigurationData}
                                      modelID ={this.props.modelID}
                                      renderCarConfigurationDataAction={this.props.renderCarConfigurationDataAction}
                                      carConfiguraInfo={this.props.carConfiguraInfo}/>

                <AllNavigationView
                    title={'车辆配置'}
                    backIconClick ={()=>{
                        this.backPage()   
                    }}
                />

            </View>
            
        )
    }
}