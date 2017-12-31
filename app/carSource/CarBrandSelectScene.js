import React, {Component} from 'react';
import {

    StyleSheet,
    View,
    Text,
    ListView,
    TouchableOpacity,
    Image,
    Dimensions,
    Animated,
    InteractionManager,
    BackAndroid

} from 'react-native';

import BaseComponent from '../component/BaseComponent';
import MyBaseNaviComponent from '../component/MyBaseNaviComponent';
import MyBaseComponent from '../component/MyBaseComponent';
import *as fontAnColor from '../constant/FontAndColor';
import NavigationView from '../component/AllNavigationView';
import StorageUtil      from '../utils/StorageUtil';
import * as StorageKeyName   from '../constant/storageKeyNames';
import PixelUtil from '../utils/PixelUtils';
let Pixel = new PixelUtil();

import {request} from "../utils/RequestUtil";
import * as AppUrls from "../constant/appUrls";


let status = 0;
let carData = new Array;
let carBrandArray1 = [];       // status=1
let carBrandArray2 = [];       // status=2
let isHeadInteraction = false;  // 是否能选择车类
let isCheckedCarModel = false;  // 是否能选择车型   false-能选,true-不能选

let carObject = {

    brand_id: '0',
    brand_icon: '',
    brand_name: '0',
    series_id: '0',
    series_name: '0',
    model_id: '0',
    model_name: '0',
    discharge_standard: '',
    model_year: '',
    liter: '',
    config_value: ''

};

export default class CarBrandSelectScene extends MyBaseNaviComponent {

    constructor(props){
        super(props)

        status = this.props.status;
        isHeadInteraction = this.props.isHeadInteraction;
        isCheckedCarModel = this.props.isCheckedCarModel;

        carObject.brand_name = '0';
        carObject.brand_name = '0';
        carObject.series_id = '0';
        carObject.series_name = '0';
        carObject.model_id = '0';
        carObject.model_name = '0';
        carObject.discharge_standard = '';
        carObject.model_year = '';
        carObject.liter = '';
        carObject.config_value = '';

        let getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        };

