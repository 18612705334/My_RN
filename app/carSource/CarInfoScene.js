import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Linking,
    InteractionManager,
    Dimensions,
    Modal,
    NativeModules,

} from 'react-native';

import *as fontAndColor from '../constant/FontAndColor';
import ImagePageView from 'react-native-viewpager';
import BaseComponent from '../component/BaseComponent';
import NavigationView from '../component/CarNavigationView';
import AllNavigationView from '../component/AllNavigationView';
import Gallery from 'react-native-gallery';
import {CarDeploySwitchoverButton, CarConfigurationView} from './znComponent/CarInfoAllComponent';
import CarZoomImageScene from './CarZoomImagScene';
import CarUpkeepScene from './CarUpkeepScene';
import AutoConfig from '../publish/AutoConfig';
import CarbreakRulesScene from './CarbreakRulesScene';
import CarReferencePriceScene from './CarReferencePriceScene';
import CarPriceAnalysisView from './znComponent/CarPriceAnalysisView';

import PixelUtil from '../utils/PixelUtils';
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";
import AccountModal from '../component/AccountModal'
import AccountManageScene from '../mine/accountManage/AccountTypeSelectScene'
import BindCardScene from '../mine/accountManage/BindCardScene'
import WaitActivationAccountScene from '../mine/accountManage/WaitActivationAccountScene'
import ProcurementOrderDetailScene from "../mine/myOrder/ProcurementOrderDetailScene";
import ExplainModal from "../mine/myOrder/component/ExplainModal";
import CarMyListScene from "./CarMyListScene";
import GetPermissionUtil from '../utils/GetRoleUtil';
import DeviceInfo from 'react-native-device-info'
import {SharedView} from './znComponent/SharedView'


let Platform = require('Platform');
const SystemVersion = DeviceInfo.getSystemVersion();
let getRole = new GetPermissionUtil();
const Pixel = new PixelUtil();

import {request} from "../utils/RequestUtil";
import * as AppUrls from "../constant/appUrls";
import MyBaseComponent from "../component/MyBaseComponent";
import SaasText from "../component/SaasText";

let {width, height} = Dimensions.get('window');
let resolveAssetSource = require('resolveAssetSource');
const IS_ANDROID = Platform.OS === 'android';
let shareClass = NativeModules.ZNShareClass;

const carParameterViewColor = [
    'rgba(5, 197, 194,0.15)',
    'rgba(58, 200, 126,0.15)',
    'rgba(47, 155, 250,0.15)',
];

const carParameterTextColor = [

    fontAndColor.COLORB0,
    fontAndColor.COLORB1,
    fontAndColor.COLORB4,

];

const carIconsData = [
    {
        title: '出厂日期',
        image: require('../../image/carSourceImages/factory.png'),
        imageHigh: require('../../image/carSourceImages/factory_h.png'),
    },
    {
        title: '初登日期',
        image: require('../../image/carSourceImages/rollout.png'),
        imageHigh: require('../../image/carSourceImages/rollout_h.png'),
    },
    {
        title: '表显里程',
        image: require('../../image/carSourceImages/mileage.png'),
        imageHigh: require('../../image/carSourceImages/mileage_h.png'),
    },
    {
        title: '过户次数',
        image: require('../../image/carSourceImages/transfer.png'),
        imageHigh: require('../../image/carSourceImages/transfer_h.png'),
    },
    {
        title: '使用性质',
        image: require('../../image/carSourceImages/operation.png'),
        imageHigh: require('../../image/carSourceImages/operation_h.png'),
    },
    {
        title: '车身/内饰颜色',
        image: require('../../image/carSourceImages/carColor.png'),
        imageHigh: require('../../image/carSourceImages/carColor_h.png'),
    },
];

let carConfigurationData = [];
let carImageArray = [];

let dataSource = new ImagePageView.DataSource({pageHasChanged: (r1, r2) => r1 !== r2})


export default class CarInfoScene extends MyBaseComponent {

    constructor(props) {
        super(props)
        this.state = {
            imageArray: dataSource.cloneWithPages([]),
            renderPlaceholderOnly: 'blank',
            residualsData: [],
            carData: {imgs: []},
            currentImageIndex: 1,
            switchoverCarInfo: 0,
        }
    }

