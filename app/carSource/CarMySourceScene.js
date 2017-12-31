import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    ListView,
    ScrollView,
    RefreshControl,
    InteractionManager,
    Image,
    NativeModules,
} from 'react-native';

import BaceComponent from '../component/BaseComponent';
import MyBaseNaviComponent from '../component/MyBaseNaviComponent';
import MyBaseComponent from '../component/MyBaseComponent';
import NavigatorView from '../component/AllNavigationView';
import ListFooter from './znComponent/LoadMoreFooter';
import SGListView from 'react-native-sglistview';
import CarInfoScene from './CarInfoScene';
import AccountModal from '../component/AccountModal'
import EditCarScene from '../publish/EditCarScene'
import MyCarCell from './znComponent/MyCarCell';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import RepaymenyTabBar from '../finance/repayment/component/RepaymenyTabBar';
import NewCarScene from '../publish/NewCarScene';
import * as fontAndColor from '../constant/FontAndColor';
import * as AppUrls from "../constant/appUrls";
import {request} from '../utils/RequestUtil';
import CarPublishFirstScene from './carPublish/CarPublishFirstScene';
import {LendSuccessAlert} from '../finance/lend/component/ModelComponent'
import PixelUtil from '../utils/PixelUtils';
import * as weChat from "react-native-wechat";
import CarSharedListScene from "./CarSharedListScene";
import CarDealInfoScene from "./CarDealInfoScene";
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";
import SaasText from "../component/SaasText";

const Pixel = new PixelUtil();
let ScreenWidth = Dimensions.get('window').width;
let shareClass = NativeModules.ZNShareClass;
let Platform = require('Platform');
const IS_ANDROID = Platform.OS === 'android';

let carUpperFrameData = [];
let carDropFrameData = [];
let carAuditData = [];

let carUpperFramePage = 1;
let carUpperFrameStatus = 1;

let carDropFramePage = 1;
let carDropFrameStatus = 1;

let carAuditPage = 1;
let carAuditStatus = 1;

