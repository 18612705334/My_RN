import React, {Component, PropTypes} from 'react'
import {
    StyleSheet,
    View,
    Text,
    ListView,
    TouchableOpacity,
    Dimensions,
    Image,
    RefreshControl
} from 'react-native'

const {width, height} = Dimensions.get('window');
import BaseComponent from "../component/BaseComponent";
import * as fontAndColor from '../constant/FontAndColor';
import NavigatorView from '../component/AllNavigationView';
import PixelUtil from '../utils/PixelUtils'
import * as AppUrls from "../constant/appUrls";
import {request} from "../utils/RequestUtil";
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";
import DailyReminderScene from "./dailyReminder/DailyReminderScene";
import BacklogListScene from "./backlog/BacklogListScene";
import HeadLineListScene from "./headLine/HeadLineListScene";
import SysMessageListScene from "./sysMessage/SysMessageListScene";
import SQLiteUtil from "../utils/SQLiteUtil";
import GetPermissionUtil from '../utils/GetRoleUtil';
import MyBaseComponent from '../component/MyBaseComponent'
import SaasText from "../component/SaasText";

const GetRoleUtil = new GetPermissionUtil();
const SQLite = new SQLiteUtil();
let Pixel = new PixelUtil();

let data = [
    {
        img: require('../../image/message/backlog.png'),
        title: '代办事件',
        subtitle: '快速处理代办事件'
    },
    {
        img: require('../../image/message/dailyReminder.png'),
        title: '每日提醒',
        subtitle: '车辆分享数据'

    },
    {
        img: require('../../image/mainImage/jiekuan.png'),
        title: '系统消息',
        subtitle: '版本升级通知和最新公告'

    },
    {
        img: require('../../image/message/sysMessage.png'),
        title: '车市头条',
        subtitle: '时刻关注汽车行业动态'

    }
];

export default class MessageListScene extends MyBaseComponent {

    constructor(props) {
        super(props);
        this.custPhone = '';
        this.backlogNum = 0;
        this.sysMessageNum = 0;
        this.headLineNum = 0;
        this.companyId = '';
        this.contentTypes = [];
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== ri2});
        this.state = {
            dataSource: ds.cloneWithRows([]),
            refreshing:false
        }
    }


    initFinish = () => {

        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code === 1 && data.result !== null) {
                let datas = JSON.parse(data.result);
                this.companyId = datas.company_base_id;
                StorageUtil.mGetItem(StorageKeyNames.PHONE, (data) => {
                    if (data.code === 1 && data.result !== null) {
                        this.custPhone = data.result;
                        GetRoleUtil.getRoleList((list) => {

                            for (let i = 0; i < list.length; i++) {
                                if (list[i].id === 32) {
                                    this.contentTypes.push('taskPGS');
                                } else if (list[i].id === 33) {
                                    this.contentTypes.push('taskZBY');
                                } else if (list[i].id === 34) {
                                    this.contentTypes.push('taskManager');
                                } else if (list[i].id === 35) {
                                    this.contentTypes.push('taskYYZY');
                                }
                            }
                            this.contentTypes.push('taskRemind');
                            this.contentTypes.push('taskTenure');
                            this.contentTypes.push('taskDC');
                            this.loadData();
                        });
                    } else {
                        this.props.showToast('查询账户信息失败');
                    }
                });
            }
        });


    };

    loadData=()=>{

        let maps = {
            accountMobile: this.custPhone + this.companyId,
            roleList: JSON.stringify(this.contentTypes)
        };

        request(AppUrls.HANDLE_COUNT, 'post', maps).then((response) => {
            this.backlogNum = response.mjson.data;
            this.getSysMessageNum();
            //console.log('this.backlogNum======', this.backlogNum);
        }, (error) => {
            this.getSysMessageNum();
        });

        this.setState({
            renderPlaceholderOnly: 'success',
            title: '消息通知',
            dataSource: this.state.dataSource.cloneWithRows(data)
        })

    };

    getSysMessageNum = ()=>{
        SQLite.selectData('SELECT * FROM messageSystemModel WHERE tel = ? order by createTime desc', [this.custPhone], (data)=>{



        })

    };


    onRefresh = () => {


    };

    renderView() {

        return (

            <View style={{backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR, flex: 1}}>
                <NavigatorView
                    title={this.state.title}
                    backIconClick={() => {
                        this.backPage()
                    }}
                />

                <ListView
                    enableEmptySections={true}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    style={{marginTop: Pixel.getTitlePixel(64), paddingTop: 15}}
                    dataSource={this.state.dataSource}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                            tintColor={[fontAndColor.NAVI_BAR_COLOR]}
                            colors={[fontAndColor.NAVI_BAR_COLOR]}
                        />
                    }
                />


            </View>

        )
    }

    renderRow = (data, sectionIndex, rowIndex) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.rowPress(rowIndex)
                }}
            >
                <View style={{flexDirection: 'row', backgroundColor: 'white', alignItems: 'center'}}>
                    <Image source={data.img} style={{width: 60, height: 60, marginVertical: 15, marginHorizontal: 15}}/>
                    <View>
                        <SaasText style={{marginBottom: 15, fontSize: 17}}>{data.title}</SaasText>
                        <SaasText style={{color: fontAndColor.COLORA1}}>{data.subtitle}</SaasText>
                    </View>

                </View>
            </TouchableOpacity>

        )
    };
    renderSeparator = () => {
        return (
            <View style={{height: 1, flex: 1, backgroundColor: fontAndColor.COLORA4}}/>
        )
    };

    rowPress = (index) => {

        switch (index) {
            case '0': {
                this.toNextPage({
                    name: 'BacklogListScene',
                    component: BacklogListScene,
                    params: {}
                });
            }
                break;
            case '1': {
                this.toNextPage({
                    name: 'DailyReminderScene',
                    component: DailyReminderScene,
                    params: {}
                });

            }
                break;
            case '2': {
                this.toNextPage({
                    name: 'SysMessageListScene',
                    component: SysMessageListScene,
                    params: {}
                });

            }
                break;
            case '3': {
                this.toNextPage({
                    name: 'HeadLineListScene',
                    component: HeadLineListScene,
                    params: {}
                });

            }
                break
        }
    }

}