/**
 * Created by hanmeng on 2017/8/3.
 */

import React, {Component, PropTypes} from 'react'

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput
} from  'react-native'

const {width, height} = Dimensions.get('window');
import BaseComponent from "../../../component/BaseComponent";
import NavigatorView from '../../../component/AllNavigationView';
import * as fontAndColor from '../../../constant/FontAndColor';
import PixelUtil from '../../../utils/PixelUtils';
const Pixel = new PixelUtil();
import DateTimePicker from 'react-native-modal-datetime-picker';


export default class SelectMonth extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.state = {
            date: this.props.date,
            isDateTimePickerVisible: false
        }
    }

    /**
     *
     * @param nextProps
     **/
    componentWillReceiveProps(nextProps) {
        this.setState({
            date: nextProps.date
        })
    }
    initFinish(){

    }
    /**
     *
     **/
    render() {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        this._showDateTimePicker()
                    }}>
                    <View style={{
                        height: Pixel.getPixel(27),
                        width: Pixel.getPixel(120),
                        backgroundColor: fontAndColor.COLORA3,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text allowFontScaling={false}
                              style={this.state.date === '选择月份' ? styles.unSelectDate : styles.selectDate}>{this.state.date}</Text>

                    </View>
                </TouchableOpacity>
                <DateTimePicker
                    titleIOS="请选择日期"
                    confirmTextIOS='确定'
                    cancelTextIOS='取消'
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}/>
            </View>
        )
    }

    /**
     *
     * @private
     **/
    _showDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: true})
    };

    /**
     *
     * @private
     **/
    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    /**
     *
     * @private
     **/
    _handleDatePicked = (date) => {
        //console.log('A date has been picked: ', date);
        let d = this.dateFormat(date, 'yyyy-MM');
        this.setState({
            date: d,
            isDateTimePickerVisible: false
        });
        this.props.callBack(d);
    };

    /**
     *
     * @private
     **/
    dateFormat = (date, fmt) => {
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }


}

const styles = StyleSheet.create({
    carType: {
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getPixel(fontAndColor.BUTTONFONT30),
        marginTop: Pixel.getPixel(17)
    },
    dateBox: {
        marginLeft: Pixel.getPixel(16),
        marginRight: Pixel.getPixel(16),
        justifyContent: 'center',
        //width: Pixel.getPixel(140),
        flex: 1,
        height: Pixel.getPixel(32),
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR
    },
    selectDate: {
        textAlign: 'center'
    },
    unSelectDate: {
        textAlign: 'center',
        color: fontAndColor.COLORA1
    }
});