export default class CarMySourceScene extends MyBaseNaviComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isShowManageView: false,
            isShowCarSharedView: false,
            renderPlaceholderOnly: 'blank',
            shelves_count: 0,
            sold_count: 0,
            no_shelves_count: 0,
        };
    }

    initFinish = () => {
        this.setState({
            title: '库存车辆'
        })
        this.loadHeadData();
    }

    allRefresh = () => {
        this.loadHeadData();
    }

    loadHeadData = (action) => {

        this.setState({renderPlaceholderOnly: 'loading'});
        request(AppUrls.CAR_USER_CAR, 'post', {
            car_status: '1',
            page: 1,
            row: 1,
        }).then((response) => {
            let data = response.mjson.data.total;
            this.setState({
                renderPlaceholderOnly: 'success',
                shelves_count: data.shelves_count,
                sold_count: data.sold_count,
                no_shelves_count: data.no_shelves_count,
            });
            action && action();

        }, (error) => {
            this.setState({
                renderPlaceholderOnly: 'error',
            });
        });
    }

    carCellClick = (carData) => {
        let navigatorParams = {
            name: "CarInfoScene",
            component: CarInfoScene,
            params: {
                carID: carData.id,
            }
        };
        this.toNextPage(navigatorParams);

    }

    renderView() {
        return (
            <View style={{flex: 1, backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,marginTop:Pixel.getTitlePixel(64)}}>
                <ScrollableTabView

                    locked={true}
                    initialPage={this.props.page ? this.props.page : 0}
                    renderTabBar={() => <RepaymenyTabBar style={{backgroundColor: 'white'}}
                                                         tabName={["在售车源(" + this.state.shelves_count + ")", "已售车源(" + this.state.sold_count + ')', "未上架车源(" + this.state.no_shelves_count + ')']}/>}>

                    <MyCarSourceUpperFrameView ref="upperFrameView" carCellClick={this.carCellClick}
                                               footButtonClick={this.footButtonClick} tabLabel="ios-paper1"/>
                    <MyCarSourceDropFrameView ref="dropFrameView" carCellClick={this.carCellClick}
                                              footButtonClick={this.footButtonClick} tabLabel="ios-paper2"/>
                    <MyCarSourceAuditView ref="auditView" carCellClick={this.carCellClick}
                                          footButtonClick={this.footButtonClick} tabLabel="ios-paper3"/>

                </ScrollableTabView>

                <TouchableOpacity
                    onPress={this.pushNewCarScene}
                    style={{
                        backgroundColor: fontAndColor.NAVI_BAR_COLOR,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 15,
                    }}
                >
                    <SaasText style={{color: 'white', fontSize: 13}}>
                        发布车源
                    </SaasText>
                </TouchableOpacity>

                {
                    this.state.isShowManageView && <ManageView offClick={() => {
                        this.setState({isShowManageView: false})
                    }} manageBtnClick={this.manageViewBtnClick}/>
                }
                {
                    this.state.isShowCarSharedView && <CarSharedView offClick={()=>{this.setState({isShowCarSharedView:false})}} carSharedBtnClick={this.carSharedBtnClick} isShowMore={this.carData.img!=''?true:false}/>
                }
                <AccountModal ref="accountmodal"/>
            </View>
        )
    }

    carDelete=(carID)=>{
        this.props.showModal(true);
        let url = AppUrls.CAR_DELETE;
        request(url, 'post', {

            id: carID,

        }).then((response) => {

            this.props.showModal(false);
            this.upAllData();
            this.props.showToast('已删除该车辆');

        }, (error) => {
            this.props.showToast(error.mjson.msg);
        });
    }

    pushNewCarScene = () => {

        let navigatorParams = {

            name: "CarPublishFirstScene",
            component: CarPublishFirstScene,
            params: {}
        };
        this.toNextPage(navigatorParams);
    }

    carRefreshTime=(carID)=>{
        this.props.showModal(true);
        let url = AppUrls.CAR_REFRESH_TIME;
        request(url, 'post', {
            id: carID,
        }).then((response) => {

            this.props.showModal(false);

            this.loadHeadData(()=>{
                this.refs.upperFrameView.refreshingData();
                if((typeof(this.refs.dropFrameView)!= "undefined")){
                    this.refs.dropFrameView.refreshingData();
                }
            });
            this.props.showToast('已刷新了该车的排名');


        }, (error) => {

            this.props.showToast(error.mjson.msg);

        });
    }

    pushCarDealScene=(carID)=>{
        let navigatorParams = {

            name: "CarDealInfoScene",
            component: CarDealInfoScene,
            params: {
                refreshDataAction:this.upAllData,
                carID:carID,
            }
        };
        this.toNextPage(navigatorParams);
    }

    upAllData=()=>{
        this.loadHeadData(()=>{
            this.refs.upperFrameView.refreshingData();
            if((typeof(this.refs.dropFrameView)!= "undefined"))
            {
                this.refs.dropFrameView.refreshingData();
            }
            if((typeof(this.refs.auditView)!= "undefined"))
            {
                this.refs.auditView.refreshingData();
            }
        });
    }

    footButtonClick = (typeStr, groupStr, carData) => {

        this.carData = carData;
        this.groupStr = groupStr;

        if (typeStr == '上架') {

            this.carAction(2, groupStr, carData.id);

        } else if (typeStr == '下架') {
            if (this.carData.in_valid_order == 1) {
                this.props.showToast('该车辆在有效订单中,不可操作下架');
                return;
            }
            this.refs.accountmodal.changeShowType(true,
                '' +
                '是否需要下架该车', '确定', '取消', () => {
                    this.carAction(3, groupStr, carData.id);
                });

        } else if (typeStr == '编辑') {

            // let navigatorParams = {
            //
            //     name: "EditCarScene",
            //     component: EditCarScene,
            //     params: {
            //
            //         fromNew: false,
            //         carId: carData.id,
            //     }
            // };
            // this.toNextPage(navigatorParams);

            if (this.carData.in_valid_order == 1) {
                this.props.showToast('该车辆在有效订单中,不可操作编辑');
                return;
            }
            let navigatorParams = {

                name: "CarPublishFirstScene",
                component: CarPublishFirstScene,
                params: {

                    carID: carData.id,
                }
            };
            this.toNextPage(navigatorParams);

        } else if (typeStr == '查看退回原因') {

            this.refs.showTitleAlert.setModelVisibleAndSubTitle(true, carData.audit_message);

        } else if (typeStr == '管理') {

            this.setState({isShowManageView: true})

        } else if (typeStr == '删除') {

            if (this.carData.in_valid_order == 1) {
                this.props.showToast('该车辆在有效订单中,不可操作删除');
                return;
            }

            this.refs.accountmodal.changeShowType(true,
                '' +
                '是否需要删除该车', '确定', '取消', () => {
                    this.carDelete(this.carData.id);
                });
        }
    }

    manageViewBtnClick=(type)=>{

        if(type == '分享'){
            this.setState({
                isShowManageView:false,
                isShowCarSharedView:true,
            })
        }else if(type =='下架'){

            if(this.carData.in_valid_order==1){
                this.props.showToast('该车辆在有效订单中,不可操作下架');
                return;
            }

            this.refs.accountmodal.changeShowType(true,
                '' +
                '是否需要下架该车', '确定', '取消', () => {
                    this.carAction(3,this.groupStr,this.carData.id);
                });

        }else if(type=='编辑'){

            if(this.carData.in_valid_order==1){
                this.props.showToast('该车辆在有效订单中,不可操作编辑');
                return;
            }

            let navigatorParams = {

                name: "CarPublishFirstScene",
                component: CarPublishFirstScene,
                params: {

                    carID: this.carData.id,
                }
            };
            this.toNextPage(navigatorParams);

        }else if(type=='刷新排名'){

            this.carRefreshTime(this.carData.id);

        }else if(type =='已售'){

            if(this.carData.in_valid_order==1){
                this.props.showToast('该车辆在有效订单中,不可操作已售');
                return;
            }
            this.pushCarDealScene(this.carData.id);

        }else if(type == '删除'){

            if(this.carData.in_valid_order==1){
                this.props.showToast('该车辆在有效订单中,不可操作删除');
                return;
            }
            this.refs.accountmodal.changeShowType(true,
                '' +
                '是否需要删除该车', '确定', '取消', () => {
                    this.carDelete(this.carData.id);
                });
        }
    }
    // 多图分享
    sharedMoreImage=(carData)=>{

        if(IS_ANDROID == true){
            let shareArray = [];
            for (let i =0;i<carData.imgs.length;i++)
            {
                shareArray.push(carData.imgs[i].url);
            }
            let carContent = carData.model_name;
            if (carData.city_name != "") {

                carContent += '\n'+carData.city_name + '\n';
            }
            if (carData.plate_number != "") {

                carContent += carData.plate_number.substring(0, 2);
            }
            if (carData.carIconsContentData[0] != "") {

                carContent += "\n" + carData.carIconsContentData[0] + '出厂';
            }
            NativeModules.ShareNative.share({image:[shareArray],title:[carContent]}).then((suc)=>{
                    this.sharedSucceedAction();
                }, (fail)=>{
                    this.props.showToast('分享已取消');
                }
            )
        }else {
            let shareArray = [];
            for (let i =0;i<carData.imgs.length;i++)
            {
                shareArray.push({image:carData.imgs[i].url});
            }
            shareClass.shareAction([shareArray]).then((data) => {

                this.props.showToast('分享成功');
                this.sharedSucceedAction();

            }, (error) => {

                this.props.showToast('分享已取消');
            });
        }


    }

    // 分享好友
    sharedWechatSession = (carData) => {
        weChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    let imageResource = require('../../image/carSourceImages/car_info_null.png');
                    let carContent = '';
                    if (carData.city_name != "") {

                        carContent = carData.city_name + ' | ';
                    }
                    if (carData.plate_number != "") {

                        carContent += carData.plate_number.substring(0, 2);
                    }
                    if (carData.carIconsContentData[0] != "") {

                        carContent += " | " + carData.carIconsContentData[0] + '出厂';
                    }
                    let fenxiangUrl = '';
                    if (AppUrls.BASEURL == 'http://api-gateway.test.dycd.com/') {
                        fenxiangUrl = AppUrls.FENXIANGTEST;
                    } else {
                        fenxiangUrl = AppUrls.FENXIANGOPEN;
                    }
                    let carImage = typeof carData.imgs[0].url == 'undefined' ? resolveAssetSource(imageResource).uri : carData.imgs[0].url;
                    weChat.shareToSession({
                        type: 'news',
                        title: carData.model_name,
                        description: carContent,
                        webpageUrl: fenxiangUrl + '?id=' + carData.id,
                        thumbImage: carImage,

                    }).then((resp)=>{

                        this.sharedSucceedAction();
                        console.log('分享成功');

                    },(error) => {
                        console.log('分享失败');

                    })
                } else {
                    this.props.showToast('请安装微信');
                }
            });


    }

    // 分享朋友圈
    sharedWechatTimeline = (carData) => {
        weChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    let imageResource = require('../../image/carSourceImages/car_info_null.png');
                    let carContent = '';
                    if (carData.city_name != "") {
                        carContent = carData.city_name + ' | ';
                    }
                    if (carData.plate_number != "") {

                        carContent += carData.plate_number.substring(0, 2);
                    }
                    if (carData.carIconsContentData[0] != "") {

                        carContent += " | " + carData.carIconsContentData[0] + '出厂';
                    }
                    let fenxiangUrl = '';
                    if (AppUrls.BASEURL == 'http://api-gateway.test.dycd.com/') {
                        fenxiangUrl = AppUrls.FENXIANGTEST;
                    } else {
                        fenxiangUrl = AppUrls.FENXIANGOPEN;
                    }
                    let carImage = typeof carData.imgs[0].url == 'undefined' ? resolveAssetSource(imageResource).uri : carData.imgs[0].url;
                    weChat.shareToTimeline({
                        type: 'news',
                        title: carData.model_name,
                        description: carContent,
                        webpageUrl: fenxiangUrl + '?id=' + carData.id,
                        thumbImage: carImage,

                    }).then((resp)=>{

                        this.sharedSucceedAction();
                        console.log('分享成功');

                    },(error) => {
                        console.log('分享失败');

                    })

                } else {
                    this.props.showToast('请安装微信');
                }
            });
    }

    sharedSucceedAction=()=>{

        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
            if (data.code == 1) {
                if (data.result != null && data.result != "")
                {
                    let userData = JSON.parse(data.result);
                    let userPhone = userData.phone+global.companyBaseID;
                    request(AppUrls.CAR_CHESHANG_SHARE_MOMENT_COUNT,'POST',{
                        mobile:userPhone
                    }).then((response) => {
                    }, (error) => {
                    });

                }else {
                    this.setState({
                        renderPlaceholderOnly:'error'
                    });
                }

            }else {
                this.setState({
                    renderPlaceholderOnly:'error'
                });
            }
        })


    }
    dateReversal = (time) => {

        const date = new Date();
        date.setTime(time);
        return (date.getFullYear() + "-" + (this.PrefixInteger(date.getMonth() + 1, 2)));
    };
    PrefixInteger = (num, length) => {
        return (Array(length).join('0') + num).slice(-length);
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

}


