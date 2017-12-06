import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ListView,
    Modal
} from 'react-native';

import NavigatorView from '../../component/AllNavigationView';
import BaseComponent from '../../component/BaseComponent';
import * as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';
const Pixel = new PixelUtil();
import * as StorageKeyNames from "../../constant/storageKeyNames";
import StorageUtil from "../../utils/StorageUtil";
import GetPermissionUtil from '../../utils/GetRoleUtil';
import ClientInfoScene from "../../crm/StoresReception/ClientInfoScene";
import CarTrimScene from "../../carSource/carBuy/CarTrimScene";
import StoreReceptionManageNewScene from "../../crm/StoresReception/StoreReceptionManageNewScene";
import KeepCustomerManageScene from "../../crm/KeepCustomer/KeepCustomerManageScene";
const GetRoleUtil = new GetPermissionUtil();
const cellJianTou = require('../../../image/mainImage/celljiantou.png');
import * as AppUrls from "../../constant/appUrls";
import {request} from "../../utils/RequestUtil";
import MyBaseComponent from '../../component/MyBaseComponent'
import SaasText from "../../component/SaasText";


export default class BacklogListScene extends MyBaseComponent{
    constructor(props){
        super(props)

    }

    initFinish = ()=>{
        this.setState({
            renderPlaceholderOnly:'success'
        })
    }



    renderView() {
        return(

            <View style={{backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR, flex: 1}}>
                <NavigatorView
                    title={'待办事件'}
                    backIconClick={() => {
                        this.backPage()
                    }}
                />
            </View>

        )

    }

}