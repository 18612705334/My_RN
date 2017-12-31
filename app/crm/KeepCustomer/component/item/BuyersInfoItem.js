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
import CarBrandSelectScene from "../../../../carSource/CarBrandSelectScene";


export default class BuyersInfoItem extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.type = '';
        this.checkedCarType = {
            title: '',
            brand_id: '',
            series_id: '',
            model_id: ''
        };
        this.childItems = [];
        this.childItems.push({name: '客户姓名', value: '', parameter: 'custName'});
        this.childItems.push({name: '手机号码', value: '', parameter: 'custPhone'});
        this.childItems.push({name: '称谓', value: '', parameter: 'custSex'});
        this.childItems.push({name: '生日', value: '', parameter: 'custBirthday'});
        this.childItems.push({name: '年龄', value: '', parameter: 'custAge'});
        this.childItems.push({name: '面访时间', value: '', parameter: 'custVisittime'});
        this.childItems.push({name: '3日内回访', value: '', parameter: 'custThreevisit'});
        this.childItems.push({name: '7日内回访', value: '', parameter: 'custSevenvisit'});
        this.childItems.push({name: '购车之前车型', value: '', parameter: 'custBeforecar'});
        this.childItems.push({name: '备注', value: '', parameter: 'custRemark'});
        this.childItems[0].value = this.props.data.custName ? this.props.data.custName : '';
        this.childItems[1].value = this.props.data.custPhone ? this.props.data.custPhone : '';
        this.childItems[2].value = this.props.data.custSex ? this.props.data.custSex : '';
        this.childItems[3].value = this.props.data.custBirthday ? this.props.data.custBirthday : '';
        this.childItems[4].value = this.props.data.custAge ? this.props.data.custAge : '';
        this.childItems[5].value = this.props.data.custVisittime ? this.props.data.custVisittime : '';
        this.childItems[6].value = this.props.data.custThreevisit ? this.props.data.custThreevisit : '';
        this.childItems[7].value = this.props.data.custSevenvisit ? this.props.data.custSevenvisit : '';
        this.childItems[8].value = this.props.data.custBeforecar ? this.props.data.custBeforecar : '';
        this.childItems[9].value = this.props.data.custRemark ? this.props.data.custRemark : '';
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
            if (i == 2) {
                let defValue = this.props.data.custSex;
                //this.childItems[i].value = defValue == '女' ? '女士' : '先生';
                items.push(<ClientInfoSelected
                    defValue={defValue}
                    ref='selectsex' key={i + 'bo'} items={this.childItems[i]}
                    toSelect={() => {
                        this.toNextPage({
                            name: 'SelectScene',
                            component: SelectScene,
                            params: {
                                regShowData: ['先生', '女士'],
                                title: this.childItems[i].name,
                                callBack: (name) => {
                                    this.childItems[i].value = name;
                                    this.refs.selectsex.setValue(name);
                                }
                            }
                        })
                    }}/>);
            } else if (i == 3) {
                //this.childItems[i].value = this.props.data.custBirthday ? this.props.data.custBirthday : '';
                items.push(<ClientInfoSelected
                    defValue={this.props.data.custBirthday}
                    ref="birthday" key={i + 'bo'} items={this.childItems[i]}
                    toSelect={() => {
                        this._showDateTimePicker('birthday');
                    }}/>);
            } else if (i == 5) {
                //this.childItems[i].value = this.props.data.custVisittime ? this.props.data.custVisittime : '';
                items.push(<ClientInfoSelected
                    defValue={this.props.data.custVisittime}
                    ref="interview" key={i + 'bo'} items={this.childItems[i]}
                    toSelect={() => {
                        this._showDateTimePicker('interview');
                    }}/>);
            } else if (i == 8) {
                //this.childItems[i].value = this.props.data.custBeforecar ? this.props.data.custBeforecar : '';
                items.push(<ClientInfoSelected
                    defValue={this.props.data.custBeforecar}
                    ref="models" key={i + 'bo'} items={this.childItems[i]}
                    toSelect={() => {
                        this.toNextPage({
                            name: 'CarBrandSelectScene',
                            component: CarBrandSelectScene,
                            params: {
                                checkedCarClick: this.checkedCarClick,
                                status: 0
                            }
                        })
                    }}/>);
            } else {
                let defValue = '';
                if (this.childItems[i].name == '客户姓名') {
                    defValue = this.props.data.custName ? this.props.data.custName : '';
                } else if (this.childItems[i].name == '手机号码') {
                    defValue = this.props.data.custPhone ? this.props.data.custPhone : '';
                    //this.childItems[i].value = defValue;
                } else if (this.childItems[i].name == '年龄') {
                    defValue = this.props.data.custAge ? this.props.data.custAge : '';
                    //this.childItems[i].value = defValue;
                } else if (this.childItems[i].name == '3日内回访') {
                    defValue = this.props.data.custThreevisit ? this.props.data.custThreevisit : '';
                    //this.childItems[i].value = defValue;
                } else if (this.childItems[i].name == '7日内回访') {
                    defValue = this.props.data.custSevenvisit ? this.props.data.custSevenvisit : '';
                    //this.childItems[i].value = defValue;
                } else if (this.childItems[i].name == '备注') {
                    defValue = this.props.data.custRemark ? this.props.data.custRemark : '';
                    //this.childItems[i].value = defValue;
                }
                items.push(<CustomerInfoInput
                    defValue={defValue}
                    callBack={this.userAireadyExist} key={i + 'bo'}
                    items={this.childItems[i]}/>);
            }

        }
        /*for (let i = 0; i < this.childItems.length; i++) {
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
         }}>dasdadada</Text>
         </View>
         <View style={{
         width: width,
         height: Pixel.getPixel(1),
         backgroundColor: fontAndColor.COLORA3
         }}/>
         </View>)
         }*/
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
                        allowFontScaling={false}>购车人信息</Text>
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
     *
     **/
    checkedCarClick = (carObject) => {
        //let title = carObject.series_id == 0 ? carObject.brand_name : carObject.series_name;
        let title = carObject.model_name;
        this.refs.models.setValue(title);
        this.childItems[8].value = title;
        this.checkedCarType.title = title;
        this.checkedCarType.brand_id = carObject.brand_id;
        this.checkedCarType.series_id = carObject.series_id;
        this.checkedCarType.model_id = carObject.model_id;
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
        if (this.type === 'birthday') {
            this.childItems[3].value = d;
            this.refs.birthday.setValue(d);
            this.setState({
                isDateTimePickerVisible: false
            });
        } else if (this.type === 'interview') {
            this.childItems[5].value = d;
            this.refs.interview.setValue(d);
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

const styles = StyleSheet.create({
    separatedLine: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15),
        height: 1,
        backgroundColor: fontAndColor.COLORA4
    },
    expButton: {
        marginBottom: Pixel.getPixel(20),
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(35),
        marginTop: Pixel.getPixel(16),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: fontAndColor.NAVI_BAR_COLOR
    },
    expText: {
        fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.NAVI_BAR_COLOR
    },
});
