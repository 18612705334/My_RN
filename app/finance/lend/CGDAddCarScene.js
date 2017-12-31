/**
 * Created by Administrator on 2017/3/22.
 */
import React from 'react';
import {
    View,
    Image,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    NativeModules,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
}from 'react-native';

import Picker from 'react-native-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import BaseComponent from '../../component/BaseComponent';
import AllNavigationView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';
const Pixel = new PixelUtil();
import CGDCarColor from './CGDCarColor';
import CarBrandSelectScene from '../../carSource/CarBrandSelectScene';
import CityListScene from '../../carSource/CityListScene';
import VinInfo from './component/VinInfo';
import * as Net from '../../utils/RequestUtil';
import * as AppUrls from '../../constant/appUrls';
import PurchasePickerScene from './PurchasePickerScene';
import SelectPeopleScene from './SelectPeopleScene';
const selectImg = require('../../../image/financeImages/celljiantou.png');
const scanImg = require('../../../image/financeImages/scan.png');

const IS_ANDROID = Platform.OS === 'android';


export default class CGDAddCarScene extends BaseComponent {

    constructor(props) {
        super(props);
        this.is_exists = true;
        this.carData = {
            sell_city_id: '',
            brand_id: '',
            model_id: '',
            series_id: '',
            frame_number: '',
            car_color: '',
            mileage: '',
            init_reg: '',
            rev_user_id: '',
            register_user_id: '',
            purchas_price: '',
            file_list: '',
            bind_type: this.props.isOBD,
            obd_number: '',
            payment_id: '',
            base_id: '',
            info_id: '',
            isCarinvoice: this.props.isCarinvoice,
            obd_bind_status: '0'
        };

        this.scanType = [
            {model_name: '扫描前风挡'},
            {model_name: '扫描行驶证'}
        ];
        this.state = {
            city_name: '请选择',
            modelName: '请选择',
            car_color: '请选择',
            init_reg: '请选择',
            carReceive: '请选择',
            carRegister: '请选择'
        };
        if (this.props.paymentId) {
            this.carData.payment_id = this.props.paymentId;
        }
    }

