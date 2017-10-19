import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    NativeModules,
    InteractionManager
} from 'react-native';

const {width, height} = Dimensions.get('window');
import  PixelUtil from '../utils/PixelUtils'
let Pixel = new PixelUtil();
import TabNavigator from 'react-native-tab-navigator';

import HomeSence  from './HomeScene'
import CarSourceSence from '../carSource/CarSourceListScene'
import MineSence from './MineScene'
import FinanceSence from './FinanceScene'
import PublishModal from './PublishModal'
import  StorageUtil from '../utils/StorageUtil';
import * as storageKeyNames from '../constant/storageKeyNames';
import LoginGesture from '../login/LoginGesture';
import * as fontAndClolr from '../constant/FontAndColor';
import BaseComponent from '../component/BaseComponent';
import NonCreditScene from './NonCreditScene';
import LoginScene from '../login/LoginScene';
import AllSelectCompanyScene from '../main/AllSelectCompanyScene';

import CustomerServiceButton  from '../component/CustomerServiceButton';
import WorkBenchScene from './WorkBenchScene';
import GetPermissionUtil from '../utils/GetPermissionUtil';

import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';

let tabArray = [];
const GetPermission = new GetPermissionUtil();

export default class MainPage extends BaseComponent{


    constructor(props){
        super(props)
        this.state = {
            renderPlaceHolderOnly:'blank',
            openSelectBranch:false
        }
        tabArray = [];
    }


    initFinish = ()=>{
        StorageUtil.mGetItem(storageKeyNames.LOAN_SUBJECT, (data)=>{
            if(data.code == 1){ //获取成功
                let result = JSON.parse(data.result);
                this.is_done_credit = result.is_done_credit;
                this.getUserPermission(this.is_done_credit)
            }else {
                this.setState({renderPlaceHolderOnly:'error'})
            }
        })
    }


    componentWillUnmount(){
        tabArray = [];
    }

    getUserPermission = (id)=>{
        request(Urls.GETFUNCTIONBYTOKENENTER, 'POST', {enterprise_id:id}).then((response)=>{
            if (response.mjson.data == null || response.mjson.data.length <= 0){
                this.setState({renderPlaceHolderOnly:'null'});
            }else {
                    StorageUtil.mSetItem(storageKeyNames.GET_USER_PERMISSION,

                            JSON.stringify(response.mjson), ()=>{
                                    GetPermission.getFirstList((list)=>{
                                        console.log(list)
                                    })


                        }

                        )
            }

        }, (error)=>{
            this.setState({renderPlaceHolderOnly:'error'})
        })



    }

    render(){

        if (this.state.renderPlaceHolderOnly != 'success'){
            return this._renderPlaceholderView();
        }

        let items = [];

        return(
            <View style = {{flex:1, backgroundColor:fontAndClolr.COLORA3}}>




            </View>
        )

    }

    _renderPlaceholderView = ()=>{
        return(
            <View style = {{flex:1, backgroundColor:fontAndClolr.COLORA3}}>
                {this.loadView()}
            </View>
        )
    }


}