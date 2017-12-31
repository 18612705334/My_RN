/**
 * Created by zhengnan on 2017/7/28.
 */

import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
} from 'react-native';

import *as fontAndColor from  '../../../constant/FontAndColor';
import PixelUtil from  '../../../utils/PixelUtils';
let Pixel = new  PixelUtil();

export default class CarTrimHeaderView extends Component{
    render(){
        return(<View style={styles.rootContainer}>
            {
                this.state.titleSource.map((data,index)=>{
                    return(
                        <HeadItemBtn key={index} itemData={data} click={this.click}/>
                    )
                })
            }
        </View>)
    }
    // 构造
    constructor(props) {
        super(props);

        let titleArray = [
            {title:'手续员',value:'sxy',isSelected:false,img:require('../../../../image/carSourceImages/carTrim1.png')},
            {title:'评估师',value:'pgs',isSelected:false,img:require('../../../../image/carSourceImages/carTrim2.png')},
            {title:'整备员',value:'zby',isSelected:false,img:require('../../../../image/carSourceImages/carTrim3.png')},
            {title:'经理',value:'manager',isSelected:false,img:require('../../../../image/carSourceImages/carTrim4.png')},
            {title:'运营专员',value:'yyzy',isSelected:false,img:require('../../../../image/carSourceImages/carTrim5.png')}
        ];

        if(this.props.defaultIndex){
            titleArray[this.props.defaultIndex].isSelected = true;
        }else {
            titleArray[0].isSelected = true;

        }

        this.state = {
            titleSource:titleArray,
        };
        // this.props.click('手续员');
    }

    /**
     * from @ZN
     * 按钮点击
     * @param title
     */
    click=(title,value)=>{

        this.setTitleType(title);
        this.props.click(title,value);

    }

    /**
     * 修改按钮选中状态
     * @param title
     */
    setTitleType=(title)=>{

        let selectIndex = 0;
        for(let i=0;i<this.state.titleSource.length;i++){

            let item = this.state.titleSource[i];
            item.isSelected = false;
            if(item.title == title){
                selectIndex = i;
            }
        }

        this.state.titleSource[selectIndex].isSelected = true;
        this.setState({
            titleSource:this.state.titleSource,
        })
    }

}

class HeadItemBtn extends Component{

    render(){
        const data = this.props.itemData;
        return(
            <TouchableOpacity onPress={()=>{this.props.click(data.title,data.value)}}>
                <View style={[styles.itemBtn,data.isSelected && {borderBottomColor:'white'},!data.isSelected && {borderBottomColor:'transparent'}]}>
                    <Image style={styles.itemBtnImg} source={data.img} resizeMethod={'auto'}/>
                    <Text style={styles.itemBtnTitle}>{data.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }


}
const styles = StyleSheet.create({
    rootContainer:{
        justifyContent:'space-between',
        paddingHorizontal:Pixel.getPixel(15),
        height:Pixel.getPixel(100),
        backgroundColor:fontAndColor.NAVI_BAR_COLOR,
        alignItems:'center',
        flexDirection:'row'
    },
    itemBtn:{
        width:Pixel.getPixel(60),
        height:Pixel.getPixel(55),
        alignItems:'center',
        borderBottomWidth:Pixel.getPixel(1.5),
        borderBottomColor:'transparent',
    },
    itemBtnImg:{
        width:Pixel.getPixel(30),
        height:Pixel.getPixel(30),
        marginBottom:Pixel.getPixel(8),
    },
    itemBtnTitle:{
        color:'white',
        fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
        textAlign:'center',
    }

});