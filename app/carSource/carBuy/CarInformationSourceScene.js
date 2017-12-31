/**
 * Created by zhengnan on 2017/7/27.
 */

import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ScrollView,

} from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import AllNavigationView from  '../../component/AllNavigationView';
import *as fontAndColor from  '../../constant/FontAndColor';
import PixelUtil from  '../../utils/PixelUtils';
let Pixel = new  PixelUtil();
const sceneWidth = Dimensions.get('window').width;


export default class CarInformationSourceScene extends  BaseComponent{

    initFinish(){

    }

    render(){
        return(
            <View style={styles.rootContainer}>
                <ScrollView>
                    <CarInformationSourceView soureData={this.sourceData} cellSelectAction={this.cellSelectAction} currentTitle={this.props.currentTitle}/>
                </ScrollView>
                <AllNavigationView title="信息来源" backIconClick ={this.backPage}/>
            </View>
        )
    }

    // 构造
    constructor(props) {
        super(props);

        this.sourceData = [[{title:'本平台',value:1},{title:'其他网络平台',value:2},{title:'朋友圈',value:3}],
            [{title:'信息员介绍',value:4},{title:'友商合车',value:5},{title:'拍卖',value:6}],
            [{title:'自到店',value:7},{title:'客户转介绍',value:8},{title:'置换',value:9}]];
        this.state = {};
    }

    cellSelectAction=(selectObject)=>{

        this.props.carInformationSourceSelectAction(selectObject);
        this.backPage();
    }
}

class CarInformationSourceView extends Component {

    render(){
        return(
            <View style={styles.soureView}>
                {
                    this.props.title && (
                        <Text style={styles.soureViewTitle}>信息来源</Text>
                    )
                }
                <View>
                    {
                        this.props.soureData.map((data,index)=>{
                            return(
                                <View key={index} style={{marginBottom:Pixel.getFontPixel(10),flexDirection:'row',justifyContent:'space-between',
                                    alignItems:'center'
                                }}>
                                    {
                                        data.map((subData,subIndex)=>{
                                            return(
                                                <TouchableOpacity onPress={()=>
                                                {
                                                    if(this.state.currentChecked!=subData.title){

                                                        this.setCurrentChecked(subData.title);
                                                        this.props.cellSelectAction({title:subData.title,value:subData.value})
                                                    }else {
                                                        this.setCurrentChecked('');
                                                        this.props.cellSelectAction({title:'',value:0})
                                                    }
                                                }} activeOpacity={1} key={'sub'+subIndex}>
                                                    <View style={[styles.checkedItemView,(this.state.currentChecked==subData.title?{borderColor:fontAndColor.NAVI_BAR_COLOR}:{borderColor:fontAndColor.COLORA2})]}>
                                                        <Text allowFontScaling={false}  style={[styles.checkedItemText,(this.state.currentChecked==subData.title?{color:fontAndColor.NAVI_BAR_COLOR}:{color:fontAndColor.COLORA2})] }>{subData.title}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )

                                        })
                                    }
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    }

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            currentChecked:this.props.currentTitle,
        };
    }

    setCurrentChecked=(text)=>{

        this.setState({
            currentChecked:text,
        });
    }
}


const styles = StyleSheet.create({

    rootContainer:{
        paddingTop:Pixel.getTitlePixel(64),
        backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR,
        flex:1,
    },
    soureView:{

        paddingHorizontal:Pixel.getPixel(10),
        backgroundColor:'white',
        flexWrap: 'wrap',
        marginTop:Pixel.getPixel(10),
        paddingTop:Pixel.getFontPixel(10),


    },
    soureViewTitle:{
        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        marginBottom:Pixel.getPixel(10)
    },
    checkedItemView:{

        borderColor:fontAndColor.COLORA2,
        borderWidth:StyleSheet.hairlineWidth,
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:3,
        width:Pixel.getPixel(100),
        height:Pixel.getPixel(32),
    },
    checkedItemText:{
        color:fontAndColor.COLORA2,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
    },


});