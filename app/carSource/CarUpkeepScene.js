import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import AutoConfig from '../publish/AutoConfig';

let {height, width} = Dimensions.get('window');
import BaseComponent from '../component/BaseComponent';
import MyBaseComponent from '../component/MyBaseComponent';
import NavigationView from '../component/AllNavigationView';
import *as fontAndColor from '../constant/FontAndColor';
import *as appUrls from '../constant/appUrls';
import *as RequestUtil from '../utils/RequestUtil';
import PixelUtil from '../utils/PixelUtils';

const Pixel = new PixelUtil();
import CarReferencePriceScene from './CarReferencePriceScene';
import SaasText from "../component/SaasText";

let carConfigurationData = [];
const data = [
    {
        title: '2016-06-20|5532公里',
        type: '正常维修',
        content: '更换左右制动总成，更换右后制动组件。车身控制模块线接头。'
    }, {
        title: '2016-06-20|5532公里',
        type: '正常维修',
        content: '更换左右制动总成，更换右后制动组件。车身控制模块线接头。'
    }, {
        title: '2016-06-20|5532公里',
        type: '正常维修',
        content: '更换左右制动总成，更换右后制动组件。车身控制模块线接头。'
    }, {
        title: '2016-06-20|5532公里',
        type: '正常维修',
        content: '更换左右制动总成，更换右后制动组件。车身控制模块线接头。'
    }, {
        title: '2016-06-20|5532公里',
        type: '正常维修',
        content: '更换左右制动总成，更换右后制动组件。车身控制模块线接头。'
    },
];


export default class CarUpkeepScene extends MyBaseComponent {

    constructor() {
        super()

        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {

            dataSource: ds,
            renderPlaceholderOnly: 'blank',
        }
    }

    initFinish() {
        carConfigurationData = [];
        this.loadData();
        this.setState({
            title: '维修保养记录'
        })
    }

    renderView() {

        return (
            <View>
                <NavigationView
                    title='维修保养记录'
                    backIconClick={this.backPage}
                />

                <ListView
                    style={{
                        marginTop: Pixel.getTitlePixel(64),
                        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
                        height:height- Pixel.getTitlePixel(64),
                    }}

                    removeClippedSubviews={false}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderHeader={this.renderHeader}
                />
            </View>
        )

    }

    renderHeader() {
        return(
            <View style={{padding:15, backgroundColor: fontAndColor.COLORB6,}}>
                <SaasText
                    style={{color:fontAndColor.COLORB2}}
                >
                    若车辆在非4S店制造商授权店的维修保养信息可能被采集和收录，仅供参考，请结合实车看眼结果和试乘试驾体验，做出准确的交易决策。
                </SaasText>
            </View>
        )
    }

    renderRow(rowData, index) {
        return (
            <View style={{marginTop: 15, backgroundColor: 'white'}}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginHorizontal: 15,
                    borderBottomColor: fontAndColor.COLORA4,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    paddingVertical:15,
                }}>
                    <SaasText style={{
                        color: fontAndColor.COLORA1,
                        fontSize: 13
                    }}>{rowData.date + ' | ' + rowData.mile + '公里'}</SaasText>
                    <SaasText style={{
                        color: fontAndColor.NAVI_BAR_COLOR,
                        fontSize: 13,
                        fontWeight: 'bold'
                    }}>{rowData.type}</SaasText>
                </View>
                <SaasText style={{margin: 15}}>
                    {rowData.detail + rowData.other}
                </SaasText>

            </View>

        )
    }


    renderNullView() {

        return (
            <View>
                <NavigationView
                    title='维修保养记录'
                    backIconClick={this.backPage}
                />

                <View style={{marginTop: Pixel.getTitlePixel(64), alignItems: 'center', paddingTop: 100}}>
                    <Image style={{
                        width: Pixel.getPixel(141),
                        height: Pixel.getPixel(183),
                        resizeMode: 'stretch'
                    }} source={require('../../image/noData.png')}/>
                    <SaasText
                        style={{
                            marginTop: 30,
                            marginHorizontal: 60,
                            textAlign: 'center',
                        }}
                    > 该车辆暂无维修保养记录，您可以查看车辆其他相关信息。</SaasText>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 40, width: width}}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: fontAndColor.NAVI_BAR_COLOR,
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 15
                            }}
                            onPress={() => {
                                this.pushCarConfigScene()
                            }}
                        >
                            <SaasText>查看配置信息</SaasText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                borderColor: fontAndColor.NAVI_BAR_COLOR,
                                borderWidth: 2,
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 15
                            }}
                            onPress={() => {
                                this.pushCarReferencePriceScene()
                            }}
                        >
                            <SaasText>查看参考价</SaasText>
                        </TouchableOpacity>

                    </View>


                </View>

            </View>
        )


    }

    loadData = () => {
        RequestUtil.request(appUrls.CAR_GET_ERPORT, 'post', {'vin': this.props.vin}).then((response) => {

            if (response.mjson.data.result.length > 0) {

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(response.mjson.data.result),
                    renderPlaceholderOnly: 'success',

                });

            } else {
                this.setState({
                    renderPlaceholderOnly: 'null',
                });
            }

        }, (error) => {
            this.setState({
                renderPlaceholderOnly: 'null',
            });
        });
    }


    pushCarConfigScene = () => {
        let navigationParams = {
            name: "AutoConfig",
            component: AutoConfig,
            params: {
                modelID: this.props.carData.model_id,
                carConfiguraInfo: this.props.carData.modification_instructions,
                carConfigurationData: carConfigurationData,
                renderCarConfigurationDataAction: this.renderCarConfigDataAction,
                from: 'CarUpkeepScene'
            }
        }
        this.toNextPage(navigationParams);
    };

    pushCarReferencePriceScene = () => {
        console.log('321321312');
        let navigationParams = {
            name: "CarReferencePriceScene",
            component: CarReferencePriceScene,
            params: {
                city_id: this.props.carData.city_id,
                mileage: this.props.carData.mileage,
                model_id: this.props.carData.model_id,
                init_reg: this.dateReversal(this.props.carData.init_reg + '000'),
                from: 'CarUpkeepScene'
            }
        }
        this.toNextPage(navigationParams);

    };


    dateReversal = (time) => {

        const date = new Date();
        date.setTime(time);
        return (date.getFullYear() + "-" + (this.PrefixInteger(date.getMonth() + 1, 2)));

    };

    PrefixInteger = (num, length) => {

        return (Array(length).join('0') + num).slice(-length);

    }

}
