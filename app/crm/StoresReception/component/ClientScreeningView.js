/**
 * Created by hanmeng on 2017/5/9.
 * 采购、销售订单筛选
 */
import React, {Component} from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    ListView,
    Text,
    TouchableOpacity,
    InteractionManager
} from "react-native";

const {width, height} = Dimensions.get('window');
import BaseComponent from "../../../component/BaseComponent";
import NavigatorView from '../../../component/AllNavigationView';
import * as fontAndColor from '../../../constant/FontAndColor';
import PixelUtil from '../../../utils/PixelUtils';
import MyButton from "../../../component/MyButton";
import {request} from "../../../utils/RequestUtil";
import * as AppUrls from "../../../constant/appUrls";
import LabelParentPayType from "../../../component/LabelParentPayType";
const Pixel = new PixelUtil();
import LabelParent from '../../../component/LabelParent';

let info_source = [];
let client_level = [];
let visit_state = [];
let purchase_budget = [];

export default class ClientScreeningView extends BaseComponent {


    initFinish(){

    }

    /**
     *
     * @param props
     **/
    constructor(props) {
        super(props);
        info_source = [];
        client_level = [];
        visit_state = [];
        purchase_budget = [];
        this.infoSourceKey = this.props.screeningItems.xxly.index;
        this.infoSourceValue = this.props.screeningItems.xxly.value;

        this.clientLevelKey = this.props.screeningItems.khjb.index;
        this.clientLevelValue = this.props.screeningItems.khjb.value;

        this.visitStateKey = this.props.screeningItems.dfzt.index;
        this.visitStateValue = this.props.screeningItems.dfzt.value;

        this.purchaseBudgetKey = this.props.screeningItems.gmys.index;
        this.purchaseBudgetValue = this.props.screeningItems.gmys.value;

        info_source.push({title: '全部', isSelected: this.infoSourceKey === info_source.length, value: '所有来源', ref: 'type_child' + 0});
        info_source.push({title: '朋友介绍', isSelected: this.infoSourceKey === info_source.length, value: '朋友介绍', ref: 'type_child' + 1});
        info_source.push({title: '朋友圈', isSelected: this.infoSourceKey === info_source.length, value: '朋友圈', ref: 'type_child' + 2});
        info_source.push({title: '58同城', isSelected: this.infoSourceKey === info_source.length, value: '58同城', ref: 'type_child' + 3});
        info_source.push({title: '二手车之家', isSelected: this.infoSourceKey === info_source.length, value: '二手车之家', ref: 'type_child' + 4});
        info_source.push({title: 'FM调频广播',isSelected: this.infoSourceKey === info_source.length, value: 'FM调频广播', ref: 'type_child' + 5});
        info_source.push({title: '室外广告牌', isSelected: this.infoSourceKey === info_source.length, value: '室外广告牌', ref: 'type_child' + 6});
        info_source.push({title: '同行引荐', isSelected: this.infoSourceKey === info_source.length, value: '同行引荐', ref: 'type_child' + 7});
        info_source.push({title: '文章引导', isSelected: this.infoSourceKey === info_source.length, value: '文章引导', ref: 'type_child' + 8});
        info_source.push({title: '自到店', isSelected: this.infoSourceKey === info_source.length, value: '自到店', ref: 'type_child' + 9});
        info_source.push({title: '转介绍', isSelected: this.infoSourceKey === info_source.length, value: '转介绍', ref: 'type_child' + 10});
        info_source.push({title: '其他', isSelected: this.infoSourceKey === info_source.length, value: '其他', ref: 'type_child' + 11});

        client_level.push({title: '全部', isSelected: this.clientLevelKey === client_level.length, value: '所有级别', ref: 'type_child1' + 0});
        client_level.push({title: '一周以内',isSelected: this.clientLevelKey === client_level.length, value: 'A : 一周以内(购买欲望强)',ref: 'type_child1' + 1});
        client_level.push({title: '一个月以内',isSelected: this.clientLevelKey === client_level.length, value: 'B : 一月以内(准买车用户)',ref: 'type_child1' + 2});
        client_level.push({title: '三个月以内',isSelected: this.clientLevelKey === client_level.length, value: 'C : 三个月以内(有购买意向)', ref: 'type_child1' + 3});
        client_level.push({title: '闲逛',isSelected: this.clientLevelKey === client_level.length, value: 'D : 闲逛(近期无意向)', ref: 'type_child1' + 4});

        visit_state.push({title: '全部', isSelected: this.visitStateKey === visit_state.length, value: '全部状态', ref: 'type_child2' + 0});
        visit_state.push({title: '初次',isSelected: this.visitStateKey === visit_state.length,value: '初次',ref: 'type_child2' + 1});
        visit_state.push({title: '电话邀约',isSelected: this.visitStateKey === visit_state.length,value: '电话邀约',ref: 'type_child2' + 2});
        visit_state.push({title: '已购买',isSelected: this.visitStateKey === visit_state.length,value: '已购买', ref: 'type_child2' + 3});
        visit_state.push({title: '置换',isSelected: this.visitStateKey === visit_state.length,value: '置换', ref: 'type_child2' + 4});
        visit_state.push({title: '复购',isSelected: this.visitStateKey === visit_state.length,value: '复购', ref: 'type_child2' + 5});

        purchase_budget.push({title: '全部', isSelected: this.purchaseBudgetKey === purchase_budget.length, value: '所有预算', ref: 'type_child3' + 0});
        purchase_budget.push({title: '10万以下',isSelected: this.purchaseBudgetKey === purchase_budget.length,value: '10万以下',ref: 'type_child3' + 1});
        purchase_budget.push({title: '10-20万',isSelected: this.purchaseBudgetKey === purchase_budget.length,value: '10-20万',ref: 'type_child3' + 2});
        purchase_budget.push({title: '20-40万',isSelected: this.purchaseBudgetKey === purchase_budget.length,value: '20-40万', ref: 'type_child3' + 3});
        purchase_budget.push({title: '40-60万',isSelected: this.purchaseBudgetKey === purchase_budget.length,value: '40-60万', ref: 'type_child3' + 4});
        purchase_budget.push({title: '60万以上',isSelected: this.purchaseBudgetKey === purchase_budget.length,value: '60万以上', ref: 'type_child3' + 5});

        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(['1', '2', '3', '4'])
        };
    }


    /**
     *
     * @param props
     **/
    loadData = () => {

    };

    /**
     *   重置筛选项
     *   xxly: {index: 0, value: '所有来源'},
     *   khjb: {index: 0, value: '所有级别'},
     *   dfzt: {index: 0, value: '全部状态'},
     *   gmys: {index: 0, value: '所有预算'}
     **/
    resetSelection = () => {
        this.infoSourceKey = 0;
        this.infoSourceValue = '所有来源';
        this.clientLevelKey = 0;
        this.clientLevelValue = '所有级别';
        this.visitStateKey = 0;
        this.visitStateValue = '全部状态';
        this.purchaseBudgetKey = 0;
        this.purchaseBudgetValue = '所有预算';
        this.is.resetLabel(this.infoSourceKey, info_source);
        this.cl.resetLabel(this.clientLevelKey, client_level);
        this.vs.resetLabel(this.visitStateKey, visit_state);
        this.pb.resetLabel(this.purchaseBudgetKey, purchase_budget);
    };

    /**
     *   确认筛选项
     **/
    confirmSelection = () => {
        let newScreeningItems = {
            xxly: {index: this.infoSourceKey, value: this.infoSourceValue},
            khjb: {index: this.clientLevelKey, value: this.clientLevelValue},
            dfzt: {index: this.visitStateKey, value: this.visitStateValue},
            gmys: {index: this.purchaseBudgetKey, value: this.purchaseBudgetValue}
        };
        this.props.hideView();
        this.props.updateScreeningItems(newScreeningItems);
    };

    /**
     *
     * @param props
     **/
    render() {
        return (<View style={styles.container}>
            <ListView style={{backgroundColor: '#ffffff'}}
                      dataSource={this.state.dataSource}
                      removeClippedSubviews={false}
                      renderRow={this._renderRow}
                      enableEmptySections={true}
                      renderSeparator={this._renderSeperator}/>
            <View style={styles.separatedLine}/>
            <View style={{flexDirection: 'row', height: Pixel.getPixel(44), backgroundColor: '#ffffff'}}>
                <TouchableOpacity
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                    onPress={() => {
                        this.resetSelection();
                    }}>
                    <View >
                        <Text style={{fontSize: Pixel.getFontPixel(fontAndColor.NAVIGATORFONT),
                            color: fontAndColor.COLORA0}}>重置</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{flex: 1, alignItems: 'center', backgroundColor: fontAndColor.COLORB0, justifyContent: 'center'}}
                    onPress={() => {
                        this.confirmSelection();
                    }}>
                    <View >
                        <Text style={{fontSize: Pixel.getFontPixel(fontAndColor.NAVIGATORFONT),
                            color: '#ffffff'}}>确定</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/*            <TouchableOpacity style={{flex: 1}} onPress={() => {
                this.props.hideView()
            }}/>*/}
        </View>);
    }

    /**
     *
     **/
    _renderSeperator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(1)}}/>
        )
    }

    /**
     *
     **/
    _renderRow = (movie, sectionId, rowId) => {
        if (movie == 1) {
            return (
                <View style={styles.containerChild}>
                    <Text allowFontScaling={false} style={styles.carType}>信息来源</Text>
                    <LabelParent items={info_source} orderState={this.infoSourceKey} updateState={this.setInfoSourceKey}
                                 updateStatus={this.setInfoSourceValue} ref={(ref) => {this.is = ref}}/>
                </View>
            )
        } else if (movie == 2) {
            return (
                <View style={{
                    backgroundColor: '#ffffff'
                }}>
                    <Text allowFontScaling={false} style={styles.carType}>客户级别</Text>
                    <LabelParent items={client_level} orderState={this.clientLevelKey} updateState={this.setClientLevelKey}
                                 updateStatus={this.setClientLevelValue} ref={(ref) => {this.cl = ref}}/>
                </View>
            )
        } else if (movie == 3) {
            return (
                <View style={{
                    backgroundColor: '#ffffff'
                }}>
                    <Text allowFontScaling={false} style={styles.carType}>到访状态</Text>
                    <LabelParent items={visit_state} orderState={this.visitStateKey} updateState={this.setVisitStateKey}
                                 updateStatus={this.setVisitStateValue} ref={(ref) => {this.vs = ref}}/>
                </View>
            )
        } else if (movie == 4) {
            return (
                <View style={{
                    backgroundColor: '#ffffff'
                }}>
                    <Text allowFontScaling={false} style={styles.carType}>购买预算</Text>
                    <LabelParent items={purchase_budget} orderState={this.purchaseBudgetKey} updateState={this.setPurchaseBudgetKey}
                                 updateStatus={this.setPurchaseBudgetValue} ref={(ref) => {this.pb = ref}}/>
                </View>
            )
        } else {
            return (
                <View/>
            )
        }

    }

    /**
     *
     **/
    setInfoSourceKey = (newInfoSourceKey) => {
        this.infoSourceKey = newInfoSourceKey;
    }


    /**
     *
     **/
    setInfoSourceValue = (newInfoSourceValue) => {
        this.infoSourceValue = newInfoSourceValue;
    }

    /**
     *
     **/
    setClientLevelKey = (newClientLevelKey) => {
        this.clientLevelKey = newClientLevelKey;
    }

    /**
     *
     **/
    setClientLevelValue = (newClientLevelValue) => {
        this.clientLevelValue = newClientLevelValue;
    }

    /**
     *
     **/
    setVisitStateKey = (newVisitStateKey) => {
        this.visitStateKey = newVisitStateKey;
    }

    /**
     *
     **/
    setVisitStateValue = (newVisitStateValue) => {
        this.visitStateValue = newVisitStateValue;
    }

    /**
     *
     **/
    setPurchaseBudgetKey = (newPurchaseBudgetKey) => {
        this.purchaseBudgetKey = newPurchaseBudgetKey;
    }

    /**
     *
     **/
    setPurchaseBudgetValue = (newPurchaseBudgetValue) => {
        this.purchaseBudgetValue = newPurchaseBudgetValue;
    }

}

const styles = StyleSheet.create({
    text: {
        fontSize: Pixel.getPixel(16),
        color: 'rgb(13, 131, 144)'
    },
    container: {
        top: Pixel.getTitlePixel(104),
        backgroundColor: 'rgba(0, 0, 0,0.3)',
        left: 0,
        right: 0,
        position: 'absolute',
        bottom: 0
    },
    carType: {
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getPixel(fontAndColor.BUTTONFONT30),
        marginTop: Pixel.getPixel(17)
    },
    containerChild: {
        //height: Pixel.getPixel(178),
        backgroundColor: '#ffffff',
        //paddingLeft: Pixel.getPixel(12),
        //marginBottom: Pixel.getPixel(10)
    },
    separatedLine: {
        height: 1,
        backgroundColor: fontAndColor.COLORA4
    }
});