import React, {Component} from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from 'react-native';

import * as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';
const Pixel = new PixelUtil();
const {width, height} = Dimensions.get('window');
import Grid from './Grid';


export default class PlateModal extends Component {



    constructor(props) {
        super(props);
        this.viewData = [
            {title: '京', selected: false, index: 0},
            {title: '津', selected: false, index: 1},
            {title: '冀', selected: false, index: 2},
            {title: '晋', selected: false, index: 3},
            {title: '蒙', selected: false, index: 4},
            {title: '辽', selected: false, index: 5},
            {title: '吉', selected: false, index: 6},
            {title: '黑', selected: false, index: 7},
            {title: '沪', selected: false, index: 8},
            {title: '苏', selected: false, index: 9},
            {title: '浙', selected: false, index: 10},
            {title: '皖', selected: false, index: 11},
            {title: '闽', selected: false, index: 12},
            {title: '赣', selected: false, index: 13},
            {title: '鲁', selected: false, index: 14},
            {title: '豫', selected: true, index: 15},
            {title: '鄂', selected: false, index: 16},
            {title: '湘', selected: false, index: 17},
            {title: '粤', selected: false, index: 18},
            {title: '桂', selected: false, index: 19},
            {title: '琼', selected: false, index: 20},
            {title: '川', selected: false, index: 21},
            {title: '云', selected: false, index: 22},
            {title: '贵', selected: false, index: 23},
            {title: '渝', selected: false, index: 24},
            {title: '藏', selected: false, index: 25},
            {title: '陕', selected: false, index: 26},
            {title: '甘', selected: false, index: 27},
            {title: '青', selected: false, index: 28},
            {title: '宁', selected: false, index: 29},
            {title: '新', selected: false, index: 30},
            {title: '', selected: '', index: 31},
        ];
        this.state = {
            modalVisible: false,
            dataSource: this.viewData,
            selectIndex: 0,
        }
    }

    _renderItem = (data, i) => {
        if (data.title !== '') {
            if(data.selected){
                return (
                    <TouchableOpacity
                        key={data.index}
                        style={styles.selectItem}
                        activeOpacity={0.6}
                        onPress={()=>{this._labelPress(data.index)}}
                    >
                        <View>
                            <Text allowFontScaling={false}  style={styles.selectText}>
                                {data.title}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            }else{
                return(
                    <TouchableOpacity
                        key={data.index}
                        style={styles.defaultItem}
                        activeOpacity={0.6}
                        onPress={()=>{this._labelPress(data.index)}}
                    >
                        <View>
                            <Text allowFontScaling={false}  style={styles.defaultText}>
                                {data.title}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            }
        } else {
            return (
                <TouchableOpacity
                    key={data.index}
                    style={styles.okBtn}
                    activeOpacity={0.6}
                    onPress={()=>{this._okClick()}}
                >
                    <View style={styles.center} >
                        <Text allowFontScaling={false}  style={styles.okText}>
                            {'确定'}
                        </Text>
                    </View>
                </TouchableOpacity>

            );
        }
    };


    openModal(){
        this.setState({
            modalVisible:true
        })
    }

    _okClick = () => {
        this.setState({
            modalVisible: false
        });
        let city = this.viewData.filter((data)=>{
            if(data.selected){
                return data;
            }
        });
        this.props.onClose(city[0].title);
    };
    render() {
        return (
            <Modal
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {}}>
                <View style={styles.container}>
                    <View style={styles.contentContainer}>
                        <Grid
                            ref = {(grid)=>{this.interiorGrid = grid}}
                            style={styles.girdContainer}
                            renderItem={this._renderItem}
                            data={this.state.dataSource}
                            itemsPerRow={5}
                        />
                    </View>
                </View>
            </Modal>
        );
    }


    _labelPress = (i) => {
        this.viewData.map((data,index)=>{
            if(data.title !== ''){
                data.selected = (i === index);
            }
        });
        this.interiorGrid.refresh(this.viewData);
    };

}


const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center'
    },
    contentContainer: {
        width: Pixel.getPixel(250),
        height: Pixel.getPixel(320),
        borderRadius: Pixel.getPixel(2),
        marginTop: Pixel.getPixel(141),
        paddingHorizontal: Pixel.getPixel(22),
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingTop: Pixel.getPixel(14)
    },
    girdContainer: {
        flex: 1
    },
    defaultItem: {
        width: Pixel.getPixel(36),
        height: Pixel.getPixel(36),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Pixel.getPixel(4)
    },
    defaultText: {
        fontSize: Pixel.getFontPixel(20),
        color: fontAndColor.COLORA2,
    },
    selectItem: {
        width: Pixel.getPixel(36),
        height: Pixel.getPixel(36),
        borderRadius: Pixel.getPixel(18),
        backgroundColor: fontAndColor.COLORB1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Pixel.getPixel(4)
    },
    selectText: {
        fontSize: Pixel.getFontPixel(20),
        color: '#FFFFFF'
    },
    okBtn: {
        width: Pixel.getPixel(154),
        height: Pixel.getPixel(36),
        borderWidth: 1,
        borderRadius: 1,
        borderColor: fontAndColor.COLORB1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Pixel.getPixel(4)
    },
    okText: {
        fontSize: Pixel.getFontPixel(15),
        color: fontAndColor.COLORB1
    },
    center:{
        alignItems:'center',
        justifyContent:'center'
    }
});
