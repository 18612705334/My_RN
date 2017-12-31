/**
 * Created by zhengnan on 2017/8/3.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    TouchableOpacity,
    Text,
    Image,
    NativeModules,
    Dimensions,
    RefreshControl,
} from 'react-native';

import BaceComponent from '../component/BaseComponent';
import NavigatorView from '../component/AllNavigationView';
import ListFooter           from './znComponent/LoadMoreFooter';
import CarShareCell     from './znComponent/CarShareCell';
import * as fontAndColor from '../constant/FontAndColor';
import * as AppUrls from "../constant/appUrls";
import  {request}           from '../utils/RequestUtil';
import PixelUtil from '../utils/PixelUtils';
import *as weChat from 'react-native-wechat';
import CarInfoScene from "./CarInfoScene";
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";
const Pixel = new PixelUtil();
var ScreenWidth = Dimensions.get('window').width;
var shareClass = NativeModules.DYShareClass;
let Platform = require('Platform');
const IS_ANDROID = Platform.OS === 'android';

let carUpperFrameData = [];
let carUpperFramePage = 1;
let carUpperFrameStatus = 1;

export default class CarSharedListScene extends BaceComponent{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        this.shareNumberSum = 0;
        this.isAllSelect = false;
        const carData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id == r2.id});
        this.state = {
            carData:carData,
            isRefreshing: true,
            renderPlaceholderOnly: 'blank',
            carUpperFrameStatus: carUpperFrameStatus,
            isShowCarSharedView:false,
        };
    }


    initFinish = () => {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.loadData();
    };

    refreshingData = () => {

        this.setState({
            isRefreshing: true,
        });
        this.loadData();

    }
    loadData = () => {

        let url = AppUrls.CAR_USER_CAR;
        carUpperFramePage = 1;
        request(url, 'post', {
            car_status: '1',
            page: carUpperFramePage,
            row: 10,

        }).then((response) => {

            carUpperFrameData=[];
            carUpperFrameStatus = response.mjson.data.status;
            let carData = response.mjson.data.list;
            if (carData.length) {
                for (let i = 0; i < carData.length; i++) {
                    let carItem = carData[i].select = false
                    carUpperFrameData.push(carData[i]);
                }
            }
            if (carUpperFrameData.length) {
                this.setState({
                    carData: this.state.carData.cloneWithRows(carUpperFrameData),
                    isRefreshing: false,
                    renderPlaceholderOnly: 'success',
                    carUpperFrameStatus:carUpperFrameStatus,
                    isCarLong:this.isCarLong,
                });

            } else {
                this.setState({
                    isRefreshing: false,
                    renderPlaceholderOnly: 'null',
                    carUpperFrameStatus: carUpperFrameStatus,
                    isCarLong:this.isCarLong,

                });
            }

        }, (error) => {

            this.setState({
                isRefreshing: false,
                renderPlaceholderOnly: 'error',
                isCarLong:this.isCarLong,
            });

        });

    }

    loadMoreData = () => {

        let url = AppUrls.CAR_USER_CAR;
        carUpperFramePage += 1;
        request(url, 'post', {
            car_status: '1',
            page: carUpperFramePage,
            row: 10,

        }).then((response) => {
            carUpperFrameStatus = response.mjson.data.status;
            let carData = response.mjson.data.list;
            if (carData.length) {
                for (let i = 0; i < carData.length; i++) {

                    let carItem = carData[i].select=false
                    carUpperFrameData.push(carData[i]);
                }

                this.setState({
                    carData:this.state.carData.cloneWithRows(carUpperFrameData),
                    carUpperFrameStatus:carUpperFrameStatus,
                    isCarLong:this.isCarLong,
                });
            } else {

                this.setState({
                    carUpperFrameStatus: carUpperFrameStatus,
                });
            }

        }, (error) => {


        });
    }


    toEnd = () => {

        if (carUpperFrameData.length && !this.state.isRefreshing && carUpperFrameStatus != 2) {
            this.loadMoreData();
        }

    };

    renderListFooter = () => {

        if (this.state.isRefreshing) {
            return null;
        } else {
            return (<ListFooter isLoadAll={this.state.carUpperFrameStatus==1? false : true}/>)
        }
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={{flex:1,backgroundColor:'white'}}>
                    {this.loadView()}
                    <NavigatorView title="批量分享" backIconClick={this.backPage}/>
                </View>);
        }
        return (

            <View style={styles.rootContainer}>
                {
                    this.state.carData &&
                    <ListView
                        removeClippedSubviews={false}
                        style={styles.listView}
                        dataSource={this.state.carData}
                        ref={'carListView'}
                        initialListSize={10}
                        onEndReachedThreshold={1}
                        stickyHeaderIndices={[]}//仅ios
                        enableEmptySections={true}
                        scrollRenderAheadDistance={10}
                        pageSize={10}
                        renderFooter={this.renderListFooter}
                        onEndReached={this.toEnd}
                        renderRow={this.renderRow}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.refreshingData}
                                tintColor={[fontAndColor.NAVI_BAR_COLOR]}
                                colors={[fontAndColor.NAVI_BAR_COLOR]}/>}
                    />
                }
                <NavigatorView title="批量分享" backIconClick={this.backPage} />
                <FootView ref="footView" allSelectClicl={this.allSelectBtnClick} carNumber={this.shareNumberSum} isSelect={this.isAllSelect} shareBtnClick={this.shareBtnClick}/>
                {
                    this.state.isShowCarSharedView && <CarSharedView offClick={()=>{this.setState({isShowCarSharedView:false})}} carSharedBtnClick={this.carSharedBtnClick} isShowMore={false}/>
                }
            </View>
        )
    }

    renderRow =(rowData,sectionID, rowID, highlightRow)=>{

        return(
            <CarShareCell carCellData={rowData} cellClick={this.carCellClick}  type={1} cellSelectBtnclick={this.cellSelectBtnclick} index={rowID}/>
        )
    }

    carCellClick = (carData) => {
        let navigatorParams = {
            name: "CarInfoScene",
            component: CarInfoScene,
            params: {
                carID: carData.id,
            }
        };
        this.toNextPage(navigatorParams);

    }

    allSelectBtnClick=(type)=>{
        for(let carItem of carUpperFrameData)
        {
            carItem.select = type;
        }
        this.shareNumberSum = type? carUpperFrameData.length:0;

        this.setState(
            {
                carData:this.state.carData.cloneWithRows(carUpperFrameData)
            },
        );

        this.isAllSelect = type;
        this.refs.footView.setAllSelectBtn(this.isAllSelect,this.shareNumberSum);

    }
    cellSelectBtnclick=(type,rowID)=>{
        carUpperFrameData[parseInt(rowID)].select = type;
        if(type){
            this.shareNumberSum+=1;
        }else {
            this.shareNumberSum-=1;
        }
        this.isAllSelect = this.shareNumberSum == carUpperFrameData.length ? true:false;
        console.log('isAllSelect',this.isAllSelect,carUpperFrameData.length);
        this.refs.footView.setAllSelectBtn(this.isAllSelect,this.shareNumberSum);

        this.setState(
            {
                carData:this.state.carData.cloneWithRows(carUpperFrameData)
            },
        );

    }

    sumShareNumber =()=>{
        let carShareArray = [];
        for(let carItem of carUpperFrameData)
        {
            if(carItem.select){

                carShareArray.push(carItem);
            }
        }
        return carShareArray;

    }

    shareBtnClick=(type)=>{

        let carShareArray = this.sumShareNumber();

        if(carShareArray.length<=0){

            this.props.showToast('请选择分享的车辆');
            return;
        }

        if(type==1){

            if(IS_ANDROID == true)
            {
                let carShareItemArray = [];
                let carShareItemTitle = [];
                for(let carData of carShareArray){
                    let imagArray = [];
                    for (let i =0;i<carData.imgs.length;i++)
                    {
                        imagArray.push(carData.imgs[i].url);
                    }
                    carShareItemArray.push(imagArray);

                    let carContent = carData.model_name;
                    if (carData.city_name) {

                        carContent +=( ' | '+carData.city_name);
                    }
                    if (carData.plate_number) {

                        carContent +=(' | '+ carData.plate_number.substring(0, 2));
                    }
                    carShareItemTitle.push(carContent);
                    this.sharedSucceedAction();
                }

                NativeModules.ShareNative.share({image:carShareItemArray,title:carShareItemTitle}).then((suc)=>{
                        this.props.showToast('分享成功');
                    }, (fail)=>{
                        this.props.showToast('分享已取消');
                    }
                );
            }else {
                let carShareItemArray = [];
                for(let carData of carShareArray){
                    let imagArray = [];
                    for (let i =0;i<carData.imgs.length;i++)
                    {
                        imagArray.push({image:carData.imgs[i].url});
                    }


                    imagArray.map((image, indx)=>{
                        carShareItemArray.push(image)
                    })

                    this.sharedSucceedAction();
                }
                shareClass.shareAction(carShareItemArray).then((data) => {

                    this.props.showToast(data);

                }, (error) => {

                    this.props.showToast('分享已取消');
                });
            }

        }
        else if(type==2)
        {
            // let carInfoItemArray = [];
            // for(let carData of carShareArray){
            //
            //     let fenxiangUrl = '';
            //     if (AppUrls.BASEURL == 'http://api-gateway.test.dycd.com/') {
            //         fenxiangUrl = AppUrls.FENXIANGTEST;
            //     } else {
            //         fenxiangUrl = AppUrls.FENXIANGOPEN;
            //     }
            //
            //     let carContent = carData.model_name;
            //     if (carData.city_name) {
            //         carContent +=( ' | '+carData.city_name);
            //     }
            //     if (carData.plate_number) {
            //         carContent +=(' | '+ carData.plate_number.substring(0, 2));
            //     }
            //
            //     carInfoItemArray.push([{url:fenxiangUrl + '?id=' + carData.id},{image:carData.img},{title:carContent}]);
            // }
            //
            // console.log(carInfoItemArray);
            // shareClass.shareAction(carInfoItemArray).then((data) => {
            //     this.props.showToast(data);
            // }, (error) => {
            //
            //     this.props.showToast('分享已取消');
            // });
            let carInfoItemArray = [];
            for(let carData of carShareArray){

                let fenxiangUrl = '';
                if (AppUrls.BASEURL == 'http://api-gateway.test.dycd.com/') {
                    fenxiangUrl = AppUrls.FENXIANGTEST;
                } else {
                    fenxiangUrl = AppUrls.FENXIANGOPEN;
                }

                let carContent = '';
                if (carData.city_name) {
                    carContent +=(carData.city_name);
                }
                if (carData.plate_number) {
                    carContent +=(' | '+ carData.plate_number.substring(0, 2));
                }
                carInfoItemArray.push({url:fenxiangUrl + '?id=' + carData.id,image:carData.img,title:carData.model_name,content:carContent});
            }
            this.batchSharedArray = carInfoItemArray;
            this.batchIndex = 0;
            this.batchSharedData();
            // shareClass.shareAction(carInfoItemArray).then((data) => {
            //     this.props.showToast(data);
            // }, (error) => {
            //
            //     this.props.showToast('分享已取消');
            // });

        }
        else if(type==3)
        {
            if(carShareArray.length>9)
            {
                this.props.showToast('多车分享最多不能超过9辆');
                return;
            }

            if(IS_ANDROID ==true){
                let carShareItemArray = [];
                let carShareItemTitle = '';
                for(let carData of carShareArray){
                    carShareItemArray.push(carData.img);
                    let carContent = carData.model_name;
                    if (carData.city_name) {

                        carContent +=( ' | '+carData.city_name);
                    }
                    if (carData.plate_number) {

                        carContent +=(' | '+ carData.plate_number.substring(0, 2));
                    }
                    carShareItemTitle+=(carContent+'\n');
                    this.sharedSucceedAction();
                }
                NativeModules.ShareNative.share({image:[carShareItemArray],title:[carShareItemTitle]}).then((suc)=>{
                    }, (fail)=>{
                        this.props.showToast('分享已取消');
                    }
                );

            }else {
                let carShareItemArray = [];
                for(let carData of carShareArray){
                    carShareItemArray.push({image:carData.img});
                    this.sharedSucceedAction();
                }
                shareClass.shareAction([carShareItemArray]).then((data) => {

                    this.props.showToast(data);

                }, (error) => {

                    this.props.showToast('分享已取消');
                });
            }
        }
    }

    batchSharedData=()=>{

        if(this.batchIndex>=this.batchSharedArray.length)
        {
            return;
        }

        this.setState({
            isShowCarSharedView:true,
        });
    }

    carSharedBtnClick=(type)=>{
        let shareData = this.batchSharedArray[this.batchIndex];
        if(type == '微信好友'){
            this.sharedWechatSession(shareData);
        }else {
            this.sharedWechatTimeline(shareData);
        }
    }

    // 分享好友
    sharedWechatSession = (sharData) => {
        weChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    weChat.shareToSession({
                        type: 'news',
                        title: sharData.title,
                        description: sharData.content,
                        webpageUrl: sharData.url,
                        thumbImage: sharData.image,

                    }).then((resp)=>{
                        this.batchIndex++;
                        this.batchSharedData();
                        this.sharedSucceedAction();
                        console.log('分享成功');
                    },(error) => {
                        console.log('分享失败');

                    })
                } else {
                    this.isVisible(false);
                }
            });


    }

    // 分享朋友圈
    sharedWechatTimeline = (sharData) => {
        console.log(sharData);
        weChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    weChat.shareToTimeline({
                        type: 'news',
                        title: sharData.title,
                        description: sharData.content,
                        webpageUrl: sharData.url,
                        thumbImage: sharData.image,

                    }).then((resp)=>{

                        this.batchIndex++;
                        this.batchSharedData();
                        this.sharedSucceedAction();
                        console.log('分享成功');

                    },(error) => {
                        console.log('分享失败');

                    })

                } else {
                    this.isVisible(false);
                }
            });

    }

    sharedSucceedAction=()=>{

        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
            if (data.code == 1) {
                if (data.result != null && data.result != "")
                {
                    let userData = JSON.parse(data.result);
                    let userPhone = userData.phone+global.companyBaseID;
                    request(AppUrls.CAR_CHESHANG_SHARE_MOMENT_COUNT,'POST',{
                        mobile:userPhone
                    }).then((response) => {
                    }, (error) => {
                    });

                }else {
                    this.setState({
                        renderPlaceholderOnly:'error'
                    });
                }

            }else {
                this.setState({
                    renderPlaceholderOnly:'error'
                });
            }
        })


    }

}


class FootView extends Component{

    render(){
        return(
            <View style={styles.footView}>
                <View style={styles.footViewHead}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>{this.props.allSelectClicl(!this.props.isSelect)}}>
                            <Image source={this.state.imgSource}/>
                        </TouchableOpacity>
                        <Text style={{fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30),color:fontAndColor.COLORA0,marginLeft:Pixel.getPixel(5)}}>全选</Text>
                    </View>
                    <Text style={{fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30),color:fontAndColor.COLORA0,}}>合计车辆:{this.state.carNumber}台</Text>
                </View>
                <View style={{justifyContent:'center', alignItems:'center'}}>
                    <View style={{alignItems:'center',justifyContent:'space-between',width:ScreenWidth - Pixel.getPixel(30),height:Pixel.getPixel(44),
                        flexDirection:'row'
                    }}>
                        <ShareBtn title={'九宫格分享'} shareBtnClick={()=>{this.props.shareBtnClick(1)}}/>
                        <ShareBtn title={'链接分享'} shareBtnClick={()=>{this.props.shareBtnClick(2)}}/>
                        <ShareBtn title={'多车分享'} shareBtnClick={()=>{this.props.shareBtnClick(3)}}/>
                    </View>
                </View>

            </View>)
    }
    // 构造
    constructor(props) {
        super(props);

        this.state = {
            carNumber:this.props.carNumber,
            imgSource: this.props.isSelect?require('../../image/carSourceImages/carSelectImgHigh.png') : require('../../image/carSourceImages/carSelectImg.png'),
        };
    }

    setAllSelectBtn=(type,carNumbser)=>{

        this.props.isSelect = type;
        this.props.carNumber = carNumbser;
        this.setState({
            carNumber:carNumbser,
            imgSource:type?require('../../image/carSourceImages/carSelectImgHigh.png') : require('../../image/carSourceImages/carSelectImg.png'),
        });
    }
}

class CarSharedView extends Component {

    render(){
        return(
            <TouchableOpacity style={styles.manageView} activeOpacity={1} onPress={this.props.offClick}>
                <View style={styles.sharedView}>
                    <View style={{flexDirection: 'row',paddingVertical:Pixel.getPixel(15)}}>
                        {
                            this.state.isShowMoreImageBtn && (
                                <TouchableOpacity style={styles.sharedItemView} onPress={() => {
                                    this.btnClick('多图分享');
                                }}>
                                    <View style={styles.sharedImageBack}>
                                        <Image source={require('../../image/carSourceImages/shareImgIcon.png')}/>
                                    </View>
                                    <Text allowFontScaling={false}  style={styles.sharedText}>多图分享</Text>
                                </TouchableOpacity>
                            )
                        }
                        <TouchableOpacity style={styles.sharedItemView} onPress={() => {
                            this.btnClick('微信好友');
                        }}>
                            <View style={styles.sharedImageBack}>
                                <Image source={require('../../image/carSourceImages/shared_wx.png')}/>
                            </View>
                            <Text allowFontScaling={false}  style={styles.sharedText}>微信好友</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sharedItemView} onPress={() => {
                            this.btnClick('朋友圈');
                        }}>
                            <View style={styles.sharedImageBack}>
                                <Image source={require('../../image/carSourceImages/shared_friend.png')}/>
                            </View>
                            <Text allowFontScaling={false}  style={styles.sharedText}>朋友圈</Text>
                        </TouchableOpacity>
                    </View>
                    <View  style={{justifyContent:'center',alignItems:'center',borderTopWidth:Pixel.getPixel(1),borderTopColor:fontAndColor.THEME_BACKGROUND_COLOR,height:Pixel.getPixel(44),
                        width:ScreenWidth
                    }}>
                        <Text style={styles.sharedViewHeadText}>取消</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isShowMoreImageBtn:this.props.isShowMore,
        };
    }

    btnClick=(type)=>{
        this.props.carSharedBtnClick(type);
        this.props.offClick();
    }
}


class ShareBtn extends Component {

    render(){
        return(
            <TouchableOpacity onPress={()=>{this.props.shareBtnClick()}}>
                <View style={{borderWidth:Pixel.getPixel(1),borderColor:fontAndColor.COLORB0,justifyContent:'center',
                    alignItems:'center', width:Pixel.getPixel(100),height:Pixel.getPixel(32),backgroundColor:'white',
                    borderRadius:Pixel.getPixel(2)
                }}>
                    <Text style={{color:fontAndColor.NAVI_BAR_COLOR, fontSize:Pixel.getPixel(fontAndColor.LITTLEFONT28)}}>{this.props.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }


}


const styles = StyleSheet.create({

    rootContainer: {
        flex: 1,
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
        paddingTop: Pixel.getTitlePixel(64),
    },
    listView: {
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
        flex:1
    },
    footView:{
        left:0,
        right:0,
        bottom:0,
        backgroundColor:'white',
        height:Pixel.getPixel(88),
    },
    footViewHead:{
        paddingHorizontal:Pixel.getPixel(15),
        height:Pixel.getPixel(44),
        borderBottomColor:fontAndColor.THEME_BACKGROUND_COLOR,
        borderBottomWidth:Pixel.getPixel(1),
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    manageView:{
        left: 0,
        right: 0,
        bottom: 0,
        top:0,
        position: 'absolute',
        backgroundColor: 'rgba(1,1,1,0.5)',
    },
    sharedView: {
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',

    },
    sharedViewHead: {
        height: Pixel.getPixel(44),
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: ScreenWidth
    },
    sharedViewHeadText: {
        color: fontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
    },
    sharedImageBack:{
        backgroundColor:fontAndColor.COLORB9,
        borderRadius:Pixel.getPixel(10),
        width:Pixel.getPixel(50),
        height:Pixel.getPixel(50),
        justifyContent:'center',
        alignItems:'center'
    },
    sharedItemView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Pixel.getPixel(20),
        marginRight: Pixel.getPixel(20),
        marginTop: Pixel.getPixel(10),
        marginBottom: Pixel.getPixel(10),
    },
    sharedText: {
        color: fontAndColor.COLORA1,
        textAlign: 'center',
        marginTop: Pixel.getPixel(10),
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
    },

})