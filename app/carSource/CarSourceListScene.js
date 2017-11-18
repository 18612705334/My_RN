import React, {Component} from 'react';

import {
    StyleSheet,
    ListView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    RefreshControl,
    Dimensions,
    Modal,
    NativeModules,
    BackAndroid,
    InteractionManager

} from 'react-native';

import * as fontAndColor    from '../constant/FontAndColor';
import BaseComponent        from '../component/BaseComponent';
import {CarSourceSelectHeadView, CarSourceSelectView}         from './znComponent/CarSourceSelectHeadView';
import ListFooter           from './znComponent/LoadMoreFooter';
import CarCell              from './znComponent/CarCell';
import CarInfoScene         from './CarInfoScene';
import CarBrandSelectScene  from './CarBrandSelectScene';
import CarScreeningScene    from  './CarScreeningScene';
import CityListScene        from './CityListScene';
import {SequencingButton, SequencingView} from './znComponent/CarSequencingView';
import CarSeekScene from './CarSeekScene';
import * as AppUrls         from "../constant/appUrls";
import  {request}           from '../utils/RequestUtil';
import PixelUtil            from '../utils/PixelUtils';
import * as storageKeyNames from '../constant/storageKeyNames';
import StorageUtil from '../utils/StorageUtil';
import * as CarDeployData from './carData/CarDeployData';


let Pixel = new PixelUtil();
let {width, height}  =  Dimensions.get('window');


let carFilterData = require('./carData/carFilterData.json');
let carAgeSource = [];
let carKMSource = [];
let carTypeSource = [];
let carNatureSource = [];
let carColorSource = [];
let carDischargeSource = [];
let carPriceSource = [];
let sequencingDataSource = carFilterData.sequencingDataSource;
let currentCheckedIndex = 1;
let checkedSource = [];
let carData = [];
let isCheckRecommend = true;


const APIParameter = {

    brand_id: 0,
    series_id: 0,
    model_id: 0,
    provice_id: 0,
    city_id: 0,
    order_type: 0,
    coty: 0,
    mileage: 0,
    dealer_price:0,
    emission_standards:0,
    nature_use:0,
    car_color:0,
    model_name:'',
    prov_id:0,
    v_type:0,
    rows: 10,
    page: 1,
    start: 0,
    type: 1,
    status: 1,
    no_cache:1,

};

export default  class CarSourceScene extends BaseComponent{

