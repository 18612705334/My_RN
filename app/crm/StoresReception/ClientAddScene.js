/**
 * Created by hanmeng on 2017/7/26.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtils';
const Pixel = new PixelUtil();
import NavigationView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/FontAndColor';
import BaseComponent from '../../component/BaseComponent';
import BaseInfoItem from "./component/item/BaseInfoItem";
import BuyerDemandItem from "./component/item/BuyerDemandItem";
import CommunicationRecordItem from "./component/item/CommunicationRecordItem";
import * as AppUrls from "../../constant/appUrls";
import {request} from "../../utils/RequestUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import StorageUtil from "../../utils/StorageUtil";

export default class ClientAddScene extends BaseComponent {

    /**
     *  constructor
     * @param props
     **/
    constructor(props) {
        super(props);
        this.clientInfo = [];
        this.companyId = '';
        this.state = {
            //dataSource: [],
            renderPlaceholderOnly: 'blank'
        };
    }

    /**
     *
     **/
    initFinish = () => {
        //const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                this.companyId = datas.company_base_id;
            }
            this.setState({
                //dataSource: ds.cloneWithRows(['0', '1', '2']),
                renderPlaceholderOnly: 'success'
            });
        });
    };

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
                        title="客户信息"
                        renderRihtFootView={this._navigatorRightView}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <NavigationView
                        backIconClick={this.backPage}
                        title="客户信息"
                        renderRightFootView={this._navigatorRightView}/>
                    {/*<ListView
                     removeClippedSubviews={false}
                     style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getTitlePixel(75)}}
                     dataSource={this.state.dataSource}
                     renderRow={this._renderRow}
                     renderSeparator={this._renderSeperator}/>*/}

                    <ScrollView
                        style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getTitlePixel(75)}}
                        ref={(ref) => {
                            this.scrollView = ref
                        }} keyboardDismissMode={Platform.OS === 'android' ? 'none' : 'on-drag'}>

                        {this._renderRow()}

                    </ScrollView>

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
                //key={`${sectionID}-${rowID}`}
                style={{backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR, height: Pixel.getPixel(10)}}/>
        )
    };

    /**
     *
     **/
    _renderRow = () => {
        return (

            <View style={styles.container}>
                <BaseInfoItem ref={(ref) => {
                    this.baseInfoItem = ref
                }}
                              companyId={this.companyId}
                              showModal={this.props.showModal}
                              showToast={this.props.showToast}
                              navigator={this.props.navigator}/>
                <View style={{backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR, height: Pixel.getPixel(10)}}/>
                <BuyerDemandItem ref={(ref) => {
                    this.buyerDemandItem = ref
                }}
                                 showModal={this.props.showModal}
                                 showToast={this.props.showToast}
                                 navigator={this.props.navigator}/>
                <View style={{backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR, height: Pixel.getPixel(10)}}/>
                <CommunicationRecordItem ref={(ref) => {
                    this.communicationRecordItem = ref
                }}
                                         showModal={this.props.showModal}
                                         showToast={this.props.showToast}
                                         navigator={this.props.navigator}/>
            </View>

        )
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
                    maps['mobiles'] = data.result + this.companyId;
                    /*            let maps = {
                     outTime: "2017-08-01 10:25:00",
                     inTime: "2017-08-01 09:25:00",
                     mobiles: "18000000002",
                     intentionalVehicle: "阿斯顿·马丁 阿斯顿马丁DB11 2016款 阿斯顿・马丁DB11 5.2T 设计师定制版",
                     customerBudget: "10万以下",
                     peopleNum: 1,
                     customerLevel: "A",
                     customerStatus: 1,
                     informationSources: "自到店",
                     customerRegion: "本地",
                     customerPhone: "13401091926",
                     customerName: "ceshi444",
                     customerCome: 1
                     };*/
                    let url = AppUrls.CUSTOMER_ADD_URL;
                    request(url, 'post', maps).then((response) => {
                        this.props.showModal(false);
                        this.props.callBack();
                        this.backPage();
                    }, (error) => {
                        this.props.showModal(false);
                        //console.log('请求错误 = ', error);
                        this.setState({
                            isRefreshing: false,
                            renderPlaceholderOnly: 'error'
                        });
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
        let startTime = '';
        let endTime = '';
        let baseInfoItems = this.baseInfoItem.getItemData();
        for (let key in baseInfoItems) {
            this.clientInfo.push(baseInfoItems[key]);
        }

        let buyerDemandItems = this.buyerDemandItem.getItemData();
        for (let key in buyerDemandItems) {
            this.clientInfo.push(buyerDemandItems[key]);
        }

        let communicationRecordItems = this.communicationRecordItem.getItemData();
        for (let key in communicationRecordItems) {
            this.clientInfo.push(communicationRecordItems[key]);
        }
        //console.log('this.clientInfo=====', this.clientInfo);
        for (let key in this.clientInfo) {
            //console.log('this.clientInfo=====', key + this.clientInfo[key]);
            if (this.clientInfo[key].name == '客户到店') {
                continue;
            }
            /*            if (this.clientInfo[key].name == '电话' && this.clientInfo[key].value.length !== 11) {
                            this.props.showToast(this.clientInfo[key].name + '输入不正确');
                            return false;
                        }*/
            if (this.clientInfo[key].value == '') {
                this.props.showToast(this.clientInfo[key].name + '不能为空');
                return false;
            }
            if (this.clientInfo[key].name == '进店时间') {
                startTime = this.clientInfo[key].value;
            }
            if (this.clientInfo[key].name == '离店时间') {
                endTime = this.clientInfo[key].value;
            }
        }
        if (endTime < startTime) {
            this.props.showToast('离店时间不能早于进店时间');
            return false;
        }
        return true;
    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR
    }
})