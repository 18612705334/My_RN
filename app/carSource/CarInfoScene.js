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
import {CarDeploySwitchoverButton, CarConfigurationView}   from './znComponent/CarInfoAllComponent';
import CarZoomImageScene from './CarZoomImagScene';
import CarUpkeepScene from './CarUpkeepScene';
import AutoConfig from  '../publish/AutoConfig';
import CarbreakRulesScene from  './CarbreakRulesScene';
import CarReferencePriceScene from  './CarReferencePriceScene';
import CarPriceAnalysisView from './znComponent/CarPriceAnalysisView';
import *as weChat from 'react-native-wechat';
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
let Platform = require('Platform');
let getRole = new GetPermissionUtil();
const Pixel = new PixelUtil();

import {request} from "../utils/RequestUtil";
import * as AppUrls from "../constant/appUrls";
import MyBaseComponent from "../component/MyBaseComponent";
import SaasText from "../component/SaasText";

let ScreenWidth = Dimensions.get('window').width;
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


export default class CarInfoScene extends MyBaseComponent {

    constructor(props){
        super(props)
        this.state = {
            imageArray: new ImagePageView.DataSource({pageHasChanged:(r1,r2)=>r1!==r2}),
            renderPlaceholderOnly: 'blank',
            residualsData: [],
            carData: {imgs: []},
            currentImageIndex: 1,
            switchoverCarInfo: 0,
        }
    }

    initFinish = () => {

        this.isUserBoss = false;

        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data)=>{
            if(data.code === 1 &&data.result != ''){
                let enters = JSON.parse(data.result);
                for(let item of enters.enterprise_list[0].role_type){
                    if(item ==1 || item==6){
                        this.isUserBoss = true;
                        break;
                    }
                }
                getRole.getRoleList((data)=>{
                    this.roleList = data;
                    this.loadData()
                })
            }
        })
    }

    loadData = ()=>{

        StorageUtil.mGetItem(StorageKeyNames.ENTERPRISE_LIST, (data)=>{
           if(data.code == 1&&data.reuslt != ''){
               let enters = JSON.parse(data.result)
               let company_base_ids = '';
               for(let index in enters ){
                   company_base_ids = company_base_ids + enters[index].enterprise_uid;
                   if (enters.length > index + 1) {
                       company_base_ids = company_base_ids + ',';
                   }
                    this.loadCarData(company_base_ids);
               }
            }else {
                this.loadCarData('')
           }
        });

    };


    loadCarData = (show_shop_id)=>{
        request(AppUrls.CAR_DETAIL, 'POST', {
            id:this.props.carID,
            imageType:1,
            shop_ids:show_shop_id
        }).then((response)=>{
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

            for(let item of this.roleList)
            {
                if((item.name ==='手续员'||item.name ==='评估师'||item.name ==='整备员'||item.name ==='经理'||item.name ==='运营专员'||item.name ==='合同专员'||item.name ==='车管专员') && !this.isUserBoss)
                {
                    carData.show_order = 2;
                    break;
                }
            }

            this.setState({
                carData:carData,
                imageArray:this.state.imageArray.cloneWithPages(carData.imgs),
                renderPlaceholderOnly: 'success',
            })

        }, (error)=>{

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

            console.log(response);
            if (response.mycode == 1) {
                this.setState({
                    residualsData: response.mjson.data,
                })
            }
        }, (error) => {
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


    allRefresh=()=>{
        this.loadData();
    }




    renderView(){
        return(
            <View style = {{flex:1, backgroundColor:'red', alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity
                    onPress={()=>{
                        this.toNextPage({
                            component:CarInfoScene,
                            name:'CarInfoScene',
                            params:{
                                carID:this.props.carID
                            }


                        })
                    }}
                >

                    <SaasText>
                        跳转
                    </SaasText>

                </TouchableOpacity>
            </View>
        )
    }


}