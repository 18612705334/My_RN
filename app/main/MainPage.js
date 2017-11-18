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
import PixelUtil from '../utils/PixelUtils'

let Pixel = new PixelUtil();
import TabNavigator from 'react-native-tab-navigator';

import HomeSence from './HomeScene'
import CarSourceSence from '../carSource/CarSourceListScene'
import MineSence from './MineScene'
import FinanceSence from './FinanceScene'
import PublishModal from './PublishModal'
import StorageUtil from '../utils/StorageUtil';
import * as storageKeyNames from '../constant/storageKeyNames';
import LoginGesture from '../login/LoginGesture';
import * as fontAndClolr from '../constant/FontAndColor';
import BaseComponent from '../component/BaseComponent';
import NonCreditScene from './NonCreditScene';
import LoginScene from '../login/LoginScene';
import AllSelectCompanyScene from '../main/AllSelectCompanyScene';

import CustomerServiceButton from '../component/CustomerServiceButton';
import WorkBenchScene from './WorkBenchScene';
import GetPermissionUtil from '../utils/GetPermissionUtil';

import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';

let tabArray = [];
const GetPermission = new GetPermissionUtil();

export class tableItemInfo {
    constructor(ref, key, title, selectedImg, defaultImg, topView) {
        this.ref = ref;
        this.key = key;
        this.title = title;
        this.selectedImg = selectedImg;
        this.defaultImg = defaultImg;
        this.topView = topView;
    }
}


export default class MainPage extends BaseComponent {


    constructor(props) {
        super(props)
        this.state = {
            renderPlaceHolderOnly: 'blank',
            openSelectBranch: false
        }
        tabArray = [];
    }