        let getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID].car[rowID];
        };

        this.getFootprintData();

        const dataSource = new ListView.DataSource({
            getSectionData: getSectionData,
            getRowData: getRowData,
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {

            renderPlaceholderOnly: true,
            dataSource: dataSource,
            isHideCarSubBrand: true,
            isHideCarModel: true,
            sectionTitleArray: [],
            footprintData: [],
        };



    }


    initFinish(){
        this.setState({
            renderPlaceholderOnly:'loading',
            title:'选择品牌'
        })
        this.loadData()
    }

    loadData = () => {

        if (status == 1 && carBrandArray1.length > 0) {

            this.setListData(carBrandArray1);
            return;

        } else if (status == 0 && carBrandArray2.length > 0) {
            this.setListData(carBrandArray2);
            return;
        }

        let url = AppUrls.CAR_HOME_BRAND;
        request(url, 'post', {

            status: status,

        }).then((response) => {

            if (status == 1) {

                carBrandArray1 = response.mjson.data;

            } else if (status == 0) {
                carBrandArray2 = response.mjson.data;
            }
            this.setListData(response.mjson.data);


            this.setState({
                renderPlaceholderOnly:'success'
            })



        }, (error) => {

            this.props.showToast(error.mjson.msg);
            this.stopLoadData();

        });
    }

    setListData = (array) => {

        let sectionIDs = [], rowIDs = [], sectionTitleArray = [];
        for (let i = 0; i < array.length; i++) {
            sectionTitleArray.push(array[i].title);
            sectionIDs.push(i)
            let cars = array[i].car;
            
            let rowID = []
            for (let j = 0; j < cars.length; j++) {
                rowID.push(j);
            }
            rowIDs.push(rowID)
        }

        carData = array;
        this.setState({

            dataSource: this.state.dataSource.cloneWithRowsAndSections(array, sectionIDs, rowIDs),
            sectionTitleArray: sectionTitleArray,

        });

    };

    renderView(){

        return(
            <View style={{flex:1, marginTop:64}}>
                {
                    (this.props.status == 1 && this.state.footprintData.length > 0) && (
                        <View style={styles.carBrandHeadView}>
                            <Text allowFontScaling={false} style={styles.carBrandHeadText}>足迹:</Text>
                            {
                                this.state.footprintData.map((data, index) => {
                                    return (
                                        <TouchableOpacity key={index} onPress={()=>{

                                            this._checkedCarType(data);
                                        }}>
                                            <View style={styles.footprintView}>
                                                <Text allowFontScaling={false}
                                                      style={styles.footprintText}>{data.series_name != '0' ? data.series_name : data.brand_name}</Text>
                                            </View>
                                        </TouchableOpacity>)
                                })
                            }
                        </View>)
                }
                {
                    this.state.dataSource&&<ListView
                        ref='listView'
                        removeClippedSubviews={false}
                        dataSource={this.state.dataSource}
                        //style={[{flex:1}, (this.props.status==0 || this.state.footprintData.length==0) && {marginTop: Pixel.getTitlePixel(64)}]}
                        renderRow={this.renderRow}
                        renderSectionHeader={this.renderSectionHeader}
                        pageSize={50}
                        onScroll={() => {
                            if (!this.state.isHideCarSubBrand) {
                                this.setState({
                                    isHideCarSubBrand: true,
                                    isHideCarModel:true,
                                });
                            }}}
                    />


                }
                {
                    this.state.isHideCarSubBrand ? (null) : (
                        <CarSeriesList ref="carSeriesList"
                                       footprintData={this.state.footprintData}
                                       checkedCarClick={this._checkedCarType}
                                       checkedCarModel={this._checkedCarModel}
                        />
                    )
                }
                {
                    this.state.isHideCarModel ? (null) : (
                        <CarModelList ref="CarModelList" checkedCarClick={this._checkedCarType}/>
                    )
                }

            </View>
        )




    }

    renderRow = (rowData, sectionID, rowID) => {


        console.log(rowData.brand_icon+'?x-oss-process=image/resize,w_'+80+',h_'+80)

        return (
            <TouchableOpacity onPress={() => {

                carObject.brand_id = rowData.brand_id;
                carObject.brand_name = rowData.brand_name;
                carObject.brand_icon = rowData.brand_icon;

                if(this.state.isHideCarSubBrand)
                {
                    this.setState({
                        isHideCarSubBrand:false,
                    });

                }else
                {
                    if(!this.state.isHideCarModel){
                        this.setState({
                            isHideCarModel:true,
                        });

                    }
                    this.refs.carSeriesList.loadCarSeriesData(carObject.brand_id,carObject.brand_name);
                }


            }}>
                <View style={styles.rowCell}>
                    <Image style={styles.rowCellImag}
                           source={{uri:rowData.brand_icon+'?x-oss-process=image/resize,w_'+80+',h_'+80}}></Image>
                    <Text allowFontScaling={false} style={styles.rowCellText}>{rowData.brand_name}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    // 每一组对应的数据
    renderSectionHeader = (sectionData, sectionId) => {

        return (
            <View style={styles.sectionHeader}>
                <Text allowFontScaling={false} style={styles.sectionText}>{sectionData.title}</Text>
            </View>
        );
    }

    _checkedCarType = (carType) => {

        this.props.checkedCarClick(carType);
        this.backPage();

    };

    getFootprintData = () => {

        StorageUtil.mGetItem(StorageKeyName.CAR_TYPE_FOOTMARK, (data) => {

            if (data.code == 1) {
                if (data.result) {
                    this.setState({
                        footprintData: JSON.parse(data.result),
                    });
                }
            }
        })
    }

    _checkedCarModel = (brand_id, series_id) => {

        if (this.state.isHideCarModel) {

            this.setState({
                isHideCarModel: false,
            });

        } else {

            this.refs.CarModelList.loadCarModelsData(brnand_id, series_id, carObject.series_namee);
        }

    };

}

class CarSeriesList extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            carTitle: carObject.brand_name + (isHeadInteraction ? '/全部车系' : ''),
            brandIcon: carObject.brand_icon,
            valueRight: new Animated.Value(0),
        };
        this.loadCarSeriesData(carObject.brand_id, carObject.brand_name);
    }

    componentDidMount() {

        this.state.valueRight.setValue(ScreenWidth);
        Animated.spring(
            this.state.valueRight,
            {
                toValue: ScreenWidth * 0.3,
                friction: 5,
            }
        ).start();

    }

    loadCarSeriesData = (carBrandID, carBrandName) => {

        let url = AppUrls.CAR_HOME_SERIES;
        let parameter = {
            brand_id: carBrandID,
            status: status,
        }
        request(url, 'post', parameter).then((response) => {

            if (response.mjson.data.length) {

                this.setListData(response.mjson.data, carBrandName);

            } else {
                alert('没数据');
            }

        }, (error) => {
        });

    }

    setListData = (array, carBrandName) => {

        var dataBlob = {}, sectionIDs = [], rowIDs = [], cars = [], sectionTitleArray = [];
        for (var i = 0; i < array.length; i++) {
            //把组号放入sectionIDs数组中
            sectionIDs.push(i);
            //把组中内容放入dataBlob对象中
            dataBlob[i] = array[i].title;
            sectionTitleArray.push(array[i].title);
            //把组中的每行数据的数组放入cars
            cars = array[i].car;
            //先确定rowIDs的第一维
            rowIDs[i] = [];
            //遍历cars数组,确定rowIDs的第二维
            for (var j = 0; j < cars.length; j++) {
                rowIDs[i].push(j);
                //把每一行中的内容放入dataBlob对象中
                dataBlob[i + ':' + j] = cars[j];
            }
        }

        let getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        };

        let getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ":" + rowID];
        };

        const ds = new ListView.DataSource({
            getSectionData: getSectionData,
            getRowData: getRowData,
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        this.setState({
            dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
            carTitle: carObject.brand_name + '/全部车系',
            brandIcon: carObject.brand_icon,

        });
    };

    renderSectionHeader = (sectionData, sectionId) => {

        return (
            <View style={styles.sectionHeader}>
                <Text allowFontScaling={false} style={styles.sectionText}>{sectionData}</Text>
            </View>
        );
    }

    // 每一行中的数据
    renderRow = (rowData) => {
        return (

            <TouchableOpacity onPress={() => {

                if(status==0){
                    if(this.state.isCheckedCarModel){

                        carObject.model_id = rowData.model_id;
                        carObject.model_name = rowData.model_name;
                        this.props.checkedCarClick(carObject);


                    }else {

                        carObject.series_id = rowData.series_id;
                        carObject.series_name = rowData.series_name;

                        if(!isCheckedCarModel){
                            this.props.checkedCarModel(rowData.brand_id,rowData.series_id);
                        }else {
                            this.props.checkedCarClick(carObject);
                        }
                    }

                }else {

                    carObject.series_id = rowData.series_id;
                    carObject.series_name = rowData.series_name;
                    this.saveFootprintData(carObject);
                    this.props.checkedCarClick(carObject);
                }

            }}>
                <View style={styles.rowCell}>
                    <Text allowFontScaling={false} style={styles.rowCellText}>{rowData.series_name}</Text>
                </View>
            </TouchableOpacity>
        )
    };


    render(){
        return(
            <Animated.View style={[styles.carSubBrandView,{left:this.state.valueRight}]}>
                <TouchableOpacity onPress={()=>{
                    if(isHeadInteraction){
                        this.saveFootprintData(carObject);
                        this.props.checkedCarClick(carObject);
                    }

                }}>
                    <View style={styles.carSubBrandHeadView}>
                        <Image style={styles.rowCellImag} source={{uri:this.state.brandIcon}}/>
                        <Text allowFontScaling={false} style={styles.rowCellText}>{this.state.carTitle}</Text>
                    </View>
                </TouchableOpacity>
                {
                    this.state.dataSource&&
                    <ListView
                        ref = 'subListView'
                        removeClippedSubviews={false}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        renderSectionHeader={this.renderSectionHeader}

                    />


                }



            </Animated.View>



        )
    }

}


