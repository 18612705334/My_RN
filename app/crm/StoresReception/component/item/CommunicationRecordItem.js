/**
 * Created by hanmeng on 2017/5/18.
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
import * as fontAndColor from '../../../../constant/FontAndColor';
import PixelUtil from '../../../../utils/PixelUtils';
import BaseComponent from "../../../../component/BaseComponent";
import ClientInfoSelected from "../ClientInfoSelected";
import CustomerInfoInput from "../ClientInfoInput";
import SelectScene from "../../SelectScene";
const Pixel = new PixelUtil();
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class CommunicationRecordItem extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.type = '';
        this.childItems = [];
        this.childItems.push({name: '客户级别', value: '', parameter: 'customerLevel'});
        this.childItems.push({name: '进店时间', value: '', parameter: 'inTime'});
        this.childItems.push({name: '离店时间', value: '', parameter: 'outTime'});
        this.childItems.push({name: '进店人数', value: '', parameter: 'peopleNum'});
        this.state = {
            isDateTimePickerVisible: false
        }
    }

    /**
     *
     **/
    initFinish = () => {
        /*this.setState({
         renderPlaceholderOnly: 'success'
         });*/
    }

    /**
     *   获取表单内数据
     **/
    getItemData = () => {
        return this.childItems;
    };

    /**
     *   将传入本页的数据解析
     **/
    parseData = () => {
        let parameter = '';
        for (let i = 0; i < this.childItems.length; i++) {
            parameter = this.childItems[i].parameter;
            this.childItems[i].value = this.props.rowData[parameter];
        }
        if (this.childItems[0].value == 'A') {
            this.childItems[0].value = 'A:一周以内(购买欲望特别强)';
        } else if (this.childItems[0].value == 'B') {
            this.childItems[0].value = 'B:一月以内(准买车用户)';
        } else if (this.childItems[0].value == 'C') {
            this.childItems[0].value = 'C:三个月以内(有购买意向)';
        } else if (this.childItems[0].value == 'D') {
            this.childItems[0].value = 'D:闲逛(近期无意向)';
        }
    };

    /**
     *
     **/
    render() {
        let items = [];
        if (this.props.editState != 'look') {
            for (let i = 0; i < this.childItems.length; i++) {
                if (i == 0) {
                    items.push(<ClientInfoSelected ref='selectsex' key={i + 'bo'} items={this.childItems[i]}
                                                   toSelect={() => {
                                                       this.toNextPage({
                                                           name: 'SelectScene',
                                                           component: SelectScene,
                                                           params: {
                                                               regShowData: ['A、一周以内(购买欲望特别强)', 'B、一月以内(准买车用户)', 'C、三个月以内(有购买意向)', 'D、闲逛(近期无意向)'],
                                                               title: '客户级别',
                                                               callBack: (name) => {
                                                                   this.childItems[i].value = name.charAt(0);
                                                                   this.refs.selectsex.setValue(name);
                                                               }
                                                           }
                                                       })
                                                   }}/>);
                } else if (i == 1) {
                    items.push(<ClientInfoSelected ref="company" key={i + 'bo'} items={this.childItems[i]}
                                                   toSelect={() => {
                                                       this._showDateTimePicker('start');
                                                   }}/>);
                } else if (i == 2) {
                    items.push(<ClientInfoSelected ref='juese' key={i + 'bo'} items={this.childItems[i]}
                                                   toSelect={() => {
                                                       this._showDateTimePicker('end');
                                                   }}/>);
                } else {
                    items.push(<CustomerInfoInput key={i + 'bo'} items={this.childItems[i]}/>);
                }

            }
        } else {
            this.parseData();
            for (let i = 0; i < this.childItems.length; i++) {
                items.push(
                    <View
                        key={i + 'bo'}
                        style={{
                            width: width,
                            height: Pixel.getPixel(45),
                            backgroundColor: '#fff'
                        }}>
                        <View style={{
                            width: width,
                            height: Pixel.getPixel(44),
                            backgroundColor: '#00000000',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text allowFontScaling={false}
                                  style={{
                                      marginLeft: Pixel.getPixel(15),
                                      width: Pixel.getPixel(125),
                                      fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                                      color: fontAndColor.COLORA1
                                  }}>{this.childItems[i].name}</Text>
                            <Text allowFontScaling={false}
                                  style={{
                                      fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                                      color: '#000'
                                  }}>{this.childItems[i].value}</Text>
                        </View>
                        <View style={{
                            width: width,
                            height: Pixel.getPixel(1),
                            backgroundColor: fontAndColor.COLORA3
                        }}/>
                    </View>)
            }
        }
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
                <View style={{height: Pixel.getPixel(44), flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{
                        marginLeft: Pixel.getPixel(15),
                        backgroundColor: fontAndColor.NAVI_BAR_COLOR,
                        height: Pixel.getPixel(11),
                        width: Pixel.getPixel(3)
                    }}/>
                    <Text
                        style={{marginLeft: Pixel.getPixel(5), fontWeight: 'bold'}}
                        allowFontScaling={false}>本次沟通记录</Text>
                </View>
                <View style={{
                    height: 1,
                    backgroundColor: fontAndColor.COLORA3
                }}/>
                {items}
                <DateTimePicker
                    mode="datetime"
                    titleIOS="请选择时间"
                    confirmTextIOS='确定'
                    cancelTextIOS='取消'
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}/>
            </View>
        )
    }

    /**
     *  显示时间选择器
     * @param type
     * @private
     **/
    _showDateTimePicker = (type) => {
        this.type = type;
        this.setState({isDateTimePickerVisible: true})
    };

    /**
     * 隐藏时间选择器
     * @private
     **/
    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    /**
     * 处理时间选择
     * @private
     **/
    _handleDatePicked = (date) => {
        let d = this.dateFormat(date, 'yyyy-MM-dd hh:mm:ss');
        if (this.type === 'start') {
            this.childItems[1].value = d;
            this.refs.company.setValue(d);
            this.setState({
                isDateTimePickerVisible: false
            });
        } else {
            this.childItems[2].value = d;
            this.refs.juese.setValue(d);
            this.setState({
                isDateTimePickerVisible: false
            });
        }
        //this._hideDateTimePicker();
    };

    /**
     *   日期格式化
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
    separatedLine: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15),
        height: 1,
        backgroundColor: fontAndColor.COLORA4
    },
});