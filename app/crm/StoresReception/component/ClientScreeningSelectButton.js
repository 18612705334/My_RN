/**
 * Created by hanmeng on 2017/8/3.
 */
import React, {Component} from 'react';
import {

    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Modal,

} from 'react-native';

const {width, height} = Dimensions.get('window');
import * as fontAndColor from '../../../constant/FontAndColor';
import PixelUtil from '../../../utils/PixelUtils';
var Pixel = new PixelUtil();


export class ClientScreeningSelectButton extends Component {

    /**
     *
     **/
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            imgSource: require('../../../../image/carSourceImages/btnIcon@2x.png'),
            isHighlighted: styles.selectBtnText,
            title: this.props.title
        };
    }

    /**
     *
     **/
    setTitle = (title) => {
        this.setState({
            title: title
        });
    };

    /**
     * 筛选项点击
     * @private
     **/
    _btnClick = () => {
        // this._setImgHighlighted(!this.state.isHighlighted);
        this.props.btnClick();
        //this.props.btnClick(this.props.index, this.state.isHighlighted, this._setImgHighlighted);
    };

    /**
     *
     **/
    componentDidMount() {
        if (this.props.title == '筛选') {
            this._setImgHighlighted(false);
        } else {
            this._setImgHighlighted(true);
        }
    }

    /**
     * 设置按钮图片类型
     * @private
     **/
    _setImgHighlighted = (bool) => {
        //const {imgSource, isHighlighted} = this.state;
        this.setState({
            imgSource: bool ? (require('../../../../image/carSourceImages/btnIconHigh@2x.png')) : (require('../../../../image/carSourceImages/btnIcon@2x.png')),
            isHighlighted: bool ? styles.selectedBtnText : styles.selectBtnText
        })
    }

    /**
     *  render
     * @returns {XML}
     **/
    render() {
        return (
            <TouchableOpacity
                onPress={this._btnClick}>
                <View style={styles.selectBtn}>
                    <View>
                        <Text allowFontScaling={false} style={this.state.isHighlighted}>{this.state.title}</Text>
                    </View>
                    <View style={{marginLeft: 5}}>
                        <Image source={this.state.imgSource}></Image>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        height: Pixel.getPixel(40),
        width: width,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    selectBtn: {
        width: Pixel.getPixel(90),
        height: Pixel.getPixel(40),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    selectBtnText: {
        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        backgroundColor: 'white',
    },
    selectedBtnText: {
        color: fontAndColor.NAVI_BAR_COLOR,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        backgroundColor: 'white',
    },
    selectView: {
        top: Pixel.getTitlePixel(104),
        backgroundColor: 'rgba(0, 0, 0,0.3)',
        left: 0,
        right: 0,
        position: 'absolute',
        bottom: 0
    }
});