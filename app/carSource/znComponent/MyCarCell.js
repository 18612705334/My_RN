import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

var screenWidth = Dimensions.get('window').width;

import * as fontAndColor from '../../constant/FontAndColor';
import  PixelUtil from '../../utils/PixelUtils';
let     Pixel = new PixelUtil();

export default class MyCarCell extends Component {


    footButtonClick=(typeStr,groupStr,carID)=>{

        this.props.footButtonClick(typeStr,this.props.type,carID);
    };
    getImage=(type,review_status)=>{

        switch(type) {
            case 1:
                if(review_status==2){
                    return(require('../../../image/carSourceImages/auditDefeat.png')); // 审核不过
                    break;

                }else {
                    return(require('../../../image/carSourceImages/audit.png')); // 审核中
                    break;
                }
            case 3:
                return(require('../../../image/carSourceImages/soldOut.png')); // 已下架
                break;
            case 4:
                return(require('../../../image/carSourceImages/accomplish.png')); //已成交
                break;
            default:
                break;
        }
    };

    dateReversal = (time,isDay) => {

        const date = new Date();
        date.setTime(time);
        if(isDay){
            return (date.getFullYear() + '-' + (this.PrefixInteger(date.getMonth() + 1, 2))+'-'+(this.PrefixInteger(date.getDate(), 2)));

        }
        return (date.getFullYear() + '-' + (this.PrefixInteger(date.getMonth() + 1, 2)));

    };
    PrefixInteger = (num, length) => {

        return (Array(length).join('0') + num).slice(-length);

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

        const {carCellData} = this.props;
        const carType = carCellData.status; // 1:审核中 2:已上架 3：已下架 4：已成交
        const review_status = carCellData.review_status;
        return(
            <TouchableOpacity onPress={()=>{
                this.props.cellClick(carCellData)
            }}>
                <View style={[styles.container,styles.lineBottom]} >
                    <View style={styles.cellHeadView}>
                        <Text allowFontScaling={false} style={styles.mainText}>{carCellData.serial_num}</Text>
                        <Text allowFontScaling={false} style={{color:fontAndColor.COLORA1,
                            fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT)}}>{this.dateReversal(carCellData.public_time+'000',true)}上架</Text>
                    </View>
                    <View style={styles.cellContentView}>
                        <View style={styles.imageView} >
                            <Image style={styles.image}
                                   source={carCellData.img?{uri:carCellData.img+'?x-oss-process=image/resize,w_'+320+',h_'+240}:require('../../../image/carSourceImages/car_null_img.png')}>
                                {
                                    (carCellData.long_aging==1 && this.props.type ==1) &&<Image style={{left:0, right:0, top:0, bottom:0,position: 'absolute'}} source={require('../../../image/carSourceImages/carLong.png')}/>
                                }
                            </Image>
                        </View>
                        <View style={[styles.textContainer]}>
                            <View style={{backgroundColor:'white'}}>
                                <Text allowFontScaling={false} numberOfLines={1}  style={styles.mainText}>{(carCellData.city_name!=""?('['+carCellData.city_name+']'):"")+(carCellData.model_name)}</Text>
                                <Text allowFontScaling={false}  style={styles.subTitleText}>{this.dateReversal(carCellData.manufacture+'000',false)+'初登 | '+carCellData.mileage+'万公里'}</Text>
                                {
                                    (carCellData.dealer_price>0 && carCellData.low_price>0) &&
                                    (<Text allowFontScaling={false}  style={styles.subTitleText}>{(this.carMoneyChange(carCellData.dealer_price)) +'万 | 低价：' +(this.carMoneyChange(carCellData.low_price))}万</Text>)
                                }
                                {
                                    (carCellData.dealer_price>0 &&carCellData.low_price<=0) &&
                                    (<Text allowFontScaling={false}  style={styles.subTitleText}>{(this.carMoneyChange(carCellData.dealer_price))}万</Text>)
                                }
                                {
                                    (carCellData.low_price>0 && carCellData.dealer_price<=0) &&
                                    (<Text allowFontScaling={false}  style={styles.subTitleText}>{ '低价：' +(this.carMoneyChange(carCellData.low_price))}万</Text>)
                                }

                            </View>
                            <View/>
                            {/*<Text allowFontScaling={false}  style={styles.carPriceText}>{carCellData.dealer_price>0?(this.carMoneyChange(carCellData.dealer_price) +'万'):''}</Text>*/}
                        </View>
                        <Image style={styles.tailImage} source={this.getImage(carType,review_status)}/>
                    </View>
                    <View style={styles.cellFootView}>
                        <View style={{justifyContent:'center'}}>
                            {
                                carType==2 && (
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <Image style={{marginRight:Pixel.getPixel(8)}} source={require('../../../image/carSourceImages/carViewIcon.png')}/>
                                        <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),marginRight:Pixel.getFontPixel(15)}}>{carCellData.views}次</Text>
                                        {/*<Image style={{marginRight:Pixel.getPixel(8)}} source={require('../../../images/carSourceImages/carPhoneIcon.png')}/>*/}
                                        {/*<Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),marginRight:Pixel.getFontPixel(15)}}>2次</Text>*/}
                                        <Image style={{marginRight:Pixel.getPixel(8)}} source={require('../../../image/carSourceImages/carDealIcon.png')}/>
                                        <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),marginRight:Pixel.getFontPixel(15)}}>{carCellData.sale_day}天</Text>
                                    </View>
                                )
                            }
                            {
                                carType ==4 && (
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        {
                                            carCellData.sale_time &&(
                                                <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),marginRight:Pixel.getFontPixel(15)}}>售出:{this.dateReversal(carCellData.sale_time+'000',true)}</Text>)
                                        }
                                        {
                                            carCellData.current_rate &&(
                                                <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),marginRight:Pixel.getFontPixel(15)}}>售价:{this.carMoneyChange(carCellData.current_rate)}万元</Text>
                                            )
                                        }
                                    </View>
                                )
                            }
                        </View>
                        {
                            <View style={{flexDirection:'row'}}>
                                {
                                    (carType==1&&carCellData.review_status==2) &&
                                    <TouchableOpacity onPress={()=>{this.footButtonClick('查看退回原因',this.props.type,carCellData)}}>
                                        <View style={[styles.cellFoot,{borderColor:fontAndColor.COLORB4}]}>
                                            <Text allowFontScaling={false}  style={[styles.cellFootText,{color:fontAndColor.COLORB4}]}> 查看退回原因 </Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                                {/*<TouchableOpacity onPress={()=>{this.footButtonClick('编辑',this.props.type,carCellData)}}>*/}
                                {/*<View style={styles.cellFoot}>*/}
                                {/*<Text allowFontScaling={false}  style={styles.cellFootText}>  编辑  </Text>*/}
                                {/*</View>*/}
                                {/*</TouchableOpacity>*/}

                                {/*{*/}
                                {/*carType==2 &&*/}
                                {/*<TouchableOpacity onPress={()=>{this.footButtonClick('下架',this.props.type,carCellData)}}>*/}
                                {/*<View style={styles.cellFoot}>*/}
                                {/*<Text allowFontScaling={false}  style={styles.cellFootText}>  下架  </Text>*/}
                                {/*</View>*/}
                                {/*</TouchableOpacity>*/}
                                {/*}*/}
                                {/*{*/}
                                {/*((carType==1&&carCellData.review_status==1)||carType==3 ) &&*/}
                                {/*<TouchableOpacity onPress={()=>{this.footButtonClick('上架',this.props.type,carCellData)}}>*/}
                                {/*<View style={styles.cellFoot}>*/}
                                {/*<Text allowFontScaling={false}  style={styles.cellFootText}> 申请上架 </Text>*/}
                                {/*</View>*/}
                                {/*</TouchableOpacity>*/}
                                {/*}*/}

                                {
                                    carType == 2 &&
                                    <TouchableOpacity onPress={()=>{this.footButtonClick('管理',this.props.type,carCellData)}}>
                                        <View style={styles.cellFoot}>
                                            <Text allowFontScaling={false}  style={styles.cellFootText}>  管理  </Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                                {
                                    (carType == 4 || carType == 3 ||  (carType==1&&carCellData.review_status==2))&&
                                    <TouchableOpacity onPress={()=>{this.footButtonClick('删除',this.props.type,carCellData)}}>
                                        <View style={styles.cellFoot}>
                                            <Text allowFontScaling={false}  style={styles.cellFootText}>  删除  </Text>
                                        </View>
                                    </TouchableOpacity>

                                }
                                {
                                    (carType == 1 || carType == 3) &&
                                    <TouchableOpacity onPress={()=>{this.footButtonClick('编辑',this.props.type,carCellData)}}>
                                        <View style={styles.cellFoot}>
                                            <Text allowFontScaling={false}  style={styles.cellFootText}>  编辑  </Text>
                                        </View>
                                    </TouchableOpacity>

                                }
                            </View>
                        }
                    </View>
                </View>
            </TouchableOpacity>



        )
    }
}

