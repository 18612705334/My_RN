/**
 * Created by hanmeng on 2017/8/26.
 */
import React, {Component, PropTypes} from 'react'

import {
    StyleSheet,
    View,
    Text,
    ListView,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput,
    RefreshControl,
    Keyboard
} from  'react-native'
import BaseComponent from "../../component/BaseComponent";
import * as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';
import * as AppUrls from "../../constant/appUrls";
import {request} from "../../utils/RequestUtil";
import LoadMoreFooter from "../../carSource/znComponent/LoadMoreFooter";
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import KeepCustomerDetailScene from "./KeepCustomerDetailScene";
const Pixel = new PixelUtil();
const {width, height} = Dimensions.get('window');
const cellJianTou = require('../../../image/mainImage/celljiantou.png');

export default class KeepCustomerSearchScene extends BaseComponent {

    // 构造
    /**
     *
     * @returns {XML}
     **/
    constructor(props) {
        super(props);
        this.pageNum = 1;
        this.allPage = 1;
        this.clientListData = [];
        this.companyId = '';
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            renderPlaceholderOnly: 'blank',
            isRefreshing: false,
            value: '',
            startSearch: 0
        };
    }

    /**
     *
     * @returns {XML}
     **/
    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    /**
     *
     * @returns {XML}
     **/
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    /**
     *
     * @returns {XML}
     **/
    _keyboardDidShow() {
        //alert('Keyboard Shown');
    }

    /**
     *
     * @returns {XML}
     **/
    _keyboardDidHide() {
        //alert('Keyboard Hidden');
    }

    /**
     *
     * @returns {XML}
     **/
    initFinish = () => {
        //this.loadData();
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                this.companyId = datas.company_base_id;
            }
            this.setState({
                renderPlaceholderOnly: 'success'
            });
        });
    };

    /**
     *
     * @returns {XML}
     **/
    dateReversal = (time) => {
        const date = new Date();
        date.setTime(time);
        return (date.getFullYear() + "-" + (this.PrefixInteger(date.getMonth() + 1, 2)) + "-" +
            (this.PrefixInteger(date.getDate(), 2)));
    };

    /**
     *
     * @returns {XML}
     **/
    PrefixInteger = (num, length) => {
        return (Array(length).join('0') + num).slice(-length);
    };

    /**
     *
     * @returns {XML}
     **/
    refreshingData = () => {
        this.clientListData = [];
        this.setState({isRefreshing: true});
        this.loadData();
    };

    /**
     *
     * @returns {XML}
     **/
    startSearch = () => {
        Keyboard.dismiss();
        if (this.state.value === '') {
            this.props.showToast('车辆名称不能为空');
        } else {
            this.setState({
                startSearch: 1,
                renderPlaceholderOnly: 'loading'
            });
            this.loadData();
        }
    };

    /**
     *
     * @returns {XML}
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
     *
     * @returns {XML}
     **/
    loadData = () => {
        StorageUtil.mGetItem(StorageKeyNames.PHONE, (data) => {
            if (data.code == 1 && data.result != null) {
                let maps = {
                    mobile: data.result + this.companyId,
                    select: this.state.value,
                    pc: 1
                };
                let url = AppUrls.SELECT_BY_SEARCH;
                this.pageNum = 1;
                request(url, 'post', maps).then((response) => {
                    this.clientListData = response.mjson.data.record.beanlist;
                    this.allPage = response.mjson.data.record.tp;
                    if (this.clientListData && this.clientListData.length > 0) {
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(this.clientListData),
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
     * @returns {XML}
     **/
    loadMoreData = () => {
        StorageUtil.mGetItem(StorageKeyNames.PHONE, (data) => {
            if (data.code == 1 && data.result != null) {
                this.pageNum += 1;
                let maps = {
                    mobile: data.result + this.companyId,
                    select: this.state.value,
                    pc: this.pageNum
                };
                let url = AppUrls.SELECT_BY_SEARCH;
                request(url, 'post', maps).then((response) => {
                    let data = response.mjson.data.record.beanlist;
                    for (let i = 0; i < data.length; i++) {
                        this.clientListData.push(data[i]);
                    }
                    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    this.setState({
                        isRefreshing: false,
                        dataSource: ds.cloneWithRows(this.clientListData)
                    });
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
     * @returns {XML}
     **/
    _renderPlaceholderView() {
        return (
            <View style={styles.container}>
                <View style={styles.navigatorView}>
                    <View style={styles.navitgatorContentView}>
                        <TouchableOpacity
                            style={{justifyContent: 'center'}}
                            onPress={this.backPage}>
                            <Image style={styles.backIcon}
                                   source={require('../../../image/mainImage/navigatorBack.png')}/>
                        </TouchableOpacity>
                        <View style={styles.navigatorSousuoView}>
                            <Image style={{marginLeft: Pixel.getPixel(15), marginRight: Pixel.getPixel(10)}}
                                   source={require('../../../image/carSourceImages/sousuoicon.png')}/>
                            <TextInput
                                onChangeText={(text) => this.setState({value: text})}
                                placeholder={"电话、姓名、意向车型"}
                                style={styles.inputStyle}
                                underlineColorAndroid="transparent"

                            />
                        </View>
                        <TouchableOpacity onPress={this.startSearch}>
                            <View style={{
                                marginLeft: Pixel.getPixel(10),
                                width: Pixel.getPixel(50),
                                height: Pixel.getPixel(40),
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text allowFontScaling={false} style={{
                                    color: 'white',
                                    fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30)
                                }}>搜索</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.loadView()}
            </View>
        );
    }

    /**
     *
     * @returns {XML}
     **/
    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.navigatorView}>
                        <View style={styles.navitgatorContentView}>
                            <TouchableOpacity
                                style={{justifyContent: 'center'}}
                                onPress={this.backPage}>
                                <Image style={styles.backIcon}
                                       source={require('../../../image/mainImage/navigatorBack.png')}/>
                            </TouchableOpacity>
                            <View style={styles.navigatorSousuoView}>
                                <Image style={{marginLeft: Pixel.getPixel(15), marginRight: Pixel.getPixel(10)}}
                                       source={require('../../../image/carSourceImages/sousuoicon.png')}/>
                                <TextInput
                                    onChangeText={(text) => this.setState({value: text})}
                                    placeholder={"电话、姓名、意向车型"}
                                    style={styles.inputStyle}
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                            <TouchableOpacity onPress={this.startSearch}>
                                <View style={{
                                    marginLeft: Pixel.getPixel(10),
                                    width: Pixel.getPixel(50),
                                    height: Pixel.getPixel(40),
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text allowFontScaling={false} style={{
                                        color: 'white',
                                        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30)
                                    }}>搜索</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ListView style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getPixel(14)}}
                              dataSource={this.state.dataSource}
                              renderRow={this._renderRow}
                              removeClippedSubviews={false}
                              enableEmptySections={true}
                              renderSeparator={this._renderSeperator}
                              renderFooter={this.state.startSearch === 0 ? null : this.renderListFooter}
                              onEndReached={this.state.startSearch === 0 ? null : this.toEnd}
                              refreshControl={this.state.startSearch === 0 ? null :
                                  <RefreshControl
                                      refreshing={this.state.isRefreshing}
                                      onRefresh={this.refreshingData}
                                      tintColor={[fontAndColor.COLORB0]}
                                      colors={[fontAndColor.COLORB0]}
                                  />
                              }/>
                </View>
            )
        }
    }

    /**
     *
     * @returns {XML}
     **/
    _renderSeperator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(10)}}/>
        )
    }

    /**
     *
     * @returns {XML}
     **/
    _renderRow = (rowData, selectionID, rowID) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.toNextPage({
                        name: 'KeepCustomerDetailScene',
                        component: KeepCustomerDetailScene,
                        params: {
                            tid: rowData.tid,
                            tcid: rowData.tcid,
                            callBack: this.refreshData
                        }
                    });
                }}
                activeOpacity={0.9}
            >
                <View style={{
                    height: Pixel.getPixel(125),
                    backgroundColor: '#ffffff'
                }}>
                    <Text
                        allowFontScaling={false}
                        numberOfLines={1}
                        style={{
                            marginTop: Pixel.getPixel(20),
                            width: width - Pixel.getPixel(30),
                            marginLeft: Pixel.getPixel(15),
                            fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color: fontAndColor.COLORA0
                        }}>{rowData.tenureCarname}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: Pixel.getPixel(8),
                            marginLeft: Pixel.getPixel(15),
                            alignItems: 'center',
                        }}>
                        <Text
                            allowFontScaling={false}
                            style={{
                                fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                                color: fontAndColor.COLORA1
                            }}>成交时间:{rowData.saleTime}</Text>
                        {/*<View style={{flex: 1}}/>
                         <Text
                         allowFontScaling={false}
                         style={{
                         marginRight: Pixel.getPixel(15),
                         fontSize: Pixel.getFontPixel(19),
                         color: fontAndColor.COLORB2
                         }}>14.8万</Text>*/}
                    </View>
                    <View style={{flex: 1}}/>
                    <View style={{backgroundColor: fontAndColor.COLORA4, height: 1}}/>
                    {rowData.custName != null && rowData.custName != '' &&
                    rowData.custPhone != null && rowData.custPhone != '' &&
                    <View style={{height: Pixel.getPixel(44), flexDirection: 'row', alignItems: 'center'}}>
                        <Text allowFontScaling={false} style={{
                            marginLeft: Pixel.getPixel(15),
                            fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color: fontAndColor.COLORA0
                        }}>购车人:{rowData.custName}</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false} style={{
                            marginRight: Pixel.getPixel(15),
                            fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color: fontAndColor.COLORA0
                        }}>手机号:{rowData.custPhone}</Text>
                    </View>}
                    {((rowData.custName == null || rowData.custName == '') ||
                        (rowData.custPhone == null || rowData.custPhone == '')) &&
                    <View style={{
                        height: Pixel.getPixel(44),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        <View style={[styles.expButton, {marginRight: Pixel.getPixel(15)}]}>
                            <Text allowFontScaling={false} style={{
                                fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                color: fontAndColor.COLORB0
                            }}>完善资料</Text>
                        </View>
                    </View>}
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR
    },
    backIcon: {
        marginLeft: Pixel.getPixel(12),
        height: Pixel.getPixel(20),
        width: Pixel.getPixel(20),
    },
    navigatorView: {
        top: 0,
        height: Pixel.getTitlePixel(64),
        backgroundColor: fontAndColor.NAVI_BAR_COLOR,
        flexDirection: 'row'
    },
    navitgatorContentView: {
        flex: 1,
        flexDirection: 'row',
        marginTop: Pixel.getTitlePixel(20),
        height: Pixel.getPixel(44),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: fontAndColor.NAVI_BAR_COLOR
    },
    navigatorSousuoView: {
        height: Pixel.getPixel(27),
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        width: width - Pixel.getPixel(100),
        flexDirection: 'row'
    },
    image: {
        marginLeft: Pixel.getPixel(15),
        width: Pixel.getPixel(120),
        height: Pixel.getPixel(80),
        resizeMode: 'stretch'
    },
    inputStyle: {
        flex: 1,
        //backgroundColor: 'transparent',
        marginLeft: Pixel.getPixel(5),
        textAlign: 'left',
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.COLORA2,
        padding: 0
    },
    expButton: {
        width: Pixel.getPixel(88),
        height: Pixel.getPixel(27),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: fontAndColor.NAVI_BAR_COLOR
    }
});