class MyCarSourceUpperFrameView extends BaceComponent {

    constructor(props) {
        super(props);
        // 初始状态

        this.isCarLong = false;
        const carData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id != r2.id});
        this.state = {
            isCarLong: false,
            carData: carData,
            isRefreshing: true,
            renderPlaceholderOnly: 'blank',
            carUpperFrameStatus: carUpperFrameStatus,
        };
    }


    componentDidMount() {
        // InteractionManager.runAfterInteractions(() => {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.initFinish();
        // });
    }

    initFinish = () => {
        this.loadData();
    };

    refreshingData = () => {

        this.setState({
            isRefreshing: true,
        });
        this.loadData();

    }


    loadData = () => {


        request(AppUrls.CAR_USER_CAR, 'POST', {
            car_status: '1',
            page: carUpperFramePage,
            row: 10,
        }).then((response) => {

            carUpperFrameData = response.mjson.data.list;
            carUpperFrameStatus = response.mjson.data.status;

            for (let data of carUpperFrameData) {
                if (!this.isCarLong && data.long_aging == 1) {
                    this.isCarLong = true;
                }
            }
            if (carUpperFrameData.length) {
                this.setState({
                    carData: this.state.carData.cloneWithRows(carUpperFrameData),
                    isRefreshing: false,
                    renderPlaceholderOnly: 'success',
                    carUpperFrameStatus: carUpperFrameStatus,
                    isCarLong: this.isCarLong,
                });

            } else {
                this.setState({
                    isRefreshing: false,
                    renderPlaceholderOnly: 'null',
                    carUpperFrameStatus: carUpperFrameStatus,
                    isCarLong: this.isCarLong,

                });
            }

        }, (error) => {

            this.setState({
                isRefreshing: false,
                renderPlaceholderOnly: 'error',
                isCarLong: this.isCarLong,
            });

        })


    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={styles.loadView}>
                    {this.loadView()}
                </View>);
        }


        return (
            <View>

                {
                    this.state.carData &&
                    <ListView
                        removeClippedSubviews={false}
                        style={styles.listView}
                        dataSource={this.state.carData}
                        ref={'carListView'}
                        initialListSize={10}
                        onEndReachedThreshold={1}
                        stickyHeaderIndices={[]}//仅ios
                        enableEmptySections={true}
                        scrollRenderAheadDistance={10}
                        pageSize={10}
                        renderFooter={this.renderListFooter}
                        onEndReached={this.toEnd}
                        renderHeader={this.renderHeader}
                        renderRow={this.renderRow}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.refreshingData}
                                tintColor={[fontAndColor.NAVI_BAR_COLOR]}
                                colors={[fontAndColor.NAVI_BAR_COLOR]}/>}
                    />

                }

            </View>
        )
    }

    renderListFooter = () => {

        if (this.state.isRefreshing) {
            return null;
        } else {
            return (<ListFooter isLoadAll={this.state.carUpperFrameStatus == 1 ? false : true}/>)
        }
    }

    renderRow = (rowData) => {

        return (
            <MyCarCell carCellData={rowData} cellClick={this.props.carCellClick}
                       footButtonClick={this.props.footButtonClick} type={1}/>
        )
    }

    toEnd = () => {

        if (carUpperFrameData.length && !this.state.isRefreshing && carUpperFrameStatus != 2) {
            this.loadMoreData();
        }

    };

    loadMoreData = () => {

        let url = AppUrls.CAR_USER_CAR;
        carUpperFramePage += 1;
        request(url, 'post', {
            car_status: '1',
            page: carUpperFramePage,
            row: 10,

        }).then((response) => {
            carUpperFrameStatus = response.mjson.data.status;
            let carData = response.mjson.data.list;
            if (carData.length) {
                for (let i = 0; i < carData.length; i++) {

                    if (!this.isCarLong && carData[i].long_aging == 1) {
                        this.isCarLong = true;
                    }
                    carUpperFrameData.push(carData[i]);
                }

                this.setState({
                    carData: this.state.carData.cloneWithRows(carUpperFrameData),
                    carUpperFrameStatus: carUpperFrameStatus,
                    isCarLong: this.isCarLong,
                });
            } else {

                this.setState({
                    carUpperFrameStatus: carUpperFrameStatus,
                });
            }

        }, (error) => {


        });
    }


    renderHeader = () => {

        if (!this.state.isCarLong) {
            return null;
        }
        return (
            <View style={{
                paddingHorizontal: Pixel.getPixel(15),
                alignItems: 'center',
                flex: 1,
                height: Pixel.getPixel(35),
                backgroundColor: fontAndColor.COLORB6,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: Pixel.getPixel(10)
            }}>
                <View style={{flexDirection: 'row'}}>
                    <Image source={require('../../image/carSourceImages/pointIcon.png')}/>
                    <Text allowFontScaling={false} style={{
                        color: fontAndColor.COLORB2,
                        fontSize: fontAndColor.LITTLEFONT28,
                        marginLeft: Pixel.getPixel(5)
                    }}>已经出售的长库龄车请尽快操作下架</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    this.setState({
                        isCarLong: false
                    });
                }}>
                    <Image source={require('../../image/carSourceImages/closeBtn.png')}/>
                </TouchableOpacity>
            </View>)
    }

}

