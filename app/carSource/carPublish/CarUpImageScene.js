import React,    {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    TouchableOpacity,
    Dimensions,
    Platform,
    Image,
}   from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import MyBaseNaviComponent from '../../component/MyBaseNaviComponent';
import MyBaseComponent from '../../component/MyBaseComponent';
import AllNavigationView from '../../component/AllNavigationView';
import *as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';
import CarUpImageCell from '../znComponent/CarUpImageCell';
import StorageUtil from "../../utils/StorageUtil";
import SuccessModal from '../../publish/component/SuccessModal';
import CarMySourceScene from '../CarMySourceScene';

import * as Net from '../../utils/RequestUtil';
import * as AppUrls from '../../constant/appUrls';

const Pixel = new  PixelUtil();
const sceneWidth = Dimensions.get('window').width;
const IS_ANDROID = Platform.OS === 'android';
import SelectPhotoModal from '../../component/SelectPhotoModal';
export default class CarUpImageScene extends MyBaseNaviComponent{

    initFinish=()=>{
        this.setState({
            renderPlaceholderOnly:'success',
            title:"请上艳照"
        })
    }

    // 构造
    constructor(props) {
        super(props);

        // this.baseTitleData=[
        //     {
        //         name: 'left_anterior',
        //         title:'左前45度',
        //         subTitle:'至多1张',
        //         number:1,
        //         imgArray:[],
        //         explain:'1',
        //     },{
        //         name: 'rear_right',
        //         title:'右后45度',
        //         subTitle:'至多1张',
        //         imgArray:[],
        //         explain:'1',
        //
        //     },{
        //         name: 'dash_board',
        //         title:'仪表盘',
        //         subTitle:'至多1张',
        //         imgArray:[],
        //         explain:'1',
        //
        //     },{
        //         name: 'front_trim',
        //         title:'前内饰',
        //         subTitle:'至多1张',
        //         number:1,
        //         imgArray:[],
        //         explain:'1',
        //
        //     },{
        //         name: 'rear_trim',
        //         title:'后内饰',
        //         subTitle:'至多1张',
        //         number:1,
        //         imgArray:[],
        //         explain:'1',
        //
        //     },{
        //         name: 'engine',
        //         title:'发动机',
        //         subTitle:'至多1张',
        //         number:1,
        //         imgArray:[],
        //         explain:'1',
        //
        //     },{
        //         name: 'vin_no',
        //         title:'车架号',
        //         subTitle:'至多1张',
        //         number:1,
        //         imgArray:[],
        //         explain:'0',
        //     }
        // ];
        //
        // this.usedCarTitleData=[
        //     {
        //         name: 'registration_card',
        //         title:'登记证',
        //         subTitle:'至多5张',
        //         number:5,
        //         imgArray:[],
        //         explain:'1',
        //     },
        // ];
        //
        // this.importCarTitleData = [
        //     {
        //         name: 'conformance_certificate',
        //         title:'车辆一致性证书正反面',
        //         subTitle:'至多5张',
        //         number:5,
        //         imgArray:[],
        //         explain:'1',
        //     }, {
        //         name: 'customs_declaration',
        //         title:'关单',
        //         subTitle:'至多5张',
        //         number:5,
        //         imgArray:[],
        //         explain:'1',
        //     }, {
        //         name: 'inspection_report',
        //         title:'商检单',
        //         subTitle:'至多5张',
        //         number:5,
        //         imgArray:[],
        //         explain:'1',
        //     },
        // ];


        this.titleData = [];
        this.results = [];
        this.carData = this.props.carData;
        if(this.carData.v_type==1){

            for(let carImageObject of this.props.carConfigurationData.used_car_pic){
                carImageObject['imgArray'] = [];
                if(carImageObject.title == '权属声明/买卖协议'){

                    if(this.carData.registrant_actual == 0)
                    {
                        this.titleData.push(carImageObject);
                    }

                }else {
                    this.titleData.push(carImageObject);
                }
            }

        }else if(this.carData.v_type==2){

            for(let carImageObject of this.props.carConfigurationData.new_car_pic){
                carImageObject['imgArray'] = [];
                this.titleData.push(carImageObject);
            }


        } else if(this.carData.v_type==3){

            for(let carImageObject of this.props.carConfigurationData.imported_car_pic){
                carImageObject.explain = 0;
                carImageObject['imgArray'] = [];
                this.titleData.push(carImageObject);
            }
        }


        if(this.carData.pictures){
            let imgas = JSON.parse(this.carData.pictures);
            this.results.push(...imgas);
            this.titleData.map((data,index)=>{
                imgas.map((imgData,subIndex)=>{
                    if(data.name == imgData.name){
                        data.imgArray.push(imgData);
                    }
                });
            });
        }else if(this.carData.imgs){
            this.results.push(...this.carData.imgs);
            this.carData['pictures']=JSON.stringify(this.results);
            this.titleData.map((data,index)=>{
                this.carData.imgs.map((imgData,subIndex)=>{
                    if(data.name == imgData.name){
                        data.imgArray.push(imgData);
                    }
                });
            });
        }

        const dataSource = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2});
        this.state = {
            dataSource:dataSource.cloneWithRows(this.titleData),
        };
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }

    renderView(){
        return(
            <View style={styles.rootContainer}>
                <SuccessModal okClick={this._goToSource} ref={(modal) => {this.successModal = modal}}/>
                <ListView
                    removeClippedSubviews={false}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    renderFooter={this.renderFooter}
                    renderHeader={()=>{return(
                        <View style={{width:sceneWidth,paddingVertical:Pixel.getPixel(25),backgroundColor:'white',borderBottomWidth:Pixel.getPixel(10),borderBottomColor:fontAndColor.COLORA3}}>
                            <Image style={{width:sceneWidth}} resizeMode={'contain'} source={require('../../../image/carSourceImages/publishCarperpos3.png')}/>
                        </View>
                    )}}
                />

                <SelectPhotoModal ref="selectphotomodal"/>
            </View>)
    }
    renderSeparator(sectionId, rowId) {
        return (
            <View style={styles.Separator} key={sectionId + rowId}/>
        )
    }

    renderFooter =()=>{
        return(
            <View style={styles.footContainer}>
                <TouchableOpacity onPress={this.footBtnClick}>
                    <View style={styles.footView}>
                        <Text allowFontScaling={false}  style={styles.footText}>申请上架</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderRow =(data)=>{
        return(
            <CarUpImageCell
                results={this.results}
                retureSaveAction={()=>{
                    this.carData['pictures']=JSON.stringify(this.results);

                    if(this.carData.show_shop_id && !this.carData.id){
                        StorageUtil.mSetItem(String(this.carData.show_shop_id),JSON.stringify(this.carData));
                    }
                }}
                showModal={(value)=>{this.props.showModal(value)}}
                showToast={(value)=>{this.props.showToast(value)}}
                items={data}
                childList={data.imgArray}
            />
        )
    }

    _goToSource = () => {

        let sourceParams = {
            name: 'CarMySourceScene',
            component: CarMySourceScene,
            params: {
                page:2,
            }
        };
        this.toNextPage(sourceParams);
    };

    footBtnClick=()=>{

        this.props.showModal(true);
        let errorTitle = '';
        for(let i=0;i<this.titleData.length;i++)
        {
            let item = this.titleData[i];
            if(item.explain=='1')
            {
                let isNull = true;
                for(let j=0;j<this.results.length;j++)
                {
                    if(this.results[j].name == item.name)
                    {
                        isNull = false;
                    }
                }
                if(isNull)
                {
                    errorTitle = item.title;
                    break;
                }
            }
        }
        if(errorTitle!='' && this.carData.v_type!=3)
        {
            this.props.showModal(false);
            this.props.showToast('请上传'+errorTitle+'图片');

        }else {

            this.publishCar();

        }
    }

    publishCar=()=>{

        Net.request(AppUrls.CAR_SAVE,'post',this.carData).then((response) => {

            this.props.showModal(false);

            if(response.mycode == 1 || response.mycode == 600010){
                if(this.carData.show_shop_id){
                    StorageUtil.mRemoveItem(String(this.carData.show_shop_id));
                }
                if(IS_ANDROID === true){
                    this.successModal.openModal();
                }else {
                    this.timer = setTimeout(
                        () => { this.successModal.openModal(); },
                        500
                    );
                }
            }else {
                this.showToast('网络连接失败');

            }

        }, (error) => {

            this.props.showModal(false);

            if(error.mycode === -300 || error.mycode === -500){
                this.showToast('网络连接失败');

            }else if(error.mycode == 600010){
                if(this.carData.show_shop_id){
                    StorageUtil.mRemoveItem(String(this.carData.show_shop_id));
                }
                if(IS_ANDROID === true){
                    this.successModal.openModal();
                }else {
                    this.timer = setTimeout(
                        () => { this.successModal.openModal();},
                        500
                    );
                }
            }
            else{
                this.showToast(error.mjson.msg);
            }
        });
    }

    showToast=(errorMsg)=>{
        if(IS_ANDROID === true){
            this.props.showToast(errorMsg);
        }else {
            this.timer = setTimeout(
                () => { this.props.showToast(errorMsg)},
                500
            );
        }
    }
}

const styles = StyleSheet.create({
    rootContainer:{
        flex:1,
        backgroundColor:fontAndColor.COLORA3,
        marginTop:Pixel.getTitlePixel(64),
    },
    Separator: {
        backgroundColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(10),

    }, footContainer:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:Pixel.getPixel(20),
        marginBottom:Pixel.getPixel(20),

    },
    footView:{
        backgroundColor:fontAndColor.NAVI_BAR_COLOR,
        height:Pixel.getPixel(44),
        justifyContent:'center',
        alignItems:'center',
        width:sceneWidth-Pixel.getPixel(30),
        borderRadius:Pixel.getPixel(3),
    },
    footText:{
        textAlign:'center',
        color:'white',
        fontSize:fontAndColor.BUTTONFONT30
    },
})