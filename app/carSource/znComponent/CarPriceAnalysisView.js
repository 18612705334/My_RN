import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    ScrollView,
} from 'react-native';

import *as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';
import SaasText from "../../component/SaasText";

let Pixel = new PixelUtil();
let sceneWidth = Dimensions.get('window').width;

let heighest = 0;

export default class CarPriceAnalysisView extends Component {

    constructor(props) {
        super(props)

        this.props.data.map((data, index) => {
            if (index > 4) return;
            if(data.eval_price>heighest){
                heighest = data.eval_price
            }
        })
    }


    render() {
        return (
            <View style={{marginTop: 10, backgroundColor: 'white', marginBottom:30}}>

                <View
                    style={{
                        height: 45,
                        justifyContent: 'center'
                    }}
                >
                    <SaasText style={{
                        marginHorizontal: 15,
                    }}>残值分析(万)</SaasText>
                </View>


                <View style={{
                    flexDirection: 'row', marginHorizontal: 15, borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: fontAndColor.COLORA4, height:250,
                }}>
                    {
                        this.props.data.map((data, index) => {
                            if (index > 4) return;

                            let rate = data.eval_price/heighest


                            return (
                                <ColumnView h={150*rate} data={data} key={'00000' + index}/>
                            )
                        })
                    }
                </View>

            </View>
        )
    }
}

class ColumnView extends Component {

    render() {
        return (
            <View style={{flex:1, flexDirection:'column-reverse'}}>
                <SaasText  style={{marginVertical: 15, textAlign:'center',color: fontAndColor.COLORA1}}>{this.props.data.trend_date}</SaasText>
                <View style={{backgroundColor: fontAndColor.NAVI_BAR_COLOR, height:2}}/>
                <View style={{marginHorizontal: 15, backgroundColor: fontAndColor.NAVI_BAR_COLOR, height:this.props.h}}/>
                <SaasText style={{marginVertical: 15, textAlign:'center'}}>{this.props.data.eval_price}</SaasText>

            </View>
        )
    }
}