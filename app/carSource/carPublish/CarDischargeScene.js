import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    Dimensions
} from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import MyBaseComponent from '../../component/MyBaseComponent';
import MyBaseNaviComponent from '../../component/MyBaseNaviComponent';
import AllNavigationView from '../../component/AllNavigationView';
import *as fontAndColor from '../../constant/FontAndColor';
import Grid from '../../publish/component/Grid';
import PixelUtil from '../../utils/PixelUtils';

let Pixel = new PixelUtil();
const sceneWidth = Dimensions.get('window').width;

const background = require('../../../image/publish/background.png');

export default class CarDischargeScene extends MyBaseNaviComponent {

    constructor(props) {
        super(props)


        this.viewData = this.props.DischargeData;
        this.viewData.map((data, index) => {
            data.index = index;
            if (data.name == this.props.currentChecked) {
                data.selected = true;
            } else {
                data.selected = false;
            }
        });


        this.state = {
            dataSource: this.viewData,
        }
    }


    initFinish() {
        this.setState({
            renderPlaceholderOnly: "success",
            title: "选择排放标准"
        })
    }


    renderView() {
        return (
            <View style={styles.rootContainer}>
                <Image
                    style={{width: sceneWidth, paddingHorizontal: Pixel.getPixel(43), paddingTop: Pixel.getPixel(20)}}
                    source={background}>
                    <View style={{flex: 1}}>
                        <Grid
                            ref={(grid) => {
                                this.interiorGrid = grid
                            }}
                            style={styles.girdContainer}
                            renderItem={this._renderItem}
                            data={this.state.dataSource}
                            itemsPerRow={2}
                        />
                    </View>
                </Image>
                <AllNavigationView title="选择排放标准" backIconClick={this.backPage}/>
            </View>
        )
    }

    _renderItem = (data, i) => {
        if (data.selected === true) {
            return (
                <TouchableOpacity
                    key={data.index}
                    style={styles.selectItem}
                    activeOpacity={0.6}
                    onPress={()=>{this._labelPress(data.index)}}
                >
                    <View >
                        <Text allowFontScaling={false}  style={styles.selectText}>
                            {data.name}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (data.selected === false) {
            return (
                <TouchableOpacity
                    key={data.index}
                    style={styles.defaultItem}
                    activeOpacity={0.6}
                    onPress={()=>{this._labelPress(data.index)}}
                >
                    <View >
                        <Text allowFontScaling={false}  style={styles.defaultText}>
                            {data.name}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <View key={i} style={styles.emptyItem}>

                </View>
            );
        }
    };

    _labelPress = (i) => {

        this.props.checkedCarDischargeClick({
            title:this.viewData[i].name,
            value:this.viewData[i].value,
        });
        this.backPage();

        // this.viewData.map((data,index)=>{
        //     data.selected = (i === index);
        // });
        //
        // this.interiorGrid.refresh(this.viewData);
    };
}


const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3,
        paddingTop: Pixel.getTitlePixel(64),
    },

    defaultItem: {
        height: Pixel.getPixel(41),
        width: Pixel.getPixel(132),
        marginTop: Pixel.getPixel(10),
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: Pixel.getPixel(20),
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    defaultText: {
        fontSize: Pixel.getFontPixel(15),
        color: '#FFFFFF'
    },
    selectItem: {
        height: Pixel.getPixel(41),
        width: Pixel.getPixel(132),
        marginTop: Pixel.getPixel(10),
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: Pixel.getPixel(20),
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectText: {
        fontSize: Pixel.getFontPixel(15),
        color: fontAndColor.COLORB1
    },
    emptyItem: {
        height: Pixel.getPixel(41),
        width: Pixel.getPixel(132),
        marginTop: Pixel.getPixel(10),
        backgroundColor: 'transparent'
    },
});
