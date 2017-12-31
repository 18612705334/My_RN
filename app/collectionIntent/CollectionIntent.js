
import React, {Component} from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    AppRegistry,
    TouchableOpacity,
    ScrollView,
    Image,

} from 'react-native';
import LabelSelect from './LabelSelect/LabelSelect';
import NavigationBar from "../component/NavigationBar";
import * as FontAndColor from "../constant/FontAndColor";
import PixelUtil from "../utils/PixelUtils";
var Pixel = new PixelUtil();

import BaseComponent from '../component/BaseComponent';
import CarBrandSelectScene  from '../carSource/CarBrandSelectScene';
import  {request}from '../utils/RequestUtil';
import * as AppUrls from "../constant/appUrls";
import ProvinceListScene from  '../carSource/ProvinceListScene';
let isHeadInteraction = false;
let auto_age = [];
let auto_mileage = [];
export default class CollectionIntent extends BaseComponent {

    initFinish = () => {
        this.loadCarConfigData();
    }

    loadData = () => {

        this.props.showModal(true);
        let yearArr = [];
        let mileArr = [];
        let provsArray = [];
        let citiesArray = [];


        if (this.brandSeriesArr.length == 0 && this.carYearArr.length == 0 && this.mileageArr.length == 0 && this.citiesArray.length ==0 &&  this.provsArray.length ==0 ) {
            this.props.showToast("请选择收车意向");
        }else if (this.carYearArr.length > 5) {
            this.props.showToast('车龄区间最多只能选五个');
        }else if (this.mileageArr.length > 5) {
            this.props.showToast('里程区间最多只能选五个');
        } else {
            if(this.carYearArr.length>0){

                yearArr.push(...this.carYearArr);

            }
            if(this.mileageArr.length>0){


                mileArr.push(...this.mileageArr);

            }
            if(this.provsArray.length>0)
            {
                for (let item of this.provsArray)
                {
                    provsArray.push(item.value);
                }
            }
            if(this.citiesArray.length>0)
            {
                for (let item of this.citiesArray)
                {
                    citiesArray.push(item.value);
                }
            }

            let url = AppUrls.BASEURL + 'v1/receiveIntention/save';
            request(url, 'post', {

                brand_series: this.brandSeriesArr.toString(),
                cotys: yearArr.toString(),
                mileages: mileArr.toString(),
                cities:citiesArray.toString(),
                provs:provsArray.toString(),


            }).then((response) => {

                if (response.mjson.code == '1') {
                    this.props.showModal(false);
                    this.props.showToast("提交成功");
                    this.backPage();
                }

            }, (error) => {
                this.props.showModal(false);
                this.props.showToast(error.msg);
            });

        }
    }

    // 获取筛选数据
    loadCarConfigData=()=>{
        request(AppUrls.CAR_CONFIG,'post',{}).then((response) => {
            auto_age=[];
            auto_mileage = [];
            if(response.mjson.code=='1'){

                if(response.mjson.data == null){
                    return ;
                }else{
                    for(let i=0;i<response.mjson.data.auto_age.length;i++   ){
                        let value  = response.mjson.data.auto_age[i];
                        auto_age.push({
                            id:i,
                            title: value.name,
                            isSelected: false,
                            value: value.value
                        });
                    }
                    for(let i=0;i<response.mjson.data.auto_mileage.length;i++){
                        let value  = response.mjson.data.auto_mileage[i];
                        auto_mileage.push({
                            id:i,
                            title: value.name,
                            isSelected: false,
                            value: value.value
                        });
                    }
                    this.setState({arr1:auto_age,arr2:auto_mileage});
                    this.readData();
                    console.log(this.state.arr1);
                    console.log(this.state.arr2);
                }
            }
        }, (error) => {
            this.props.showToast(error.msg);
        });
    }

