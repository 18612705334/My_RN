import React, {Component, PropTypes} from 'react'

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput,
    NativeModules,
    Platform
} from 'react-native'

const {width, height} = Dimensions.get('window');
import * as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';
import SaasText from "../../component/SaasText";
import {IDCARD_NUMBER} from "../../constant/storageKeyNames";
const IS_ANDROID = Platform.OS === 'android';
let shareClass = NativeModules.DYShareClass;
import * as AppUrls from "../../constant/appUrls";
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import *as weChat from 'react-native-wechat';
import {request} from "../../utils/RequestUtil";

export class SharedView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            is_show: false
        }

    }


    sharedMoreImage = (carData) => {
        this.is_show(false)
        if(IS_ANDROID){

        }else{
            let shareArray = [];
            for (let i =0;i<carData.imgs.length;i++)
            {
                shareArray.push({image:carData.imgs[i].url});
            }
            shareClass.shareAction(shareArray).then(()=>{
                this.props.showToast('分享成功');
                this.sharedSucceedAction();
            }, (error)=>{

                this.props.showToast('分享已取消');
            })


        }

    }

    sharedWechatSession = (carData) => {
        this.is_show(false)
        weChat.isWXAppInstalled().then((isInstalled)=>{
            if(isInstalled){
                let imageResource = require('../../../image/carSourceImages/car_info_null.png');
                let carContent = '';
                if (carData.city_name != "") {

                    carContent = carData.city_name + ' | ';
                }
                if (carData.plate_number != "") {

                    carContent += carData.plate_number.substring(0, 2);
                }
                if (carData.carIconsContentData[0] != "") {

                    carContent += " | " + carData.carIconsContentData[0] + '出厂';
                }
                let fenxiangUrl = '';
                if (AppUrls.BASEURL == 'http://api-gateway.test.dycd.com/') {
                    fenxiangUrl = AppUrls.FENXIANGTEST;
                } else {
                    fenxiangUrl = AppUrls.FENXIANGOPEN;
                }
                let carImage = typeof carData.imgs[0].url == 'undefined' ? resolveAssetSource(imageResource).uri : carData.imgs[0].url;
                console.log(fenxiangUrl + '?id=' + carData.id);

                weChat.shareToSession({
                    type:'news',
                    title:carData.model_name,
                    description:carContent,
                    webpageUrl: fenxiangUrl + '?id=' + carData.id,
                    thumbImage: carImage,

                }).then((resp)=>{
                    this.sharedSucceedAction();
                    this.props.showToast('分享成功')
                }, (error)=>{
                    this.props.showToast('分享失败')
                })
            }else {
                this.is_show(false)
            }
        })
    }

    sharedWechatTimeline = (carData) => {
        this.is_show(false)
        weChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    let imageResource = require('../../../image/carSourceImages/car_info_null.png');
                    let carContent = '';
                    if (carData.city_name != "") {
                        carContent = carData.city_name + ' | ';
                    }
                    if (carData.plate_number != "") {

                        carContent += carData.plate_number.substring(0, 2);
                    }
                    if (carData.carIconsContentData[0] != "") {

                        carContent += " | " + carData.carIconsContentData[0] + '出厂';
                    }

                    let fenxiangUrl = '';
                    if (AppUrls.BASEURL == 'http://api-gateway.test.dycd.com/') {
                        fenxiangUrl = AppUrls.FENXIANGTEST;
                    } else {
                        fenxiangUrl = AppUrls.FENXIANGOPEN;
                    }
                    let carImage = typeof carData.imgs[0].url == 'undefined' ? resolveAssetSource(imageResource).uri : carData.imgs[0].url;
                    weChat.shareToTimeline({
                        type: 'news',
                        title: carData.model_name,
                        description: carContent,
                        webpageUrl: fenxiangUrl + '?id=' + carData.id,
                        thumbImage: carImage,

                    }).then((resp)=>{

                        this.sharedSucceedAction();

                        this.props.showToast('分享成功')

                    },(error) => {
                        this.props.showToast('分享失败')
                        console.log('分享失败');

                    })

                } else {
                    this.is_show(false);
                }
            });

    }

    sharedSucceedAction=()=> {

        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
            if (data.code == 1) {
                if (data.result != null && data.result != "") {
                    let userData = JSON.parse(data.result);
                    let userPhone = userData.phone + global.companyBaseID;
                    request(AppUrls.CAR_CHESHANG_SHARE_MOMENT_COUNT, 'POST', {
                        mobile: userPhone
                    }).then((response) => {

                    }, (error) => {

                    });

                } else {
                    this.setState({
                        renderPlaceholderOnly: 'error'
                    });
                }

            } else {
                this.setState({
                    renderPlaceholderOnly: 'error'
                });
            }
        })
    }
        is_show = (show) => {
        this.setState({
            is_show: show
        })
    }

    render(){

        if (!this.state.is_show) {
            return null
        }
        return (
            <View
                style={{position: 'absolute', height: height, width: width}}
            >
                <TouchableOpacity
                    onPress={() => {
                        this.is_show(false)
                    }}
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.3)'}}
                >
                </TouchableOpacity>

                <View style={{backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR}}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginHorizontal: 45,
                        marginVertical: 15
                    }}>

                        <TouchableOpacity
                             onPress={()=>{
                                 this.sharedMoreImage(this.props.carData)
                             }}
                        >

                            <View style={{alignItems: 'center'}}>
                                <Image source={require('../../../image/carSourceImages/shareImgIcon.png')}/>
                                <SaasText
                                    style={{marginTop: 8, fontSize: 12, color: fontAndColor.COLORA4}}>多图分享</SaasText>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{
                                this.sharedWechatSession(this.props.carData)
                            }}
                        >

                            <View style={{alignItems: 'center'}}>
                                <Image source={require('../../../image/carSourceImages/shared_wx.png')}/>
                                <SaasText
                                    style={{marginTop: 8, fontSize: 12, color: fontAndColor.COLORA4}}>微信好友</SaasText>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{
                                this.sharedWechatTimeline(this.props.carData)
                            }}
                        >
                            <View style={{alignItems: 'center'}}>
                                <Image source={require('../../../image/carSourceImages/shared_friend.png')}/>
                                <SaasText
                                    style={{marginTop: 8, fontSize: 12, color: fontAndColor.COLORA4}}>朋友圈</SaasText>
                            </View>

                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={()=>{
                            this.is_show(false)
                        }}
                    >
                        <View style={{
                            borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: fontAndColor.COLORA4,
                            justifyContent: 'center', alignItems: 'center'
                        }}>
                            <SaasText style={{color: fontAndColor.COLORA1, fontSize: 14, marginVertical: 15}}>取消</SaasText>
                        </View>
                    </TouchableOpacity>


                </View>
            </View>
        )
    }
}

export class CallView extends Component {


}