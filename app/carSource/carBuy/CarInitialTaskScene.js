/**
 * Created by zhengnan on 2017/7/28.
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
import VinInfo from '../../publish/component/VinInfo';
import CarZoomImageScene from '../CarZoomImagScene';
import *as fontAndColor from  '../../constant/FontAndColor';
import PixelUtil from  '../../utils/PixelUtils';
import CarBrandSelectScene from "../CarBrandSelectScene";
import CarInfomationSourceScene from './CarInformationSourceScene';
import * as AppUrls from "../../constant/appUrls";
import  {request}   from '../../utils/RequestUtil';
import CarlicenseTagScene from "../carPublish/CarlicenseTagScene";
import CarInitialTaskUpImagScene from "./CarInitialTaskUpImagScene";
let Pixel = new  PixelUtil();
const sceneWidth = Dimensions.get('window').width;
const scanImg = require('../../../image/financeImages/scan.png');
const IS_ANDROID = Platform.OS === 'android';


export default class CarInitialTaskScene extends BaseComponent{

    render(){
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    {this.loadView()}
                    <AllNavigationView title="车辆信息" backIconClick={this.backPage}/>
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
                <AllNavigationView title= {this.props.taskid ? '车辆信息': "录入车辆信息"} backIconClick={this.backPage}/>
            </View>
        )
    }

    loadScrollView=()=>{
        return(
            <ScrollView  keyboardDismissMode={IS_ANDROID?'none':'on-drag'}>
                {
                    this.state.titleData.map((data, index) => {
                        return (
                            <View style={{marginTop:10,backgroundColor:'white',marginBottom:10}} key={index}>
                                {
                                    data.map((rowData, subIndex) => {
                                        return( <TouchableOpacity key={subIndex}
                                                                  activeOpacity={1}
                                                                  onPress={()=>this.cellCilck(rowData.title)}>
                                            <CellView cellData={rowData}/>
                                        </TouchableOpacity>)
                                    })
                                }
                            </View>
                        )
                    })
                }
                {
                    this.state.imageArray.map((data,index)=>{
                        return(
                            <View style={{backgroundColor:'white',paddingVertical:Pixel.getPixel(15),paddingHorizontal:Pixel.getPixel(15)}} key={'imgkey'+index}>
                                <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30)}}>{data.title}</Text>
                                <TouchableOpacity activeOpacity={1} onPress={()=>{this.showPhotoView(index)}}>
                                    <Image style={{width:sceneWidth-Pixel.getPixel(30),height:(sceneWidth-Pixel.getPixel(30))/Pixel.getPixel(1.5),backgroundColor:fontAndColor.COLORA3,marginTop:Pixel.getPixel(15)}}
                                           source={{uri:data.url}}/>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
                {
                    this.props.type != 2&&
                    (<View style={styles.footContainer}>
                        <TouchableOpacity onPress={this.footBtnClick}>
                            <View style={styles.footView}>
                                <Text allowFontScaling={false}  style={styles.footText}>下一步</Text>
                            </View>
                        </TouchableOpacity>
                    </View>)
                }
            </ScrollView>
        )

    }

    cellSelectAction=(selectDict)=>{
        alert(selectDict.title,selectDict.value);
    }

    footBtnClick=()=>{

        if(!this.carData.vin)
        {
            this.props.showToast('请输入正确的车架号');
            return;
        }
        if(!this.carData.carName)
        {
            this.props.showToast('请输入车类型');
            return;
        }


        this.toNextPage({
            name:'CarInitialTaskUpImagScene',
            component: CarInitialTaskUpImagScene,
            params: {
                carData:this.carData,
                reloadTaskData:this.props.reloadTaskData,

            }
        })
    }


    initFinish=()=>{

        if(this.props.taskid){
            this.loadData();
        }else {
            this.setState({
                renderPlaceholderOnly:'success'
            });
        }
    }

    /**
     * 加载数据
     */
    loadData=()=>{

        this.setState({
            renderPlaceholderOnly:'loading'
        });
        request(AppUrls.CAR_CHESHANG_TASKINFO,'post',{
            type:this.type,
            roleName:this.roleName,
            taskid:this.props.taskid,
        }).then((response) => {

            this.setData(response.mjson.data);
        }, (error) => {

        });
    }

    setData=(carData)=>{
        this.titleData1[0][0].tailView='';
        this.titleData1[1][0].tailView='';
        this.titleData1[1][1].tailView='';
        this.titleData1[2][2].tailView='';
        this.titleData1[3][0].tailView='';
        this.titleData1[3][1].tailView='';

        this.titleData1[0][0].value = carData.vin;
        this.titleData1[0][1].value = carData.carName;

        this.titleData1[1][0].value = carData.taskInfo.infoName;
        this.titleData1[1][1].value = carData.taskInfo.infoMobile;

        let infoSourceStr = '';
        switch(carData.taskInfo.infoSource){
            case 1:{
                infoSourceStr='本平台';
                break;
            }
            case 2:{
                infoSourceStr='其他网络平台';
                break;
            }
            case 3:{
                infoSourceStr='朋友圈';
                break;
            }
            case 4:{
                infoSourceStr='信息员介绍';
                break;
            }
            case 5:{
                infoSourceStr='友商合车';
                break;
            }
            case 6:{
                infoSourceStr='拍卖';
                break;
            }
            case 7:{
                infoSourceStr='自到店';
                break;
            }
            case 8:{
                infoSourceStr='客户转介绍';
                break;
            }
            case 9:{
                infoSourceStr='置换';
                break;
            }
        }
        this.titleData1[2][0].value = infoSourceStr;
        this.titleData1[2][1].value = carData.carNum;
        this.titleData1[2][2].value = carData.taskInfo.keysNum;

        this.titleData1[3][0].value = carData.taskInfo.selfName;
        this.titleData1[3][1].value = carData.taskInfo.selfMobile;

        let imageArray = [];

        if(carData.taskInfo.arcPath){
            imageArray.push({title:'登记证',url:carData.taskInfo.arcPath})
        }
        if(carData.taskInfo.dlPath){
            imageArray.push({title:'行驶证',url:carData.taskInfo.dlPath})

        }
        if(carData.taskInfo.policyPath){
            imageArray.push({title:'保险单',url:carData.taskInfo.policyPath})

        }
        if(carData.taskInfo.idcardPath){
            imageArray.push({title:'身份证',url:carData.taskInfo.idcardPath})

        }

        this.titleData1[3][2].tailView=()=>{
            return(
                <TextInput
                    style={[styles.textInput,{width:sceneWidth-Pixel.getPixel(130),height:Pixel.getPixel(60)}]}
                    maxLength={200}
                    value={carData.remark}
                    editable={false}
                    underlineColorAndroid='transparent'
                    ref={(input) => {this.instructionsInput = input}}
                    placeholderTextColor={fontAndColor.COLORA4}
                    onChangeText={(text)=>{this.carData.remark = text}}
                    placheolderFontSize={Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}
                />
            )
        }



        this.setState({
            renderPlaceholderOnly:'success',
            titleData:this.titleData1,
            imageArray:imageArray,
        });

    }

    // 构造
    constructor(props) {
        super(props);

        this.carData ={
            dlPath:'',
            policyPath:'',
            arcPath:'',
            idcardPath:'',
            carName:'',
            infoName:'',
            vin:'',
            selfName:'',
            keysNum:'',
            remark:'',
            carNum:'',
            infoMobile:'',
            infoSource:1,
            selfMobile:''
        };

        this.roleName = this.props.roleName;
        this.type = this.props.type;
        this.scanType = [
            {model_name: '扫描前风挡'},
            {model_name: '扫描行驶证'}
        ];
        this.titleData1=[
            [
                {
                    title:'车架号',
                    isShowTag:this.props.taskid?false:true,
                    subTitle:"",
                    tailView:()=>{
                        return(
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <TextInput style={styles.textInput}
                                           ref={(input) => {this.vinInput = input}}
                                           placeholder='输入车架号'
                                           underlineColorAndroid='transparent'
                                           maxLength={17}
                                           onChangeText={this._onVinChange}
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
                    isShowTag:this.props.taskid?false:true,
                    value:'请选择',
                    isShowTail:this.props.taskid?false:true,
                },

            ],
            [
                {
                    title:'信息员姓名',
                    isShowTag:false,
                    value:'请选择',
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
                                           onChangeText={(text)=>{this.carData.infoName = text}}/>
                            </View>)
                    }
                },
                {
                    title:'信息员电话',
                    isShowTag:false,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           placeholder='请输入'
                                           keyboardType={'phone-pad'}
                                           ref={(ref)=>{this.infoMobileInput = ref}}
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
                                               this.infoMobileInput.setNativeProps({
                                                   text: number,
                                               });
                                               this.carData.infoMobile = text
                                           }}/>

                            </View>)
                    }
                },

            ],
            [
                {
                    title:'信息来源',
                    isShowTag:false,
                    value:'请选择',
                    isShowTail:this.props.taskid?false:true,
                },
                {
                    title:'原车牌号',
                    isShowTag:false,
                    value:'请选择',
                    isShowTail:this.props.taskid?false:true,
                },
                {
                    title:'钥匙数',
                    isShowTag:false,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={11}
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text)=>{this.carData.keysNum=text}}/>

                            </View>)
                    }
                },
            ],
            [
                {
                    title:'卖车人姓名',
                    isShowTag:false,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           placeholder='请输入'
                                           maxLength={15}
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text)=>{this.carData.selfName = text}}/>
                            </View>)
                    }
                },
                {
                    title:'卖车人电话',
                    isShowTag:false,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref)=>{this.selfMobileInput=ref}}
                                           placeholder='请输入'
                                           keyboardType={'phone-pad'}
                                           maxLength={11}
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text)=>{
                                               let number = this.phoneNumber(text);
                                               this.selfMobileInput.setNativeProps({
                                                   text: number,
                                               });
                                               this.carData.selfMobile = text
                                           }}/>

                            </View>)
                    }
                },
                {
                    title:'备注',
                    isShowTag:false,
                    value:'请填写',
                    tailView:()=>{
                        return(
                            <TextInput
                                style={[styles.textInput,{width:sceneWidth-Pixel.getPixel(130),height:Pixel.getPixel(60)}]}
                                placeholder='请填写'
                                maxLength={200}
                                underlineColorAndroid='transparent'
                                ref={(input) => {this.instructionsInput = input}}
                                placeholderTextColor={fontAndColor.COLORA4}
                                onChangeText={(text)=>{this.carData.remark = text}}
                                placheolderFontSize={Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}
                            />
                        )
                    }
                },
            ]

        ];
        this.state = {
            titleData:this.titleData1,
            imageArray:[],
            keyboardOffset:-Pixel.getPixel(64),
            renderPlaceholderOnly:'success'
        };
    }

    // 浏览图片
    showPhotoView = (index) => {

        let navigatorParams = {
            name: "CarZoomImageScene",
            component: CarZoomImageScene,
            params: {
                images: this.state.imageArray,
                index: index,
            }
        }
        this.toNextPage(navigatorParams);
    }

    /**
     *  form @ZN
     * @param title
     * 点击对应标题
     */
    cellCilck=(title)=>{

        if(this.props.taskid)
        {
            return;
        }
        if(title=='车型'){

            this.pushCarBrand();

        }else if(title == '信息来源')
        {
            this.pushCarInfomation();

        }else if(title == '原车牌号'){

            this.pushCarIicenseTagScene();
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
        this.carData.carName = carObject.model_name;
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

                currentTitle:this.titleData1[2][0].value,
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
        this.titleData1[2][0].value = selectObject.title;
        this.carData.infoSource = selectObject.value;
    }

    /**
     * from @zn
     *
     * 跳转车牌号页面
     **/
    pushCarIicenseTagScene = () => {
        let navigatorParams = {
            name: "CarlicenseTagScene",
            component: CarlicenseTagScene,
            params: {
                checkedCarlicenseTagClick: this._checkedCarlicenseTagClick,
                currentChecked: this.titleData1[2][1].value,

            }
        };
        this.toNextPage(navigatorParams);
    }

    /**
     * from @zn
     *
     * 保存车牌号信息
     **/
    _checkedCarlicenseTagClick = (title) => {
        this.titleData1[2][1].value = title;
        this.carData.carNum = title;
        this.upTitleData();
    }


    upTitleData=()=>{

        this.setState({
            titleData:this.titleData1,
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
            this.carData.carName = this.modelData[index].model_name;
            this.upTitleData();
        }

    };

    /**
     * from @ZN
     * @param text
     * @private
     */
    _onVinChange = (text) => {

        this.carData.vin = '';
        if (text.length === 17) {
            this._showLoading();
            this.vinInput.blur();

            request(AppUrls.VIN_CHECK, 'post',{vin:text}).then(
                (response) => {
                    if (response.mycode === 1 && response.mjson.data.valid) {
                        this.titleData1[0][0].subTitle='';
                        this.titleData1[0][1].value = '请选择';
                        this.carData.vin = text;
                        this.carData.carName = '';
                        request(AppUrls.VININFO, 'post',{vin:text}).then(
                            (response) => {
                                this._closeLoading();
                                if (response.mycode === 1)
                                {
                                    let rd = response.mjson.data;
                                    if (rd.length === 1) {
                                        // this.modelInfo['brand_id'] = rd[0].brand_id;
                                        // this.modelInfo['model_id'] = rd[0].model_id;
                                        // this.modelInfo['series_id'] = rd[0].series_id;
                                        // this.modelInfo['model_year'] = rd[0].model_year;
                                        // this.modelInfo['model_name'] = rd[0].model_name;

                                        this.titleData1[0][1].value = rd[0].model_name;
                                        this.carData.carName = rd[0].model_name;

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
                                this.upTitleData();
                            }
                        );
                    }else {
                        this._closeLoading();
                        this.titleData1[0][0].subTitle='校验失败';
                        this.carData.vin = '';
                        this.upTitleData();
                    }
                },
                (error) => {
                    this._closeLoading();
                    this.titleData1[0][0].subTitle='校验失败';
                    this.carData.vin = '';
                    this.upTitleData();
                }
            );
        }else {
            this.carData.vin = '';
        }
    };

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