    readData = () => {
        let url = AppUrls.BASEURL + 'v1/receiveIntention/index';
        request(url, 'post', {}).then((response) => {

            if (response.mjson.data == null) {
                this.setState({renderPlaceholderOnly: 'null'});
            } else {
                if (response.mjson.code == '1') {
                    this.setState({renderPlaceholderOnly: 'success'});
                    if(response.mjson.data != null){

                        this.getSelectedItems(this.state.arr, response.mjson.data.brand_series, this.brandSeriesArr);
                        this.getSelectedItems(this.state.arr1, response.mjson.data.coty, this.carYearArr);
                        this.getSelectedItems(this.state.arr2, response.mjson.data.mileage, this.mileageArr);

                        this.getCityItems(response.mjson.data.city,response.mjson.data.province);
                    }
                } else {
                    this.props.showToast(response.mjson.msg);
                }
            }

        }, (error) => {
            this.setState({renderPlaceholderOnly: 'error'});

        });

    }

    getSelectedItems=(arrs, items, params)=> {
        if (items.length > 0)
        {
            for (let item of items) {
                if (arrs == this.state.arr)
                {// 车系
                    params.push(item.value);
                    this.state.arr.push({
                        title: item.name,
                        isSelected: true,
                    });

                } else {
                    params.push(item.id + '|' + item.value);
                    arrs[item.id].isSelected = true;
                }
            }

            if (arrs == this.state.arr) {

                this.setState({arr:this.state.arr});

            } else if (arrs == this.state.arr1)
            {
                this.setState({arr1:this.state.arr1});
                // console.log(this.carYearArr);

            } else {
                this.setState({arr2:this.state.arr2});
                console.log(this.mileageArr);

            }

        }
    }

    getCityItems =(citiesArray,provsArray)=>{

        for (let object of citiesArray){
            this.state.cityArray.push({
                title: object.name,
                isSelected: true,
                provsID:object.prov_id,
                cityID:object.id,
            })
            this.citiesArray.push({title:object.name,value:object.id,});

        }
        for (let object of provsArray){
            this.state.cityArray.push({
                title: object.name,
                isSelected: true,
                provsID:object.id,
                cityID:0,
            })
            this.provsArray.push({title:object.name,value:object.id});

        }


        this.setState({
            cityArray:this.state.cityArray,
        });
    }

    constructor(props) {
        super(props);
        this.carYearArr = [];
        this.mileageArr = [];
        this.brandSeriesArr = [];
        this.citiesArray = [];
        this.provsArray = [];
        this.isAdd = false;
        isHeadInteraction = this.props.isHeadInteraction;

        this.state = {
            renderPlaceholderOnly: 'blank',
            arr: [],
            arr1: [],
            arr2: [],
            cityArray:[],

        };
        this.selectConfirm = this.selectConfirm.bind(this);
        this.deleteItem = this.deleteItem.bind(this);

    }

    /**
     * 选择车型
     */
    checkedCarClick = (carObject) => {
// {brand_id: 2, series_id: 2446, series_name: "拉共达Taraf", model_id: 29702, model_name: "2015款 拉共达Taraf 6.0L 标准型"}

        for (let i = 0; i < this.brandSeriesArr.length; i++) {
            if ((this.brandSeriesArr[i].split('|', 1)) == (carObject.brand_id)) {
                if ((this.brandSeriesArr[i].split('|', 2)[1]) == '0' || carObject.series_id === '0') {

                    this.props.showToast('一个品牌只能选一次');
                    return;
                } else if ((this.brandSeriesArr[i].split('|', 2)[1])==(carObject.series_id)) {
                    this.props.showToast('一个品牌的相同车型只能选一次');
                    return;
                }
            }
        }
        if (carObject.series_id == '' || carObject.series_id == '0') {
            this.brandSeriesArr.push(carObject.brand_id + '|' + 0);
            this.state.arr.push({
                title: carObject.brand_name,
                isSelected: true,
            });
        } else {
            this.brandSeriesArr.push(carObject.brand_id + '|' + carObject.series_id);
            this.state.arr.push({
                title: carObject.series_name,
                isSelected: true,
            });
        }
        // this.selectConfirm(this.state.arr);
        this.setState({arr: this.state.arr});
        this.isAdd = false;
    }

