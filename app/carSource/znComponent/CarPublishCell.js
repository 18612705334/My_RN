/**
 * Created by zhengnan on 2017/5/12.
 */

import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,

} from 'react-native';

import *as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';

const Pixel = new  PixelUtil();
const sceneWidth = Dimensions.get('window').width;

export class CellView extends Component {

    render(){
        const {cellData} =this.props;
        return(
            <View style={styles.cellType1}>
                <View style={{flexDirection:'row'}}>
                    {
                        cellData.isShowTag && <Text allowFontScaling={false}  style={{color:fontAndColor.COLORB2, fontSize:fontAndColor.LITTLEFONT28}}>*</Text>
                    }
                    <View >
                        <Text allowFontScaling={false}  style={styles.cellTitle}>{cellData.title}</Text>
                        {
                            cellData.subTitle? (<Text allowFontScaling={false}  style={styles.cellSubTitle}>{cellData.subTitle}</Text>):(null)
                        }
                    </View>
                </View>
                {
                    cellData.tailView? cellData.tailView():(
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Text allowFontScaling={false}  style={styles.cellValue}>{cellData.value}</Text>
                            {
                                cellData.isShowTail &&
                                <Image style={{marginLeft:Pixel.getPixel(5)}}
                                       source={require('../../../image/mainImage/celljiantou.png')}/>
                            }
                        </View>)
                }
            </View>)
    }
}

export class CellSelectView extends Component{

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            currentChecked:this.props.currentTitle,

        };
    }

    setCurrentChecked=(text)=>{

        this.setState({
            currentChecked:text,
        });
    }

    render(){
        const {cellData} =this.props;

        return(
            <View style={styles.cellType2}>
                <View style={{flexDirection:'row'}}>
                    {
                        cellData.isShowTag && <Text allowFontScaling={false}  style={{color:fontAndColor.COLORB2, fontSize:fontAndColor.LITTLEFONT28}}>*</Text>
                    }
                    <Text allowFontScaling={false}  style={styles.cellTitle}>{cellData.title}</Text>
                </View>
                <View style={{flexDirection:'row',width:Pixel.getPixel(290),height:Pixel.getPixel(40),alignItems:'center',marginTop:Pixel.getPixel(10),backgroundColor:'white'}}>
                    {
                        cellData.selectDict.data.map((data,index)=>{
                            return (
                                <TouchableOpacity onPress={()=>
                                {
                                    if(this.state.currentChecked!=data.title){

                                        this.setCurrentChecked(data.title);
                                        this.props.cellSelectAction({title:data.title,value:data.value})
                                    }
                                }} activeOpacity={1} key={index}>
                                    <View style={[styles.checkedItemView,(this.state.currentChecked==data.title?{borderColor:fontAndColor.NAVI_BAR_COLOR}:{borderColor:fontAndColor.COLORA2})]}>
                                        <Text allowFontScaling={false}  style={[styles.checkedItemText,(this.state.currentChecked==data.title?{color:fontAndColor.NAVI_BAR_COLOR}:{color:fontAndColor.COLORA2})] }>{data.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cellType1:{
        flexDirection:'row',
        paddingHorizontal:Pixel.getPixel(15),
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:fontAndColor.COLORA4,
        paddingVertical:Pixel.getPixel(15),
        width:sceneWidth,

    },
    cellType2:{
        paddingHorizontal:Pixel.getPixel(15),
        backgroundColor:'white',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:fontAndColor.COLORA4,
        paddingVertical:Pixel.getPixel(20),
        justifyContent:'center',
        width:sceneWidth,
        flexDirection:'column',
        height:Pixel.getPixel(90)

    },
    cellTitle:{
        color:fontAndColor.COLORA0,
        fontSize:fontAndColor.LITTLEFONT28,
    },
    cellSubTitle:{
        fontSize:Pixel.getFontPixel(fontAndColor.MARKFONT22),
        color:fontAndColor.COLORA1,
        marginTop:Pixel.getPixel(5),
        // backgroundColor:'red',
    },
    cellValue:{
        color:fontAndColor.COLORA2,
        fontSize:fontAndColor.LITTLEFONT28,
    },
    checkedItemView:{
        borderColor:fontAndColor.COLORA2,
        borderWidth:StyleSheet.hairlineWidth,
        marginRight:Pixel.getPixel(15),
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:3,
        width:Pixel.getPixel(85),
        height:Pixel.getPixel(32),
    },
    checkedItemText:{
        color:fontAndColor.COLORA2,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
    },
});