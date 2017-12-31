import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    Dimensions,
} from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import MyBaseNaviComponent from '../../component/MyBaseNaviComponent';
import MyBaseComponent from '../../component/MyBaseComponent';
import AllNavigationView from  '../../component/AllNavigationView';
import *as fontAndColor from  '../../constant/FontAndColor';
import Grid from '../../publish/component/Grid';
import PixelUtil from  '../../utils/PixelUtils';
let Pixel = new  PixelUtil();
const sceneWidth = Dimensions.get('window').width;

const background = require('../../../image/publish/background.png');
const grayColor = require('../../../image/publish/gray-color.png');
const multiColor = require('../../../image/publish/multi-color.png');
const doubleColor = require('../../../image/publish/double-color.png');
const colorSelect = require('../../../image/publish/color-select.png');


export default class CarBodyColorScene extends  MyBaseNaviComponent {

    initFinish = () => {
        this.setState({
            renderPlaceholderOnly:'success',
            title:'车身颜色'
        })
    }

    constructor(props){
        super(props)

        this.viewShell = this.props.carBodyColorData;
        this.viewShell.push(
            {
                name:'',
                value:'',
            },
            {
                name:'',
                value:''
            });

        this.viewShell.map((data,index)=>{
            data.index = index;
            if(data.name == this.props.currentChecked)
            {
                data.selected = true;

            }else {
                data.selected = false;
            }
            if(data.name == '多彩色'){
                data.fill = false;
                data.img = multiColor;
            }else if(data.name == '其他'){
                data.fill = false;
                data.img = doubleColor;
            }else {
                data.fill = true;
                data.img = '';
            }

        });



        this.state = {
            carShell: this.viewShell,
        }

    }


    renderView(){
        return(
            <View style={styles.rootContainer}>
                <Image  style={{width:sceneWidth,paddingHorizontal:Pixel.getPixel(43),paddingTop:Pixel.getPixel(20)}} source={background}>
                    <View style={{flex:1}}>
                        <Grid
                            ref = {(grid)=>{this.interiorGrid = grid}}
                            style={styles.girdContainer}
                            renderItem={this._renderShell}
                            data={this.state.carShell}
                            itemsPerRow={4}
                        />
                    </View>
                </Image>

            </View>
        )


    }
    _renderShell = (data, i) => {

        if(!data.name){
            return (
                <View key={data.index} style={styles.shellContainer}>
                    <View style={[styles.emptyContainer]}>

                    </View>
                </View>
            );
        }else if (data.selected === false)
        {
            if (data.fill === true) {
                //颜色
                return (
                    <TouchableOpacity
                        key={data.index}
                        style={styles.shellContainer}
                        activeOpacity={0.6}
                        onPress={()=>{this._shellPress(data.index)}}
                    >
                        <View style={styles.center}>
                            <View style={[styles.colorContainer,{backgroundColor:data.value}]}/>
                            <Text allowFontScaling={false}  style={styles.textLabel}>{data.name}</Text>
                        </View>
                    </TouchableOpacity>

                );
            } else {
                //图片
                return (
                    <TouchableOpacity
                        key={data.index}
                        style={styles.shellContainer}
                        activeOpacity={0.6}
                        onPress={()=>{this._shellPress(data.index)}}
                    >
                        <View style={styles.center}>
                            <Image style={styles.colorContainer} source={data.img}/>
                            <Text allowFontScaling={false}  style={styles.textLabel}>{data.name}</Text>
                        </View>
                    </TouchableOpacity>

                );
            }
        } else if (data.selected === true)
        {
            return (
                <TouchableOpacity
                    key={data.index}
                    style={styles.shellContainer}
                    activeOpacity={0.6}
                    onPress={()=>{this._shellPress(data.index)}}
                >
                    <View style={styles.center}>
                        <View style={[styles.colorContainer,styles.selectColor]}>
                            <Image style={styles.selectImg} source={colorSelect}/>
                        </View>
                        <Text allowFontScaling={false}  style={styles.textLabel}>{data.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        }

    };
    _shellPress = (i) => {
        this.props.checkedCarBodyColorClick({
            title:this.viewShell[i].name,
            value:this.viewShell[i].value,
        });
        this.backPage();
    };


}


const styles = StyleSheet.create({
    rootContainer:{
        flex:1,
        backgroundColor:fontAndColor.COLORA3,
        marginTop:Pixel.getTitlePixel(64),
    },

    titleText: {
        fontSize: Pixel.getFontPixel(15),
        color: '#FFFFFF'
    },
    splitLine: {
        marginTop: Pixel.getPixel(6),
        borderColor: '#FFFFFF',
        borderWidth: 0.5,
        flexDirection: 'row'
    },
    girdContainer: {
        flex: 1,
        marginTop: Pixel.getPixel(12)
    },
    shellContainer: {
        marginTop: Pixel.getPixel(14)
    },
    colorContainer: {
        width: Pixel.getPixel(40),
        height: Pixel.getPixel(40),
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: Pixel.getPixel(20)
    },
    emptyContainer: {
        width: Pixel.getPixel(40),
        height: Pixel.getPixel(40)
    },
    textLabel: {
        marginTop: Pixel.getPixel(4),
        fontSize: Pixel.getFontPixel(12),
        color: '#FFFFFF',
        backgroundColor:"rgba(0,0,0,0)"
    },
    selectColor: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectImg: {
        width: Pixel.getPixel(16),
        height: Pixel.getPixel(11)
    },
    center: {
        alignItems: 'center'
    },
});
