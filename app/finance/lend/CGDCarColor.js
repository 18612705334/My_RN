/**
 * Created by Administrator on 2017/3/22.
 */
import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
}from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import AllNavigationView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';
const Pixel = new PixelUtil();
import Grid from './component/Grid';

const grayColor = require('../../../image/publish/gray-color.png');
const multiColor = require('../../../image/publish/multi-color.png');
const doubleColor = require('../../../image/publish/double-color.png');
const colorSelect = require('../../../image/publish/color-select.png');

export default class CGDCarColor extends BaseComponent {

    constructor(props) {
        super(props);
        this.viewShell = [
            {
                title: '黑色',
                selected: false,
                fill: true,
                color: '#000000',
                img: '',
                index: 0
            },
            {
                title: '白色',
                selected: false,
                fill: true,
                color: '#FFFFFF',
                img: '',
                index: 1
            },
            {
                title: '银灰色',
                selected: false,
                fill: false,
                color: '',
                img: grayColor,
                index: 2
            },
            {
                title: '深灰色',
                selected: false,
                fill: true,
                color: '#a8a8a8',
                img: '',
                index: 3
            },
            {
                title: '绿色',
                selected: false,
                fill: true,
                color: '#79c65e',
                img: '',
                index: 4
            },
            {
                title: '红色',
                selected: false,
                fill: true,
                color: '#d22c23',
                img: '',
                index: 5
            },
            {
                title: '橙色',
                selected: false,
                fill: true,
                color: '#ffaa25',
                img: '',
                index: 6
            },
            {
                title: '黄色',
                selected: false,
                fill: true,
                color: '#ffcf12',
                img: '',
                index: 7
            },
            {
                title: '蓝色',
                selected: false,
                fill: true,
                color: '#0c99f9',
                img: '',
                index: 8
            },
            {
                title: '咖啡色',
                selected: false,
                fill: true,
                color: '#814505',
                img: '',
                index: 9
            },
            {
                title: '紫色',
                selected: false,
                fill: true,
                color: '#6c1d90',
                img: '',
                index: 10
            },
            {
                title: '香槟色',
                selected: false,
                fill: true,
                color: '#e1c8b4',
                img: '',
                index: 11
            },
            {
                title: '多彩色',
                selected: false,
                fill: false,
                color: '',
                img: multiColor,
                index: 12
            },
            {
                title: '其他',
                selected: false,
                fill: false,
                color: '',
                img: doubleColor,
                index: 13
            },
            {
                title: '',
                selected: '',
                fill: false,
                color: '',
                img: '',
                index: 14
            },
            {
                title: '',
                selected: '',
                fill: false,
                color: '',
                img: '',
                index: 15
            }
        ];
    }

    initFinish = () => {

    };

    _onBack = () => {
        this.backPage();
    };

    _shellPress = (i) => {
        let shell = '';
        this.viewShell.map((data,index)=>{
            if(data.title !== ''){
                if(i === index){
                    data.selected = true;
                    shell = data.title;
                }else{
                    data.selected = false;
                }
            }
        });

        this.shellGrid.refresh(this.viewShell);
        this.props.selectColor(shell);
        this.backPage();
    };

    _renderShell = (data, i) => {
        if (data.selected === false) {
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
                            <View style={[styles.colorContainer,{backgroundColor:data.color}]}/>
                            <Text allowFontScaling={false}  style={styles.textLabel}>{data.title}</Text>
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
                            <Text allowFontScaling={false}  style={styles.textLabel}>{data.title}</Text>
                        </View>
                    </TouchableOpacity>

                );
            }
        } else if (data.selected === true) {
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
                        <Text allowFontScaling={false}  style={styles.textLabel}>{data.title}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <View key={data.index} style={styles.shellContainer}>
                    <View style={[styles.emptyContainer]}>

                    </View>
                </View>
            );
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <AllNavigationView
                    backIconClick={this._onBack}
                    title='选择颜色'
                />
                <View style={styles.alignTop}>
                    <Grid
                        ref = {(grid)=>{this.shellGrid = grid}}
                        style={styles.girdContainer}
                        renderItem={this._renderShell}
                        data={this.viewShell}
                        itemsPerRow={4}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
    },
    alignTop: {
        flex: 1,
        marginTop: Pixel.getPixel(59),
        backgroundColor:'white',
        paddingHorizontal:Pixel.getPixel(42)
    },
    girdContainer: {
        flex: 1,
        marginTop: Pixel.getPixel(48)
    },
    shellContainer: {
        marginTop: Pixel.getPixel(14)
    },
    center: {
        alignItems: 'center'
    },
    colorContainer: {
        width: Pixel.getPixel(40),
        height: Pixel.getPixel(40),
        borderColor:fontAndColor.COLORA4,
        borderWidth: 1,
        borderRadius: Pixel.getPixel(20)
    },
    textLabel: {
        marginTop: Pixel.getPixel(4),
        fontSize: Pixel.getFontPixel(12),
        color: '#000000'
    },
    selectColor: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyContainer: {
        width: Pixel.getPixel(40),
        height: Pixel.getPixel(40)
    }
});