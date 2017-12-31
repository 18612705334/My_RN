/**
 * Created by hanmeng on 2017/5/18.
 */
import React, {Component, PropTypes} from 'react'

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput
} from  'react-native'

const {width, height} = Dimensions.get('window');
import * as fontAndColor from '../../../../constant/FontAndColor';
import PixelUtil from '../../../../utils/PixelUtils';
import BaseComponent from "../../../../component/BaseComponent";
import ClientInfoSelected from "../ClientInfoSelected";
import CustomerInfoInput from "../ClientInfoInput";
import SelectScene from "../../SelectScene";
import ExplainModal from "../../../../mine/myOrder/component/ExplainModal";
import * as StorageKeyNames from "../../../../constant/storageKeyNames";
import StorageUtil from "../../../../utils/StorageUtil";
import {request} from "../../../../utils/RequestUtil";
import * as AppUrls from "../../../../constant/appUrls";
const Pixel = new PixelUtil();

export default class BaseInfoItem extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.rowData = this.props.rowData;
        this.childItems = [];
        this.childItems.push({name: '客户姓名', value: '', parameter: 'customerName'});
        this.childItems.push({name: '电话', value: '', parameter: 'customerPhone'});
        this.childItems.push({name: '当前客户状态', value: '', parameter: 'customerStatus'});
        this.childItems.push({name: '信息来源', value: '', parameter: 'informationSources'});
        this.childItems.push({name: '地域', value: '', parameter: 'customerRegion'});
        this.childItems.push({name: '客户到店', value: '', parameter: 'customerCome'});
        this.state = {
            refre: ''
        };
    }

    /**
     *
     **/
    initFinish = () => {
        /*this.setState({
         renderPlaceholderOnly: 'success'
         });*/
    }

    componentWillReceiveProps(nextProps) {
        this.rowData = nextProps.rowData;
        this.setState({
            refre: ''
        });
    }

    /**
     *   获取表单内数据
     **/
    getItemData = () => {
        return this.childItems;
    };

    /**
     *   将传入本页的数据解析
     **/
    parseData = () => {
        let parameter = '';
        for (let i = 0; i < this.childItems.length; i++) {
            parameter = this.childItems[i].parameter;
            this.childItems[i].value = this.rowData[parameter];
        }
        if (this.childItems[2].value == 2 && this.childItems[5].value == 1) {
            this.childItems[2].value = '电话邀约-到店';
        } else if (this.childItems[2].value == 2) {
            this.childItems[2].value = '电话邀约-未到店';
        } else if (this.childItems[2].value == 1) {
            this.childItems[2].value = '初次到店';
        } else if (this.childItems[2].value == 3) {
            this.childItems[2].value = '已购买';
        } else if (this.childItems[2].value == 4) {
            this.childItems[2].value = '置换';
        } else if (this.childItems[2].value == 5) {
            this.childItems[2].value = '复购';
        }
        /*
                if (this.childItems[5].value == 1) {
                    this.childItems[5].value = '到店';
                } else {
                    this.childItems[5].value = '未到店';
                }*/
    };


    /**
     *
     **/
    render() {
        let items = [];
        if (this.props.editState != 'look') {
            for (let i = 0; i < this.childItems.length; i++) {
                if (this.childItems[i].name == '客户到店') {
                    continue;
                } else if (i == 2) {
                    items.push(<ClientInfoSelected ref='selectsex' key={i + 'bo'} items={this.childItems[i]}
                                                   toSelect={() => {
                                                       this.toNextPage({
                                                           name: 'SelectScene',
                                                           component: SelectScene,
                                                           params: {
                                                               regShowData: ['初次到店', '电话邀约-到店', '电话邀约-未到店', '已购买', '置换', '复购'],
                                                               title: '客户状态',
                                                               callBack: (name) => {
                                                                   if (name === '初次到店') {
                                                                       this.childItems[i].value = 1;
                                                                   } else if (name === '电话邀约-到店') {
                                                                       this.childItems[i].value = 2;
                                                                       this.childItems[5].value = 1;
                                                                   } else if (name === '电话邀约-未到店') {
                                                                       this.childItems[i].value = 2;
                                                                       this.childItems[5].value = 2;
                                                                   } else if (name === '已购买') {
                                                                       this.childItems[i].value = 3;
                                                                   } else if (name === '置换') {
                                                                       this.childItems[i].value = 4;
                                                                   } else if (name === '复购') {
                                                                       this.childItems[i].value = 5;
                                                                   }
                                                                   this.refs.selectsex.setValue(name);
                                                               }
                                                           }
                                                       })
                                                   }}/>);
                } else if (i == 3) {
                    items.push(<ClientInfoSelected ref="company" key={i + 'bo'} items={this.childItems[i]}
                                                   toSelect={() => {
                                                       this.toNextPage({
                                                           name: 'SelectScene',
                                                           component: SelectScene,
                                                           params: {
                                                               regShowData: ['朋友介绍', '朋友圈', '58同城', '二手车之家', 'FM调频广播', '室外广告牌', '同行引荐', '文章引导', '自到店', '转介绍', '其他'],
                                                               title: '信息来源',
                                                               callBack: (name) => {
                                                                   this.childItems[i].value = name;
                                                                   this.refs.company.setValue(name);
                                                               }
                                                           }
                                                       })
                                                   }}/>);
                } else if (i == 4) {
                    items.push(<ClientInfoSelected ref='juese' key={i + 'bo'} items={this.childItems[i]}
                                                   toSelect={() => {
                                                       this.toNextPage({
                                                           name: 'SelectScene',
                                                           component: SelectScene,
                                                           params: {
                                                               regShowData: ['本地', '非本地'],
                                                               title: '地域',
                                                               callBack: (name) => {
                                                                   this.childItems[i].value = name;
                                                                   this.refs.juese.setValue(name);
                                                               }
                                                           }
                                                       })
                                                   }}/>);
                } else {
                    items.push(<CustomerInfoInput
                        ref={(ref) => {
                            if (ref != null && ref.props.items.name === '电话') {
                                this.customerInfoInput = ref;
                            }
                        }}
                        callBack={this.userAireadyExist} key={i + 'bo'}
                        items={this.childItems[i]}/>);
                }

            }
        } else {
            this.parseData();
            for (let i = 0; i < this.childItems.length; i++) {
                if (this.childItems[i].name == '客户到店') {
                    continue;
                }
                items.push(
                    <View
                        key={i + 'bo'}
                        style={{
                            width: width,
                            height: Pixel.getPixel(45),
                            backgroundColor: '#fff'
                        }}>
                        <View style={{
                            width: width,
                            height: Pixel.getPixel(44),
                            backgroundColor: '#00000000',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text allowFontScaling={false}
                                  style={{
                                      marginLeft: Pixel.getPixel(15),
                                      width: Pixel.getPixel(125),
                                      fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                                      color: fontAndColor.COLORA1
                                  }}>{this.childItems[i].name}</Text>
                            <Text allowFontScaling={false}
                                  style={{
                                      fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                                      color: '#000'
                                  }}>{this.childItems[i].value}</Text>
                        </View>
                        <View style={{
                            width: width,
                            height: Pixel.getPixel(1),
                            backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR
                        }}/>
                    </View>)
            }
        }
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
                <View style={{height: Pixel.getPixel(44), flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{
                        marginLeft: Pixel.getPixel(15),
                        backgroundColor: fontAndColor.NAVI_BAR_COLOR,
                        height: Pixel.getPixel(11),
                        width: Pixel.getPixel(3)
                    }}/>
                    <Text
                        style={{marginLeft: Pixel.getPixel(5), fontWeight: 'bold'}}
                        allowFontScaling={false}>基本信息</Text>
                </View>
                <View style={{
                    height: 1,
                    backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR
                }}/>
                {items}
                <ExplainModal ref={(ref) => {
                    this.em = ref
                }} title="提示" content="用户已经存在" text="确定"
                              buttonStyle={styles.expButton}
                              textStyle={styles.expText}/>
            </View>
        )
    }

    /**
     *  用户已经存在弹出提示框
     **/
    userAireadyExist = (customerPhone) => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.PHONE, (data) => {
            if (data.code == 1 && data.result != null) {
                let maps = {
                    mobiles: data.result + this.props.companyId,
                    customerPhone: customerPhone
                };
                let url = AppUrls.SELECT_CUST_IF_EXIST;
                request(url, 'post', maps).then((response) => {
                    //this.props.showModal(false);
                    this.props.showToast(response.mjson.msg);
                    //console.log('SELECT_CUST_IF_EXIST', 'succ');
                }, (error) => {
                    //this.props.showModal(false);
                    if (error.mjson.code == '0004') {
                        this.props.showToast(error.mjson.msg);
                    } else {
                        this.props.showToast('该客户已经存在');
                        //this.backPage();
                        this.customerInfoInput.clearInputText();
                    }
                    //console.log('SELECT_CUST_IF_EXIST', 'error');
                });
            } else {
                this.props.showToast('查询账户信息失败');
            }
        });
    };
}

const styles = StyleSheet.create({
    separatedLine: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15),
        height: 1,
        backgroundColor: fontAndColor.COLORA4
    },
    expButton: {
        marginBottom: Pixel.getPixel(20),
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(35),
        marginTop: Pixel.getPixel(16),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: fontAndColor.NAVI_BAR_COLOR
    },
    expText: {
        fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.NAVI_BAR_COLOR
    },
});