class MyCarSourceDropFrameView extends BaceComponent {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        const carData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id != r2.id});
        this.state = {

            carData: carData,
            isRefreshing: true,
            carDropFrameStatus: carDropFrameStatus,
            renderPlaceholderOnly: 'blank',


        };
    }

    componentDidMount() {
        // InteractionManager.runAfterInteractions(() => {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.initFinish();
        // });
    }


    initFinish = () => {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.loadData();
    };

    refreshingData = () => {

        this.setState({
            isRefreshing: true,
        });
        this.loadData();

    }
    loadData = () => {

        let url = AppUrls.CAR_USER_CAR;
        carDropFramePage = 1;
        request(url, 'post', {
            car_status: '4',
            page: carDropFramePage,
            row: 10,

        }).then((response) => {

            carDropFrameData = response.mjson.data.list;
            carDropFrameStatus = response.mjson.data.status;
            if (carDropFrameData.length) {
                this.setState({
                    carData: this.state.carData.cloneWithRows(carDropFrameData),
                    isRefreshing: false,
                    renderPlaceholderOnly: 'success',
                    carDropFrameStatus: carDropFrameStatus,

                });

            } else {

                this.setState({
                    isRefreshing: false,
                    renderPlaceholderOnly: 'null',
                    carDropFrameStatus: carDropFrameStatus,

                });
            }

        }, (error) => {

            this.setState({
                isRefreshing: false,
                renderPlaceholderOnly: 'error',
            });

        });

    }

    loadMoreData = () => {

        let url = AppUrls.CAR_USER_CAR;
        carDropFramePage += 1;
        request(url, 'post', {
            car_status: '4',
            page: carDropFramePage,
            row: 10,

        }).then((response) => {

            carDropFrameStatus = response.mjson.data.status;
            let carData = response.mjson.data.list;
            if (carData.length) {
                for (let i = 0; i < carData.length; i++) {
                    carDropFrameData.push(carData[i]);
                }

                this.setState({
                    carData: this.state.carData.cloneWithRows(carDropFrameData),
                    carDropFrameStatus: carDropFrameStatus,
                });

            } else {

                this.setState({
                    carDropFrameStatus: carDropFrameStatus,
                });
            }

        }, (error) => {


        });
    }


    toEnd = () => {

        if (carDropFrameData.length && !this.state.isRefreshing && this.state.carDropFrameStatus != 2) {
            this.loadMoreData();
        }

    };

    renderListFooter = () => {

        if (this.state.isRefreshing) {
            return null;
        } else {
            return (<ListFooter isLoadAll={this.state.carDropFrameStatus==1? false : true}/>)
        }
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={styles.loadView}>
                    {this.loadView()}
                </View>);
        }
        return (

            <View style={styles.viewContainer}>
                {
                    this.state.carData &&
                    <ListView style={styles.listView}
                              dataSource={this.state.carData}
                              ref={'carListView'}
                              initialListSize={10}
                              removeClippedSubviews={false}
                              onEndReachedThreshold={1}
                              stickyHeaderIndices={[]}//仅ios
                              enableEmptySections={true}
                              scrollRenderAheadDistance={10}
                              pageSize={10}
                              renderFooter={this.renderListFooter}
                              onEndReached={this.toEnd}
                              renderRow={(rowData) =><MyCarCell carCellData={rowData} cellClick={this.props.carCellClick} footButtonClick={this.props.footButtonClick} type={2}/>}
                              refreshControl={
                                  <RefreshControl
                                      refreshing={this.state.isRefreshing}
                                      onRefresh={this.refreshingData}
                                      tintColor={[fontAndColor.NAVI_BAR_COLOR]}
                                      colors={[fontAndColor.NAVI_BAR_COLOR]}
                                  />}
                    />
                }
            </View>
        )
    }
}

