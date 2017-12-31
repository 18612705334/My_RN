import  React, {Component, PropTypes} from  'react'
import  {
    View,
    RefreshControl,
    ListView,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    Text
} from  'react-native'

import  PixelUtil from '../../utils/PixelUtils'
var Pixel = new PixelUtil();
import {request} from '../../utils/RequestUtil';
import * as fontAndColor from '../../constant/FontAndColor';
import BaseComponent from "../../component/BaseComponent";
import NavigationView from '../../component/AllNavigationView';
import * as AppUrls from '../../constant/appUrls';
import CustomerAddScene from "./ClientAddScene";
import WebViewTitle from "../../mine/accountManage/component/WebViewTitle";
import ClientSearchScene from "./ClientSearchScene";
import {ClientAddTimeSelectView} from "./component/ClientAddTimeSelectView";
import {ClientScreeningSelectButton} from "./component/ClientScreeningSelectButton";
import ClientScreeningView from "./component/ClientScreeningView";
import ClientInfoScene from "./ClientInfoScene";
import LoadMoreFooter from "../../carSource/znComponent/LoadMoreFooter";
const cellJianTou = require('../../../image/mainImage/celljiantou.png');
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
/*
 * 获取屏幕的宽和高
 **/
const {width, height} = Dimensions.get('window');

