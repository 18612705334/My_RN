import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Keyboard,
    ScrollView,
    DeviceEventEmitter,
    KeyboardAvoidingView,
    Platform
}   from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import MyBaseNaviComponent from '../../component/MyBaseNaviComponent';
import MyBaseComponent from '../../component/MyBaseComponent';
import AllNavigationView from '../../component/AllNavigationView';
import {CellView, CellSelectView} from '../znComponent/CarPublishCell';
import CarSelectRegisterPersonScene from '../CarSelectRegisterPersonScene';
import CarlicenseTagScene from  './CarlicenseTagScene';
import CarUpImageScene   from './CarUpImageScene';
import CityListScene from  '../CityListScene';
import *as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';
import StorageUtil from "../../utils/StorageUtil";
import CarReferencePriceScene from '../CarReferencePriceScene';

const Pixel = new PixelUtil();
const sceneWidth = Dimensions.get('window').width;
const sceneHeight = Dimensions.get('window').height;
const IS_ANDROID = Platform.OS === 'android';


export default class CarPublishSecondScene extends MyBaseNaviComponent{


    initFinish(){
        this.setState({
            renderPlaceholderOnly:'success',
            title:'车辆基本信息'
        })
    }

    constructor(props) {
        super(props);
        // 初始状态
        this.carData = this.props.carData;


        if (this.carData.nature_use == 1) {
            this.nature_use = '营运';
            this.carData['nature_use'] = 1;
        } else {
            this.nature_use = '非营运';
            this.carData['nature_use'] = 2;
        }

        if (this.carData.v_type !== 1) {
            this.carData['nature_use'] = 2;
            this.carData['transfer_times'] = '0';
            this.carData['mileage'] = '0';
        } else {
            this.carData['transfer_times'] = this.carData.transfer_times ? String(this.carData.transfer_times) : '0';
            this.carData['mileage'] = this.carData.mileage ? String(this.carData.mileage) : '';
        }


        this.titleData1 = [
            [
                {
                    title: '使用性质',
                    isShowTag: false,
                    isShowTail: true,
                    selectDict: {current: this.nature_use, data: [{title: '营运', value: 1}, {title: '非营运', value: 2}]},
                },
                {
                    title: '过户次数',
                    isShowTag: true,
                    isShowTail: true,
                    tailView: () => {
                        return (
                            <TextInput
                                ref={(ref)=>{this.transferInput = ref}}
                                style={styles.textInput}
                                underlineColorAndroid='transparent'
                                placeholder='请输入'
                                maxLength={2}
                                defaultValue={this.carData.transfer_times}
                                onEndEditing={()=>{this.saveCarData();}}
                                keyboardType={'number-pad'}
                                onFocus={()=>{
                                    this.setCurrentPy(this.transferInput);
                                }}
                                onChangeText={(text)=>{this.carData['transfer_times'] = text}}
                            />
                        )
                    }
                },
                {
                    title: '车牌号',
                    isShowTag: true,
                    isShowTail: true,
                    value: this.carData.plate_number ? this.carData.plate_number : '请选择'
                },
                {
                    title: '表显里程',
                    isShowTag: true,
                    isShowTail: true,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput
                                    ref={(ref)=>{this.mileageInput = ref}}
                                    style={styles.textInput}
                                    placeholder='请输入'
                                    maxLength={3}
                                    underlineColorAndroid='transparent'
                                    onFocus={()=>{
                                        this.setCurrentPy(this.mileageInput);
                                    }}
                                    defaultValue={this.carData.mileage}
                                    keyboardType={'number-pad'}
                                    onEndEditing={()=>{this.saveCarData();}}
                                    onChangeText={(text)=>{this.carData['mileage'] = text}}
                                />
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万公里</Text>
                            </View>
                        )
                    }
                },

            ],
            [{
                title: '参考价',
                isShowTag: false,
                value: '查看',
                isShowTail: true,
            },
                {
                    title: '分销批发价',
                    subTitle: '展示给其他车商看',
                    isShowTag: true,
                    isShowTail: true,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref)=>{this.dealerPriceInput = ref}}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           onFocus={()=>{
                                               this.setCurrentPy(this.dealerPriceInput);
                                           }}
                                           underlineColorAndroid='transparent'
                                           defaultValue={this.carData.dealer_price?this.carMoneyChange(this.carData.dealer_price):''}
                                           onEndEditing={()=>{this.saveCarData();}}
                                           onChangeText={(text)=>{
                                               if(text.length>4&&text.indexOf('.')==-1){
                                                   text = text.substring(0,4);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.carData['dealer_price']= moneyStr;
                                               this.dealerPriceInput.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },
                {
                    title: '圈子内的分销批发价',
                    subTitle: '展示给其他圈友看',
                    isShowTag: false,
                    isShowTail: false,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref)=>{this.dealer_price_circle = ref}}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           onFocus={()=>{
                                               this.setCurrentPy(this.dealer_price_circle);
                                           }}
                                           underlineColorAndroid='transparent'
                                           defaultValue={this.carData.dealer_price_circle?this.carMoneyChange(this.carData.dealer_price_circle):''}
                                           onEndEditing={()=>{this.saveCarData();}}
                                           onChangeText={(text)=>{
                                               if(text.length>4&&text.indexOf('.')==-1){
                                                   text = text.substring(0,4);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.carData['dealer_price_circle']= moneyStr;
                                               this.dealer_price_circle.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },
                {
                    title: '采购价',
                    subTitle: '仅供车商老板、采购、财务查看',
                    isShowTag: false,
                    isShowTail: false,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref)=>{this.buying_price = ref}}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           onFocus={()=>{
                                               this.setCurrentPy(this.buying_price);
                                           }}
                                           underlineColorAndroid='transparent'
                                           defaultValue={this.carData.buying_price?this.carMoneyChange(this.carData.buying_price):''}
                                           onEndEditing={()=>{this.saveCarData();}}
                                           onChangeText={(text)=>{
                                               if(text.length>4&&text.indexOf('.')==-1){
                                                   text = text.substring(0,4);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.carData['buying_price']= moneyStr;
                                               this.buying_price.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },
                {
                    title: '网上零售价',
                    subTitle: '展示给个人消费者看',
                    isShowTag: true,
                    isShowTail: true,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref)=>{this.online_retail_price = ref}}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           onFocus={()=>{
                                               this.setCurrentPy(this.online_retail_price);
                                           }}
                                           underlineColorAndroid='transparent'
                                           defaultValue={this.carData.online_retail_price?this.carMoneyChange(this.carData.online_retail_price):''}
                                           onEndEditing={()=>{this.saveCarData();}}
                                           onChangeText={(text)=>{

                                               if(text.length>4&&text.indexOf('.')==-1){
                                                   text = text.substring(0,4);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.carData['online_retail_price']= moneyStr;
                                               this.online_retail_price.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },
                {
                    title: '销售底价',
                    subTitle: '仅供内部销售人员查看',
                    isShowTag: false,
                    isShowTail: true,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           underlineColorAndroid='transparent'
                                           ref={(ref)=>{this.lowPriceInput = ref}}
                                           onFocus={()=>{
                                               this.setCurrentPy(this.lowPriceInput);
                                           }}
                                           defaultValue={this.carData.low_price?this.carMoneyChange(this.carData.low_price):''}
                                           onEndEditing={()=>{this.saveCarData();}}
                                           onChangeText={(text)=>{
                                               if(text.length>4&&text.indexOf('.')==-1){
                                                   text = text.substring(0,4);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.carData['low_price']= moneyStr;
                                               this.lowPriceInput.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },
                {
                    title: '到店零售价',
                    subTitle: '销售人员 对到店个人消费者报价',
                    isShowTag: false,
                    isShowTail: true,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           underlineColorAndroid='transparent'
                                           ref={(ref)=>{this.retail_price_store = ref}}
                                           onFocus={()=>{
                                               this.setCurrentPy(this.retail_price_store);
                                           }}
                                           defaultValue={this.carData.retail_price_store?this.carMoneyChange(this.carData.retail_price_store):''}
                                           onEndEditing={()=>{this.saveCarData();}}
                                           onChangeText={(text)=>{
                                               if(text.length>4&&text.indexOf('.')==-1){
                                                   text = text.substring(0,4);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.carData['retail_price_store']= moneyStr;
                                               this.retail_price_store.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },
                {
                    title: '评估师价格-对平台交易',
                    subTitle: '此项在申请评估服务后由评估师填写',
                    isShowTag: false,
                    isShowTail: true,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}></Text>
                            </View>)
                    }
                },
                {
                    title: '评估师价格-对金融业务',
                    subTitle: '此项在申请金融服务后由评估师填写',
                    isShowTag: false,
                    isShowTail: true,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}></Text>
                            </View>)
                    }
                },

            ],
            [{
                title: '车辆所在地',
                isShowTag: true,
                value: this.carData.city_name ? this.carData.city_name : '请选择',
                isShowTail: true,
            }, {
                title: '登记人',
                isShowTag: true,
                value: this.carData.registrant_name ? this.carData.registrant_name : '请选择',
                isShowTail: true,
            },
                {
                    title: '车况描述',
                    isShowTag: false,
                    isShowTail: false,
                    tailView: () => {
                        return (
                            <TextInput
                                ref={(ref)=>{this.describeInput = ref}}
                                style={[styles.textInput,{width:sceneWidth-Pixel.getPixel(100),height:Pixel.getPixel(50)}]}
                                placeholder='请填写'
                                maxLength={50}
                                underlineColorAndroid='transparent'
                                onFocus={()=>{
                                    this.setCurrentPy(this.describeInput);
                                }}
                                defaultValue={this.carData.describe?this.carData.describe:''}
                                onEndEditing={()=>{this.saveCarData();}}
                                onChangeText={(text)=>{this.carData['describe']=text}}/>
                        )
                    }

                },
            ]

        ];

        this.titleData2 = [
            [
                {
                    title: '过户次数',
                    isShowTag: this.props.carData.v_type==3?false:true,
                    value: '0',
                    isShowTail: false,
                },
                // {
                //     title:'车牌号',
                //     isShowTag:true,
                //     isShowTail:true,
                //     value:this.carData.plate_number?this.carData.plate_number:'请选择'
                // },
                {
                    title: '表显里程',
                    isShowTag: this.props.carData.v_type==3?false:true,
                    isShowTail: false,
                    value: '0 万公里',
                },

            ],
            [
                {
                    title: '分销批发价',
                    subTitle: '展示给其他车商看',
                    isShowTag: true,
                    isShowTail: true,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref)=>{this.dealerPriceInput = ref}}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           onFocus={()=>{
                                               this.setCurrentPy(this.dealerPriceInput);
                                           }}
                                           underlineColorAndroid='transparent'
                                           defaultValue={this.carData.dealer_price?this.carMoneyChange(this.carData.dealer_price):''}
                                           onEndEditing={()=>{this.saveCarData();}}
                                           onChangeText={(text)=>{
                                               if(text.length>4&&text.indexOf('.')==-1){
                                                   text = text.substring(0,4);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.carData['dealer_price']= moneyStr;
                                               this.dealerPriceInput.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },
                {
                    title: '圈子内的分销批发价',
                    subTitle: '展示给其他圈友看',
                    isShowTag: false,
                    isShowTail: false,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref)=>{this.dealer_price_circle = ref}}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           onFocus={()=>{
                                               this.setCurrentPy(this.dealer_price_circle);
                                           }}
                                           underlineColorAndroid='transparent'
                                           defaultValue={this.carData.dealer_price_circle?this.carMoneyChange(this.carData.dealer_price_circle):''}
                                           onEndEditing={()=>{this.saveCarData();}}
                                           onChangeText={(text)=>{
                                               if(text.length>4&&text.indexOf('.')==-1){
                                                   text = text.substring(0,4);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.carData['dealer_price_circle']= moneyStr;
                                               this.dealer_price_circle.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },
                {
                    title: '采购价',
                    subTitle: '仅供车商老板、采购、财务查看',
                    isShowTag: false,
                    isShowTail: false,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref)=>{this.buying_price = ref}}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           onFocus={()=>{
                                               this.setCurrentPy(this.buying_price);
                                           }}
                                           underlineColorAndroid='transparent'
                                           defaultValue={this.carData.buying_price?this.carMoneyChange(this.carData.buying_price):''}
                                           onEndEditing={()=>{this.saveCarData();}}
                                           onChangeText={(text)=>{
                                               if(text.length>4&&text.indexOf('.')==-1){
                                                   text = text.substring(0,4);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.carData['buying_price']= moneyStr;
                                               this.buying_price.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },
                {
                    title: '网上零售价',
                    subTitle: '展示给个人消费者看',
                    isShowTag: this.props.carData.v_type==3?false:true,
                    isShowTail: true,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref)=>{this.online_retail_price = ref}}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           onFocus={()=>{
                                               this.setCurrentPy(this.online_retail_price);
                                           }}
                                           underlineColorAndroid='transparent'
                                           defaultValue={this.carData.online_retail_price?this.carMoneyChange(this.carData.online_retail_price):''}
                                           onEndEditing={()=>{this.saveCarData();}}
                                           onChangeText={(text)=>{

                                               if(text.length>4&&text.indexOf('.')==-1){
                                                   text = text.substring(0,4);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.carData['online_retail_price']= moneyStr;
                                               this.online_retail_price.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },
                {
                    title: '销售底价',
                    subTitle: '仅供内部销售人员查看',
                    isShowTag: false,
                    isShowTail: true,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           underlineColorAndroid='transparent'
                                           ref={(ref)=>{this.lowPriceInput = ref}}
                                           onFocus={()=>{
                                               this.setCurrentPy(this.lowPriceInput);
                                           }}
                                           defaultValue={this.carData.low_price?this.carMoneyChange(this.carData.low_price):''}
                                           onEndEditing={()=>{this.saveCarData();}}
                                           onChangeText={(text)=>{
                                               if(text.length>4&&text.indexOf('.')==-1){
                                                   text = text.substring(0,4);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.carData['low_price']= moneyStr;
                                               this.lowPriceInput.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },
                {
                    title: '到店零售价',
                    subTitle: '销售人员 对到店个人消费者报价',
                    isShowTag: false,
                    isShowTail: true,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           underlineColorAndroid='transparent'
                                           ref={(ref)=>{this.retail_price_store = ref}}
                                           onFocus={()=>{
                                               this.setCurrentPy(this.retail_price_store);
                                           }}
                                           defaultValue={this.carData.retail_price_store?this.carMoneyChange(this.carData.retail_price_store):''}
                                           onEndEditing={()=>{this.saveCarData();}}
                                           onChangeText={(text)=>{
                                               if(text.length>4&&text.indexOf('.')==-1){
                                                   text = text.substring(0,4);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.carData['retail_price_store']= moneyStr;
                                               this.retail_price_store.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },
                {
                    title: '评估师价格-对平台交易',
                    subTitle: '此项在申请评估服务后由评估师填写',
                    isShowTag: false,
                    isShowTail: true,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}></Text>
                            </View>)
                    }
                },
                {
                    title: '评估师价格-对金融业务',
                    subTitle: '此项在申请金融服务后由评估师填写',
                    isShowTag: false,
                    isShowTail: true,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}></Text>
                            </View>)
                    }
                },
            ],
            [{
                title: '车辆所在地',
                isShowTag: true,
                value: this.carData.city_name ? this.carData.city_name : '请选择',
                isShowTail: true,
            },
                {
                    title: '车况描述',
                    isShowTag: false,
                    isShowTail: false,
                    tailView: () => {
                        return (
                            <TextInput
                                ref={(ref)=>{this.describeInput = ref}}
                                style={[styles.textInput,{width:sceneWidth-Pixel.getPixel(100),height:Pixel.getPixel(50)}]}
                                placeholder='请填写'
                                maxLength={50}
                                onFocus={()=>{
                                    this.setCurrentPy(this.describeInput)
                                }}
                                underlineColorAndroid='transparent'
                                defaultValue={this.carData.describe?this.carMoneyChange(this.carData.describe):''}
                                onEndEditing={()=>{this.saveCarData();}}
                                onChangeText={(text)=>{this.carData['describe']=text}}/>
                        )
                    }
                },
            ]

        ];
        this.state = {
            titleData: this.props.carData.v_type == 1 ? this.titleData1 : this.titleData2,
        };
    }


    setCurrentPy = (ref) => {}

    renderView(){
        return(

            <View style={styles.rootContainer}>
                {
                    IS_ANDROID?(this.loadScrollView()):(
                        <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-Pixel.getPixel(100)}>
                            {
                                this.loadScrollView()
                            }
                        </KeyboardAvoidingView>
                    )
                }

            </View>

        )
    }



    loadScrollView=()=>{
        return(
            <ScrollView ref={(ref)=>{this.scrollView = ref}}    keyboardDismissMode={IS_ANDROID?'none':'on-drag'}>
                <View style={{width:sceneWidth,paddingVertical:Pixel.getPixel(25),backgroundColor:'white'}}>
                    <Image style={{width:sceneWidth}} resizeMode={'contain'}
                           source={require('../../../image/carSourceImages/publishCarperpos2.png')}/>
                </View>
                {
                    this.state.titleData.map((data, index) => {
                        return (
                            <View style={{marginTop:10,backgroundColor:'white'}} key={index}>
                                {
                                    data.map((rowData, subIndex) => {
                                        return ( rowData.selectDict ?
                                                (
                                                    <TouchableOpacity
                                                        key={subIndex}
                                                        activeOpacity={1}
                                                        onPress={()=>this.cellCilck(rowData.title)}>
                                                        <CellSelectView
                                                            currentTitle={rowData.selectDict.current}
                                                            cellData={rowData}
                                                            cellSelectAction={this.cellSelectAction}/>
                                                    </TouchableOpacity>) :
                                                (
                                                    <TouchableOpacity key={subIndex}
                                                                      activeOpacity={1}
                                                                      onPress={()=>this.cellCilck(rowData.title)}>
                                                        <CellView cellData={rowData}/>
                                                    </TouchableOpacity>)
                                        )
                                    })
                                }
                            </View>
                        )
                    })
                }
                <View style={styles.footContainer}>
                    <TouchableOpacity onPress={this.nextAction}>
                        <View style={styles.footView}>
                            <Text allowFontScaling={false}  style={styles.footText}>下一步</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }

    cellSelectAction = (selectDict) => {
        this.carData['nature_use'] = selectDict.value;
        this.titleData1[0][0].selectDict.current = selectDict.value;
        this.saveCarData();

    }
    saveCarData = () => {
        if (this.carData.show_shop_id && !this.carData.id) {
            StorageUtil.mSetItem(String(this.carData.show_shop_id), JSON.stringify(this.carData));
        }
    }
    cellCilck = (cellTitle) => {

        if (cellTitle == '登记人') {
            this.pushSelectRegisterPersonScene();

        } else if (cellTitle == '车牌号') {

            this.pushCarIicenseTagScene();

        } else if (cellTitle == '参考价') {

            this.pushCarReferencePriceScene();
        }
        else if (cellTitle == '车辆所在地') {

            this.pushCityListScene();
        }
    }

    nextAction = () => {

        if (this.carData.transfer_times == '' || !this.carData.transfer_times) {
            this.props.showToast('请输入过户次数');
            return;
        }
        if ((this.carData.plate_number == '' || !this.carData.plate_number) && this.carData.v_type == 1) {
            this.props.showToast('请输入正确的车牌号');
            return;
        }
        if (this.carData.v_type == 1 && !this.isCarlicenseTag(this.carData.plate_number)) {
            this.props.showToast('请输入正确的车牌号');
            return;
        }

        if (this.carData.mileage == '' || !this.carData.mileage) {
            this.props.showToast('请输入里程');
            return;
        }
        if (parseFloat(this.carData.mileage) <= 0 && this.carData.v_type == 1) {
            this.props.showToast('里程不能等于0');
            return;
        }

        if (this.carData.dealer_price == '' || !this.carData.dealer_price) {
            this.props.showToast('请输入分销批发价');
            return;
        }

        if (parseFloat(this.carData.dealer_price) <= 0) {
            this.props.showToast('分销批发价不能等于0');
            return;
        }

        if ((this.carData.online_retail_price == '' || !this.carData.online_retail_price) && this.carData.v_type!=3) {
            this.props.showToast('请输入网上零售价');
            return;
        }

        if ((parseFloat(this.carData.online_retail_price) <= 0) &&  this.carData.v_type!=3 ) {
            this.props.showToast('网上零售价不能等于0');
            return;
        }
        if (this.carData.city_id == '') {
            this.props.showToast('请选择车辆所在地');
            return;
        }
        if (this.carData.v_type == 1 && !this.carData.registrant_id) {
            this.props.showToast('请选择登记人');
            return;
        }


        let navigatorParams = {
            name: "CarUpImageScene",
            component: CarUpImageScene,
            params: {
                carData: this.carData,
                carConfigurationData:this.props.carConfigurationData,
            }
        };
        this.toNextPage(navigatorParams);
        //console.log(this.carData);
    }


    pushSelectRegisterPersonScene = () => {
        let navigatorParams = {
            name: "CarSelectRegisterPersonScene",
            component: CarSelectRegisterPersonScene,
            params: {
                selectPersonClick: this.selectPersonClick,
                currentPerson: this.titleData1[2][1].value,
                shopID: this.carData.show_shop_id,
            }
        };

        // console.log(this.carData.show_shop_id);
        //console.log(this.carData);
        this.toNextPage(navigatorParams);
    }


    selectPersonClick = (data) => {

        this.titleData1[2][1].value = data.business_name;
        this.carData['registrant_id'] = data.id;
        this.carData['registrant_name'] = data.business_name;
        this.carData['registrant_actual'] = data.is_control;
        this.updateUI();
    }


    pushCarIicenseTagScene = () => {
        let navigatorParams = {
            name: "CarlicenseTagScene",
            component: CarlicenseTagScene,
            params: {
                checkedCarlicenseTagClick: this._checkedCarlicenseTagClick,
                currentChecked: this.titleData1[0][2].value,

            }
        };
        this.toNextPage(navigatorParams);
    }


    pushCarReferencePriceScene = () => {

        if (!this.carData.city_id || this.carData.city_id == '') {

            this.props.showToast('请先选择车辆所在地');
            return;
        }
        if (this.carData.mileage == '' || !this.carData.mileage) {
            this.props.showToast('请输入里程');
            return;
        }

        let navigationParams = {
            name: "CarReferencePriceScene",
            component: CarReferencePriceScene,
            params: {
                city_id: this.carData.city_id,
                mileage: this.carData.mileage,
                model_id: this.carData.model_id,
                init_reg: this.carData.init_reg,
                from:'CarPublishSecondScene'
            }
        }
        this.toNextPage(navigationParams);
    };


    _checkedCarlicenseTagClick = (title) => {
        this.titleData1[0][2].value = title;
        this.titleData2[0][1].value = title;
        this.carData['plate_number'] = title;
        this.updateUI();
    }


    pushCityListScene = () => {

        let navigatorParams = {
            name: "CityListScene",
            component: CityListScene,
            params: {
                checkedCityClick: this.checkedCityClick,
            }
        };
        this.toNextPage(navigatorParams);
    }

    updateUI = () => {

        if (this.props.carData.v_type == 1) {
            this.setState({
                titleData: this.titleData1,
            });
        } else {
            this.setState({
                titleData: this.titleData2,
            });
        }
        this.saveCarData();

    }

    checkedCityClick = (city) => {

        //console.log(city);
        this.titleData1[2][0].value = city.city_name;
        this.titleData2[2][0].value = city.city_name;
        this.carData['city_name'] = city.city_name;
        this.carData['city_id'] = city.city_id;
        this.carData['provice_id'] = city.provice_id;
        this.updateUI();
    }


    carMoneyChange = (carMoney) => {

        let newCarMoney = parseFloat(carMoney);
        let carMoneyStr = newCarMoney.toFixed(2);
        let moneyArray = carMoneyStr.split(".");

        // console.log(carMoney+'/'+newCarMoney +'/' + carMoneyStr +'/' +moneyArray);

        if (moneyArray.length > 1) {
            if (moneyArray[1] > 0) {

                return moneyArray[0] + '.' + moneyArray[1];

            } else {

                return moneyArray[0];
            }

        } else {
            return carMoneyStr;
        }
    }


    chkPrice = (obj) => {
        obj = obj.replace(/[^\d.]/g, "");
        //必须保证第一位为数字而不是.
        obj = obj.replace(/^\./g, "");
        //保证只有出现一个.而没有多个.
        obj = obj.replace(/\.{2,}/g, ".");
        //保证.只出现一次，而不能出现两次以上
        obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        if ((/\.\d{3}/).test(obj)) {
            obj = obj.substring(0, obj.length - 1);
        }

        return obj;
    }

    isCarlicenseTag = (carNumber) => {

        if (!(/^(?=.*\d)/.test(carNumber))) {
            return false;
        } else {
            return true
        }
    }

}


const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
        marginTop: Pixel.getTitlePixel(64),
    },
    footContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Pixel.getPixel(20),
    },
    footView: {
        backgroundColor: fontAndColor.NAVI_BAR_COLOR,
        height: Pixel.getPixel(44),
        justifyContent: 'center',
        alignItems: 'center',
        width: sceneWidth - Pixel.getPixel(30),
        borderRadius: Pixel.getPixel(3),
        marginBottom: Pixel.getPixel(20),

    },
    footText: {
        textAlign: 'center',
        color: 'white',
        fontSize: fontAndColor.BUTTONFONT30
    },
    textInput: {
        height: Pixel.getPixel(30),
        borderColor: fontAndColor.COLORA0,
        width: Pixel.getPixel(80),
        textAlign: 'right',
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,

    },
    textInputTitle: {
        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        marginLeft: Pixel.getPixel(5),
        textAlign: 'right',
    }
});