class MyCarSourceAuditView extends BaceComponent {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        const carData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id != r2.id});
        this.state = {

            carData: carData,
            isRefreshing: true,
            carAuditStatus: carAuditStatus,
            renderPlaceholderOnly: 'blank',

        };
    }

    componentDidMount() {
        //InteractionManager.runAfterInteractions(() => {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.initFinish();
        //});
    }


    initFinish = () => {

        this.setState({renderPlaceholderOnly: 'loading'});
        this.loadData();
    };

    refreshingData = () => {

        this.setState({
            isRefreshing: true,
        });
        this.loadData();

    }
    loadData = () => {

        let url = AppUrls.CAR_USER_CAR;
        // let url = AppUrls.CAR_PERLIST;
        carAuditPage = 1;
        request(url, 'post', {

            car_status: '5',
            page: carAuditPage,
            row: 10,

        }).then((response) => {

            carAuditData = response.mjson.data.list;
            carAuditStatus = response.mjson.data.status;

            if(carAuditData.length>0){
                this.setState({
                    carData: this.state.carData.cloneWithRows(carAuditData),
                    isRefreshing: false,
                    renderPlaceholderOnly: 'success',
                    carAuditStatus: carAuditStatus,

                });
            }else {
                this.setState({
                    isRefreshing: false,
                    renderPlaceholderOnly: 'null',
                    carAuditStatus: carAuditStatus,
                });
            }
        }, (error) => {

            this.setState({
                isRefreshing: false,
                renderPlaceholderOnly: 'error'
            });

        });

    }

    loadMoreData = () => {

        // let url = AppUrls.CAR_PERLIST;
        let url = AppUrls.CAR_USER_CAR;
        carAuditPage += 1;
        request(url, 'post', {
            car_status: '5',
            page: carAuditPage,
            row: 10,

        }).then((response) => {

            carAuditStatus = response.mjson.data.status;
            let carData = response.mjson.data.list;
            if (carData.length) {
                for (let i = 0; i < carData.length; i++) {
                    carAuditData.push(carData[i]);
                }

                this.setState({
                    carData: this.state.carData.cloneWithRows(carAuditData),
                    carAuditStatus: carAuditStatus,
                });

            } else {
                this.state({
                    carAuditStatus: carAuditStatus,
                })
            }

        }, (error) => {


        });
    }


    toEnd = () => {

        if (carAuditData.length && !this.state.isRefreshing && this.state.carAuditStatus != 2) {

            this.loadMoreData();
        }

    };

    renderListFooter = () => {

        if (this.state.isRefreshing) {
            return null;
        } else {
            return (<ListFooter isLoadAll={this.state.carAuditStatus==1? false : true}/>)
        }
    }

    renderHeader =()=> {
        return(
            <View style={{paddingHorizontal:Pixel.getPixel(15),alignItems:'center',height:Pixel.getPixel(35),backgroundColor:fontAndColor.COLORB6,
                flexDirection:'row',justifyContent:'space-between',marginBottom:Pixel.getPixel(10), flex:1
            }}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Image source={require('../../image/carSourceImages/pointIcon.png')}/>
                    <Text allowFontScaling={false}  style={{color:fontAndColor.COLORB2, fontSize:fontAndColor.LITTLEFONT28,marginLeft:Pixel.getPixel(5)}}>与其他商户重复的车源需待管理员核实后显示</Text>
                </View>
            </View>)
    }

    render() {

        if(this.state.renderPlaceholderOnly == 'null'){
            return (
                <View style={styles.loadView}>
                    {
                        this.loadView()
                    }
                    <View style={{paddingHorizontal:Pixel.getPixel(15),alignItems:'center',height:Pixel.getPixel(35),backgroundColor:fontAndColor.COLORB6,
                        flexDirection:'row',justifyContent:'space-between',top:0,left:0,
                        right:0,position:'absolute'
                    }}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Image source={require('../../image/carSourceImages/pointIcon.png')}/>
                            <Text allowFontScaling={false}  style={{color:fontAndColor.COLORB2, fontSize:fontAndColor.LITTLEFONT28,marginLeft:Pixel.getPixel(5)}}>与其他商户重复的车源需待管理员核实后显示</Text>
                        </View>
                    </View>
                </View>);

        }else if (this.state.renderPlaceholderOnly !== 'success')
        {
            return (
                <View style={styles.loadView}>
                    {this.loadView()}
                </View>);
        }
        return (

            <View style={styles.viewContainer}>
                {
                    this.state.carData &&
                    <SGListView style={styles.listView}
                                dataSource={this.state.carData}
                                removeClippedSubviews={false}
                                ref={'carListView'}
                                initialListSize={10}
                                onEndReachedThreshold={1}
                                stickyHeaderIndices={[]}//仅ios
                                enableEmptySections={true}
                                scrollRenderAheadDistance={10}
                                pageSize={10}
                                renderHeader={this.renderHeader}
                                renderFooter={this.renderListFooter}
                                onEndReached={this.toEnd}
                                renderRow={(rowData) =><MyCarCell carCellData={rowData} cellClick={this.props.carCellClick} footButtonClick={this.props.footButtonClick} type={3}/>}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={this.refreshingData}
                                        tintColor={[fontAndColor.NAVI_BAR_COLOR]}
                                        colors={[fontAndColor.NAVI_BAR_COLOR]}
                                    />}
                    />
                }
            </View>
        )
    }
}