    /**
     * 选择地区
     * @param cityType
     */
    checkedCityClick=(cityType)=>{

        let isCityTitle = true;

        console.log('**'+cityType.city_name+':'+cityType.city_id + '|'+cityType.provice_id);
        for (let item of this.state.cityArray)
        {
            console.log(item.title);
            if(item.title == cityType.city_name)
            {
                isCityTitle = false;
                this.props.showToast('已存在该地区');
                break;

            }else if(item.provsID == cityType.provice_id){


                if(cityType.city_id !=0 && item.cityID ==0){
                    isCityTitle = false;
                    this.props.showToast('已存在该地区');
                    break;

                }else if(cityType.city_id ==0){
                    isCityTitle = false;
                    this.props.showToast('已存在该地区');
                    break;
                }

            }
        }

        if(isCityTitle)
        {
            this.state.cityArray.push({
                title: cityType.city_name,
                isSelected: true,
                provsID:cityType.provice_id,
                cityID:cityType.city_id,
            })
            this.setState({
                cityArray:this.state.cityArray,
            });
            if(cityType.city_id!==0){
                this.citiesArray.push({title:cityType.city_name,value:cityType.city_id});
            }else {
                this.provsArray.push({title:cityType.city_name,value:cityType.provice_id});
            }
        }


    }

    navigatorParams = {
        title: "CarBrandSelectScene",
        component: CarBrandSelectScene,
        params: {
            checkedCarClick: this.checkedCarClick,
            status: 0,
            isHeadInteraction: true,
            isCheckedCarModel: true,
        }

    }

    selectConfirm(list) {
        let {arr} = this.state;
        for (let item of list) {
            let index = arr.findIndex(ele => ele === item);
            if (~index) arr[index].isSelected = true;
            else continue;
        }
        this.setState({arr: arr});
    }

    deleteItem(item) {
        let {arr} = this.state;
        let index = arr.findIndex(a => a === item);
        arr[index].isSelected = false;
        this.setState({arr: arr});
        this.brandSeriesArr.splice(index, 1);
        this.state.arr.splice(index, 1);
    }


    deleteCityItem(item) {

        let {cityArray} = this.state;
        let index = cityArray.findIndex(a => a === item);
        cityArray[index].isSelected = false;

        for (let i=0;i<this.citiesArray.length;i++)
        {
            if(this.citiesArray[i].title == item.title)
            {
                this.citiesArray.splice(i,1);
                break;
            }
        }

        for (let i=0;i<this.provsArray.length;i++)
        {
            if(this.provsArray[i].title == item.title)
            {
                this.provsArray.splice(i,1);
                break;
            }
        }

        this.state.cityArray.splice(index, 1);
        this.setState({cityArray: cityArray});

    }

