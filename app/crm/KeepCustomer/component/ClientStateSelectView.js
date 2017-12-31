/**
 * Created by hanmeng on 2017/8/12.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ListView,
    Modal
} from 'react-native';

import * as fontAndColor from '../../../constant/FontAndColor';
import PixelUtil from '../../../utils/PixelUtils';
const Pixel = new PixelUtil();
const cellJianTou = require('../../../../image/mainImage/celljiantou.png');

export class ClientStateSelectView extends Component {

    /**
     *
     **/
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(['待完善客户', '已完善客户']),
        };
    }

    /**
     *
     **/
    loadData = () => {

    };

    /**
     *
     **/
    render() {
        return (<View style={styles.container}>
            <View style={{backgroundColor: 'white'}}>
                <ListView style={{backgroundColor: '#ffffff'}}
                          dataSource={this.state.dataSource}
                          removeClippedSubviews={false}
                          renderRow={this._renderRow}
                          enableEmptySections={true}
                          renderSeparator={this._renderSeperator}/>
            </View>
            <TouchableOpacity style={{flex: 1}} onPress={() => {
                this.props.hideView()
            }}/>
        </View>);
    }

    /**
     *
     **/
    _renderSeperator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(1)}}/>
        )
    }

    /**
     *
     **/
    _renderRow = (rowData, selectionID, rowID) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.callBack(rowData);
                }}>
                <View style={styles.listItem}>
                    <Text allowFontScaling={false} style={rowData == this.props.currentSelect ? styles.selectedDescribe : styles.describe}>{rowData}</Text>
                </View>
            </TouchableOpacity>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        top: Pixel.getTitlePixel(104),
        backgroundColor: 'rgba(0, 0, 0,0.3)',
        left: 0,
        right: 0,
        position: 'absolute',
        bottom: 0,
    },
    listItem: {
        justifyContent: 'center',
        alignItems: 'center',
        height: Pixel.getPixel(44),
        backgroundColor: '#ffffff'
    },
    date: {
        marginRight: Pixel.getPixel(15),
        marginTop: Pixel.getPixel(20),
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
        color: fontAndColor.COLORA1
    },
    title: {
        marginLeft: Pixel.getPixel(15),
        marginTop: Pixel.getPixel(20),
        fontSize: Pixel.getFontPixel(fontAndColor.NAVIGATORFONT),
        color: fontAndColor.COLORA0
    },
    describe: {
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        color: fontAndColor.COLORA0
    },
    selectedDescribe: {
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        color: fontAndColor.NAVI_BAR_COLOR
    },
    separatedLine: {
        marginTop: Pixel.getPixel(10),
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15),
        height: 1,
        backgroundColor: fontAndColor.COLORA4
    },
    subItem: {
        alignItems: 'center',
        flexDirection: 'row',
        height: Pixel.getPixel(44),
        backgroundColor: '#ffffff'
    },
    subTitle: {
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        color: fontAndColor.COLORA2
    },
    image: {
        marginRight: Pixel.getPixel(15)
    }
});
