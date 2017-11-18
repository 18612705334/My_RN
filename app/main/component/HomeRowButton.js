import React, {Component, PureComponent} from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    ListView
} from 'react-native';

let {height, width} = Dimensions.get('window');
import  PixelUtil from '../../utils/PixelUtils'
import  * as fontAndColor from '../../constant/FontAndColor'
var Pixel = new PixelUtil();

export default class HomeRowButton extends PureComponent{

    constructor(props){
        super(props)

        let ds = new ListView.DataSource({rowHasChanged:(r1, r2)=>r1!==r2})

        this.state ={
            source:ds.cloneWithRows(this.props.list)
        }

    }


    render(){

        if(this.props.list.length<=0||this.props.list === null){
            return(
                <View/>
            )
        }
        return(
            <View style = {{backgroundColor:'white', alignItems:'center', width:width}} >
                <Text
                    allowFontScaling = {false}
                    style = {{fontSize:15, fontWeight:'bold', marginVertical:15}}

                >推荐车源</Text>
                <ListView
                    contentContainerStyle = {{ paddingLeft:15, marginBottom:15}}
                    horizontal = {true}
                    dataSource = {this.state.source}
                    removeClippedSubviews = {false}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

        )
    }

    _renderRow = (data, sectionID, rowID)=>{

        let imageList = [];
        for(let i = 0; i< 3; i++){

            imageList.push(<Image key={'imgs'+i}
                                  source={data.imgs[i].url !== ''? {uri:data.imgs[i].url}:require('../../../image/carSourceImages/car_null_img.png')}
                                  style={{height:Pixel.getPixel(57),resizeMode: 'stretch',width:(width-width/8-width/8-Pixel.getPixel(44))/3, marginHorizontal:5}}/>);

        }

        let left = 0;
        if (rowID == 0) {
            left = Pixel.getPixel(12);
        }

        let DIDIAN;
        if (data.city_name.length) {
            DIDIAN = '[' + data.city_name + ']'
        } else {
            DIDIAN = '';
        }

        return(
            <TouchableOpacity
                onPress = {
                    ()=>{
                        this.props.onPress(data.id)}
                    }
                style = {styles.container}
            >
                <Text
                    style = {{marginHorizontal:15, marginTop: 15}}
                    numberOfLines={1}
                    allowFontScaling = {false}
                >{DIDIAN+data.model_name}</Text>
                <View style = {{flexDirection:'row', marginHorizontal:15, marginTop:10}}>
                    <Text
                        allowFontScaling = {false}
                        style = {{flex:1, color:fontAndColor.COLORA1}}
                    >{this.dateReversal(data.create_time + '000') + '/' + data.mileage + '万公里'}</Text>
                    <Text
                        style = {{color:'red', fontWeight:'bold'}}
                        allowFontScaling = {false}
                    >{data.dealer_price ? this.carMoneyChange(data.dealer_price)+'万' : ''}</Text>
                </View>
                <View style = {{flexDirection:'row', marginHorizontal:10,marginTop:10}}>
                    {imageList}
                </View>
            </TouchableOpacity>
        )
    }

    _renderSeparator = (sectionID, rowID)=>{
        //
        // if (rowID===this.props.list.length-1) {
        //     return (
        //         <View/>
        //     )
        // }

        return (
            <View style={{width:Pixel.getPixel(12),height:Pixel.getPixel(134),
                backgroundColor:'#fff'}} key={sectionID + rowID}>
            </View>
        )

    }


    dateReversal = (time)=>{
        const date = new Date();
        date.setTime(time)
        return (date.getFullYear()+'年'+(date.getMonth()+1)+'月')
    }

    carMoneyChange=(money)=>{

        let newCarMoney = parseFloat(money);
        let carMoneyStr = newCarMoney.toFixed(2);
        let moneyArray = carMoneyStr.split(".");


        if (moneyArray.length > 1) {
            if (moneyArray[1] > 0) {

                return moneyArray[0] + '.' + moneyArray[1];

            } else {

                return moneyArray[0];
            }

        } else {
            return carMoneyStr;
        }

    }


}

const styles = StyleSheet.create({

    container:{
        height:134,
        width:width-width/8-width/8,
        backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR

    }


})