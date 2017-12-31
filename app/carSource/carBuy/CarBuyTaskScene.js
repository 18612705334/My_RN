/**
 * Created by zhengnan on 2017/7/26.
 */

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
    NativeModules,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import AllNavigationView from  '../../component/AllNavigationView';
import {CellView, CellSelectView} from '../znComponent/CarPublishCell';
import AccountModal from '../../component/AccountModal'
import DateTimePicker from 'react-native-modal-datetime-picker';
import VinInfo from '../../publish/component/VinInfo';
import *as fontAndColor from  '../../constant/FontAndColor';
import PixelUtil from  '../../utils/PixelUtils';
import CarBrandSelectScene from "../CarBrandSelectScene";
import CarInfomationSourceScene from './CarInformationSourceScene';
import CityListScene from "../CityListScene";
import * as AppUrls from "../../constant/appUrls";
import  {request}           from '../../utils/RequestUtil';
import * as Net from "../../utils/ImageUpload";
let Pixel = new  PixelUtil();
const sceneWidth = Dimensions.get('window').width;
const sceneHeight = Dimensions.get('window').height;
const scanImg = require('../../../image/financeImages/scan.png');
const IS_ANDROID = Platform.OS === 'android';


export default class CarBuyTaskScene extends BaseComponent{

    render(){
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    {this.loadView()}
                    <AllNavigationView title={'收车任务'} backIconClick={this.backPage}/>
                </View>);
        }
        return(
            <View style={styles.rootContaier}>
                {
                    IS_ANDROID?(this.loadScrollView()):(
                        <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={this.state.keyboardOffset}>
                            {
                                this.loadScrollView()
                            }
                        </KeyboardAvoidingView>
                    )
                }
                <VinInfo viewData={this.scanType} vinPress={this._vinPress} ref={(modal) => {this.vinModal = modal}}/>
                <DateTimePicker
                    titleIOS="请选择日期"
                    confirmTextIOS='确定'
                    cancelTextIOS='取消'
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
                <AccountModal ref="accountmodal"/>
                <AllNavigationView title="收车任务" backIconClick={this.backPage}/>
            </View>
        )
    }

    loadScrollView=()=>{
        return(
            <ScrollView keyboardDismissMode={IS_ANDROID?'none':'on-drag'}>
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
        )
    }

    cellSelectAction=(selectDict)=>{
        this.carData['isDeal'] = selectDict.value;
    }

    initFinish=()=>{
        console.log(this.props.userPhone);

        if(this.props.id){
            this.loadData();
        }else {
            this.setState({
                renderPlaceholderOnly:'success'
            });
        }
    }

    loadData=()=>{
        this.setState({
            renderPlaceholderOnly:'loading'
        });
        request(AppUrls.CAR_SASS_SELECT_MSG, 'post', {
            id:this.props.id,
        }).then((response) => {
            this.setState({
                renderPlaceholderOnly:'success'
            });
            this.setData(response.mjson.data.acquisitionCar);
        }, (error) => {
            this.setState({
                renderPlaceholderOnly:'error'
            });
        });
    }

    setData=(data)=>{

        this.carData={
            consultList:data.consultList,
            isDeal:data.isDeal,
            collectionArea:data.collectionArea,
            customerName:data.customerName,
            contentNum:data.contentNum,
            consultPrice:'',
            mobile:this.props.userPhone,
            vin:data.vin,
            closeingPrice:data.closeingPrice,
            collectionType:data.collectionType,
            preferPrice:data.preferPrice,
            brand:data.brand,
            remark:data.remark,
            infoRecourse:data.infoRecourse,
            id:data.id,
        };

        if(data.firstUpTime){
            console.log(data.firstUpTime);
            let dateStr = data.firstUpTime.replace(/-/g,"-");
            // let dateStr = data.firstUpTime;
            // let date = new Date(dateStr);
            // this.carData.firstUpTime = this.dateFormat(date,'yyyy-MM-dd');
            // console.log(dateStr,date,this.carData.firstUpTime);
            this.carData.firstUpTime =dateStr.substring(0,10);
        }

        if(this.carData.isDeal == 2)
        {
            this.currentDealStr = '尚未成交';

        }else if(this.carData.isDeal == 1)
        {
            this.currentDealStr = '已成交';

        }else{
            this.currentDealStr = '已放弃';
        }

        this.titleData1[0][0].tailView='';
        this.titleData1[0][0].value = data.vin;
        this.titleData1[0][1].value = data.collectionType;

        this.titleData1[1][0].tailView=() => {
            return (
                <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                    <TextInput style={styles.textInput}
                               placeholder='请输入'
                               maxLength={7}
                               defaultValue={data.customerName}
                               underlineColorAndroid='transparent'
                               onFocus={()=>{
                                   this.setState({
                                       keyboardOffset:-Pixel.getPixel(200)
                                   });
                               }}
                               onBlur={()=>{
                                   this.setState({
                                       keyboardOffset:-Pixel.getPixel(64)
                                   });
                               }}
                               onChangeText={(text)=>{
                                   this.carData['customerName'] = text;
                               }}/>
                </View>)
        }

        this.titleData1[1][1].tailView=() => {
            return (
                <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                    <TextInput style={styles.textInput}
                               placeholder='请输入'
                               ref={(ref)=>{this.contentNumInput=ref}}
                               keyboardType={'phone-pad'}
                               maxLength={11}
                               defaultValue={data.contentNum}
                               underlineColorAndroid='transparent'
                               onFocus={()=>{
                                   this.setState({
                                       keyboardOffset:-Pixel.getPixel(200)
                                   });
                               }}
                               onBlur={()=>{
                                   this.setState({
                                       keyboardOffset:-Pixel.getPixel(64)
                                   });
                               }}
                               onChangeText={(text)=>{
                                   let number = this.phoneNumber(text);
                                   this.contentNumInput.setNativeProps({
                                       text: number,
                                   });
                                   this.carData['contentNum'] = text;
                               }}/>
                </View>)
        }



        if(this.props.isHideInfoRecourse){
            this.titleData1[2][0].tailView='';
            this.titleData1[2][0].value=data.preferPrice?String(data.preferPrice)+'万元':'';
        }else {
            this.titleData1[2][0].tailView=() => {
                return (
                    <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                        <TextInput style={styles.textInput}
                                   ref={(ref)=>{this.preferPriceInput = ref}}
                                   placeholder='请输入'
                                   keyboardType={'numeric'}
                                   maxLength={7}
                                   underlineColorAndroid='transparent'
                                   defaultValue={data.preferPrice?String(data.preferPrice):''}
                                   onChangeText={(text)=>{

                                       if(text.length>4&&text.indexOf('.')==-1){
                                           text = text.substring(0,4);
                                       }
                                       let moneyStr = this.chkPrice(text);
                                       this.carData['preferPrice'] = moneyStr;
                                       this.preferPriceInput.setNativeProps({
                                           text: moneyStr,
                                       });
                                   }}/>
                        <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                    </View>)
            }
        }


        this.titleData1[2][1].value = data.infoRecourse?data.infoRecourse:(this.props.isHideInfoRecourse?'':'请选择');
        this.titleData1[2][2].value = data.collectionArea?data.collectionArea:(this.props.isHideInfoRecourse?'':'请选择');
        this.titleData1[2][3].value = this.carData.firstUpTime?this.carData.firstUpTime:(this.props.isHideInfoRecourse?'':'请选择');



        if(data.consultList.length>0)
        {

            for(let index =0 ;index<data.consultList.length;index++){
                let item = data.consultList[index];
                if(index==0){
                    this.titleData1[2][4].tailView='';
                    this.titleData1[2][4].title = '第'+String(index+1)+'次给价';
                    this.titleData1[2][4].value = String(item.consultPrice)+'万元';

                }else {
                    this.titleData1[2].push({
                        title:'第'+String(index+1)+'次给价',
                        value:String(item.consultPrice)+'万元',
                    });
                }


            }
            if(!this.props.isHideInfoRecourse){
                this.titleData1[2].push({
                    title:'第'+String(data.consultList.length+1)+'次出价',
                    tailView:()=> {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref)=>{this.consultPriceInput = ref}}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text)=>{

                                               if(text.length>4&&text.indexOf('.')==-1){
                                                   text = text.substring(0,4);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.carData['consultPrice'] = moneyStr;
                                               this.consultPriceInput.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                });
            }

        }
        else if(!this.props.isHideInfoRecourse)
        {
            this.titleData1[2][4].tailView=()=> {
                return (
                    <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                        <TextInput style={styles.textInput}
                                   ref={(ref)=>{this.consultPriceInput = ref}}
                                   placeholder='请输入'
                                   keyboardType={'numeric'}
                                   maxLength={7}
                                   underlineColorAndroid='transparent'
                                   onChangeText={(text)=>{

                                       if(text.length>4&&text.indexOf('.')==-1){
                                           text = text.substring(0,4);
                                       }
                                       let moneyStr = this.chkPrice(text);
                                       this.carData['consultPrice'] = moneyStr;
                                       this.consultPriceInput.setNativeProps({
                                           text: moneyStr,
                                       });
                                   }}/>
                        <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                    </View>)
            }
        }
        else{
            this.titleData1[2].splice(4,1);
        }



        if(this.props.isHideInfoRecourse){
            this.titleData1[3].splice(0,1);
        }else {
            this.titleData1[3][0].selectDict={current:this.currentDealStr,data:[{title:'尚未成交',value:2},{title:'已经成交',value:1},{title:'已放弃',value:3}]};
        }

        if(this.props.isHideInfoRecourse){
            this.titleData1[4][0].tailView='';
            this.titleData1[4][0].value = data.closeingPrice? String(data.closeingPrice)+'万元' :'';
        }else {
            this.titleData1[4][0].tailView=() => {
                return (
                    <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                        <TextInput style={styles.textInput}
                                   ref={(ref)=>{this.dealPrice = ref}}
                                   placeholder='请输入'
                                   keyboardType={'numeric'}
                                   maxLength={7}
                                   underlineColorAndroid='transparent'
                                   defaultValue={data.closeingPrice? String(data.closeingPrice) :'' }
                                   onChangeText={(text)=>{

                                       if(text.length>4&&text.indexOf('.')==-1){
                                           text = text.substring(0,4);
                                       }
                                       let moneyStr = this.chkPrice(text);
                                       this.carData['closeingPrice']=moneyStr;
                                       this.dealPrice.setNativeProps({
                                           text: moneyStr,
                                       });
                                   }}/>
                        <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                    </View>)
            };
        }

        this.titleData1[4][1].tailView=()=>{
            return(
                <TextInput
                    style={[styles.textInput,{width:sceneWidth-Pixel.getPixel(130),height:Pixel.getPixel(60)}]}
                    placeholder='请填写'
                    maxLength={200}
                    underlineColorAndroid='transparent'
                    defaultValue={data.remark}
                    onFocus={()=>{
                        this.setState({
                            keyboardOffset:Pixel.getPixel(0)
                        });
                    }}
                    onBlur={()=>{
                        this.setState({
                            keyboardOffset:-Pixel.getPixel(64)
                        });
                    }}
                    onChangeText={(text)=>{
                        this.carData['remark'] = text;
                    }}
                    placeholderTextColor={fontAndColor.COLORA4}
                    placheolderFontSize={Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}
                />
            )
        };

        this.upTitleData();

    }
    /**
     * 提交
     */
    footBtnClick=()=>{


        if(!this.carData.vin){
            this.props.showToast('请输入正确的车架号');
            return;
        }

        if(!this.carData.collectionType)
        {
            this.props.showToast('请输入车型');
            return;
        }

        this.upCarData();

    }

    upCarData =()=>{
        let carData = {...this.carData};
        let consultList =[];
        if(parseFloat(this.carData.consultPrice) >0)
        {
            if(this.carData.consultList.length>0){

                consultList.push(...this.carData.consultList);
                consultList.push({consultPrice:this.carData.consultPrice, acquisitionId:0, id:0});

            }else {
                consultList = [{id:0,consultPrice:this.carData.consultPrice}];
            }

            carData.consultList = JSON.stringify(consultList);
        }
        this.props.showModal(true);
        request(AppUrls.CAR_SASS_PUBLISH, 'post', carData).then((response) => {
            this.props.showModal(false);
            this.props.reloadData();
            this.backPage();
        }, (error) => {
            this.props.showToast(error.mjson.msg);
        });
    }


    // 构造
    constructor(props) {
        super(props);
        this.scanType = [
            {model_name: '扫描前风挡'},
            {model_name: '扫描行驶证'}
        ];
        this.carData={
            consultList:[],
            isDeal:2,
            collectionArea:'',
            customerName:'',
            contentNum:'',
            consultPrice:'',
            mobile:this.props.userPhone,
            vin:'',
            closeingPrice:'',
            collectionType:'',
            preferPrice:'',
            brand:'',
            remark:'',
            // firstUpTime:'',
            infoRecourse:'',
        };

        if(this.carData.isDeal == 2)
        {
            this.currentDealStr = '尚未成交';

        }else if(this.carData.isDeal == 1)
        {
            this.currentDealStr = '已成交';

        }else{
            this.currentDealStr = '已放弃';
        }

        this.titleData1=[
            [
                {
                    title:'车架号',
                    isShowTag:this.props.id!=undefined?false:true,
                    subTitle:"",
                    tailView:()=>{
                        if (this.props.id)
                        {
                            return null;
                        }
                        return(
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <TextInput style={styles.textInput}
                                           ref={(input) => {this.vinInput = input}}
                                           placeholder='输入车架号'
                                           underlineColorAndroid='transparent'
                                           maxLength={17}
                                           onFocus={()=>{
                                               this.setState({
                                                   keyboardOffset:-Pixel.getPixel(300)
                                               });
                                           }}
                                           onBlur={()=>{
                                               this.setState({
                                                   keyboardOffset:-Pixel.getPixel(64)
                                               });
                                           }}
                                           editable={this.props.carID?false:true}
                                           onChangeText={this._onVinChange}
                                           placeholderTextColor={fontAndColor.COLORA4}
                                           keyboardType={'ascii-capable'}
                                           placheolderFontSize={Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}
                                />
                                {
                                    !this.props.carID &&(<TouchableOpacity onPress={this._onScanPress} style={{flexDirection:'row', alignItems:'center'}}>
                                        <Image style={styles.scanImage} source={scanImg}/>
                                        <Text allowFontScaling={false}  style={{color:fontAndColor.COLORA2, fontSize:fontAndColor.LITTLEFONT28,marginLeft:Pixel.getPixel(5)}}>扫描</Text>
                                    </TouchableOpacity>)
                                }
                            </View>
                        )
                    }
                },
                {
                    title:'车型',
                    isShowTag:this.props.id!=undefined?false:true,
                    value:'请选择',
                    isShowTail:!this.props.isHideInfoRecourse,
                },

            ],
            [
                {
                    title:'客户姓名',
                    isShowTag:false,
                    value:'请选择',
                    isShowTail:true,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           placeholder='请输入'
                                           maxLength={15}
                                           underlineColorAndroid='transparent'
                                           onFocus={()=>{
                                               this.setState({
                                                   keyboardOffset:-Pixel.getPixel(200)
                                               });
                                           }}
                                           onBlur={()=>{
                                               this.setState({
                                                   keyboardOffset:-Pixel.getPixel(64)
                                               });
                                           }}
                                           onChangeText={(text)=>{
                                               this.carData['customerName'] = text;
                                           }}/>
                            </View>)
                    }
                },
                {
                    title:'联系电话',
                    isShowTag:false,
                    value:'请选择',
                    isShowTail:true,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref)=>{this.contentNumInput=ref}}
                                           placeholder='请输入'
                                           keyboardType={'phone-pad'}
                                           maxLength={11}
                                           underlineColorAndroid='transparent'
                                           onFocus={()=>{
                                               this.setState({
                                                   keyboardOffset:-Pixel.getPixel(200)
                                               });
                                           }}
                                           onBlur={()=>{
                                               this.setState({
                                                   keyboardOffset:-Pixel.getPixel(64)
                                               });
                                           }}
                                           onChangeText={(text)=>{
                                               let number = this.phoneNumber(text);
                                               this.contentNumInput.setNativeProps({
                                                   text: number,
                                               });
                                               this.carData['contentNum'] = text;
                                           }}/>

                            </View>)
                    }
                },

            ],
            [
                {
                    title:'意向价格',
                    isShowTag:false,
                    value:'请选择',
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref)=>{this.preferPriceInput = ref}}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text)=>{

                                               if(text.length>4&&text.indexOf('.')==-1){
                                                   text = text.substring(0,4);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.carData['preferPrice'] = moneyStr;
                                               this.preferPriceInput.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },
                {
                    title:'信息来源',
                    isShowTag:false,
                    value:'请选择',
                    isShowTail:!this.props.isHideInfoRecourse,
                },
                {
                    title:'收车地区',
                    isShowTag:false,
                    value:'请选择',
                    isShowTail:!this.props.isHideInfoRecourse,
                },
                {
                    title:'初登日期',
                    isShowTag:false,
                    value:'请选择',
                    isShowTail:!this.props.isHideInfoRecourse,
                },
                {
                    title:'第1次给价',
                    isShowTag:false,
                    value:'请选择',
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref)=>{this.consultPriceInput = ref}}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text)=>{

                                               if(text.length>4&&text.indexOf('.')==-1){
                                                   text = text.substring(0,4);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.carData['consultPrice'] = moneyStr;
                                               this.consultPriceInput.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },


            ],
            [
                {
                    title:'是后成交',
                    isShowTag:false,
                    isShowTail:true,
                    selectDict:{current:this.currentDealStr,data:[{title:'尚未成交',value:2},{title:'已经成交',value:1},{title:'已放弃',value:3}]},
                },

            ],
            [
                {
                    title:'成交价格',
                    isShowTag:false,
                    value:'查看',
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref)=>{this.closeingPriceInput = ref}}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text)=>{

                                               if(text.length>4&&text.indexOf('.')==-1){
                                                   text = text.substring(0,4);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.carData['closeingPrice']=moneyStr;
                                               this.closeingPriceInput.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },
                {
                    title:'备注',
                    isShowTag:false,
                    value:'请填写',
                    isShowTail:false,
                    tailView:()=>{
                        return(
                            <TextInput
                                style={[styles.textInput,{width:sceneWidth-Pixel.getPixel(130),height:Pixel.getPixel(60)}]}
                                placeholder='请填写'
                                maxLength={200}
                                underlineColorAndroid='transparent'
                                onFocus={()=>{
                                    this.setState({
                                        keyboardOffset:Pixel.getPixel(0)
                                    });
                                }}
                                onBlur={()=>{
                                    this.setState({
                                        keyboardOffset:-Pixel.getPixel(64)
                                    });
                                }}
                                onChangeText={(text)=>{
                                    this.carData['remark'] = text;
                                }}
                                placeholderTextColor={fontAndColor.COLORA4}
                                placheolderFontSize={Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}
                            />
                        )
                    }
                },
            ]

        ];
        this.state = {
            titleData:this.titleData1,
            keyboardOffset:-Pixel.getPixel(64),
            isDateTimePickerVisible:false,
            renderPlaceholderOnly:'loading'
        };
    }


    /**
     *  form @ZN
     * @param title
     * 点击对应标题
     */
    cellCilck=(title)=>{

        if(this.props.isHideInfoRecourse){
            return;
        }

        if(title=='车型'){

            this.pushCarBrand();

        }else if(title == '信息来源')
        {
            this.pushCarInfomation();

        }else if(title == '收车地区'){

            this.pushCityListScene();

        }else if(title == '初登日期'){

            this._labelPress('register');

        }
    }

    /**
     * from @ZN
     * 车辆系选择
     */
    pushCarBrand=()=>{
        let brandParams = {
            name: 'CarBrandSelectScene',
            component: CarBrandSelectScene,
            params: {
                checkedCarClick: this._checkedCarClick,
                status: 0,
            }
        };
        this.toNextPage(brandParams);
    }

    /**
     *
     * from @ZN
     * 车系选择结果
     * @param carObject
     * @private
     */
    _checkedCarClick=(carObject)=>{

        this.titleData1[0][1].value = carObject.model_name;
        this.carData['brand'] = carObject.brand_name;
        this.carData['collectionType'] = carObject.model_name;
        this.upTitleData();
    }


    /**
     * from @ZN
     * 信息选择
     */
    pushCarInfomation=()=>{

        let brandParams = {
            name: 'CarInfomationSourceScene',
            component: CarInfomationSourceScene,
            params: {
                currentTitle:this.titleData1[2][1].value,
                carInformationSourceSelectAction:this.carInformationSourceSelectAction,
            }
        };
        this.toNextPage(brandParams);
    }

    /**
     * from @ZN
     * 信息选择结果
     * @param selectObject
     */
    carInformationSourceSelectAction =(selectObject)=>{
        this.titleData1[2][1].value = selectObject.title;
        this.carData['infoRecourse']=selectObject.title;
    }

    /**
     * from @zhaojian
     *
     * 跳转到城市选择页面
     **/
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

    /**
     * from @zhaojian
     *
     * 保存城市信息
     **/
    checkedCityClick = (city) => {

        this.titleData1[2][2].value = city.city_name;
        this.carData['collectionArea'] = city.city_name;
        this.upTitleData();
    }

    _labelPress=(type)=>{
        this.type = type;
        this.setState({ isDateTimePickerVisible: true });
    };

    _handleDatePicked = (date)=>{
        let d = this.dateFormat(date,'yyyy-MM-dd');
        if(this.type === 'register') {

            this.titleData1[2][3].value = d;
            this.carData['firstUpTime'] = d;
        }

        this.upTitleData();
        this._hideDateTimePicker();
    };

    _hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    upTitleData=()=>{
        this.setState({
            titleData:this.titleData1,
            renderPlaceholderOnly:'success'
        });
    };

    /**
     * 扫描车架号
     * @private
     */
    _onScanPress=()=>{
        this.vinModal.refresh(this.scanType);
        this.vinModal.openModal(1);
    }

    /**
     * 获取扫描车架号结果
     * @param type
     * @param index
     */
    _vinPress = (type,index) => {

        if(type==1){
            if (IS_ANDROID === true) {
                NativeModules.VinScan.scan(parseInt(index)).then((vl) => {
                    this.vinInput.setNativeProps({
                        text: vl
                    });
                    this._onVinChange(vl);
                }, (error) => {
                });
            } else {
                this.timer = setTimeout(
                    () => {
                        NativeModules.VinScan.scan(parseInt(index)).then((vl) => {
                            this.vinInput.setNativeProps({
                                text: vl
                            });
                            this._onVinChange(vl);
                        }, (error) => {
                        });
                    },
                    500
                );
            }
        }else if (type==0){

            this.titleData1[0][1].value = this.modelData[index].model_name;
            this.carData['brand'] = this.modelData[index].brand_name;
            this.carData['collectionType'] = this.modelData[index].model_name;
            this.upTitleData();
        }

    };

    /**
     * from @ZN
     * @param text
     * @private
     */
    _onVinChange = (text) => {

        if (text.length === 17) {
            this._showLoading();
            this.vinInput.blur();

            request(AppUrls.VIN_CHECK, 'post',{vin:text}).then(
                (response) => {
                    if (response.mycode === 1 && response.mjson.data.valid) {
                        this.titleData1[0][1].value = '请选择';
                        this.titleData1[0][0].subTitle='';
                        this.carData.vin = text;
                        this.carData.brand = '';
                        this.carData.collectionType = '';

                        request(AppUrls.VININFO, 'post',{vin:text}).then(
                            (response) => {
                                this._closeLoading();
                                if (response.mycode === 1) {

                                    let rd = response.mjson.data;
                                    if (rd.length === 1) {
                                        // this.modelInfo['brand_id'] = rd[0].brand_id;
                                        // this.modelInfo['model_id'] = rd[0].model_id;
                                        // this.modelInfo['series_id'] = rd[0].series_id;
                                        // this.modelInfo['model_year'] = rd[0].model_year;
                                        // this.modelInfo['model_name'] = rd[0].model_name;

                                        this.titleData1[0][1].value = rd[0].model_name;
                                        this.carData.brand = rd[0].brand_name;
                                        this.carData.collectionType = rd[0].model_name;


                                    } else if (rd.length > 1) {

                                        this.modelData = response.mjson.data;
                                        this.vinModal.refresh(this.modelData);
                                        this.vinModal.openModal(0);
                                    }

                                }
                                this.upTitleData();
                            },
                            (error) => {
                                this._closeLoading();
                                this.props.showToast(error.mjson.msg);
                            }
                        );

                    } else {
                        this._closeLoading();
                        this.titleData1[0][0].subTitle='校验失败';
                        this.carData.vin='';
                        this.upTitleData();
                    }
                },
                (error) => {
                    this._closeLoading();
                    this.titleData1[0][0].subTitle='校验失败';
                    this.carData.vin='';
                    this.upTitleData();
                }
            );
        }else {
            this.carData.vin='';
        }
    };
    /**
     * from @ZN
     *
     * 正则校验，保证小数点后只能有两位
     **/
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

    /**
     *  限制手机号输入数字
     * @param obj
     * @returns {string}
     */
    phoneNumber=(obj)=> {
        return obj.replace(/[^\d]/g,'');
    }

    /**
     * 开始加载
     * @private
     */
    _showLoading = () => {
        this.props.showModal(true);
    };

    /**
     * 关闭加载
     * @private
     */
    _closeLoading = () => {
        this.props.showModal(false);
    };

    /**
     * from @ZN
     * 时间戳转换
     * @param date
     * @param fmt
     * @returns {*}
     */
    dateFormat = (date,fmt) => {
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
}

const styles = StyleSheet.create({
    rootContaier:{
        backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR,
        flex:1,
        paddingTop:Pixel.getTitlePixel(64),
    },
    scanImage: {
        height: Pixel.getPixel(18),
        width: Pixel.getPixel(18),
        marginLeft: Pixel.getPixel(8)
    },
    textInput: {
        height: Pixel.getPixel(30),
        borderColor: fontAndColor.COLORA0,
        width: Pixel.getPixel(170),
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