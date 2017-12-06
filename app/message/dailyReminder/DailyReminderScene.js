import  React, {Component} from 'react';
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
} from 'react-native';

import BaceComponent from '../../component/BaseComponent';
import NavigatorView from '../../component/AllNavigationView';
import CarInfoScene         from '../../carSource/CarInfoScene';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import RepaymenyTabBar from '../../finance/repayment/component/RepaymenyTabBar';
import * as fontAndColor from '../../constant/FontAndColor';
import * as AppUrls from "../../constant/appUrls";
import  {request}           from '../../utils/RequestUtil';
import PixelUtil from '../../utils/PixelUtils';
import {DailyReminderSelectView} from "../component/DailyReminderSelectView";
import {ShareListView} from "./ShareListView";
import {StatisticalListView} from "./StatisticalListView";
const Pixel = new PixelUtil();
import MyBaseComponent from '../../component/MyBaseComponent'
import SaasText from "../../component/SaasText";





export default class DailyReminderScene extends MyBaseComponent{
    constructor(props){
        super(props)
        this.timeFrame = [{name: '每日', value: 1}, {name: '每周', value: 2}, {name: '每月', value: 3}];
        this.shareCurrentFrame = {name: '每日', value: 1};
        this.statisticalCurrentFrame = {name: '每日', value: 1};
        this.currentTab = 0;
        this.state = {
            isHide: true
        };
    }

    initFinish = ()=>{
        this.setState({
            renderPlaceholderOnly:'success'
        })
    }


    renderView(){

        return(
            <View style = {{flex:1, backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR}}>
                <NavigatorView
                    title={'每日提醒'}
                    backIconClick={this.backPage}
                    renderRightFootView={this.renderRightFootView}
                />
                <ShareListView navigator={this.props.navigator} ref="shareListView" tabLabel="ios-paper1" showModal={this.props.showModal}/>
                <DailyReminderSelectView
                    ref='drsv'
                    checkedSource={this.timeFrame}
                    checkedTypeString={this.shareCurrentFrame.name}
                    checkTimeFrameClick={this.checkTimeFrameClick}
                    hideClick={this.hideCheckedView}
                />
            </View>

        )
    }

    checkTimeFrameClick = (data, index)=>{

        if (this.currentTab === 0) {
            this.shareCurrentFrame = data;
            this.refs.drsv.changeClick(false, this.shareCurrentFrame.name);
            this.refs.shareListView.refreshData(this.shareCurrentFrame.value);
        } else {
            this.statisticalCurrentFrame = data;
            this.refs.drsv.changeClick(false, this.statisticalCurrentFrame.name);
            this.refs.statisticalListView.refreshData(this.statisticalCurrentFrame.value);
        }
    }




    hideCheckedView = ()=>{
        this.setState({
            isHide: true,
        });
    }


    renderRightFootView = ()=>{

        return(
            <TouchableOpacity
                style={{alignItems:'flex-end', paddingRight:15}}
                onPress={()=>{
                    if (this.currentTab === 0) {
                        this.refs.drsv.changeClick(true, this.shareCurrentFrame.name);
                    } else {
                        this.refs.drsv.changeClick(true, this.statisticalCurrentFrame.name);
                    }
                }}
            >
                <Image source={require('../../../image/mainImage/screening.png')}/>
            </TouchableOpacity>
        )

    }



}
