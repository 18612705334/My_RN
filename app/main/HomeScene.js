import React, {Component, PropTypes} from 'react'
import {

    View,
    Text,
    ListView,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    InteractionManager,
    RefreshControl,
    BackAndroid,
    NativeModules
} from 'react-native'

import * as fontAndClolr from '../constant/FontAndColor';
import PixelUtil from '../utils/PixelUtils'
import BaseComponent from "../component/BaseComponent";

let Pixel = new PixelUtil();
let page = 1;
let status = 1;

import ViewPagers from './component/ViewPager'

const {width, height} = Dimensions.get('window');
import BaseComponet from '../component/BaseComponent';
import * as Urls from '../constant/appUrls';
import {request} from '../utils/RequestUtil';
import CarInfoScene from '../carSource/CarInfoScene';
import StorageUtil from '../utils/StorageUtil';
import * as storageKeyNames from '../constant/storageKeyNames';
import WebScene from './WebScene';
import CarMySourceScene from '../carSource/CarMySourceScene';
import HomeJobItem from './component/HomeJobItem';
import HomeRowButton from './component/HomeRowButton';
import HomeAdvertisementButton from './component/HomeAdvertisementButton';
import MessageListScene from "../message/MessageListScene";

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let allList = [];


export default class HomeScene extends BaseComponent {

    constructor(props) {
        super(props)
        this.carData = [];
        this.state = {
            source: [],
            renderPlaceHolderOnly: 'blank',
            isRefreshing: false,
            headSource: [],
            pageData: []

        }

    }

    initFinish = () => {
        this.loadData();
    }