class CarSharedView extends Component {

    render(){
        return(
            <TouchableOpacity style={styles.manageView} activeOpacity={1} onPress={this.props.offClick}>
                <View style={styles.sharedView}>
                    <View style={{flexDirection: 'row',paddingVertical:Pixel.getPixel(15)}}>
                        {
                            this.state.isShowMoreImageBtn && (
                                <TouchableOpacity style={styles.sharedItemView} onPress={() => {
                                    this.btnClick('多图分享');
                                }}>
                                    <View style={styles.sharedImageBack}>
                                        <Image source={require('../../image/carSourceImages/shareImgIcon.png')}/>
                                    </View>
                                    <Text allowFontScaling={false}  style={styles.sharedText}>多图分享</Text>
                                </TouchableOpacity>
                            )
                        }
                        <TouchableOpacity style={styles.sharedItemView} onPress={() => {
                            this.btnClick('微信好友');
                        }}>
                            <View style={styles.sharedImageBack}>
                                <Image source={require('../../image/carSourceImages/shared_wx.png')}/>
                            </View>
                            <Text allowFontScaling={false}  style={styles.sharedText}>微信好友</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sharedItemView} onPress={() => {
                            this.btnClick('朋友圈');
                        }}>
                            <View style={styles.sharedImageBack}>
                                <Image source={require('../../image/carSourceImages/shared_friend.png')}/>
                            </View>
                            <Text allowFontScaling={false}  style={styles.sharedText}>朋友圈</Text>
                        </TouchableOpacity>
                    </View>
                    <View  style={{justifyContent:'center',alignItems:'center',borderTopWidth:Pixel.getPixel(1),borderTopColor:fontAndColor.THEME_BACKGROUND_COLOR,height:Pixel.getPixel(44),
                        width:ScreenWidth
                    }}>
                        <Text style={styles.sharedViewHeadText}>取消</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isShowMoreImageBtn:this.props.isShowMore,
        };
    }

    btnClick=(type)=>{
        this.props.carSharedBtnClick(type);
        this.props.offClick();
    }
}