    countItem(item, array) {//获取车龄区间或里程区间选中的个数

        console.log('item:',item);

        if (array === this.state.arr1) {

            if (item.isSelected) {
                for (let i=0;i<this.carYearArr.length;i++)
                {
                    let object = this.carYearArr[i];
                    console.log('object:',object);
                    if(object == item.id + '|' + item.value)
                    {
                        this.carYearArr.splice(i,1);
                        break;
                    }
                }

            } else {
                this.carYearArr.push(item.id + '|' + item.value);
            }

            for( let i=0;i<this.state.arr1.length;i++ )
            {
                if(this.state.arr1[i].value == item.value)
                {
                    this.state.arr1[i].isSelected =!this.state.arr1[i].isSelected;
                    break;
                }
            }


        } else if (array === this.state.arr2) {

            if (item.isSelected) {
                for (let i=0;i<this.mileageArr.length;i++)
                {
                    let object = this.mileageArr[i];
                    if(object == item.id + '|' + item.value)
                    {
                        this.mileageArr.splice(i,1);
                        break;
                    }
                }

            } else {
                this.mileageArr.push(item.id + '|' + item.value);
            }

            for( let i=0;i<this.state.arr2.length;i++ )
            {
                if(this.state.arr2[i].value == item.value)
                {
                    this.state.arr2[i].isSelected =!this.state.arr2[i].isSelected;
                    break;
                }
            }

        }
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={styles.container}>
                    <NavigationBar
                        centerText={'订阅车源'}
                        rightText={''}
                        leftImageCallBack={this.backPage}

                    />
                    {this.loadView()}
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <NavigationBar
                        centerText={'订阅车源'}
                        rightText={''}
                        leftImageCallBack={this.backPage}

                    />
                    <ScrollView style={ styles.container1}>
                        <View style={styles.containerChild}>
                            <View style={{flexDirection: 'row', marginTop: Pixel.getPixel(10)}}>
                                <Text allowFontScaling={false}  style={styles.carSelect}>
                                    品牌、车系
                                </Text>
                                <Text allowFontScaling={false}  style={{fontSize: 15, marginRight: 10, color: FontAndColor.COLORA2}}
                                      onPress={() => {
                                          if (this.brandSeriesArr.length >= 5) {
                                              this.props.showToast("车系最多只能选5个");
                                          } else {

                                              this.toNextPage(this.navigatorParams);
                                          }
                                      }}>
                                    请选择>
                                </Text>
                            </View>
                            <View style={styles.checkedContentView}>
                                {
                                    this.state.arr.map((item,index)=>{
                                        return(
                                            <TouchableOpacity
                                                onPress={()=>{this.deleteItem(item)} } key={'car'+index}>
                                                <View style={styles.checkedContentItem}>
                                                    <Text allowFontScaling={false}  style={styles.checkedItemText}>{item.title}</Text>
                                                    <Image style={styles.checkedDeleteImg}
                                                           source={require('../../image/deleteIcon2x.png')}/>
                                                </View>
                                            </TouchableOpacity>)
                                    })
                                }
                            </View>
                        </View>
                        <View style={styles.containerChild}>
                            <View style={{flexDirection: 'row', marginTop: Pixel.getPixel(10)}}>
                                <Text allowFontScaling={false}  style={styles.carSelect}>
                                    地区
                                </Text>
                                <Text allowFontScaling={false}  style={{fontSize: 15, marginRight: 10, color: FontAndColor.COLORA2}}
                                      onPress={() => {
                                          if (this.state.cityArray.length >= 5) {
                                              this.props.showToast("地区最多只能选5个");
                                          } else {
                                              let navigatorParams = {
                                                  name: "ProvinceListScene",
                                                  component: ProvinceListScene,
                                                  params: {
                                                      checkedCityClick:this.checkedCityClick,
                                                      isSelectProvince:true
                                                  }
                                              }
                                              this.toNextPage(navigatorParams);
                                          }
                                      }}>
                                    请选择>
                                </Text>
                            </View>
                            <View style={styles.checkedContentView}>
                                {
                                    this.state.cityArray.map((item,index)=>{
                                        return(
                                            <TouchableOpacity
                                                onPress={()=>{this.deleteCityItem(item)} } key={'city'+index}>
                                                <View style={styles.checkedContentItem}>
                                                    <Text allowFontScaling={false}  style={styles.checkedItemText}>{item.title}</Text>
                                                    <Image style={styles.checkedDeleteImg}
                                                           source={require('../../image/deleteIcon2x.png')}/>
                                                </View>
                                            </TouchableOpacity>)
                                    })
                                }
                            </View>
                        </View>
                        <View style={styles.containerChild}>
                            <Text allowFontScaling={false}  style={styles.carType}>车龄区间（单位：年）</Text>
                            <View
                                style={styles.labelSelect}
                            >
                                {this.state.arr1.map((item, index) =>{
                                        return (<LabelSelect.Label
                                            key={'CarAge-' + index}
                                            data={item}
                                            enables={item.isSelected}
                                            readOnly={true}
                                            isBigSize={true}
                                            onCancel={() => {
                                                this.countItem(item, this.state.arr1);
                                            }}
                                        >{item.title}
                                        </LabelSelect.Label>)
                                    }
                                )}
                            </View>
                        </View>
                        <View style={styles.containerChild}>
                            <Text allowFontScaling={false}  style={styles.carType}>里程区间（单位：万公里）</Text>
                            <View
                                style={styles.labelSelect}
                            >
                                {this.state.arr2.map((item, index) =>{
                                        return(
                                            <LabelSelect.Label
                                                key={'label-' + index}
                                                readOnly={true}
                                                isBigSize={true}
                                                data={item}
                                                enables={item.isSelected}
                                                onCancel={() => {
                                                    this.countItem(item, this.state.arr2);
                                                }}
                                            >{item.title}
                                            </LabelSelect.Label>
                                        )
                                    }
                                )}
                            </View>
                        </View>
                        <Text allowFontScaling={false}  style={styles.bottomText}>根据您提报的订阅条件，我们会推荐相关车源，请关注首页已订阅车源。</Text>
                        <TouchableOpacity style={styles.btnStyle}
                                          onPress={() => this.loadData('')}>
                            <Text allowFontScaling={false}  style={{
                                color: FontAndColor.THEME_BACKGROUND_COLOR,
                                fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT),
                                textAlign: 'center',
                            }}>提交</Text>
                        </TouchableOpacity>
                    </ScrollView>

                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     padding: 10,
    //     alignItems: 'flex-start',
    //     backgroundColor: '#e3eeee'
    // },
    labelSelect: {
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical:Pixel.getPixel(10),
    },
    text: {
        fontSize: Pixel.getPixel(16),
        color: 'rgb(13, 131, 144)'
    },
    container: {
        flex: 1,
        backgroundColor: FontAndColor.THEME_BACKGROUND_COLOR
    },
    container1: {
        flex: 1,
        backgroundColor: FontAndColor.THEME_BACKGROUND_COLOR,
        paddingTop: Pixel.getPixel(10),
    },
    carSelect: {
        flex: 1,
        fontSize: Pixel.getPixel(17)
    },
    carType: {
        fontSize: Pixel.getPixel(17),
        marginTop: Pixel.getPixel(10)
    },
    bottomText: {
        marginHorizontal: Pixel.getPixel(10),
    },
    containerChild: {
        backgroundColor: '#ffffff',
        paddingLeft: Pixel.getPixel(12),
        marginBottom: Pixel.getPixel(10),
        flexWrap: 'wrap',
    },
    btnStyle: {
        height: Pixel.getPixel(40),
        backgroundColor: FontAndColor.NAVI_BAR_COLOR,
        marginTop: Pixel.getPixel(40),
        borderRadius: 3,
        marginHorizontal: Pixel.getPixel(15),
        justifyContent: 'center',
        marginBottom:Pixel.getPixel(10)

    },
    checkedContentView:{
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical:Pixel.getPixel(10),
    },
    checkedContentItem: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: Pixel.getPixel(25),
        paddingHorizontal: Pixel.getPixel(5),
        marginRight: Pixel.getPixel(10),
        marginBottom: Pixel.getPixel(5),
        borderRadius: 4,
        borderColor:FontAndColor.NAVI_BAR_COLOR,
        borderWidth:Pixel.getPixel(1),
    },
    checkedDeleteImg: {
        width: Pixel.getPixel(10),
        height: Pixel.getPixel(10),
        marginLeft: Pixel.getPixel(5),
    },
    checkedItemText: {
        color: FontAndColor.NAVI_BAR_COLOR,
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),

    },
});