    loadData = () => {
        StorageUtil.mGetItem(storageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code === 1 && data.result !== '') {
                let enters = JSON.parse(data.result);
                this.getData(enters.prov_id);
            } else {
                this.getData(0)
            }
        })


    }

    getData = (prov_id) => {

        let maps = {
            page: page,
            row: 6,
            prov_id: prov_id
        }

        request(Urls.HOME, 'POST', maps).then((response) => {

            if (response.mycode === 1 && response.mjson.data !== null) {
                allList.push(...response.mjson.data.carList.list)
                this.state.headSource.push(...response.mjson.data.banners)
                StorageUtil.mGetItem(storageKeyNames.USER_INFO, (data) => {
                    if (data.code === 1) {
                        this.getCarData(response.mjson.data);
                    }

                })

                status = response.mjson.data.carList.pageCount;


            } else {
                this.setState({renderPlaceholderOnly: 'error', isRefreshing: false});
            }

        }, (error) => {
            this.setState({renderPlaceholderOnly: 'error', isRefreshing: false});
        })

    }


    getCarData(allData) {
        let maps = {
            brand_id: 0,
            series_id: 0,
            model_id: 0,
            provice_id: 0,
            city_id: 0,
            order_type: 0,
            coty: 0,
            mileage: 0,
            dealer_price: 0,
            emission_standards: 0,
            nature_use: 0,
            car_color: 0,
            model_name: '',
            prov_id: 0,
            v_type: 0,
            rows: 5,
            page: 1,
            start: 0,
            type: 2,
            status: 1,
            no_cache: 1,
        };


        request(Urls.CAR_INDEX, 'POST', maps).then((response) => {

            if (response.mycode === 1 && response.mjson.data !== null) {

                this.carData = response.mjson.data.list;
                if (allList.length <= 0) {
                    this.setState({
                        renderPlaceHolderOnly: 'success',
                        allData: allData,
                        source: ds.cloneWithRows(['1']),
                        isRefreshing: false,
                    })
                } else {
                    this.setState({
                        renderPlaceHolderOnly: 'success',
                        allData: allData,
                        source: ds.cloneWithRows(allList),
                        isRefreshing: false
                    })
                }


            }

        }, (error) => {
            this.setState({renderPlaceHolderOnly: 'error', isRefreshing: false})

        })


    }


    render() {

        if (this.state.renderPlaceHolderOnly !== 'success') {
            return (
                <View>
                    {
                        this.loadView()
                    }
                </View>
            )
        }

        return (
            <View style={{flex: 1, backgroundColor: fontAndClolr.THEME_BACKGROUND_COLOR}}>

                <ListView
                    enableEmptySections={true}
                    renderRow={this._renderRow}
                    renderHeader={this._renderHeader}
                    renderSeparator={this._renderSeparator}
                    renderFooter={this._renderFooter}
                    initialListSize={6}
                    stickyHeaderIndices={[]}
                    onEndReachedThreshold={1}
                    scrollRenderAheadDistance={1}
                    pageSize={6}
                    contentContainerStyle={styles.listStyle}
                    removeClippedSubviews={false}
                    dataSource={this.state.source}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.refreshingData}
                            tintColor={[fontAndClolr.NAVI_BAR_COLOR]}
                            colors={[fontAndClolr.NAVI_BAR_COLOR]}
                        />
                    }

                    onEndReached={this.toEnd}

                />

            </View>
        )
    }


    _renderRow = (data, sectionID, rowID) => {

        let DIDIAN;
        if (data === '1') {
            return <View/>
        }

        if (data.city_name.length) {
            DIDIAN = '[' + data.city_name + ']'
        } else {
            DIDIAN = ''
        }

        return (
            <TouchableOpacity
                onPress={()=>{
                    this.props.callBack({component:CarInfoScene, name:'CarInfoScene', params:{carID:data.id}})
                }}
                activeOpacity={.6}
                style={styles.cell_touchable_container}
            >
                <View
                    style={styles.cell_container}
                >
                    <Image style={styles.cell_image}
                           source={data.img ? {uri: data.img + '?x-oss-process=image/resize,w_' + 320 + ',h_' + 240} : require('../../image/carSourceImages/car_null_img.png')}/>
                    <Text allFontScalling={false} style={styles.cell_title} numberOfLines = {2}>{DIDIAN + data.model_name}</Text>
                    <Text allFontScalling={false}
                          style={styles.cell_subTitle}>{this.dateReversal(data.create_time + '000') + '/' + data.mileage + '万公里'}</Text>
                </View>
            </TouchableOpacity>
        )


    }

    _renderSeparator = (sectionID, rowID) => {
        return (
            <View style={styles.list_separator} key={sectionID + '' + rowID}/>
        )
    }

    _renderHeader = () => {
        return (

            <View>


                <View style={{flexDirection: 'row'}}>
                    <ViewPagers
                        onChangePage={() => {}}
                        items={this.state.headSource}
                        callBack={(url) => {
                            this.props.callBack({name: 'WebScene', component: WebScene, params: {webUrl: url}})
                        }}
                        toNext={() => {
                            this.props.jumpScene('financePage', '');
                        }}
                    />

                    <View style={{flexDirection: 'row', position: 'absolute', height: 28, width: width, marginTop: 26}}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.jumpScene('carpage', 'true')
                            }}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 14,
                                flex: 1,
                                marginHorizontal: 25
                            }}

                        >
                            <Image source={require('../../image/findIcon.png')} style={{width: 17, height: 17}}/>
                            <Text allowFontScaling={false} style={{
                                color: fontAndClolr.COLORA1,
                                fontSize: Pixel.getPixel(fontAndClolr.CONTENTFONT24)
                            }}>搜索您要找的车</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.callBack({
                                    component: MessageListScene,
                                    name: 'MessageListScene',
                                    params: {}
                                });
                            }}
                            style={{marginRight: 15}}
                        >
                            <Image style={{flex: 1, resizeMode: 'stretch'}}
                                   source={require('../../image/workbench/ysjxx.png')}/>
                        </TouchableOpacity>

                    </View>

                </View>

                <HomeJobItem
                    jumpScene={(ref,com)=>{this.props.jumpScene(ref,com)}}
                    callBack={(params)=>{this.props.callBack(params)}}
                />
                <HomeRowButton
                    onPress = {(id)=>{
                        this.props.callBack({component:CarInfoScene, name:'CarInfoScene', params:{carID:id}})

                    }}
                    list = {this.carData}
                />
                <HomeAdvertisementButton
                    click={()=> {
                        this.props.jumpScene('carpage', storageKeyNames.NEED_CHECK_NEW_CAR);
                    }}
                />
                <View style={{flexDirection:'row', backgroundColor:'white', paddingHorizontal:15, paddingVertical:15}}>
                    <Text
                        allowFontScaling = {false}
                        style = {{fontWeight:'bold', color:'black', fontSize:14, flex:1}}
                    >已订阅车辆</Text>
                    <TouchableOpacity
                        onPress = {()=>{

                        }}
                        style ={{flexDirection:'row', alignItems:'center'}}
                    >
                        <Text
                            allowFontScaling = {false}
                            style = {{color:fontAndClolr.COLORA4, fontSize:13}}
                        >更多</Text>
                        <Image source = {require('../../image/mainImage/more.png')}
                            stlyle ={{width: Pixel.getPixel(5),
                                height: Pixel.getPixel(10),
                                marginLeft: Pixel.getPixel(2),}}

                        />
                    </TouchableOpacity>
                </View>

            </View>

        )

    }

    _renderFooter = () => {

        return (

            <TouchableOpacity
                onPress = {()=>{
                    this.props.jumpScene('carpage','checkRecommend');
                }}
                style = {{alignItems:'center', width:width}}>
                <Text
                    style = {{ marginTop:15, marginBottom:30}}

                >查看更多车源>></Text>
            </TouchableOpacity>

        )
    }

    refreshingData = () => {
        this.setState({
            isRefreshing:true
        })
        page = 1
        allList = []
        this.loadData();
    }

    toEnd = () => {
        if(page < status){
            page ++;
            this.loadData();
        }
    }

    dateReversal = (time) => {
        const date = new Date();
        date.setTime(time)
        return (date.getFullYear() + '年' + (date.getMonth() + 1) + '月')
    }

}


const styles = StyleSheet.create({

    cell_container: {
        width:166,
    },
    cell_touchable_container: {

        width:width/2,
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center'

    },
    cell_image: {
        width: 166,
        height: 111,
        marginVertical:10,
    },
    cell_title: {
        marginBottom:10,
        textAlign:'left',
    },
    cell_subTitle: {
        color:fontAndClolr.COLORA4,
        flex:1,

    },
    list_separator: {
        height: 2,
        backgroundColor: 'white'
    },

    listStyle:{
        flexWrap:'wrap',
        flexDirection:'row',

    }
})