    initFinish = () => {

        this._showLoading();
        let peopleParams = {
            api: AppUrls.GET_BUSINESS_LIST,
        };
        Net.request(AppUrls.FINANCE, 'post', peopleParams).then(
            (response) => {
                if (response.mycode === 1) {
                    let rdb = response.mjson.data;
                    console.log('=====================>>>>>>>>>');
                    console.log(rdb);
                    if (rdb.rev_user_list.length === 0) {
                        this._showHint('请先配置收车人');
                        this.timer = setTimeout(
                            () => {
                                this._onBack();
                            },
                            1000
                        );
                        return;
                    } else {
                        this.revData = rdb.rev_user_list;
                        this.revShowData = rdb.rev_user_list.map((rev) => {
                            return (rev.name + '(' + rev.cardid + ')');
                        });
                    }
                    if (rdb.reg_user_list.length === 0) {
                        this._showHint('请先配置登记人');
                        this.timer = setTimeout(
                            () => {
                                this._onBack();
                            },
                            1000
                        );
                        return;
                    } else {
                        this.regData = rdb.reg_user_list;
                        this.regShowData = rdb.reg_user_list.map((reg) => {
                            return (reg.name + '(' + reg.cardid + ')');
                        });
                    }

                    if (this.props.updateCar && this.props.updateCar === true) {
                        let detailParams = {
                            api: AppUrls.PURCHA_AUTO_DETAIL,
                            info_id: this.props.InfoId
                        };
                        Net.request(AppUrls.FINANCE, 'post', detailParams).then(
                            (response2) => {
                                if (response2.mycode === 1) {
                                    this._closeLoading();
                                    let rdb2 = response2.mjson.data.detail;

                                    let dt = this.dateReversal(rdb2.init_reg);
                                    this.carData.sell_city_id = rdb2.city_id;
                                    this.carData.brand_id = rdb2.brand_id;
                                    this.carData.model_id = rdb2.model_id;
                                    this.carData.series_id = rdb2.series_id;
                                    this.carData.frame_number = rdb2.frame_number;
                                    this.carData.car_color = rdb2.car_color;
                                    this.carData.mileage = rdb2.mileage + '';
                                    this.carData.init_reg = dt;
                                    this.carData.rev_user_id = rdb2.rev_user_id;
                                    this.carData.register_user_id = rdb2.register_user_id;
                                    this.carData.purchas_price = rdb2.purchas_price;
                                    this.carData.file_list = rdb2.file_list;
                                    this.carData.obd_number = rdb2.obd_number;
                                    this.carData.base_id = rdb2.base_id;
                                    this.carData.info_id = rdb2.info_id;
                                    this.carData.obd_bind_status = rdb2.obd_bind_status;

                                    this.setState({
                                        city_name: rdb2.city_name,
                                        modelName: rdb2.model_name,
                                        car_color: rdb2.car_color,
                                        init_reg: dt,
                                        carReceive: rdb2.rev_user_name,
                                        carRegister: rdb2.register_user_name
                                    });

                                    this.vinInput.setNativeProps({
                                        text: rdb2.frame_number + ''
                                    });

                                    this.milInput.setNativeProps({
                                        text: rdb2.mileage + ''
                                    });

                                    this.priceInput.setNativeProps({
                                        text: rdb2.purchas_price + ''
                                    });

                                    this.is_exists = false;
                                }
                            },
                            (error) => {
                                this.is_exists = true;
                                if (IS_ANDROID === true) {
                                    this._showHint('获取车辆数据失败');
                                } else {
                                    this.timer = setTimeout(
                                        () => {
                                            this._showHint('获取车辆数据失败');
                                        },
                                        500
                                    );
                                }
                            }
                        );
                    }
                    this._closeLoading();
                }
            },
            (error) => {
                this._closeLoading();
                if (IS_ANDROID === true) {
                    this._showHint('获取收车人失败');
                } else {
                    this.timer = setTimeout(
                        () => {
                            this._showHint('获取收车人失败');
                        },
                        500
                    );
                }
                this.timer = setTimeout(
                    () => {
                        this._onBack();
                    },
                    1000
                );
            }
        );
    };

    _showLoading = () => {
        this.props.showModal(true);
    };

    _closeLoading = () => {
        this.props.showModal(false);
    };

    //提示信息
    _showHint = (hint) => {
        this.props.showToast(hint);
    };

    _onCityPress = () => {
        let navigatorParams = {
            name: "CityListScene",
            component: CityListScene,
            params: {
                checkedCityClick: this._checkedCityClick,
            }
        };
        this.toNextPage(navigatorParams);
    };

    _checkedCityClick = (cityObj) => {
        this.setState({
            city_name: cityObj.city_name
        });
        this.carData.sell_city_id = cityObj.city_id;
    };

    _onModelPress = () => {
        let brandParams = {
            name: 'CarBrandSelectScene',
            component: CarBrandSelectScene,
            params: {
                checkedCarClick: this._checkedCarClick,
                status: 0,
            }
        };
        this.toNextPage(brandParams);
    };

    _checkedCarClick = (carObject) => {
        this.setState({
            modelName: carObject.model_name
        });
        this.carData.brand_id = carObject.brand_id;
        this.carData.model_id = carObject.model_id;
        this.carData.series_id = carObject.series_id;
    };

    _onScanPress = () => {
        this.vinModal.openModal();
    };

    _vinPress = (index) => {
        if (IS_ANDROID === true) {
            NativeModules.VinScan.scan(parseInt(index)).then((vl) => {
                this.vinInput.setNativeProps({
                    text: vl
                });
                this._onVinChange(vl);
            }, (error) => {
            });
        } else {
            this.timer = setTimeout(
                () => {
                    NativeModules.VinScan.scan(parseInt(index)).then((vl) => {
                        this.vinInput.setNativeProps({
                            text: vl
                        });
                        this._onVinChange(vl);
                    }, (error) => {
                    });
                },
                500
            );
        }
    };