    initFinish = () => {

        this.isUserBoss = false;
        this.setState({
            title: '车源详情'
        })

        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
            if (data.code === 1 && data.result != '') {
                let enters = JSON.parse(data.result);
                for (let item of enters.enterprise_list[0].role_type) {
                    if (item == 1 || item == 6) {
                        this.isUserBoss = true;
                        break;
                    }
                }
                getRole.getRoleList((data) => {
                    this.roleList = data;
                    this.loadData()
                })
            }
        })
    }

    loadData = () => {

        StorageUtil.mGetItem(StorageKeyNames.ENTERPRISE_LIST, (data) => {
            if (data.code == 1 && data.reuslt != '') {
                let enters = JSON.parse(data.result)
                let company_base_ids = '';
                for (let index in enters) {
                    company_base_ids = company_base_ids + enters[index].enterprise_uid;
                    if (enters.length > index + 1) {
                        company_base_ids = company_base_ids + ',';
                    }
                }
                this.loadCarData(company_base_ids);
            } else {
                this.loadCarData('')
            }
        });

    };


    loadCarData = (show_shop_id) => {
        request(AppUrls.CAR_DETAIL, 'POST', {
            id: this.props.carID,
            imageType: 1,
            shop_ids: show_shop_id
        }).then((response) => {
            let carData = response.mjson.data;
            this.loadCarResidualsData(carData);
            carData.carIconsContentData = [
                carData.manufacture != '' ? this.dateReversal(carData.manufacture + '000') : '',
                carData.init_reg != '' ? this.dateReversal(carData.init_reg + '000') : '',
                carData.mileage > 0 ? this.carMoneyChange(carData.mileage) + '万公里' : '',
                carData.transfer_times + '次',
                carData.nature_str,
                carData.car_color.split("|")[0] + '/' + carData.trim_color.split("|")[0],
            ];
            if (carData.imgs.length <= 0) {

                carData.imgs = [{require: require('../../image/carSourceImages/car_info_null.png')}];
            }

            for (let item of this.roleList) {
                if ((item.name === '手续员' || item.name === '评估师' || item.name === '整备员' || item.name === '经理' || item.name === '运营专员' || item.name === '合同专员' || item.name === '车管专员') && !this.isUserBoss) {
                    carData.show_order = 2;
                    break;
                }
            }

            this.setState({
                carData: carData,
                imageArray: dataSource.cloneWithPages(carData.imgs),
                renderPlaceholderOnly: 'success',
            })

        }, (error) => {

            this.setState({
                renderPlaceholderOnly: 'error',
            })
        })

    }

    loadCarResidualsData = (carData) => {

        request(AppUrls.CAR_GET_RESIDUALS, 'post', {
            id: this.props.carID,
            mile: carData.mileage,
            modelId: carData.model_id,
            regDate: this.dateReversal(carData.init_reg + '000'),
            zone: carData.city_id,

        }).then((response) => {

            if (response.mycode == 1) {
                this.setState({
                    residualsData: response.mjson.data,
                })
            }
        }, (error) => {
            console.log(error)
        });
    }


    dateReversal = (time) => {

        const date = new Date();
        date.setTime(time);
        return (date.getFullYear() + "-" + (this.PrefixInteger(date.getMonth() + 1, 2)));

    };

    PrefixInteger = (num, length) => {
        return (Array(length).join('0') + num).slice(-length);
    }


    allRefresh = () => {
        this.loadData();
    }

    renderView() {
        const carData = this.state.carData;

        let toTop = 0
        if (parseInt(SystemVersion) >= 11) {
            toTop = -20
        }


        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white',
            }}>

                <ScrollView
                    style={{marginTop: toTop, marginBottom: 40, backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,}}
                    scrollEventThrottle={200}
                    onScroll={(event) => {
                        this.setNavitgationBackgroundColor(event)
                    }}
                >

                    <ImagePageView
                        dataSource={this.state.imageArray}
                        renderPage={this._renderImagePage}
                        isLoop={true}
                        autoPlay={false}
                        locked={false}
                        renderPageIndicator={() => {
                            return (
                                <View style={styles.imageFootView}>
                                    <View style={{backgroundColor: 'rgba(0,0,0,.3)', borderRadius: 4,}}>
                                        <SaasText style={{
                                            backgroundColor: 'transparent',
                                            marginHorizontal: 7,
                                            marginVertical: 3,
                                            color: 'white'
                                        }}>
                                            {carData.v_type == 1 ? '车龄 ' + carData.init_coty : carData.v_type_str}
                                        </SaasText>
                                    </View>
                                    <SaasText style={{
                                        backgroundColor: 'transparent', color: 'white',
                                    }}>
                                        {this.state.currentImageIndex + '/' + this.state.carData.imgs.length}
                                    </SaasText>
                                </View>
                            )
                        }}
                        onChangePage={(index) => {
                            this.setState({
                                currentImageIndex: index + 1,
                            })
                        }}

                    />

                    <View style={{
                        backgroundColor: 'white',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: fontAndColor.COLORA4
                    }}>
                        <SaasText style={styles.title_text} numberOfLines={2}>{carData.model_name}</SaasText>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginHorizontal: 15,
                            marginBottom: 15
                        }}>

                            {
                                carData.dealer_price >= 0 && <View style={{flexDirection: 'row'}}>
                                    <SaasText style={{color: 'red', fontSize: 18}}>
                                        {this.carMoneyChange(carData.dealer_price) + '万'}
                                    </SaasText>

                                    {
                                        (carData.model_id != '0' && carData.city_id != '0' && carData.model_id != '' && carData.city_id != '') &&
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => {
                                                this.pushCarReferencePriceScene(carData)
                                            }}
                                        >
                                            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 15}}>
                                                <Image
                                                    source={require('../../image/carSourceImages/carPriceIcon.png')}/>
                                                <SaasText style={{color: 'red',}}>查看参考价</SaasText>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>
                            }

                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image style={{marginRight: 5}}
                                       source={require('../../image/carSourceImages/browse.png')}/>
                                <SaasText style={{
                                    fontSize: 13,
                                    color: fontAndColor.COLORA1
                                }}>{carData.views + '次浏览'}</SaasText>
                            </View>
                        </View>
                    </View>
                    {
                        ((typeof(carData.labels) != "undefined" ? (carData.labels.length <= 0 ? false : true) : false) || carData.describe !== '' || carData.city_name !== '' || carData.plate_number !== '') &&
                        <View style={{paddingVertical: 15, backgroundColor: 'white', alignItems: 'flex-start'}}>
                            {
                                (typeof(carData.labels) != "undefined" ? (carData.labels.length <= 0 ? false : true) : false) &&
                                <View style={{flexDirection: 'row', marginHorizontal: 15}}>
                                    {
                                        carData.labels.map((label, index) => {
                                            return (
                                                <View
                                                    key={index + ''}
                                                    style={{
                                                        backgroundColor: carParameterViewColor[index % 3],
                                                        borderRadius: 3,
                                                        marginRight: 5
                                                    }}>
                                                    <SaasText style={{
                                                        color: fontAndColor.NAVI_BAR_COLOR,
                                                        fontSize: 11,
                                                        margin: 3
                                                    }}>{label.name}</SaasText>
                                                </View>
                                            )
                                        })
                                    }
                                </View>

                            }
                            {
                                carData.describe != "" &&
                                <View
                                    style={{
                                        marginHorizontal: 15,
                                        marginVertical: 15,
                                        backgroundColor: 'rgba(158,158,158,0.15)',
                                        borderRadius: 3,
                                        padding: 4
                                    }}
                                >
                                    <SaasText style={{
                                        fontSize: 12,
                                        color: fontAndColor.COLORA2,
                                    }}>{carData.describe}</SaasText>
                                </View>
                            }

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginHorizontal: 15,
                                marginTop: 15
                            }}>

                                {
                                    carData.city_name !== '' &&
                                    <View style={{flexDirection: 'row', flex: 1}}>
                                        <SaasText style={{color: fontAndColor.COLORA1}}>所在地：</SaasText>
                                        <SaasText>{carData.provice_name + (carData.provice_name === carData.city_name ? " " : ("  " + carData.city_name))}</SaasText>
                                    </View>

                                }
                                {
                                    carData.plate_number !== '' &&
                                    <View style={{flexDirection: 'row'}}>
                                        <SaasText style={{color: fontAndColor.COLORA1}}>挂牌地：</SaasText>
                                        <SaasText>{carData.plate_number.substring(0, 2)}</SaasText>

                                    </View>
                                }
                            </View>

                        </View>

                    }

                    <View style={{marginTop: 10}}>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'white',}}>
                            {
                                carIconsData.map((data, index) => {
                                    return (
                                        <CarIconView
                                            imageData={data.image}
                                            imageHighData={data.imageHigh}
                                            title={data.title}
                                            content={carData.carIconsContentData && carData.carIconsContentData[index]}
                                            key={'carIconsData' + index}/>

                                    )
                                })
                            }
                        </View>
                        <View style={{backgroundColor: 'white', marginTop: 10,}}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.pushCarConfigScene()
                                }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    height: 45,
                                    borderBottomColor: fontAndColor.COLORA4,
                                    borderBottomWidth: StyleSheet.hairlineWidth
                                }}
                            >
                                <Image style={{marginHorizontal: 15}}
                                       source={require('../../image/carSourceImages/carConfigImg.png')}/>
                                <SaasText style={{textAlign: 'left', flex: 1}}>车辆配置信息</SaasText>
                                <Image style={{marginRight: 15}}
                                       source={require('../../image/mainImage/celljiantou.png')}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.pushCarUpkeepScene(carData.vin)
                                }}
                                style={{flexDirection: 'row', alignItems: 'center', height: 45,}}
                            >
                                <Image style={{marginHorizontal: 15}}
                                       source={require('../../image/carSourceImages/carConfigImg.png')}/>
                                <SaasText style={{textAlign: 'left', flex: 1}}>维修保养记录</SaasText>
                                <Image style={{marginRight: 15}}
                                       source={require('../../image/mainImage/celljiantou.png')}/>
                            </TouchableOpacity>

                            {
                                (carData.vin != '' && carData.city_id != '' && carData.engine_number != '' && carData.plate_number != '') && (


                                    <TouchableOpacity
                                        onPress={() => {
                                            this.pushCarUpkeepScene(carData)
                                        }}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            height: 45,
                                            borderTopColor: fontAndColor.COLORA4,
                                            borderTopWidth: StyleSheet.hairlineWidth
                                        }}
                                    >
                                        <Image style={{marginHorizontal: 15}}
                                               source={require('../../image/carSourceImages/carBreakIcon.png')}/>
                                        <SaasText style={{textAlign: 'left', flex: 1}}>违章记录</SaasText>
                                        <Image style={{marginRight: 15}}
                                               source={require('../../image/mainImage/celljiantou.png')}/>
                                    </TouchableOpacity>
                                )
                            }

                        </View>


                    </View>

                    {
                        this.state.residualsData.length > 0 && <CarPriceAnalysisView data={this.state.residualsData}/>
                    }
                </ScrollView>

                <View style={{
                    height: 50,
                    position: 'absolute',
                    flexDirection: 'row',
                    bottom: 0,
                    right: 0,
                    left: 0,
                    borderTopColor: fontAndColor.COLORA1,
                    borderTopWidth: StyleSheet.hairlineWidth,
                    backgroundColor: 'white'
                }}>
                    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                        <SaasText style={{marginBottom: 5}}>车源标号</SaasText>
                        <SaasText>{carData.serial_num}</SaasText>
                    </View>
                    <TouchableOpacity
                        style={{flex: 1}}
                        onPress={() => {
                            this.callClick(carData.show_shop_id)
                        }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                            borderRightColor: fontAndColor.COLORA1,
                            borderRightWidth: StyleSheet.hairlineWidth,
                            borderLeftColor: fontAndColor.COLORA1,
                            borderLeftWidth: StyleSheet.hairlineWidth
                        }}>
                            <Image style={{marginLeft: 5}}
                                   source={require('../../image/carSourceImages/phoneIcon.png')}/>
                            <SaasText>电话咨询</SaasText>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{flex: 1}}
                    >
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: fontAndColor.NAVI_BAR_COLOR,
                            flex: 1
                        }}>
                            <SaasText style={{color: 'white', fontSize: 15}}>订购</SaasText>
                        </View>
                    </TouchableOpacity>


                </View>

                <NavigationView
                    title={'车辆详情'}
                    ref="navtigation"
                    backIconClick={this.backPage}
                    wrapStyle={{backgroundColor: 'rgba(0,0,0,0)'}}
                    isStore={this.state.carData.is_collection == 0 ? false : true}
                    addStoreAction={this.addStoreAction}
                    cancelStoreAction={this.cancelStoreAction}
                    showShared={this.showShared}
                />

                <SharedView ref="sharedView" carData={this.state.carData} showToast={this.props.showToast}/>
                <CallView ref={(ref) => {
                    this.CallView = ref
                }}/>
            </View>
        )
    }

    // 轮播图

    _renderImagePage = (data, pageID) => {

        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={(data) => {
                    this.showPhotoView()
                }}
            >
                <Image style={{resizeMode: 'stretch', width: width, height: 250}}
                       source={typeof data.url == 'undefined' ? data.require : {uri: data.url + '?x-oss-process=image/resize,w_' + Math.ceil(width) + ',h_' + 555}}/>
            </TouchableOpacity>
        )

    }

    showPhotoView = (data) => {

        if (typeof this.state.carData.imgs[0].url == 'undefine') {
            this.props.showToast('没有图片')
            return;
        }

        this.toNextPage({
            name: "CarZoomImageScene",
            component: CarZoomImageScene,
            params: {
                images: this.state.carData.imgs,
                index: this.state.currentImageIndex - 1,
            }
        });
    }

    // 收藏
    addStoreAction = (isStoreClick) => {
        let url = AppUrls.BASEURL + 'v1/user.favorites/create';
        request(url, 'post', {
            id: this.state.carData.id
        }).then((response) => {
            if (response.mycode == 1) {
                isStoreClick(true)
                this.props.showToast('收藏成功')
            } else {
                this.props.showToast('收藏失败')
            }

        }, (error) => {
            this.props.showToast('收藏失败')

        })
    }

    // 取消收藏
    cancelStoreAction = (isStoreClick) => {
        let url = AppUrls.BASEURL + 'v1/user.favorites/delete';
        request(url, 'post', {
            id: this.state.carData.id
        }).then((response) => {
            if (response.mycode == 1) {
                isStoreClick(false)
                this.props.showToast('取消收藏')
            } else {
                this.props.showToast('取消收藏失败')
            }
        }, (error) => {
            this.props.showToast('取消收藏失败')

        })
    }

    // 分享
    showShared = () => {
        this.refs.sharedView.is_show(true)
    }

    setNavitgationBackgroundColor = (event) => {

        if (event.nativeEvent.contentOffset.y > 20) {
            this.refs.navtigation.setNavigationBackgroindColor(true);
        } else {
            this.refs.navtigation.setNavigationBackgroindColor(false);
        }
    }

    carMoneyChange = (carMoney) => {

        let newCarMoney = parseFloat(carMoney);
        let carMoneyStr = newCarMoney.toFixed(2);
        let moneyArray = carMoneyStr.split(".");

        // console.log(carMoney+'/'+newCarMoney +'/' + carMoneyStr +'/' +moneyArray);

        if (moneyArray.length > 1) {
            if (moneyArray[1] > 0) {

                return moneyArray[0] + '.' + moneyArray[1];

            } else {

                return moneyArray[0];
            }

        } else {
            return carMoneyStr;
        }
    }


    // 查看参考价
    pushCarReferencePriceScene = (carData) => {
        this.toNextPage({
            name: "CarReferencePriceScene",
            component: CarReferencePriceScene,
            params: {
                city_id: carData.city_id,
                mileage: carData.mileage,
                model_id: carData.model_id,
                init_reg: this.dateReversal(carData.init_reg + '000'),
                from: 'CarInfoScene'
            }
        });
    }

    // 车辆配置信息
    pushCarConfigScene = () => {
        let navigationParams = {
            name: "AutoConfig",
            component: AutoConfig,
            params: {

                modelID: this.state.carData.model_id,
                carConfiguraInfo: this.state.carData.modification_instructions,
                carConfigurationData: carConfigurationData,
                renderCarConfigurationDataAction: this.renderCarConfigDataAction,
            }
        }
        this.toNextPage(navigationParams);

    }

    renderCarConfigDataAction = (data) => {
        carConfigurationData = data;
        console.log(data);
    }

    //车辆保养记录
    pushCarUpkeepScene = (vin) => {

        let navigationParams = {
            name: "CarUpkeepScene",
            component: CarUpkeepScene,
            params: {
                vin: vin,
                carData: this.state.carData
            }
        }
        this.toNextPage(navigationParams);
    }

    callClick(show_shop_id) {
        request(AppUrls.CAR_CUSTOMER_PHONE_NUMBER, 'post', {'enterprise_uid': show_shop_id}).then((response) => {
            // this.props.showModal(false);
            if (response.mjson.code == 1) {
                // Linking.openURL('tel:'+response.mjson.data.phone);
                this.CallView.isVisible(true, response.mjson.data);


            } else {
                this.props.showToast(response.mjson.msg);
            }
        }, (error) => {
            this.props.showToast(error.msg);
        });

    }

}