class CarModelList extends BaseComponent {


    componentDidMount() {

        this.state.valueRight.setValue(ScreenWidth);
        Animated.spring(
            this.state.valueRight,
            {
                toValue: ScreenWidth * 0.3,
                friction: 5,
            }
        ).start();
    }


    constructor(props) {

        super(props);

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
        this.state = ({

            carTitle: carObject.series_name + (isHeadInteraction ? '/全部车型' : ''),
            valueRight: new Animated.Value(0),
            modelsData: ds,
        });

        this.loadCarModelsData(carObject.brand_id, carObject.series_id, carObject.series_name);
    }


    loadCarModelsData = (carBrand_ID, series_ID, carTitle) => {

        let url = AppUrls.CAR_HOME_MODELS;
        let parameter = {
            brand_id: carBrand_ID,
            series_id: series_ID,
            status: status,
        }
        request(url, 'post', parameter).then((response) => {

            if (response.mjson.data.length) {

                this.setState({
                    modelsData: this.state.modelsData.cloneWithRows(response.mjson.data),
                });
            }

        }, (error) => {


        });

    }


    // 每一行中的数据
    renderRow = (rowData) => {
        return (

            <TouchableOpacity onPress={() => {

                carObject.model_id = rowData.model_id;
                carObject.model_name = rowData.model_name;
                carObject.discharge_standard = rowData.discharge_standard;
                carObject.model_year = rowData.model_year;
                carObject.config_value = rowData.config_value;

                if(rowData.liter)
                {
                    carObject.liter = rowData.liter;
                }
                this.props.checkedCarClick(carObject);

            }}>
                <View style={styles.rowCell}>
                    <Text allowFontScaling={false} style={styles.rowCellText}>{rowData.model_name}</Text>
                </View>
            </TouchableOpacity>
        )
    };