    _onVinChange = (text) => {
        if (text.length === 17) {
            this.carData.frame_number = text;
            this._showLoading();
            let vinParams;
            if (this.props.updateCar && this.props.updateCar === true) {
                vinParams = {
                    api: AppUrls.PURCHA_CHECK_IN,
                    frame_number: text,
                    base_id: this.carData.baseID
                };
            } else {
                vinParams = {
                    api: AppUrls.PURCHA_CHECK_IN,
                    frame_number: text
                };
            }

            Net.request(AppUrls.FINANCE, 'post', vinParams).then(
                (response) => {
                    if (response.mycode === 1) {
                        let rdb = response.mjson.data;
                        this._closeLoading();
                        if (rdb.is_exists == 1) {
                            if (IS_ANDROID === true) {
                                this._showHint('车架号已存在');
                            } else {
                                this.timer = setTimeout(
                                    () => {
                                        this._showHint('车架号已存在');
                                    },
                                    500
                                );
                            }
                            this.is_exists = true;
                        } else {
                            this.is_exists = false;
                        }
                    }
                },
                (error) => {
                    if (IS_ANDROID === true) {
                        this._showHint('车架号校验失败');
                    } else {
                        this.timer = setTimeout(
                            () => {
                                this._showHint('车架号校验失败');
                            },
                            500
                        );
                    }
                    this.is_exists = true;
                }
            );
        }
    };

    _onMileageChange = (text) => {
        this.carData.mileage = text;
    };

    _onPriceChange = (text) => {
        this.carData.purchas_price = text;
    };

    _onColorPress = () => {
        let colorParams = {
            name: 'CGDCarColor',
            component: CGDCarColor,
            params: {selectColor: this._colorSelected}
        };

        this.toNextPage(colorParams);
    };

    _colorSelected = (color) => {
        this.carData.car_color = color;
        this.setState({car_color: color});
    };

    _onDatePress = () => {
        this.setState({
            isDateTimePickerVisible: true,
        });
    };

    _handleDatePicked = (date) => {
        let d = this.dateFormat(date, 'yyyy-MM-dd');
        this.carData.init_reg = d;
        this.setState({init_reg: d});

        this._hideDateTimePicker();
    };

