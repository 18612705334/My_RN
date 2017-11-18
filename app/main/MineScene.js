import React, {Component, PropTypes} from 'react'
import {

    View,
    Text,
    ListView,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    InteractionManager,
    RefreshControl,
    BackAndroid,
    NativeModules
} from 'react-native'

import * as fontAndClolr from '../constant/FontAndColor';
import PixelUtil from '../utils/PixelUtils'
import BaseComponent from "../component/BaseComponent";
import * as storageKeyNames from '../constant/storageKeyNames'
import * as Urls from '../constant/appUrls';
import SText from '../component/SaasText'

import ContractManageScene from '../mine/contractManage/ContractManageScene';

import AccountManageScene from '../mine/accountManage/AccountTypeSelectScene'
import WaitActivationAccountScene from '../mine/accountManage/WaitActivationAccountScene'
import AccountScene from '../mine/accountManage/AccountScene'
import BindCardScene from '../mine/accountManage/BindCardScene'

import AdjustManageScene from '../mine/adjustManage/AdjustManageScene'
import EmployeeManageScene from '../mine/employeeManage/EmployeeManageScene'
import EvaluateCarInfo from '../mine/setting/EvaluateCarInfo'
import Setting from './../mine/setting/Setting'
import  CarCollectSourceScene from '../carSource/CarCollectSourceScene';
import  BrowsingHistoryScene from '../carSource/BrowsingHistoryScene';
import * as StorageKeyNames from "../constant/storageKeyNames";
import EditEmployeeScene  from '../mine/employeeManage/EditEmployeeScene'
import ImageSource from '../publish/component/ImageSource';
import {request} from '../utils/RequestUtil';
import AccountModal from '../component/AccountModal';
import OrderTypeSelectScene from  '../mine/myOrder/OrderTypeSelectScene';
import CustomerAddScene from "../crm/StoresReception/ClientAddScene";
import StoreReceptionManageScene from "../crm/StoresReception/StoreReceptionManageScene";
import StoreReceptionManageNewScene from "../crm/StoresReception/StoreReceptionManageNewScene";
import MyAccountScene from "../mine/accountManage/MyAccountScene";

let Pixel = new PixelUtil();

let firstType = '-1';
let lastType = '-1';
let haveOrder = 0;
import GetPermissionUtil from '../utils/GetPermissionUtil';
import StorageUtil from "../utils/StorageUtil";


const GetPermission = new GetPermissionUtil();
let componyname = '';
let Car = [];

const {width, height} = Dimensions.get('window');

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== ri2})

export default class MineScene extends BaseComponent {

    constructor(props) {
        super(props)
        firstType = '-1';
        lastType = '-1';
        haveOrder = 0;
        componyname = '';
        this.state = {
            renderPlaceholderOnly: 'loading',
            isRefreshing: true,
        }

    }

    componentDidMount() {
        super.componentDidMount();
    }


    initFinish() {
        this.getData()
    }

    getData = () => {  //初始化列表数据源

        Car = [
            {
                "cars": [],
                "title": "section0"
            },
            {
                "cars": [],
                "title": "section1"
            },
            {
                "cars": [],
                "title": "section2"
            },
            {
                "cars": [],
                "title": "section3"
            },
            {
                "cars": [],
                "title": "section4"
            },

        ]

        this.toCompany();

    }