class CarIconView extends Component {

    render() {
        const {imageData, imageHighData, title, content} = this.props;
        const bool = (content && content !== '/' && content !== '次' && content !== '万公里') ? true : false;
        return (
            <View style={{width: width / 3, height: width / 3, alignItems: 'center', justifyContent: 'center'}}>
                <Image source={bool ? imageHighData : imageData}/>
                <SaasText style={{color: 'black', marginVertical: 5}}>{title}</SaasText>
                <SaasText style={{color: fontAndColor.COLORA1}}>{content}</SaasText>
            </View>
        )
    }
}


class CallView extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isVisible: false
        }


    }

    isVisible(isVisible, data) {
        this.setState({
            isVisible: isVisible,
            callData: data
        })
    }

    render() {

        if (!this.state.isVisible) {
            return null
        }

        return (
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,.4)',
                    width: width,
                    height: height,
                }}
                onPress={()=>{
                    this.isVisible(false, null);
                }}
            >
                <View style={{backgroundColor: 'white', borderRadius: 3, paddingVertical: 30, paddingHorizontal: 15}}>

                    {
                        this.state.callData.phone !== '' &&
                        <TouchableOpacity
                            onPress={()=>{
                                this.callAction(this.state.callData.phone)
                            }}


                        >
                            <View style={{
                                borderColor: fontAndColor.NAVI_BAR_COLOR,
                                flexDirection: 'row',
                                justifyContent: "center",
                                borderRadius: 3,
                                borderWidth:1,
                                paddingVertical:5,
                                paddingHorizontal:40
                            }}>
                                <Image source={require('../../image/carSourceImages/phoneIcon.png')}/>
                                <SaasText
                                    style={{color: fontAndColor.NAVI_BAR_COLOR}}
                                >
                                    咨询第1车贷客服
                                </SaasText>
                            </View>
                        </TouchableOpacity>

                    }
                    {
                        this.state.callData.shopsNumber !== "" &&
                        <TouchableOpacity
                            onPress={()=>{
                                this.callAction(this.state.callData.shopsNumber)
                            }}


                        >
                            <View style={{
                                borderColor: fontAndColor.NAVI_BAR_COLOR,
                                flexDirection: 'row',
                                justifyContent: "center",
                                borderRadius: 3,
                                borderWidth:1,
                                paddingVertical:5,
                                paddingHorizontal:40
                            }}>
                                <Image source={require('../../image/carSourceImages/phoneIcon.png')}/>
                                <SaasText
                                    style={{color: fontAndColor.NAVI_BAR_COLOR}}
                                >
                                    咨询商家
                                </SaasText>
                            </View>
                        </TouchableOpacity>
                    }


                </View>
            </TouchableOpacity>
        )
    }

    callAction(number){
        this.isVisible(false, this.state.callData);
        if(Platform.OS==='android'){
            NativeModules.VinScan.callPhone(number);
        }else{
            Linking.openURL('tel:' + number);
        }



    }


}


const styles = StyleSheet.create({

    title_text: {
        fontSize: 20,
        marginHorizontal: 15,
        marginVertical: 10
    },

    imageFootView: {

        height: Pixel.getPixel(50),
        right: Pixel.getPixel(15),
        bottom: 0,
        left: Pixel.getPixel(15),
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },

    carAgeView: {

        paddingHorizontal: Pixel.getPixel(10),
        paddingVertical: Pixel.getPixel(5),
        backgroundColor: 'rgba(1,1,1,0.3)',
        borderRadius: 3,

    },


    carAgeText: {

        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT),
        backgroundColor: 'transparent'
    },


    imageIndexText: {

        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        backgroundColor: 'transparent'


    },
})