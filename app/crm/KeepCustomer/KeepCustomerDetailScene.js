/**
 * Created by hanmeng on 2017/8/12.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    ListView,
    Platform,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';

const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtils';
const Pixel = new PixelUtil();
import NavigationView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/FontAndColor';
import BaseComponent from '../../component/BaseComponent';
import * as AppUrls from "../../constant/appUrls";
import {request} from "../../utils/RequestUtil";
import DealAmountItem from "./component/item/DealAmountItem";
import CarInfoItem from "./component/item/CarInfoItem";
import BuyersInfoItem from "./component/item/BuyersInfoItem";
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";

export default class KeepCustomerDetailScene extends BaseComponent {

    /**
     *  constructor
     * @param props
     **/
    constructor(props) {
        super(props);
        this.buyerInfo = {};
        this.carInfo = {};
        this.clientInfo = [];
        this.state = {
            dataSource: [],
            isRefreshing: false,
            renderPlaceholderOnly: 'blank'
        };
    }

    /**
     *
     **/
    initFinish = () => {
        /*        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
         this.setState({
         dataSource: ds.cloneWithRows(['0', '1', '2']),
         renderPlaceholderOnly: 'success'
         });*/
        this.loadData();
    };

    /**
     *   数据请求
     **/
    loadData = () => {
        let maps = {
            tid: this.props.tid ? this.props.tid : '',
            tcid: this.props.tcid
        };
        let url = AppUrls.TENURE_CAR_PEOPLE_MSG;
        request(url, 'post', maps).then((response) => {
            this.buyerInfo = response.mjson.data.tenureMap;
            this.carInfo = response.mjson.data.carMap;
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
                dataSource: ds.cloneWithRows(['0', '1', '2']),
                isRefreshing: false,
                renderPlaceholderOnly: 'success'
            });
        }, (error) => {
            this.setState({
                isRefreshing: false,
                renderPlaceholderOnly: 'error'
            });
        });

    }

    /**
     *  render
     * @returns {XML}
     **/
    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={styles.container}>
                    {this.loadView()}
                    <NavigationView
                        backIconClick={this.backPage}
                        title="保有客户管理"
                        renderRihtFootView={this._navigatorRightView}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <NavigationView
                        backIconClick={this.backPage}
                        title="保有客户管理"
                        renderRihtFootView={this._navigatorRightView}/>
                    {/*<ListView
                     removeClippedSubviews={false}
                     style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getTitlePixel(75)}}
                     dataSource={this.state.dataSource}
                     renderRow={this._renderRow}
                     renderSeparator={this._renderSeperator}/>*/}
                    {Platform.OS === 'android' ?
                        <ScrollView
                            style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getTitlePixel(75)}}
                            ref={(ref) => {
                                this.scrollView = ref
                            }} keyboardDismissMode='none'>

                            {this._renderRow()}

                        </ScrollView> :
                        <KeyboardAvoidingView behavior={'position'} style={{marginTop: Pixel.getTitlePixel(75)}}>
                            <ScrollView
                                style={{backgroundColor: fontAndColor.COLORA3}}
                                ref={(ref) => {
                                    this.scrollView = ref
                                }} keyboardDismissMode='on-drag'>

                                {this._renderRow()}

                            </ScrollView>
                        </KeyboardAvoidingView>}
                </View>
            );
        }
    }

    /**
     *
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
     **/
    _renderRow = () => {
        return (
            <View style={styles.container}>
                <DealAmountItem ref={(ref) => {
                    this.dealAmountItem = ref
                }} data={this.carInfo}/>
                <View style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(10)}}/>
                <CarInfoItem ref={(ref) => {
                    this.carInfoItem = ref
                }} data={this.carInfo}/>
                <View style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(10)}}/>
                <BuyersInfoItem ref={(ref) => {
                    this.buyersInfoItem = ref
                }} data={this.buyerInfo} navigator={this.props.navigator}/>
            </View>
        )
    };


    /**
     *
     **/
    submitClientInfo = () => {
        this.props.showModal(true);
        if (this.checkInfo()) {
            StorageUtil.mGetItem(StorageKeyNames.PHONE, (data) => {
                if (data.code == 1 && data.result != null) {
                    //console.log('this.clientInfo=====', this.clientInfo);
                    let maps = [];
                    for (let i = 0; i < this.clientInfo.length; i++) {
                        maps[this.clientInfo[i].parameter] = this.clientInfo[i].value;
                    }
                    maps['mobile'] = data.result;
                    //maps['tid'] = this.props.tid;
                    maps['tid'] = this.props.tid ? this.props.tid : '';
                    maps['tcid'] = this.props.tcid;
                    let url = AppUrls.UPDATE_CAR_WELFARE;
                    request(url, 'post', maps).then((response) => {
                        this.props.showModal(false);
                        this.props.callBack();
                        this.backPage();
                        //console.log('请求正确 = ', response);
                    }, (error) => {
                        this.props.showModal(false);
                        //console.log('请求错误 = ', error);
                        this.props.showToast('完善客户信息失败');
                    });
                } else {
                    this.props.showToast('查询账户信息失败');
                }
            });
        }
    };

    /**
     *
     **/
    checkInfo = () => {
        this.clientInfo = [];
        let carInfoItem = this.carInfoItem.getItemData();
        for (let key in carInfoItem) {
            this.clientInfo.push(carInfoItem[key]);
        }

        let buyersInfoItem = this.buyersInfoItem.getItemData();
        for (let key in buyersInfoItem) {
            this.clientInfo.push(buyersInfoItem[key]);
        }
        //console.log('this.clientInfo=====', this.clientInfo);
        for (let key in this.clientInfo) {
            /*            if (this.clientInfo[key].name == '手机号码' && this.clientInfo[key].value.length !== 11) {
                            this.props.showToast(this.clientInfo[key].name + '输入不正确');
                            return false;
                        }*/
            if ((this.clientInfo[key].name == '交强险到期' || this.clientInfo[key].name == '商业险到期' || this.clientInfo[key].name == '保养到期' ||
                    this.clientInfo[key].name == '质保到期' || this.clientInfo[key].name == '车牌号码' || this.clientInfo[key].name == '客户姓名') &&
                this.clientInfo[key].value == '') {
                this.props.showToast(this.clientInfo[key].name + '不能为空');
                return false;
            }
        }

        return true;
    };

    /**
     *
     * @returns {XML}
     * @private
     **/
    _navigatorRightView = () => {
        return (
            <TouchableOpacity
                style={{
                    width: Pixel.getPixel(53), height: Pixel.getPixel(27),
                    justifyContent: 'center', alignItems: 'flex-end',
                }}
                activeOpacity={0.8}
                onPress={() => {
                    this.submitClientInfo();
                }}>
                <Text style={{color: fontAndColor.COLORA3}}>保存</Text>
            </TouchableOpacity>
        );
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3
    }
});