/**
 * Created by zhengnan on 2017/7/27.
 */

import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
} from 'react-native';

import *as fontAndColor from  '../../../constant/FontAndColor';
import PixelUtil from  '../../../utils/PixelUtils';
let Pixel = new  PixelUtil();

export default class CarBuyCell extends  Component{
    render(){
        return(
            <View style={styles.rootContainer}>
                <View style={styles.titleView}>
                    <Text style={styles.titleText}>{this.props.cellData.collectionType}</Text>
                </View>
                <View style={styles.contentView}>
                    <View style={styles.contentSubView}>
                        <Text style={styles.subTitleText}>VIN:</Text>
                        <Text style={styles.subTitleText}>{this.props.cellData.vin}</Text>
                    </View>
                    <View style={styles.contentSubView}>
                        <Text style={styles.subTitleText}>验车时间:</Text>
                        <Text style={styles.subTitleText}>{this.props.cellData.carInspectionTime}</Text>
                    </View>

                    <View style={styles.contentSubView}>
                        <Text style={styles.subTitleText}>客户信息</Text>
                        <Text style={styles.subTitleText}>{this.props.cellData.customerName}  {this.props.cellData.contentNum}</Text>
                    </View>
                </View>
                {
                    this.props.btnTitle &&
                    (
                        <TouchableOpacity onPress={this.props.cellBtnClick} activeOpacity={1}>
                            <View style={styles.footView}>
                                <View style={styles.footBtn}>
                                    <Text style={styles.footBtnText}>{this.props.btnTitle}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    rootContainer:{
        flex:1,
        backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR,
        paddingBottom:Pixel.getPixel(10),
        overflow:"hidden"
    },
    titleView:{
        height:Pixel.getPixel(44),
        justifyContent:'center',
        backgroundColor:'white',
        paddingLeft:Pixel.getPixel(15),
    },
    titleText:{
        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
    },
    contentView:{

        backgroundColor:'white',
        paddingHorizontal:Pixel.getPixel(15),
        paddingTop:Pixel.getPixel(15),
        paddingBottom:Pixel.getPixel(10),
        marginTop:Pixel.getPixel(1),


    },
    contentSubView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginBottom:Pixel.getPixel(10),
        // backgroundColor:'red',
    },
    subTitleText:{
        color:fontAndColor.COLORA1,
        fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24) ,
        // backgroundColor:'red',


    },
    footView:{
        marginTop:Pixel.getPixel(1),
        height:Pixel.getPixel(44),
        justifyContent:'center',
        alignItems:'flex-end',
        paddingRight:Pixel.getPixel(15),
        backgroundColor:'white'
    },
    footBtn:{
        height:Pixel.getPixel(27),
        width:Pixel.getPixel(65),
        borderColor:fontAndColor.NAVI_BAR_COLOR,
        borderWidth:Pixel.getPixel(0.5),
        borderRadius:Pixel.getPixel(2),
        justifyContent:'center',
        alignItems:'center',
    },
    footBtnText:{
        color:fontAndColor.NAVI_BAR_COLOR,
        fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24) ,
    },
});