class ManageView extends Component {

    render() {
        return (
            <View style={{
                position: 'absolute', left: 0,
                right: 0,
                bottom: 0,
                top: 0,
            }}>
                <TouchableOpacity
                    style={{flex: 1, backgroundColor: "rgba(0,0,0,.4)"}}
                    onPress={() => {
                        this.props.offClick();
                    }}
                    activeOpacity={1}
                >
                </TouchableOpacity>

                <View style={{backgroundColor: 'white'}}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        paddingHorizontal: 30,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: fontAndColor.COLORA4,
                        paddingVertical:15
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.btnClick('下架');
                            }}
                        >
                            <View style={{alignItems: 'center'}}>
                                <Image style={{marginBottom: 5}}
                                       source={require('../../image/carSourceImages/carSoldOut.png')}/>
                                <SaasText style={{fontSize: 13, color: fontAndColor.COLORA1}}>下架</SaasText>

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.btnClick('编辑');
                            }}
                        >
                            <View style={{alignItems: 'center'}}>
                                <Image style={{marginBottom: 5}}
                                       source={require('../../image/carSourceImages/carBianJi.png')}/>
                                <SaasText style={{fontSize: 13, color: fontAndColor.COLORA1}}>编辑</SaasText>

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.btnClick('已售');
                            }}
                        >
                            <View style={{alignItems: 'center'}}>
                                <Image style={{marginBottom: 5}}
                                       source={require('../../image/carSourceImages/carYiShou.png')}/>
                                <SaasText style={{fontSize: 13, color: fontAndColor.COLORA1}}>已售</SaasText>

                            </View>
                        </TouchableOpacity>


                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        paddingHorizontal: 30,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: fontAndColor.COLORA4,
                        paddingVertical:15
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.btnClick('刷新排名');
                            }}
                        >
                            <View style={{alignItems: 'center'}}>
                                <Image style={{marginBottom: 5}}
                                       source={require('../../image/carSourceImages/carRefresh.png')}/>
                                <SaasText style={{fontSize: 13, color: fontAndColor.COLORA1}}>刷新排名</SaasText>

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.btnClick('分享');
                            }}
                        >
                            <View style={{alignItems: 'center'}}>
                                <Image style={{marginBottom: 5}}
                                       source={require('../../image/carSourceImages/carShared.png')}/>
                                <SaasText style={{fontSize: 13, color: fontAndColor.COLORA1}}>分享</SaasText>

                            </View>
                        </TouchableOpacity>


                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.offClick();
                        }}
                    >
                        <View
                            style={{justifyContent: 'center', alignItems: 'center', paddingVertical:15}}
                        >
                            <SaasText
                                style={{color: fontAndColor.COLORA4, fontSize: 14}}
                            >
                                取消
                            </SaasText>

                        </View>
                    </TouchableOpacity>

                </View>


            </View>

        )

    }

    btnClick = (type) => {
        this.props.manageBtnClick(type);
        if (type !== '分享') {
            this.props.offClick();
        }
    }
}