    _hideDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: false});
    };

    _onReceiverPress = () => {
        this.toNextPage({
            name: 'SelectPeopleScene', component: SelectPeopleScene,
            params: {
                regShowData: this.revShowData, title: '收车人', callBack: (data) => {
                    let sel;
                    this.revShowData.map((dt, i) => {
                        if (dt === data) {
                            sel = i;
                        }
                    });
                    this.carData.rev_user_id = this.revData[sel].bussiness_id;
                    this.setState({
                        carReceive: this.revData[sel].name
                    });
                }
            }
        });
        // Picker.init({
        //     pickerData: this.revShowData,
        //     pickerConfirmBtnText: '确定',
        //     pickerCancelBtnText: '取消',
        //     pickerTitleText: '收车人',
        //     pickerConfirmBtnColor: [69, 205, 203, 1],
        //     pickerCancelBtnColor: [69, 205, 203, 1],
        //     pickerTitleColor: [0, 0, 0, 1],
        //     pickerBg: [247, 250, 252, 1],
        //     pickerToolBarFontSize: 17,
        //     pickerFontSize: 19,
        //     pickerFontColor: [0, 0, 0, 1],
        //     selectedValue: [0],
        //     onPickerConfirm: (data) => {
        //         if (IS_ANDROID === true) {
        //             let sel;
        //             this.revShowData.map((dt, i) => {
        //                 if (dt === data[0]) {
        //                     sel = i;
        //                 }
        //             });
        //             this.carData.rev_user_id = this.revData[sel].bussiness_id;
        //             this.setState({
        //                 carReceive: this.revData[sel].name
        //             });
        //         }else{
        //             this.carData.rev_user_id = this.revData[data].bussiness_id;
        //             this.setState({
        //                 carReceive: this.revData[data].name
        //             });
        //         }
        //     },
        //     onPickerCancel: (data) => {
        //     },
        //     onPickerSelect: (data) => {
        //     }
        // });
        // Picker.show();
    };

    _onRegisterPress = () => {
        this.toNextPage({
            name: 'SelectPeopleScene', component: SelectPeopleScene,
            params: {
                regShowData: this.regShowData, title: '登记人', callBack: (data) => {
                    let sel;
                    this.regShowData.map((dt, i) => {
                        if (dt === data) {
                            sel = i;
                        }
                    });
                    this.carData.register_user_id = this.regData[sel].bussiness_id;
                    this.setState({
                        carRegister: this.regData[sel].name
                    });
                }
            }
        });
        // Picker.init({
        //     pickerData: this.regShowData,
        //     pickerConfirmBtnText: '确定',
        //     pickerCancelBtnText: '取消',
        //     pickerTitleText: '登记人',
        //     pickerConfirmBtnColor: [69, 205, 203, 1],
        //     pickerCancelBtnColor: [69, 205, 203, 1],
        //     pickerTitleColor: [0, 0, 0, 1],
        //     pickerBg: [247, 250, 252, 1],
        //     pickerToolBarFontSize: 17,
        //     pickerFontSize: 19,
        //     pickerFontColor: [0, 0, 0, 1],
        //     selectedValue: [0],
        //     onPickerConfirm: (data) => {
        //         if (IS_ANDROID === true) {
        //             let sel;
        //             this.regShowData.map((dt, i) => {
        //                 if (dt === data[0]) {
        //                     sel = i;
        //                 }
        //             });
        //             this.carData.register_user_id = this.regData[sel].bussiness_id;
        //             this.setState({
        //                 carRegister: this.regData[sel].name
        //             });
        //         }else{
        //             this.carData.register_user_id = this.regData[data].bussiness_id;
        //             this.setState({
        //                 carRegister: this.regData[data].name
        //             });
        //         }
        //
        //     },
        //     onPickerCancel: (data) => {
        //     },
        //     onPickerSelect: (data) => {
        //     }
        // });
        // Picker.show();
    };

    _onBack = () => {
        this.backPage();
    };

    _onOKPress = () => {

        if (this.is_exists === true) {
            this._showHint('车架号有误');
            return;
        }
        if (this.isEmpty(this.carData.sell_city_id) === true) {
            this._showHint('请选择出售城市');
            return;
        }
        if (this.isEmpty(this.carData.model_id) === true) {
            this._showHint('请选择车型');
            return;
        }
        if (this.isEmpty(this.carData.car_color) === true) {
            this._showHint('请选择外观颜色');
            return;
        }
        if (this.isEmpty(this.carData.mileage) === true) {
            this._showHint('请填写行驶里程');
            return;
        }
        if (this.isEmpty(this.carData.init_reg) === true) {
            this._showHint('请选择首次上牌时间');
            return;
        }
        if (this.isEmpty(this.carData.rev_user_id) === true) {
            this._showHint('请选择收车人');
            return;
        }
        if (this.isEmpty(this.carData.register_user_id) === true) {
            this._showHint('请选择登记人');
            return;
        }
        if (this.isEmpty(this.carData.purchas_price) === true) {
            this._showHint('请填写收购价');
            return;
        }

        let upd = false;
        if (this.props.updateCar && this.props.updateCar === true) {
            upd = true;
        }

        let pickerParams = {
            name: 'PurchasePickerScene',
            component: PurchasePickerScene,
            params: {
                carData: this.carData, updateCar: upd, backRefresh: () => {
                    this.props.backRefresh();
                }
            }
        };


        this.toNextPage(pickerParams);

    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={25}>
                        <AllNavigationView
                            backIconClick={this._onBack}
                            title='车辆信息'
                        />

                        <View style={[styles.itemBackground, styles.alignTop]}>
                            <Text allowFontScaling={false}  style={styles.leftFont}>出售城市</Text>
                            <View style={styles.fillSpace}/>
                            <TouchableOpacity onPress={this._onCityPress}>
                                <View style={styles.rightContainer}>
                                    <Text allowFontScaling={false}  style={styles.selectHintFont}>{this.state.city_name}</Text>
                                    <Image style={styles.selectImage} source={selectImg}/>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.splitItem}/>
                        <View style={styles.itemBackground}>
                            <Text allowFontScaling={false}  style={styles.leftFont}>选择车型</Text>
                            <View style={styles.fillSpace}/>
                            <TouchableOpacity onPress={this._onModelPress}>
                                <View style={styles.rightContainer}>
                                    <Text allowFontScaling={false}  style={styles.selectHintFont}>{this.state.modelName}</Text>
                                    <Image style={styles.selectImage} source={selectImg}/>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.itemBackground, styles.alignItem]}>
                            <Text allowFontScaling={false}  style={styles.leftFont}>车架号</Text>
                            <TextInput
                                ref={(input) => {
                                    this.vinInput = input
                                }}
                                style={[styles.inputHintFont, styles.fillSpace]}
                                underlineColorAndroid='transparent'
                                maxLength={17}
                                onChangeText={this._onVinChange}
                                placeholder='请输入'
                                placeholderTextColor={fontAndColor.COLORA1}
                            />
                            <TouchableOpacity onPress={this._onScanPress}>
                                <Image style={styles.scanImage} source={scanImg}/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.splitItem}/>
                        <View style={styles.itemBackground}>
                            <Text allowFontScaling={false}  style={styles.leftFont}>外观颜色</Text>
                            <View style={styles.fillSpace}/>
                            <TouchableOpacity onPress={this._onColorPress}>
                                <View style={styles.rightContainer}>
                                    <Text allowFontScaling={false}  style={styles.selectHintFont}>{this.state.car_color}</Text>
                                    <Image style={styles.selectImage} source={selectImg}/>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.splitItem}/>
                        <View style={styles.itemBackground}>
                            <Text allowFontScaling={false}  style={styles.leftFont}>行驶里程</Text>
                            <TextInput
                                ref={(input) => {
                                    this.milInput = input
                                }}
                                style={[styles.inputHintFont, styles.fillSpace]}
                                underlineColorAndroid='transparent'
                                keyboardType='numeric'
                                onChangeText={this._onMileageChange}
                                placeholder='请输入'
                                placeholderTextColor={fontAndColor.COLORA1}
                            />
                            <Text allowFontScaling={false}  style={styles.rightHintFont}>万公里</Text>
                        </View>

                        <View style={styles.splitItem}/>
                        <View style={styles.itemBackground}>
                            <Text allowFontScaling={false}  style={styles.leftFont}>首次上牌时间</Text>
                            <View style={styles.fillSpace}/>
                            <TouchableOpacity onPress={this._onDatePress}>
                                <View style={styles.rightContainer}>
                                    <Text allowFontScaling={false}  style={styles.selectHintFont}>{this.state.init_reg}</Text>
                                    <Image style={styles.selectImage} source={selectImg}/>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.splitItem}/>
                        <View style={styles.itemBackground}>
                            <Text allowFontScaling={false}  style={styles.leftFont}>收车人</Text>
                            <View style={styles.fillSpace}/>
                            <TouchableOpacity onPress={this._onReceiverPress}>
                                <View style={styles.rightContainer}>
                                    <Text allowFontScaling={false}  style={styles.selectHintFont}>{this.state.carReceive}</Text>
                                    <Image style={styles.selectImage} source={selectImg}/>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.splitItem}/>
                        <View style={styles.itemBackground}>
                            <Text allowFontScaling={false}  style={styles.leftFont}>登记人</Text>
                            <View style={styles.fillSpace}/>
                            <TouchableOpacity onPress={this._onRegisterPress}>
                                <View style={styles.rightContainer}>
                                    <Text allowFontScaling={false}  style={styles.selectHintFont}>{this.state.carRegister}</Text>
                                    <Image style={styles.selectImage} source={selectImg}/>
                                </View>
                            </TouchableOpacity>
                        </View>


                        <View style={[styles.itemBackground, styles.alignItem]}>
                            <Text allowFontScaling={false}  style={styles.leftFont}>收购价</Text>
                            <TextInput
                                ref={(input) => {
                                    this.priceInput = input
                                }}
                                style={[styles.inputHintFont, styles.fillSpace]}
                                underlineColorAndroid='transparent'
                                keyboardType='numeric'
                                onChangeText={this._onPriceChange}
                                placeholder='请输入'
                                placeholderTextColor={fontAndColor.COLORA1}
                            />
                            <Text allowFontScaling={false}  style={styles.rightHintFont}>万元</Text>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>

                <View style={styles.fillSpace}>
                    <TouchableOpacity style={styles.btnOk} activeOpacity={0.6} onPress={this._onOKPress}>
                        <Text allowFontScaling={false}  style={styles.btnFont}>确定</Text>
                    </TouchableOpacity>
                </View>
                <DateTimePicker
                    titleIOS="请选择日期"
                    confirmTextIOS='确定'
                    cancelTextIOS='取消'
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
                <VinInfo viewData={this.scanType} vinPress={this._vinPress} ref={(modal) => {
                    this.vinModal = modal
                }}/>
            </View>
        )
    }

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

    isEmpty = (str) => {
        if (typeof(str) != 'undefined' && str !== '') {
            return false;
        } else {
            return true;
        }
    };

    dateReversal = (time) => {
        const date = new Date();
        date.setTime(time + '000');
        let year = date.getFullYear();
        let month = (date.getMonth() + 1) + '';
        let day = date.getDay() + '';
        if (month.length == 1) month = '0' + month;
        if (day.length == 1) day = '0' + day;
        return (year + "-" + month + "-" + day);
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3,
    },
    alignTop: {
        marginTop: Pixel.getPixel(59)
    },
    alignItem: {
        marginTop: Pixel.getPixel(10)
    },
    itemBackground: {
        flexDirection: 'row',
        height: Pixel.getPixel(44),
        backgroundColor: 'white',
        paddingHorizontal: Pixel.getPixel(15),
        alignItems: 'center'
    },
    splitItem: {
        height: Pixel.getPixel(0.5),
        backgroundColor: fontAndColor.COLORA4
    },
    leftFont: {
        fontSize: Pixel.getFontPixel(14),
        color: 'black'
    },
    fillSpace: {
        flex: 1
    },
    selectHintFont: {
        fontSize: Pixel.getFontPixel(14),
        color: fontAndColor.COLORA2,
        textAlign: 'right'
    },
    inputHintFont: {
        fontSize: Pixel.getFontPixel(14),
        color: 'black',
        textAlign: 'right'
    },
    selectImage: {
        height: Pixel.getPixel(16),
        width: Pixel.getPixel(9),
        marginLeft: Pixel.getPixel(13)
    },
    scanImage: {
        height: Pixel.getPixel(18),
        width: Pixel.getPixel(18),
        marginLeft: Pixel.getPixel(8)
    },
    rightContainer: {
        height: Pixel.getPixel(44),
        flexDirection: 'row',
        alignItems: 'center'
    },
    rightHintFont: {
        fontSize: Pixel.getFontPixel(14),
        color: 'black',
        marginLeft: Pixel.getPixel(8)
    },
    btnOk: {
        height: Pixel.getPixel(44),
        marginHorizontal: Pixel.getPixel(15),
        backgroundColor: fontAndColor.COLORB0,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Pixel.getPixel(15),
        borderRadius: Pixel.getFontPixel(2),
    },
    btnFont: {
        fontSize: Pixel.getFontPixel(15),
        color: 'white'
    }
});