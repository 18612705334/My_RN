
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
import CarBrandSelectScene from "../../../../carSource/CarBrandSelectScene";
import {SelectView} from  '../../../../carSource/CarScreeningScene';
const Pixel = new PixelUtil();


export default class BuyerDemandItem extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.checkedCarType = {
            title: '',
            brand_id: '',
            series_id: '',
            model_id: ''
        };
        this.childItems = [];
        this.childItems.push({name: '购车预算', value: '', parameter: 'customerBudget'});
        this.childItems.push({name: '意向车型', value: '', parameter: 'intentionalVehicle'});
    }

    /**
     *
     **/
    initFinish = () => {
        /*this.setState({
         renderPlaceholderOnly: 'success'
         });*/
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
            this.childItems[i].value = this.props.rowData[parameter];
        }
    };

    /**
     *
     **/
    render() {
        let items = [];
        if (this.props.editState != 'look') {
            for (let i = 0; i < this.childItems.length; i++) {
                if (i == 0) {
                    items.push(<ClientInfoSelected ref='selectsex' key={i + 'bo'} items={this.childItems[i]}
                                                   toSelect={() => {
                                                       this.toNextPage({
                                                           name: 'SelectScene',
                                                           component: SelectScene,
                                                           params: {
                                                               regShowData: ['10万以下', '10-20万', '10-40万', '40-60万', '60万以上'],
                                                               title: '购车预算',
                                                               callBack: (name) => {
                                                                   this.childItems[i].value = name;
                                                                   this.refs.selectsex.setValue(name);
                                                               }
                                                           }
                                                       })
                                                   }}/>);
                } else if (i == 1) {
                    items.push(<ClientInfoSelected ref="company" key={i + 'bo'} items={this.childItems[i]}
                                                   toSelect={() => {
                                                       this.toNextPage({
                                                           name: 'CarBrandSelectScene',
                                                           component: CarBrandSelectScene,
                                                           params: {
                                                               checkedCarClick: this.checkedCarClick,
                                                               status: 0
                                                           }
                                                       })
                                                   }}/>);
                    /*items.push(<SelectView
                     ref="carView"
                     title="意向车型"
                     content={(this.checkedCarType.title != '') ? this.checkedCarType.title : '请选择意向车型'}
                     selectCilck={this.pushCarBrandSceneAction}/>);*/
                }
            }
        } else {
            this.parseData();
            for (let i = 0; i < this.childItems.length; i++) {
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
                            <View style={{width: width - Pixel.getPixel(140)}}>
                                <Text allowFontScaling={false}
                                      numberOfLines={2}
                                      style={{
                                          fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                                          color: '#000'
                                      }}>{this.childItems[i].value}</Text>
                            </View>
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
                        allowFontScaling={false}>购车需求</Text>
                </View>
                <View style={{
                    height: 1,
                    backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR
                }}/>
                {items}
            </View>
        )
    }

    /**
     * 选择品牌
     **/
    pushCarBrandSceneAction = () => {
        let navigatorParams = {
            name: "CarBrandSelectScene",
            component: CarBrandSelectScene,
            params: {
                checkedCarClick: this.checkedCarClick
                //status: 1,
                //isHeadInteraction: true,
                //unlimitedAction:this.carUnlimitedAction,
            }
        }
        this.toNextPage(navigatorParams);
    };

    /**
     *
     **/
    checkedCarClick = (carObject) => {
        //let title = carObject.series_id == 0 ? carObject.brand_name : carObject.series_name;
        let title = carObject.model_name;
        this.refs.company.setValue(title);
        this.childItems[1].value = title;
        this.checkedCarType.title = title;
        this.checkedCarType.brand_id = carObject.brand_id;
        this.checkedCarType.series_id = carObject.series_id;
        this.checkedCarType.model_id = carObject.model_id;
    }

}

const styles = StyleSheet.create({
    separatedLine: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15),
        height: 1,
        backgroundColor: fontAndColor.COLORA4
    },
});