const styles = StyleSheet.create({

    rootContainer: {

        flex: 1,
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,

    },
    ScrollableTabView: {

        marginTop: Pixel.getTitlePixel(64),
        marginBottom:Pixel.getPixel(44),
    },
    loadView: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: Pixel.getPixel(5),
    },
    viewContainer: {
        flex: 1,
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR
    },
    listView: {

        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
        marginTop: Pixel.getPixel(5),
    },footBtn:{
        left:0,
        bottom:0,
        right:0,
        backgroundColor:fontAndColor.NAVI_BAR_COLOR,
        justifyContent:'center',
        alignItems:'center',
        position: 'absolute',
        height:Pixel.getPixel(44),
    },
    footBtnText:{
        textAlign:'center',
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        color:'white',
    },
    manageView:{
        left: 0,
        right: 0,
        bottom: 0,
        top:0,
        position: 'absolute',
        backgroundColor: 'rgba(1,1,1,0.5)',
    },
    sharedView: {
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',

    },
    sharedViewHead: {
        height: Pixel.getPixel(44),
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: ScreenWidth
    },
    sharedViewHeadText: {
        color: fontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
    },
    sharedImageBack:{
        backgroundColor:fontAndColor.COLORB9,
        borderRadius:Pixel.getPixel(10),
        width:Pixel.getPixel(50),
        height:Pixel.getPixel(50),
        justifyContent:'center',
        alignItems:'center'
    },
    sharedItemView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Pixel.getPixel(20),
        marginRight: Pixel.getPixel(20),
        marginTop: Pixel.getPixel(10),
        marginBottom: Pixel.getPixel(10),
    },
    sharedText: {
        color: fontAndColor.COLORA1,
        textAlign: 'center',
        marginTop: Pixel.getPixel(10),
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
    },

})