    constructor(props){
        super(props)

        const carSource = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2})

        this.state = {
            isRefreshing:false,
            dataSource:carSource,
            isFillData:1,
            isHide : true,

            sequencingType: {
                title: '',
                value: '',
            },
            checkedCarType: {
                title: '',
                brand_id: '',
                series_id: '',
            },
            checkedCarAgeType: {
                title: '',
                value: '',
            },
            checkedCarKMType: {
                title: '',
                value: '',
            },
            checkedCarGenre:{
                title: '',
                value: '',
            },
            checkedCity:{
                title: '',
                province_id:'',
                city_id:''
            },
            checkedCarPrice:{
                title: '',
                value: '',
            },
            checkedCarDischarge:{
                title: '',
                value: '',
            },
            checkedCarColor:{
                title: '',
                value: '',
            },
            checkedCarNature:{
                title: '',
                value: '',
            },

            renderPlaceholderOnly: 'blank',

        }
    }




    componentWillReceiveProps(){

        StorageUtil.mGetItem(storageKeyNames.NEED_OPENBRAND, (data)=>{
            if (data.code === 1){
                if (data.result === 'true'){
                    this.toSearch();
                }
            }
        })



        StorageUtil.mSetItem(storageKeyNames.NEED_OPENBRAND, 'false');

    }

    initFinish=()=>{
        StorageUtil.mGetItem(storageKeyNames.NEED_OPENBRAND,(data)=>{
            if(data.code===1){
                if(data.result==='true'){
                    this.toSearch();
                }

            }
        });
        StorageUtil.mSetItem(storageKeyNames.NEED_OPENBRAND, 'false')



        StorageUtil.mGetItem(storageKeyNames.LOAN_SUBJECT, (data)=>{
            if(data.code === 1&& data.result !== null){
                let enters = JSON.parse(data.result)
                this.prov_id = enters.prov_id;
                APIParameter.prov_id = this.prov_id,
                this.loadData(1)
            }else{
                this.loadData(1)
            }

        })
    }


    loadData = (page)=>{

        APIParameter.page = page;
        request(AppUrls.CAR_INDEX, 'post', APIParameter).then((response)=>{
            if(response.mycode === 1){

                carData.push(...response.mjson.data.list);
                if (typeof(response.mjson.data.start) === "undefined") {
                    APIParameter.start = 0;

                } else {
                    APIParameter.start = response.mjson.data.start;
                }
                APIParameter.status = response.mjson.data.status;
                if (this.state.isFillData !== APIParameter.status) {
                    this.setState({
                        isFillData: APIParameter.status,
                        dataSource: this.state.dataSource.cloneWithRows(carData),
                        isRefreshing: false,
                        renderPlaceholderOnly: 'success',
                    });
                } else {
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(carData),
                        isRefreshing: false,
                        renderPlaceholderOnly: 'success',
                    });
                }
               this.props.showModal(false);

            }

        }, (error)=>{
           this.props.showModal(false);
            this.setState({
                isRefreshing: false,
                renderPlaceholderOnly: 'error'
            });

        })
    }


    render(){
        return(
            <View style = {{flex:1, backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR}}>
                <CarListNavigatorView
                    search = {this.toSearch}
                    screening = {this.screening}
                />
                <CarSourceSelectHeadView
                    onPress = {(title, is_selected)=>{
                        console.log(title + is_selected);
                    }}
                />


                <ListView
                    contentContainerStyle = {{marginTop:3}}
                    removeClippedSubviews = {false}
                    dataSource = {this.state.dataSource}
                    initialListSize = {10}
                    onEndReachedThreshold={1}
                    stickyHeaderIndices={[]}
                    pageSize = {10}
                    scrollRenderAheadDistance = {10}
                    enableEmptySections={true}
                    renderRow = {(item, sectionID, rowID)=>{
                        return(
                            <CarCell
                                carCellData = {item}
                                onPress = {this.carCellOnPres.bind([item, sectionID, rowID])} />
                            )
                    }}
                    renderFooter={this.renderListFooter}
                    onEndReached={this.toEnd}
                    refreshControl = {
                        <RefreshControl
                            refreshing = {this.state.isRefreshing}
                            onRefresh = {this.refreshingData}
                            tintColor={[fontAndColor.NAVI_BAR_COLOR]}
                            colors={[fontAndColor.NAVI_BAR_COLOR]}
                        />
                    }

                    renderSeparator = {this.renderSeparator}
                />

                <SequencingButton
                    onPress = {this.sequencing}
                />

            </View>
        )
    }

    carCellOnPres(item, sectionID, rowID){



    }

    refreshingData = ()=>{
        carData = []
        this.setState({isRefreshing: true});
        this.loadData(1)

    }


    renderSeparator = ()=>{
        return(
            <View style = {{height:1}}/>
        )
    }
    renderListFooter = ()=>{
        return(
            <View style = {{marginVertical:15, alignItems:'center'}}>
                <Text>正在加载更多车源...</Text>
            </View>
        )

    }

    toEnd = ()=>{
        let page = APIParameter.page;
        console.log(page)
        this.loadData(page++);
    }

    toSearch = ()=>{
        this.props.callBack({
            component: CarSeekScene,
            name:'CarSeekScene',
            params:{
                checkedCarClick:this.checkedCarClick
            }

        })
    }

    screening = ()=>{

    }

    sequencing = () =>{


    }

    checkedCarClick = (carObject)=>{

        console.log(carObject)

        APIParameter.brand_id = carObject.brand_id;
        APIParameter.series_id = carObject.series_id;
        if(carObject.brand_id === 0 && carObject.series_id === 0){
            APIParameter.brand_name = carObject.brand_name
        }else {
            APIParameter.brand_name = ''
        }
        this.setState({
            checkedCarType: {
                title: carObject.series_id == 0 ? carObject.brand_name : carObject.series_name,
                brand_id: carObject.brand_id,
                series_id: carObject.series_id,
            },
        });

        this.setHeadViewType();
    }

    setHeadViewType = ()=>{



    }

    filterData = ()=>{
        carData = [];
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(carData)
        })
        this.props.showModal(true)
        this.loadData()
    }




}


class CarListNavigatorView extends Component{
    render(){
        return(
            <View style = {styles.navi_bar_container}>
                <TouchableOpacity
                    onPress = {this.props.search}
                    style = {styles.search_bar}
                >
                    <Image source = {require('../../image/carSourceImages/sousuoicon.png')} style = {{}} />
                    <Text allowFontScaling = {false} style = {{marginHorizontal:15, color:'lightgray'}}>请输入车型关键词</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress = {this.props.screening}
                >
                    <Text
                        allowFontScaling = {false}
                        style = {{marginHorizontal:15, marginRight:30,fontSize:17, color:'white'}}
                    >筛选</Text>
                </TouchableOpacity>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    navi_bar_container:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:fontAndColor.NAVI_BAR_COLOR,
        height:64,
        paddingTop:15,

    },
    search_bar:{
        backgroundColor:'white',
        flexDirection:'row',
        flex:1,
        borderRadius:5,
        marginLeft:30,
        marginRight:15,
        height:25,
        alignItems:'center',
        justifyContent:'center'
    }


})