    render() {

        return (
            <Animated.View style={[styles.carSubBrandView,{left:this.state.valueRight}]}>
                <TouchableOpacity onPress={()=>{
                    if(isHeadInteraction){
                        this.props.checkedCarClick(carObject);
                    }

                }}>
                    <View style={styles.carSubBrandHeadView}>
                        {/*<Image style={styles.rowCellImag}/>*/}
                        <Text allowFontScaling={false} style={styles.rowCellText}>{this.state.carTitle}</Text>
                    </View>
                </TouchableOpacity>
                {
                    this.state.modelsData &&
                    <ListView ref="subListView"
                              removeClippedSubviews={false}
                              style={{flex: 1}}
                              dataSource={this.state.modelsData}
                              renderRow={this.renderRow}
                              renderSectionHeader={this.renderSectionHeader}
                    />
                }
            </Animated.View>
        )

    }

}


const ScreenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

    rootContainer: {
        flex: 1,
        backgroundColor: 'white',
    },

    carBrandHeadView: {
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: Pixel.getTitlePixel(64),
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: Pixel.getPixel(10),

    },
    carBrandHeadText: {

        color: fontAnColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAnColor.LITTLEFONT),
        backgroundColor: 'white',
        marginTop: Pixel.getPixel(5),
        marginBottom: Pixel.getPixel(5),
        marginLeft: Pixel.getPixel(15),

    },

    footprintView: {

        marginLeft: Pixel.getPixel(7),
        marginRight: Pixel.getPixel(3),
        paddingHorizontal: Pixel.getPixel(10),
        height: Pixel.getPixel(20),
        borderRadius: 4,
        backgroundColor: fontAnColor.THEME_BACKGROUND_COLOR,
        justifyContent: 'center',
        marginTop: Pixel.getPixel(5),
        marginBottom: Pixel.getPixel(5),
    },
    footprintText: {

        color: fontAnColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAnColor.CONTENTFONT),
    },

    carSubBrandHeadView: {

        flexDirection: 'row',
        backgroundColor: 'white',
        height: Pixel.getPixel(44),
        alignItems: 'center',
    },
    carSubBrandView: {

        backgroundColor: 'white',
        top: Pixel.getTitlePixel(64),
        bottom: 0,
        position: 'absolute',
        width: ScreenWidth * 0.7,
        borderLeftWidth: 2,
        borderLeftColor: fontAnColor.THEME_BACKGROUND_COLOR,

    },

    navigation: {

        height: Pixel.getPixel(64),
        backgroundColor: fontAnColor.NAVI_BAR_COLOR,
        left: 0,
        right: 0,
        position: 'absolute',


    },

    sectionHeader: {
        backgroundColor: fontAnColor.THEME_BACKGROUND_COLOR,
        flexDirection:'row',
        alignItems:"center"

    },
    sectionText: {
        marginLeft: Pixel.getPixel(31),
        color: fontAnColor.COLORA1,
        fontSize: Pixel.getFontPixel(fontAnColor.LITTLEFONT),
    },
    rowCell: {

        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: fontAnColor.THEME_BACKGROUND_COLOR,
        height: Pixel.getPixel(44),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',

    },
    rowCellImag: {
        width: Pixel.getPixel(40),
        height: Pixel.getPixel(40),
        marginLeft: Pixel.getPixel(15),
    },
    rowCellText: {
        marginLeft: Pixel.getPixel(5),
        color: fontAnColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAnColor.LITTLEFONT),
    },

    indexView: {

        position: 'absolute',
        bottom: 0,
        top: Pixel.getTitlePixel(113),
        backgroundColor: 'transparent',
        right: 0,
        width: Pixel.getPixel(45),
        alignItems: 'center',
        justifyContent: 'center',

    },
    indexItem: {

        marginTop: Pixel.getPixel(6),
        width: Pixel.getPixel(30),
        backgroundColor: 'transparent',


    },
    indexItemText: {

        color: fontAnColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAnColor.CONTENTFONT),
        textAlign: 'center',
    },

});