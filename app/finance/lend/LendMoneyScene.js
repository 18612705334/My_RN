
import React, {Component, PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
//图片加文字
//ok

import {width, adapeSize, fontadapeSize, PAGECOLOR} from './component/MethodComponent';
import AllNavigationView from '../../component/AllNavigationView'
import BaseComponent from '../../component/BaseComponent';
import SingelCarScene from './SingelCarScene';
import KurongSence from './KurongSence';
import ChedidaiSence from './ChedidaiSence'
import PixelUtil from '../../utils/PixelUtils';
const Pixel = new PixelUtil();
import {confimCarcell} from './ConfimCGDPriceSence'
import {LendSuccessAlert} from './component/ModelComponent'
import CGDSelectPatternScene from './CGDSelectPatternScene';

class TitleImage extends PureComponent {
    // 构造
    render() {
        const {imageSource, title}=this.props;
        return (

            <View style={styles.titleImage}>
                <Image style={styles.image} source={imageSource}/>
                <Text allowFontScaling={false} style={styles.text}>{title}</Text>
            </View>
        )
    }
}

class PageItem extends PureComponent {

    render() {
        const {onPress, backImage, title, imageSource}=this.props;
        return (
            <View style={styles.warp}>

                <View style={styles.insertWarp}>

                    <TouchableOpacity style={{alignItems: 'center'}} activeOpacity={0.9} onPress={onPress}>
                        <Image style={styles.backGroundImage} source={backImage}>

                            <TitleImage imageSource={imageSource} title={title}
                                        onPress={this.onPress}/>
                        </Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}

export  default class LendMoneySence extends BaseComponent {

    dataSource = [
        {
            backImage: require('../../../image/financeImages/backSingle.png'),
            imageSource: require('../../../image/financeImages/singleIcon.png'),
            title: '单车融资',
            key: 'single'
        },
    ]

    componentWillMount() {

        try {
            if (parseInt(this.props.inventory_financing_status) == 1) {

                this.dataSource.push({
                    backImage: require('../../../image/financeImages/backkurong.png'),
                    imageSource: require('../../../image/financeImages/kurongIcon.png'),
                    title: '库融融资',
                    key: 'kurong'
                })
            }
            if (parseInt(this.props.purchase_status) == 1) {
                this.dataSource.push({
                    backImage: require('../../../image/financeImages/backcaigou.png'),
                    imageSource: require('../../../image/financeImages/caigouIcon.png'),
                    title: '采购融资',
                    key: 'caigoudai'
                })
            }
            if (parseInt(this.props.car_loan_status ) == 1) {
                this.dataSource.push({
                    backImage: require('../../../image/financeImages/chedidai_bg.png'),
                    imageSource: require('../../../image/financeImages/chedidai_icon.png'),
                    title: '车抵贷',
                    key: 'chedidai'
                })
            }
        } catch (e) {
            this.dataSource.push({
                backImage: require('../../../image/financeImages/backkurong.png'),
                imageSource: require('../../../image/financeImages/kurongIcon.png'),
                title: '库融融资',
                key: 'kurong'
            })
            this.dataSource.push({
                backImage: require('../../../image/financeImages/backcaigou.png'),
                imageSource: require('../../../image/financeImages/caigouIcon.png'),
                title: '采购融资',
                key: 'caigoudai'
            })
        }

    }

    initFinish = () => {


    }

    navigatorParams = {
        name: 'SingelCarScene',
        component: SingelCarScene,
        params: {
            customerName: this.props.customerName, backRefresh: () => {
                this.props.backRefresh();
            }
        }
    }

    onPress = (key) => {
        if (key === 'single') {
            this.navigatorParams.name = "SingelCarScene";
            this.navigatorParams.component = SingelCarScene;
            this.toNextPage(this.navigatorParams);
        }
        else if (key === 'kurong') {
            this.navigatorParams.name = "KurongSence";
            this.navigatorParams.component = KurongSence;
            this.toNextPage(this.navigatorParams);
        }
        else if (key == 'caigoudai') {

            this.navigatorParams.name = "CGDSelectPatternScene";
            this.navigatorParams.component = CGDSelectPatternScene;
            this.toNextPage(this.navigatorParams);

            // this.cgdMessage.setModelVisible(true)
        }
        else if (key == 'chedidai') {
            this.navigatorParams.name = "ChedidaiSence";
            this.navigatorParams.component = ChedidaiSence;
            this.toNextPage(this.navigatorParams);
        }

    }

    render() {


        let viewBlob = [];
        this.dataSource.map((item) => {
            viewBlob.push(
                <PageItem
                    key={item.key}
                    backImage={item.backImage}
                    imageSource={item.imageSource}
                    title={item.title}
                    onPress={() => {
                        this.onPress(item.key);
                    }}
                />
            )
        })

        return (

            <View style={{flex: 1}}>

                <ScrollView showsVerticalScrollIndicator={false}
                            style={{marginTop:Pixel.getTitlePixel(64) , backgroundColor: PAGECOLOR.COLORA3, paddingTop: adapeSize(15)} }>
                    {viewBlob}

                </ScrollView>
                <LendSuccessAlert title="提示" subtitle="采购融资功能正在维护中，请您移步BMS系统申请采购融资"
                                  ref={(message)=>{this.cgdMessage=message}} confimClick={()=>{}}/>

                <AllNavigationView title="借款" backIconClick={()=> {

                    this.backPage();
                }}/>

            </View>
        )
    }

}

const styles = StyleSheet.create({

    image: {

        width: adapeSize(43),
        height: adapeSize(43),
    },
    text: {
        marginTop: adapeSize(15),
        fontSize: fontadapeSize(15),
        color: 'white',
        backgroundColor: 'transparent'

    },
    titleImage: {

        justifyContent: 'center',
        alignItems: 'center',
    },

    warp: {

        paddingBottom: adapeSize(10),
    },

    insertWarp: {

        backgroundColor: 'white',
        padding: adapeSize(15),

    },
    backGroundImage: {

        justifyContent: 'center',
        borderRadius: adapeSize(5),
        width: width - adapeSize(30),

    }
})