
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Image,
    ScrollView,
} from 'react-native';

import BaseComponent from '../component/BaseComponent';
import MyBaseComponent from '../component/MyBaseComponent';
import NavigationView from '../component/AllNavigationView';
import *as fontAndColor from '../constant/FontAndColor';
import *as appUrls from '../constant/appUrls';
import *as RequestUtil from '../utils/RequestUtil';
import PixelUtil from '../utils/PixelUtils';
import SaasText from "../component/SaasText";
const Pixel = new PixelUtil();
let ScreenWidth = Dimensions.get('window').width;


export  default  class CarReferencePriceScene extends MyBaseComponent{

    initFinish(){
        this.setState({
            title:'参考价格'
        })
        this.loadData();
    }

    loadData(){

        RequestUtil.request(appUrls.CAR_GET_REFERENCEPRICE, 'POST', {
            city_id:this.props.city_id,
            mile:this.props.mileage,
            model_id:this.props.model_id,
            reg_date:this.props.init_reg
        }).then((response)=>{
            if(response.mjson.data.length>0){

                this.setState({
                    data:response.mjson.data,
                    renderPlaceholderOnly: 'success',

                });

            }else {
                this.setState({
                    renderPlaceholderOnly: 'null',
                });
            }
        },(error)=>{

            this.setState({
                renderPlaceholderOnly: 'error',
            });
        })



    }

    backPage(){
        let navi = this.props.navigator;

        if(this.props.form='CarUpkeepScene'){
            if (navi){

                for(let i = 0; i<navi.getCurrentRoutes().length; i++){
                    if(navi.getCurrentRoutes()[i].name == 'CarUpkeepScene')  {
                        navi.popToRoute(navi.getCurrentRoutes()[i])
                        break;
                    }
                }
            }

        }else {

            if(navi){
                navi.pop();
            }
        }
    }


    renderView(){
        return(
            <View style={{flex:1, backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR}}>
                <NavigationView
                    title={'参考价格'}
                    backIconClick={this.backPage}
                />
                <ScrollView style={
                    {
                        marginTop:Pixel.getTitlePixel(64)
                    }
                }>
                    {
                        this.state.data.map((item, index)=>{
                            return(
                                <PirceCell
                                    key={index}
                                    data={item}
                               />
                            )
                        })
                    }
                </ScrollView>

            </View>

        )
    }

}

class PirceCell extends Component{

    render(){
        return(
            <View style={{backgroundColor:'white', marginTop:10}}>
                <View style={{marginHorizontal:15, paddingVertical:10, borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:fontAndColor.COLORA4}}>
                    <Image source={this.props.data.type == 1?require('../../image/carSourceImages/logo1.png'):require('../../image/carSourceImages/logo2.png')}/>
                </View>
                <View style={{paddingVertical:5}}>
                    {
                        this.props.data.data.map((item, index)=>{
                            return(
                                <View
                                    key={index}
                                    style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:15, paddingVertical:5, }}
                                >
                                    <SaasText style={{color:fontAndColor.COLORA1, fontSize:13}}>{item.title}</SaasText>
                                    <SaasText>{item.value+'万元'}</SaasText>
                                </View>
                            )

                        })
                    }
                </View>

            </View>
        )
    }
}