import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';


import * as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';
var Pixel = new PixelUtil();

const {width, height}  =  Dimensions.get('window');

export default class CarCell extends Component{

    cellClick=()=>{

        this.props.onPress(this.props.carMainText);

    };

    dateReversal = (time)=>{
        const date = new Date()
        date.setTime(time)
        return (date.getFullYear()+'年'+(date.getMonth()+1)+'月')
    }

    carMoneyChange=(carMoney)=>{

        let newCarMoney = parseFloat(carMoney);
        let carMoneyStr = newCarMoney.toFixed(2);
        let moneyArray = carMoneyStr.split(".");

        // console.log(carMoney+'/'+newCarMoney +'/' + carMoneyStr +'/' +moneyArray);

        if(moneyArray.length>1)
        {
            if(moneyArray[1]>0){

                return moneyArray[0]+'.'+moneyArray[1];

            }else {

                return moneyArray[0];
            }

        }else {
            return carMoneyStr;
        }


    }

    render(){
        const {carCellData}= this.props;
        return(

                <TouchableOpacity
                    onPress = {this.cellClick}
                >
                    <View style = {styles.container}>
                        <Image style = {styles.image} source = {carCellData.img?{uri:carCellData.img+'?x-oss-process=image/resize,w_'+320+',h_'+240}:require('../../../image/carSourceImages/car_null_img.png')}/>
                        <View style = {{margin:13, flex:1}}>
                            <Text numberOfLines = {2} allowFontScaling = {false} style = {styles.title}>{(carCellData.city_name!=""?('['+carCellData.city_name+']'):"")+(carCellData.model_name)}</Text>
                            <Text allowFontScaling = {false} style = {styles.subtitle}>{this.dateReversal(carCellData.manufacture+'000')+'/'+carCellData.mileage+'万公里'}</Text>
                            <Text allowFontScaling = {false} style = {styles.price}>{carCellData.dealer_price>0?(this.carMoneyChange(carCellData.dealer_price) +'万'):''}</Text>
                        </View>
                    </View>
                </TouchableOpacity>


        )
    }

}


const styles  = StyleSheet.create({
    container:{
        height:110,
        flexDirection:'row',
        backgroundColor:'white',
        alignItems:'center',
        paddingLeft:15,
    },

    image:{
        width:120,
        height:80,
        resizeMode:'stretch'
    },
    title:{
        color:'black',
        fontWeight:'bold',
        fontSize:17,
        flexWrap:'wrap'
    },
    subtitle:{
        fontSize:14,
        color:fontAndColor.COLORA4,
        flex:1,
        marginTop:5,
    },
    price:{
        fontSize:16,
        color:'red',
        fontWeight:'bold',
    }

})