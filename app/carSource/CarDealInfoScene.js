import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    TextInput,
    Dimensions,
    Image,
    KeyboardAvoidingView,
} from 'react-native';

import BaseComponent from "../component/BaseComponent";
import MyBaseComponent from "../component/MyBaseComponent";
import MyBaseNaviComponent from "../component/MyBaseNaviComponent";
import AllNavigationView from  '../component/AllNavigationView';
import {CellView, CellSelectView} from './znComponent/CarPublishCell';
import *as fontAndColor from  '../constant/FontAndColor';
import PixelUtil from  '../utils/PixelUtils';
import * as AppUrls from "../constant/appUrls";
import  {request}   from '../utils/RequestUtil';
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";
import CarSaledStaffListScene from "./CarSaledStaffListScene";

let Pixel = new  PixelUtil();
const sceneWidth = Dimensions.get('window').width;

export default class CarDealInfoScene extends MyBaseNaviComponent{

    initFinish(){
        this.setState({
            title:'车辆基本信息'
        })
        this.setState({
            renderPlaceholderOnly:'success'
        })
    }


    renderView(){
        return(
            <View style={styles.rootContaier}>
                <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-Pixel.getPixel(64)}>
                    <ScrollView keyboardDismissMode={'on-drag'} >
                        {
                            this.state.titleData.map((data, index) => {
                                return (
                                    <View style={{marginTop:10,backgroundColor:'white',marginBottom:10}} key={index}>
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
                            <TouchableOpacity onPress={this.footBtnClick}>
                                <View style={styles.footView}>
                                    <Text allowFontScaling={false}  style={styles.footText}>提交</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

            </View>
        )
    }
    footBtnClick=()=>{

        if(this.carDealData.insurance==''){

            this.props.showToast('请选择商业保险');
            return;
        }

        if(this.carDealData.salesman==''){
            this.props.showToast('请输入销售员姓名');
            return;
        }
        if(this.carDealData.current_rate=='')
        {
            this.props.showToast('请输入成交价');
            return;
        }


        this.props.showModal(true);
        request(AppUrls.CAR_SALE, 'post', this.carDealData).then((response) => {
            request(AppUrls.CAR_SASS_SALED, 'post', {
                id:this.carDealData.id,
                account_code:this.carDealData.account_code,
                saledPeople:this.carDealData.saledPeople,
                saledPrice:this.carDealData.current_rate,
                saledType:this.carDealData.paymentValue,
                businessIf:this.carDealData.insuranceValue,
            }).then((response) => {
                this.props.showModal(false);
                this.props.refreshDataAction();
                this.backPage();

            }, (error) => {
                this.props.showToast(error.mjson.msg);
            });

        }, (error) => {
            this.props.showToast(error.mjson.msg);
        });

    }


    constructor(props) {
        super(props);

        this.carDealData={
            id:this.props.carID,
            payment:'全款',
            insurance:'',
            salesman:'',
            current_rate:'',
            paymentValue:1,
            account_code:'',
            saledPeople:'',

        };

        this.titleData1=[
            [
                {
                    title:'付款方式',
                    isShowTag:true,
                    value:"",
                    selectDict:{current:this.carDealData.payment,data:[{title:'全款',value:1},{title:'贷款',value:2}]},
                },
                {
                    title:'商业保险',
                    isShowTag:true,
                    value:' ',
                    isShowTail:false,
                    selectDict:{current:this.carDealData.insurance,data:[{title:'已投',value:3},{title:'未投',value:4}]},
                },
                {
                    title: '销售员姓名',
                    isShowTag: true,
                    isShowTail: true,
                    value:'请选择'
                },{
                title: '成交价',
                isShowTag: true,
                isShowTail: true,
                tailView: () => {
                    return (
                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <TextInput style={styles.textInput}
                                       ref={(ref) => {
                                           this.price = ref
                                       }}
                                       placeholder='请输入'
                                       keyboardType={'numeric'}
                                       maxLength={7}
                                       underlineColorAndroid='transparent'
                                       onChangeText={(text) => {

                                           if (text.length > 4 && text.indexOf('.') == -1) {
                                               text = text.substring(0, text.length - 1);
                                           }
                                           let moneyStr = this.chkPrice(text);
                                           this.carDealData.current_rate = moneyStr;
                                           this.price.setNativeProps({
                                               text: moneyStr,
                                           });
                                       }}/>
                            <Text allowFontScaling={false} style={styles.textInputTitle}>万元</Text>
                        </View>)
                }
            }
            ]
        ];
        this.state = {
            titleData:this.titleData1,
        };
    }

    cellSelectAction=(selectDict)=>{

        if(selectDict.value>=3){
            this.carDealData.insurance = selectDict.title;
            this.carDealData.insuranceValue = selectDict.value-2;
        }else {
            this.carDealData.payment = selectDict.title;
            this.carDealData.paymentValue = selectDict.value;
        }
    }


    cellCilck=(title)=>{

        if(title='销售员姓名')
        {
            this.toNextPage({
                name: 'CarSaledStaffListScene',
                component: CarSaledStaffListScene,
                params: {
                    clickSaledStaff:(staffData)=>{
                        this.carDealData.saledPeople = staffData.mobile;
                        this.carDealData.account_code = staffData.account_code;
                        this.carDealData.salesman = staffData.real_name;
                        this.titleData1[0][2].value = staffData.real_name;
                        this.setState({
                            titleData:this.titleData1,
                        });
                    }
                }
            });
        }
    }

    _showLoading = () => {
        this.props.showModal(true);
    };


    _closeLoading = () => {
        this.props.showModal(false);
    };

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
}



const styles = StyleSheet.create({
    rootContaier:{
        backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR,
        flex:1,
        marginTop:Pixel.getTitlePixel(64),
    },
    scanImage: {
        height: Pixel.getPixel(18),
        width: Pixel.getPixel(18),
        marginLeft: Pixel.getPixel(8)
    },
    textInput: {
        height: Pixel.getPixel(30),
        borderColor: fontAndColor.COLORA0,
        width: Pixel.getPixel(160),
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
});