    initFinish = () => {
        StorageUtil.mGetItem(storageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code === 1) { //获取成功
                let result = JSON.parse(data.result);
                this.is_done_credit = result.is_done_credit;
                this.getUserPermission(result.company_base_id)
            } else {
                this.setState({renderPlaceHolderOnly: 'error'})
            }
        })
    }


    componentWillUnmount() {
        tabArray = [];
    }

    getUserPermission = (id) => {
        request(Urls.GETFUNCTIONBYTOKENENTER, 'POST', {enterprise_uid: id}).then((response) => {
            if (response.mjson.data === null || response.mjson.data.length <= 0) {
                this.setState({renderPlaceHolderOnly: 'null'});
            } else {
                StorageUtil.mSetItem(storageKeyNames.GET_USER_PERMISSION,

                    JSON.stringify(response.mjson), () => {
                        GetPermission.getFirstList((list) => {
                            list.map((item, i) => {
                                console.log(item);
                                tabArray.push(new tableItemInfo(item.ref, item.key, item.name, item.image, item.unImage, this.getTopView(item.ref)))
                                this.setState({
                                    selectedTab: tabArray[0].ref,
                                    renderPlaceHolderOnly: 'success'
                                })
                            })
                        })
                    })
            }
        }, (error) => {
            this.setState({renderPlaceHolderOnly: 'error'})
        })

    }

    getTopView = (ref) => {
        if (ref === 'firstpage') {
            return (
                <HomeSence
                    showModal={(value) => {
                        this.props.showModal(value)
                    }}
                    showToast={(value) => {
                        this.props.showToast(value)
                    }}
                    openModal={() => {

                    }}
                    backToLogin={() => {
                        this.resetRoute({name: 'LoginScene', conponent: LoginScene})
                    }}

                    callBack={(params) => {
                        this.toNextPage(params)
                    }}
                    jumpScene={(ref, openSelectBranch) => {
                        if (openSelectBranch === 'true') {
                            this.setState({selectedTab: ref})
                            StorageUtil.mSetItem(storageKeyNames.NEED_OPENBRAND, 'true');

                        } else if (openSelectBranch === storageKeyNames.NEED_CHECK_RECOMMEND) {

                            this.setState({selectedTab: ref})
                            StorageUtil.mSetItem(storageKeyNames.NEED_CHECK_RECOMMEND, 'true');

                        } else if (openSelectBranch === storageKeyNames.NEED_CHECK_NEW_CAR) {

                            this.setState({selectedTab: ref})
                            StorageUtil.mSetItem(storageKeyNames.NEED_CHECK_NEW_CAR, 'true');

                        } else {
                            if (ref === 'financePage') {
                                StorageUtil.mGetItem(storageKeyNames.NEED_GESTURE, (datas) => {
                                    if (datas.code === 1) {
                                        if (datas.result === 'true') {
                                            this.toNextPage({
                                                name: 'LoginGesture', component: LoginGesture, params: {
                                                    callBack: () => {
                                                        this.setState({selectedTab: ref})
                                                    }
                                                }
                                            });
                                        } else {
                                            this.setState({selectedTab: ref})
                                        }
                                    }
                                });
                            } else {
                                this.setState({selectedTab: ref})
                                StorageUtil.mSetItem(storageKeyNames.NEED_OPENBRAND, 'false');
                            }
                        }
                    }}


                />

            )

        } else if (ref === 'carpage') {
            return (
                <CarSourceSence
                    showModal={(value) => {
                        this.props.showModal(value)
                    }}
                    showToast={(value) => {
                        this.props.showToast(value)
                    }}
                    callBack = {(params)=>{
                        this.toNextPage(params)
                    }}
                    backToLogin={()=>{
                        this.backToLogin({name:'LoginScene',component:LoginScene});
                    }}
                />

            )

        } else if (ref === 'sendpage') {

            return (

                <WorkBenchScene
                    showModal={(value) => {
                        this.props.showModal(value)
                    }}
                    showToast={(value) => {
                        this.props.showToast(value)
                    }}
                    callBack={(params) => {
                        this.toNextPage(params)
                    }}
                />
            )

        } else if (ref === 'financePage') {

            return (
                <FinanceSence
                    showModal={(value) => {
                        this.props.showModal(value)
                    }}
                    showToast={(value) => {
                        this.props.showToast(value)
                    }}
                    callBack={(params) => {
                        this.toNextPage(params)
                    }}
                />

            )
        } else if (ref === 'mypage') {
            return (
                <MineSence
                    showModal={(value) => {
                        this.props.showModal(value)
                    }}
                    showToast={(value) => {
                        this.props.showToast(value)
                    }}
                    callBack={(params) => {
                        this.toNextPage(params)
                    }}
                />

            )

        }

    }

    render() {

        if (this.state.renderPlaceHolderOnly !== 'success') {
            return this._renderPlaceholderView();
        }

        let items = [];

        tabArray.map((item) => {
            let tabItem = <TabNavigator.Item
                selected={this.state.selectedTab === item.ref}
                key={item.key}
                onPress={() => {
                    this.setState({selectedTab: item.ref})
                }}
                title={item.title}
                renderSelectedIcon={() => <Image source={item.selectedImg} style={{}}/>}
                renderIcon={() => <Image source={item.defaultImg} style={{}}/>}
                selectedTitleStyle={styles.selectedTitleStyle}
            >
                {item.topView}
            </TabNavigator.Item>
            items.push(tabItem)

        })

        return (
            <View style={{flex: 1, backgroundColor: fontAndClolr.THEME_BACKGROUND_COLOR}}>


                <TabNavigator
                    sceneStyle={{backgroundColor: '#00000000'}}
                    tabBarShadowStyle={{backgroundColor: '#00000000'}}
                    tabBarStyle={{height: 50, backgroundColor: 'white', overflow: 'visible'}}
                >{items}</TabNavigator>
                <View
                    style={[styles.imageStyle, this.props.identity === "finance" ? {width: Pixel.getPixel(1)} : {width: 0}]}/>

            </View>
        )

    }

    _renderPlaceholderView = () => {
        return (
            <View style={{flex: 1, backgroundColor: fontAndClolr.THEME_BACKGROUND_COLOR}}>
                {this.loadView()}
            </View>
        )
    }

}


const styles = StyleSheet.create({

    selectedTitleStyle: {
        color: fontAndClolr.NAVI_BAR_COLOR,
    },

    imageStyle: {
        position: 'absolute',
        bottom: 10,
        left: width / 2.0 - 0.5,
        width: 1,
        height: 30,
        backgroundColor: 'lightgray'
    }

})