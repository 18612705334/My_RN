/**
 * Created by hanmeng on 2017/8/12.
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
import ExplainModal from "../../../../mine/myOrder/component/ExplainModal";
import ClientInfoSelected from "../../../StoresReception/component/ClientInfoSelected";
import CustomerInfoInput from "../../../StoresReception/component/ClientInfoInput";
import SelectScene from "../../../StoresReception/SelectScene";
const Pixel = new PixelUtil();
import DateTimePicker from 'react-native-modal-datetime-picker';


export default class CarInfoItem extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.type = '';
        this.childItems = [];
        this.childItems.push({name: '车牌号码', value: '', parameter: 'tenureCarnum'});
        this.childItems.push({name: '交强险到期', value: '', parameter: 'tenureCompulsory'});
        this.childItems.push({name: '商业险到期', value: '', parameter: 'tenureBusiness'});
        this.childItems.push({name: '保养到期', value: '', parameter: 'tenureMaintain'});
        this.childItems.push({name: '质保到期', value: '', parameter: 'tenureWarranty'});
        this.childItems[0].value = this.props.data.tenureCarnum ? this.props.data.tenureCarnum : '';
        this.childItems[1].value = this.props.data.tenureCompulsory ? this.props.data.tenureCompulsory : '';
        this.childItems[2].value = this.props.data.tenureBusiness ? this.props.data.tenureBusiness : '';
        this.childItems[3].value = this.props.data.tenureMaintain ? this.props.data.tenureMaintain : '';
        this.childItems[4].value = this.props.data.tenureWarranty ? this.props.data.tenureWarranty : '';
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
     *
     **/
    render() {
        let items = [];
        for (let i = 0; i < this.childItems.length; i++) {
            if (i == 0) {
                items.push(<CustomerInfoInput defValue={this.props.data.tenureCarnum} key={i + 'bo'}
                                              items={this.childItems[i]}/>);
            } else if (i == 1) {
                items.push(<ClientInfoSelected
                    defValue={this.props.data.tenureCompulsory}
                    ref="insurance" key={i + 'bo'} items={this.childItems[i]}
                    toSelect={() => {
                        this._showDateTimePicker('insurance');
                    }}/>);
            } else if (i == 2) {
                items.push(<ClientInfoSelected
                    defValue={this.props.data.tenureBusiness}
                    ref="business" key={i + 'bo'} items={this.childItems[i]}
                    toSelect={() => {
                        this._showDateTimePicker('business');
                    }}/>);
            } else if (i == 3) {
                items.push(<ClientInfoSelected
                    defValue={this.props.data.tenureMaintain}
                    ref="maintenance" key={i + 'bo'} items={this.childItems[i]}
                    toSelect={() => {
                        this._showDateTimePicker('maintenance');
                    }}/>);
            } else if (i == 4) {
                items.push(<ClientInfoSelected
                    defValue={this.props.data.tenureWarranty}
                    ref="quality" key={i + 'bo'} items={this.childItems[i]}
                    toSelect={() => {
                        this._showDateTimePicker('quality');
                    }}/>);
            } else {

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
                        allowFontScaling={false}>车辆信息</Text>
                </View>
                <View style={{
                    height: 1,
                    backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR
                }}/>
                <View >
                    <Text
                        numberOfLines={1}
                        style={{
                            marginTop: Pixel.getPixel(18),
                            width: width - Pixel.getPixel(30),
                            marginLeft: Pixel.getPixel(15),
                            fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color: fontAndColor.COLORA0
                        }}
                        allowFontScaling={false}>{this.props.data.tenureCarname}</Text>
                    <Text
                        style={{
                            marginTop: Pixel.getPixel(12),
                            marginLeft: Pixel.getPixel(15),
                            fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                            color: fontAndColor.COLORA1
                        }}
                        allowFontScaling={false}>VIN:{this.props.data.tenureVin}</Text>
                    <Text
                        style={{
                            marginBottom: Pixel.getPixel(18),
                            marginTop: Pixel.getPixel(6),
                            marginLeft: Pixel.getPixel(15),
                            fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                            color: fontAndColor.COLORA1
                        }}
                        allowFontScaling={false}>里程:{this.props.data.carMales}</Text>
                </View>
                <View style={{
                    height: 1,
                    backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR
                }}/>
                {items}
                <DateTimePicker
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
        let d = this.dateFormat(date, 'yyyy-MM-dd');
        if (this.type == 'insurance') {
            this.childItems[1].value = d;
            this.refs.insurance.setValue(d);
            this.setState({
                isDateTimePickerVisible: false
            });
        } else if (this.type == 'business') {
            this.childItems[2].value = d;
            this.refs.business.setValue(d);
            this.setState({
                isDateTimePickerVisible: false
            });
        } else if (this.type == 'maintenance') {
            this.childItems[3].value = d;
            this.refs.maintenance.setValue(d);
            this.setState({
                isDateTimePickerVisible: false
            });
        } else if (this.type == 'quality') {
            this.childItems[4].value = d;
            this.refs.quality.setValue(d);
            this.setState({
                isDateTimePickerVisible: false
            });
        } else {

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

const styles = StyleSheet.create({});