    toCompany = () => {
        StorageUtil.mGetItem(storageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code === 1) {
                let datas = JSON.parse(data.result)
                componyname = ''
                if (datas.companyname === null || datas.companyname=== '') {
                    componyname = datas.name;
                } else {
                    componyname = datas.componyname;
                }

                let maps = {
                    enter_base_ids: datas.company_base_id,
                    child_type: '1'
                }
                request(Urls.USER_ACCOUNT_INFO, 'POST', maps).then((response) => {

                    if (response.mycode === 1) {
                        haveOrder = response.mjson.data.order.tradeing_count;
                        if (response.mjson.data.account === null || response.mjson.data.account.length <= 0) {
                            lastType = 'error';
                        } else {
                            lastType = response.mjson.data.account.status;
                        }
                        this.changeData();
                    } else {
                        this.setState({
                            renderPlaceholderOnly: 'error',
                            isRefreshing: false
                        })
                        this.props.showToast('发生错误')
                    }
                }, (error) => {
                    this.changeData();
                })


            }


        })


    }


    changeData = () => {
        StorageUtil.mGetItem(storageKeyNames.USER_INFO, (data) => {

            if (data.code === 1) {

                let user_list = [];
                let datas = JSON.parse(data.result);
                user_list.push(...Car);
                GetPermission.getMineList((minList) => {

                    minList.map((item) => {
                        this.initData(item.id, item.name)
                    })

                    let jsonData = user_list;
                    let dataBlob = {}, sectionIDs = [], rowIDs = [];

                    jsonData.map((data, i) => {
                        sectionIDs.push(i)

                        dataBlob[i] = jsonData[i].title;

                        rowIDs[i] = [];

                        let cars = jsonData[i].cars

                        cars.map((data, j) => {
                            rowIDs[i].push(j)
                            dataBlob[i + ':' + j] = data

                        })

                    })


                    let section = (data, sectionID) => {
                        return data[sectionID]
                    }
                    let row = (data, sectionID, rowID) => {
                        return data[sectionID + ':' + rowID]
                    }


                    let ds = new ListView.DataSource({
                        getSectionData: section,
                        getRowData: row,
                        rowHasChanged: (r1, r2) => r1 !== r2,
                        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,

                    })

                    this.setState({
                        source: ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                        name: datas.real_name,
                        phone: datas.phone,
                        headUrl: datas.head_portrait_url,
                        renderPlaceholderOnly: 'success',
                        isRefreshing: false
                    });

                })

            } else {
                this.setState({
                    renderPlaceholderOnly: 'error',
                    isRefreshing: false
                });
            }
        })

    }


    initData = (id, name) => {
        if (id === 15) {
            Car[0].cars.push({
                "icon": require('../../image/mainImage/zhanghuguanli.png'),
                "name": name
                , "id": id
            })
        } else if (id === 16) {
            Car[0].cars.push({
                "icon": require('../../image/mainImage/yuangongguanli.png'),
                "name": name
                , "id": id
            })
        } else if (id === 17) {
            Car[0].cars.push({
                "icon": require('../../image/mainImage/switchcompony.png'),
                "name": name
                , "id": id
            })
        } else if (id === 20) {
            Car[2].cars.push({
                "icon": require('../../image/mainImage/my_order.png'),
                "name": name
                , "id": id
            })
        } else if (id === 18) {
            Car[1].cars.push({
                "icon": require('../../image/mainImage/youhuiquanguanli.png'),
                "name": name
                , "id": id
            })
        } else if (id === 19) {
            Car[1].cars.push({
                "icon": require('../../image/mainImage/hetongguanli.png'),
                "name": name
                , "id": id
            })
        } else if (id === 21) {
            Car[2].cars.push({
                "icon": require('../../image/mainImage/shoucangjilu.png'),
                "name": name
                , "id": id
            })
        } else if (id === 22) {
            Car[2].cars.push({
                "icon": require('../../image/mainImage/liulanlishi.png'),
                "name": name,
                "id": id
            })
        } else if (id === 24) {
            Car[3].cars.push({
                "icon": require('../../image/mainImage/shezhi.png'),
                "name": name
                , "id": id
            })
        } else if (id === 47) {
            Car[2].cars.push({
                "icon": require('../../image/mainImage/myCarSource.png'),
                "name": name
                , "id": id
            })
        }
    }


    render() {

        if (this.state.renderPlaceholderOnly === 'loading') {
            return (
                <View>
                    {
                        this.loadView()
                    }
                </View>
            )
        }

        return (
            <View style = {{backgroundColor:fontAndClolr.THEME_BACKGROUND_COLOR, flex:1}}>
                <ListView
                    contentContainerStyle={styles.listStyle}
                    removeClippedSubviews={false}
                    dataSource={this.state.source}
                    renderRow={this._renderRow}
                    renderSectionHeader={this._renderSectionHeader}
                    renderSeparator = {this._renderSeparator}
                    renderHeader = {this._renderHeader}
                    enableEmptySections = {true}
                    refreshControl = {
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.refreshingData}
                            tintColor={[fontAndClolr.NAVI_BAR_COLOR]}

                        />
                    }
                />
            </View>
        )
    }

    _renderSeparator = ()=>{
        return(<View style = {{height:StyleSheet.hairlineWidth, backgroundColor:fontAndClolr.COLORA1}}/>)
    }


    _renderHeader = () => {
        return (
            <View style = {{height:200, backgroundColor:fontAndClolr.NAVI_BAR_COLOR, alignItems:'center'}}>
                <TouchableOpacity
                    onPress = {()=>{

                    }}
                    style = {{marginTop:50}}
                >
                    <Image style = {{width:60, height:60, resizeMode:'stretch'}} source = {this.state.headUrl?this.state.headUrl:require('../../image/mainImage/whiteHead.png')}/>
                </TouchableOpacity>
                <SText style ={{color:'white', fontSize:17, marginTop:12}} >{this.state.name}</SText>
                <SText style = {{color:'white', fontSize:14, marginTop:10}}>{componyname}</SText>
            </View>

        )
    }

    refreshingData = () => {

    }

    _renderSectionHeader=(data,sectionID)=>{
        return(
            <View style = {{height:10, backgroundColor:fontAndClolr.THEME_BACKGROUND_COLOR}}/>
        )

    }

    _renderRow = (data, sectionID, rowID) => {

        return(
            <TouchableOpacity
                onPress = {()=>{
                    this._rowPress(data)
                }}
            >
                <View style = {{flexDirection:'row', alignItems:'center', height:50, backgroundColor:'white'}}>
                    <Image source = {data.icon} style = {{marginLeft:15, marginRight:10}}/>
                    <SText style = {{flex:1}}>{data.name}</SText>
                    {data.name === '我的订单' && haveOrder !== 0 ?
                        <View style={{
                            marginRight: Pixel.getPixel(15),
                            width: Pixel.getPixel(10),
                            height: Pixel.getPixel(10),
                            backgroundColor: fontAndClolr.COLORB2,
                            borderRadius: 10
                        }}
                        /> : null}
                    <Image source = {require('../../image/mainImage/celljiantou.png')} style ={{marginRight:15}}/>
                </View>
            </TouchableOpacity>

        )
    }

    _rowPress = (data)=>{
        console.log(data)
    }

}

const styles = StyleSheet.create({

    listStyle:{

    }

})