export default class StoreReceptionManageNewScene extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.timeSelect = this.props.timeSelect ? this.props.timeSelect : '今天';
        this.selectMonth = '选择月份';
        this.potentialClientList = [];
        this.companyId = '';
        this.pageNum = 1;
        this.allPage = 1;
        this.screeningItems = {
            xxly: {index: 0, value: '所有来源'},
            khjb: {index: 0, value: '所有级别'},
            dfzt: {index: 0, value: '全部状态'},
            gmys: {index: 0, value: '所有预算'}
        };
        this.state = {
            dataSource: [],
            renderPlaceholderOnly: 'blank',
            isRefreshing: false,
            addTimeHide: false,
            selectFilterHide: false
        };
    }

    /**
     *
     **/
    initFinish = () => {
        /*        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
         this.setState({
         dataSource: ds.cloneWithRows(['', '', '', '', '', '', '', '', '']),
         renderPlaceholderOnly: 'success'
         });*/
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                this.companyId = datas.company_base_id;
                this.loadData();
            }
        });
    };

    /**
     *   刷新页面数据
     **/
    refreshData = () => {
        this.props.showModal(true);
        this.loadData();
    };

    /**
     *   时间单位筛选映射
     **/
    timeSelectMapping = () => {
        if (this.timeSelect === '今天') {
            return 1;
        } else if (this.timeSelect === '本周') {
            return 2;
        } else if (this.timeSelect === '本月') {
            return 3;
        } else {
            return '';
        }
    };

    /**
     *  下拉刷新数据
     **/
    refreshingData = () => {
        this.potentialClientList = [];
        this.setState({isRefreshing: true});
        this.loadData();
    };

    /**
     *   数据请求
     **/
    loadData = () => {
        StorageUtil.mGetItem(StorageKeyNames.PHONE, (data) => {
            if (data.code == 1 && data.result != null) {
                let maps = {
                    //mobile: '15102373842',
                    mobile: data.result + this.companyId,
                    //token: '5afa531b-4295-4c64-8d6c-ac436c619078',
                    xxly: this.screeningItems.xxly.value,
                    khjb: this.screeningItems.khjb.value,
                    dfzt: this.screeningItems.dfzt.value,
                    gmys: this.screeningItems.gmys.value,
                    pc: 1,
                    times: this.timeSelectMapping(),
                    month: this.selectMonth === '选择月份' ? '' : this.selectMonth
                    //createTime: '2017-08-09 15:18:47'
                };
                let url = AppUrls.POTENTIAL_CUSTOMER_LISTS;
                this.pageNum = 1;
                request(url, 'post', maps).then((response) => {
                    this.props.showModal(false);
                    this.potentialClientList = response.mjson.data.record.beanlist;
                    this.allPage = response.mjson.data.record.tp;
                    if (this.potentialClientList && this.potentialClientList.length > 0) {
                        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(this.potentialClientList),
                            isRefreshing: false,
                            renderPlaceholderOnly: 'success'
                        });
                    } else {
                        this.setState({
                            isRefreshing: false,
                            renderPlaceholderOnly: 'null'
                        });
                    }
                }, (error) => {
                    this.props.showModal(false);
                    this.setState({
                        isRefreshing: false,
                        renderPlaceholderOnly: 'error'
                    });
                });
            } else {
                this.props.showToast('查询账户信息失败');
            }
        });
    };

    /**
     *   上拉加载
     **/
    loadMoreData = () => {
        StorageUtil.mGetItem(StorageKeyNames.PHONE, (data) => {
            if (data.code == 1 && data.result != null) {
                this.pageNum += 1;
                let maps = {
                    //mobile: '15102373842',
                    mobile: data.result + this.companyId,
                    //token: '5afa531b-4295-4c64-8d6c-ac436c619078',
                    xxly: this.screeningItems.xxly.value,
                    khjb: this.screeningItems.khjb.value,
                    dfzt: this.screeningItems.dfzt.value,
                    gmys: this.screeningItems.gmys.value,
                    pc: this.pageNum,
                    times: this.timeSelectMapping(),
                    month: this.selectMonth === '选择月份' ? '' : this.selectMonth
                    //createTime: '2017-08-09 15:18:47'
                };
                let url = AppUrls.POTENTIAL_CUSTOMER_LISTS;
                request(url, 'post', maps).then((response) => {
                    let data = response.mjson.data.record.beanlist;
                    if (data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            this.potentialClientList.push(data[i]);
                        }
                        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            isRefreshing: false,
                            dataSource: ds.cloneWithRows(this.potentialClientList)
                        });
                    } else {
                        this.allPage = this.pageNum;
                        this.setState({
                            isRefreshing: false
                        });
                    }
                }, (error) => {
                    this.setState({
                        isRefreshing: false,
                        renderPlaceholderOnly: 'error'
                    });
                });
            } else {
                this.props.showToast('查询账户信息失败');
            }
        });
    };

    /**
     *
     **/
    render() {
        if (this.state.renderPlaceholderOnly != 'success') {
            return (
                <View style={styles.container}>
                    <NavigationView
                        backIconClick={this.backPage}
                        title="门店接待"
                        renderRightFootView={this._navigatorRightView}/>
                    <Image style={{
                        marginTop: Pixel.getTitlePixel(64),
                        height: Pixel.getPixel(40),
                        width: width,
                        flexDirection: 'row'
                    }}
                           source={require('../../../image/carSourceImages/bottomShaow.png')}>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <ClientScreeningSelectButton
                                style={{flex: 1}}
                                ref={(ref) => {
                                    this.btn1 = ref
                                }} title={this.timeSelect} index={1} btnClick={this.selectAddTime}/>
                        </View>
                        <View style={styles.lineView}>
                            <View style={styles.line}/>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <ClientScreeningSelectButton
                                style={{flex: 1}}
                                ref={(ref) => {
                                    this.btn2 = ref
                                }} title="筛选" index={2} btnClick={this.selectFilterItems}/>
                        </View>
                    </Image>
                    {this.loadView()}
                    {this.state.addTimeHide && <ClientAddTimeSelectView hideView={this.selectAddTime}
                                                                        selectMonth={this.selectMonth}
                                                                        updateMonth={this.updateMonth}
                                                                        currentSelect={this.timeSelect}
                                                                        callBack={this.updateTimeSelect}/>}

                    {this.state.selectFilterHide && <ClientScreeningView
                        updateScreeningItems={this.updateScreeningItems}
                        screeningItems={this.screeningItems}
                        hideView={this.selectFilterItems}/>}
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <NavigationView
                        backIconClick={this.backPage}
                        title="门店接待"
                        renderRightFootView={this._navigatorRightView}/>
                    {/*<ClientScreeningHeadView ref="headView"/>*/}
                    <Image style={{
                        marginTop: Pixel.getTitlePixel(64),
                        height: Pixel.getPixel(40),
                        width: width,
                        flexDirection: 'row'
                    }}
                           source={require('../../../image/carSourceImages/bottomShaow.png')}>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <ClientScreeningSelectButton
                                style={{flex: 1}}
                                ref={(ref) => {
                                    this.btn1 = ref
                                }} title="今天" index={1} btnClick={this.selectAddTime}/>
                        </View>
                        <View style={styles.lineView}>
                            <View style={styles.line}/>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <ClientScreeningSelectButton
                                style={{flex: 1}}
                                ref={(ref) => {
                                    this.btn2 = ref
                                }} title="筛选" index={2} btnClick={this.selectFilterItems}/>
                        </View>
                    </Image>
                    <ListView style={{backgroundColor: fontAndColor.COLORA3}}
                              dataSource={this.state.dataSource}
                              removeClippedSubviews={false}
                              renderRow={this._renderRow}
                              enableEmptySections={true}
                              renderFooter={this.renderListFooter}
                              onEndReached={this.toEnd}
                              renderSeparator={this._renderSeperator}
                              refreshControl={
                                  <RefreshControl
                                      refreshing={this.state.isRefreshing}
                                      onRefresh={this.refreshingData}
                                      tintColor={[fontAndColor.COLORB0]}
                                      colors={[fontAndColor.COLORB0]}
                                  />
                              }/>
                    {this.state.addTimeHide && <ClientAddTimeSelectView hideView={this.selectAddTime}
                                                                        selectMonth={this.selectMonth}
                                                                        updateMonth={this.updateMonth}
                                                                        currentSelect={this.timeSelect}
                                                                        callBack={this.updateTimeSelect}/>}

                    {this.state.selectFilterHide && <ClientScreeningView
                        updateScreeningItems={this.updateScreeningItems}
                        screeningItems={this.screeningItems}
                        hideView={this.selectFilterItems}/>}
                </View>
            );
        }
    }

    /**
     *
     **/
    renderListFooter = () => {
        if (this.state.isRefreshing) {
            return null;
        } else {
            return (<LoadMoreFooter isLoadAll={this.pageNum >= this.allPage} isCarFoot={false}/>)
        }
    };

    /**
     *
     **/
    toEnd = () => {
        if (this.pageNum < this.allPage && !this.state.isRefreshing) {
            this.loadMoreData();
        }
    };

    /**
     *  listView间隔线
     **/
    _renderSeperator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(1)}}/>
        )
    }

    /**
     *  _renderRow
     **/
    _renderRow = (rowData, selectionID, rowID) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.toNextPage({
                        name: 'ClientInfoScene',
                        component: ClientInfoScene,
                        params: {
                            rowData: rowData
                        }
                    });
                }}
                activeOpacity={0.9}
            >
                <View style={{
                    height: Pixel.getPixel(44),
                    backgroundColor: '#ffffff',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text
                        allowFontScaling={false}
                        style={{
                            marginLeft: Pixel.getPixel(15),
                            fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color: fontAndColor.COLORA0
                        }}>{rowData.customerName}</Text>
                    <View style={{flex: 1}}/>
                    <Image source={cellJianTou} style={{marginRight: Pixel.getPixel(15),}}/>
                </View>
            </TouchableOpacity>
        )
    };

    /**
     *
     **/
    updateTimeSelect = (newTime) => {
        this.timeSelect = newTime;
        this.selectAddTime();
        this.btn1.setTitle(this.timeSelect);
        this.selectMonth = '选择月份';
        this.refreshData();
    };

    /**
     *
     * @param newMonth
     **/
    updateMonth = (newMonth) => {
        this.selectMonth = newMonth;
        this.selectAddTime();
        this.btn1.setTitle(this.selectMonth);
        this.timeSelect = '';
        this.refreshData();
    };

    /**
     * xxly: {index: 0, value: '所有来源'},
     * khjb: {index: 0, value: '所有级别'},
     * dfzt: {index: 0, value: '全部状态'},
     * gmys: {index: 0, value: '所有预算'}
     * @param newScreeningItems
     **/
    updateScreeningItems = (newScreeningItems) => {
        this.screeningItems = newScreeningItems;
        this.selectFilterItems();
        if (newScreeningItems.xxly.index === 0 &&
            newScreeningItems.khjb.index === 0 &&
            newScreeningItems.dfzt.index === 0 &&
            newScreeningItems.gmys.index === 0 ) {
            this.btn2._setImgHighlighted(false);
        } else {
            this.btn2._setImgHighlighted(true);
        }
        this.refreshData();
    };


    /**
     *  筛选项选择
     **/
    selectFilterItems = () => {
        this.setState({
            addTimeHide: false,
            selectFilterHide: !this.state.selectFilterHide
        });
    };

    /**
     *  时间选择
     **/
    selectAddTime = () => {
        this.setState({
            addTimeHide: !this.state.addTimeHide,
            selectFilterHide: false
        });
    };

    /**
     *
     **/
    _navigatorRightView = () => {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                    style={{marginRight: Pixel.getPixel(7)}}
                    onPress={() => {
                        this.toNextPage({
                            name: 'ClientSearchScene',
                            component: ClientSearchScene,
                            params: {}
                        });
                    }}
                    activeOpacity={0.9}
                >
                    <Image source={require('../../../image/mainImage/search_order.png')}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{marginLeft: Pixel.getPixel(7)}}
                    activeOpacity={0.9}
                    onPress={() => {
                        this.toNextPage({
                            name: 'ClientAddScene',
                            component: CustomerAddScene,
                            params: {
                                callBack: this.refreshData
                            }
                        })
                    }}>
                    <Image source={require('../../../image/employee_manage.png')}/>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
    },
    selectView: {
        //top: Pixel.getTitlePixel(90),
        backgroundColor: 'rgba(0, 0, 0,0.3)',
        left: 0,
        right: 0,
        position: 'absolute',
        bottom: 0,
    },
    lineView: {
        width: StyleSheet.hairlineWidth,
        justifyContent: 'center'
    },
    line: {
        height: Pixel.getPixel(15),
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
    }
});