const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:'white',
        paddingHorizontal:Pixel.getPixel(15),

    },

    cellContentView:{
        height:Pixel.getPixel(110),
        flexDirection:'row',
        borderBottomWidth:Pixel.getPixel(1),
        borderColor:fontAndColor.THEME_BACKGROUND_COLOR,
        overflow:'hidden',
        backgroundColor:'white',

    },
    cellHeadView:{
        height:Pixel.getPixel(44),
        flexDirection:'row',
        borderBottomWidth:Pixel.getPixel(1),
        borderColor:fontAndColor.THEME_BACKGROUND_COLOR,
        alignItems:'center',
        justifyContent:'space-between',
    },
    cellFootView:{

        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white',
        paddingVertical:Pixel.getPixel(10)


    },
    cellFoot:{
        paddingHorizontal:Pixel.getPixel(10),
        paddingVertical:Pixel.getPixel(5),
        borderColor:fontAndColor.NAVI_BAR_COLOR,
        borderWidth:StyleSheet.hairlineWidth,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:2,
        overflow:'hidden',
        marginLeft:Pixel.getPixel(15)
    },
    cellFootText:{

        color: fontAndColor.NAVI_BAR_COLOR,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT) ,
    },
    lineBottom:{

        borderBottomWidth:Pixel.getPixel(10),
        borderColor:fontAndColor.THEME_BACKGROUND_COLOR,

    },

    imageView:{

        width:Pixel.getPixel(134),
        justifyContent:'center',
        // backgroundColor:'yellow'

    },
    image:{

        width:Pixel.getPixel(120),
        height:Pixel.getPixel(80),
        resizeMode: 'stretch',

    },
    tailImage:{

        bottom:Pixel.getPixel(5),
        right:0,
        position:'absolute',
    },

    textContainer:{
        flex:1,
        // backgroundColor:'#FF0067',
        justifyContent:'space-around',
    },

    mainText:{

        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        // backgroundColor:'red',

    },

    subTitleText:{

        color:fontAndColor.COLORA1,
        fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT) ,
        marginTop:Pixel.getPixel(5),
        // backgroundColor:'red',

    },
    carPriceText:{
        color:fontAndColor.COLORB2,
        fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
        fontWeight:'bold',
    }

});