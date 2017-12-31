

import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,

} from 'react-native';

import BaseComponent from '../component/BaseComponent';
import * as fontAndColor from '../constant/FontAndColor';
import AllNavigationView   from '../component/AllNavigationView';
import PixelUtil from '../utils/PixelUtils';
const Pixel = new PixelUtil();

import *as appUrls from '../constant/appUrls';
import {request} from "../utils/RequestUtil";



const provinceData = (require('./carData/carFilterData.json')).provinceSource;
const SceneWidth = Dimensions.get('window').width;

let selectData={
    province_name:'',
    city_name:'',
    provice_id:0,
    city_id:0,

};

export default class ProvinceListScene extends BaseComponent{

    initFinish(){}

    componentWillMount() {
        selectData.provice_id = 0;
        selectData.province_name='';
        selectData.city_name='';
        selectData.city_id=0;
    }

    // 构造
    constructor(props) {
        super(props);
        // 初始状态


        this.titleArray = [];

        let  getSectionData = (dataBlob,sectionID)=>{
            return dataBlob[sectionID];
        }
        let  getRowData = (dataBlob,sectionID,rowID)=>{
            return dataBlob[sectionID+":"+rowID];
        }

        const dataSource = new  ListView.DataSource(
            {
                getSectionData:getSectionData,
                getRowData:getRowData,
                sectionHeaderHasChanged:(s1,s2)=>s1!==s2,
                rowHasChanged:(r1,r2)=>r1!==r2,
            }
        );

        let dataBlob={},sectionIDS=[],rowIDS=[],rows=[];
        for (var i=0;i<provinceData.length;i++){

            sectionIDS.push(i);
            dataBlob[i]=provinceData[i].title;
            this.titleArray.push(dataBlob[i]);
            rows = provinceData[i].data;
            rowIDS[i] = [];
            for (var j=0;j<rows.length;j++){
                rowIDS[i].push(j);
                dataBlob[i+':'+j] = rows[j];
            }
        }

        this.state = {
            dataSource:dataSource.cloneWithRowsAndSections(dataBlob,sectionIDS,rowIDS),
            isShowCityList:false,
        };
    }
    _checkedCityClick=()=>{
        this.props.checkedCityClick(selectData);
        this.backPage();
    }

    loadModel=(type)=>{
        this.props.showModal(type);
    }

    render(){
        return(
            <View style={styles.rootContainer}>
                <ListView
                    ref="listView"
                    dataSource={this.state.dataSource}

                    renderSectionHeader={(sectionData)=>{
                        return(
                            <View style={styles.sectionHeader}>
                                <Text allowFontScaling={false}  style={styles.sectionText}>{sectionData}</Text>
                            </View>
                        )
                    }}
                    renderRow={this.renderRow}
                    enableEmptySections={true}
                    removeClippedSubviews={false}
                    onScroll={() => {
                        if (this.state.isShowCityList) {
                            this.setState({
                                isShowCityList:false,
                            });
                        }}}/>
                <ZNListIndexView indexTitleArray={this.titleArray} indexClick={this._indexAndScrollClick}/>
                {
                    this.state.isShowCityList && (<CityList  isZs = {this.props.isZs} ref="cityList" checkedCityClick={this._checkedCityClick} isSelectProvince = {this.props.isSelectProvince} showLoadModel={this.loadModel}/>)
                }
                <AllNavigationView title="城市筛选" backIconClick={this.backPage} renderRihtFootView={this.renderRightFootView}/>
            </View>)
    }

    renderRightFootView = () => {

        return (
            this.props.unlimitedAction &&  <TouchableOpacity onPress={()=>{this.props.unlimitedAction();this.backPage();}}>
                <View style={{paddingVertical:3, paddingHorizontal:5,backgroundColor:'transparent',borderWidth:StyleSheet.hairlineWidth,borderColor:'white',borderRadius:3}}>
                    <Text allowFontScaling={false}  style={{
                        color: 'white',
                        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                        textAlign: 'center',
                        backgroundColor: 'transparent',}}>全国</Text>
                </View>
            </TouchableOpacity>
        )
    }

    // 每一行中的数据
    renderRow = (rowData) => {
        return (
            <TouchableOpacity onPress={()=>{
                this.setState({isShowCityList:true});

                if(selectData.provinceID == rowData.ID){return;}

                selectData.city_name=rowData.title;
                selectData.provice_id=rowData.ID;
                selectData.provice_name=rowData.title;

                this.refs.cityList && this.refs.cityList.loadData();
            }}>
                <View style={styles.rowCell}>
                    <Text allowFontScaling={false}  style={styles.rowCellText}>{rowData.title}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    _indexAndScrollClick = (index) => {

        let listView = this.refs.listView;
        let scrollY = index * Pixel.getPixel(40);
        for (let i = 0; i < index; i++) {
            let rowIndex = provinceData[i].data.length;
            scrollY += +rowIndex * Pixel.getPixel(44);
        }
        listView.scrollTo({x: 0, y: scrollY, animated: true});
    };


}


class ZNListIndexView extends Component{

    render(){
        const {indexTitleArray}=this.props;
        return(
            <View style={styles.indexView}>
                {
                    indexTitleArray.map((data,index)=>{
                        return(
                            <TouchableOpacity key={index} style={styles.indexItem} onPress={()=>{

                                this.props.indexClick(index);

                            }}>
                                <Text allowFontScaling={false}  style={styles.indexItemText}>{data}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }
}

class CityList extends  Component{

    componentDidMount() {

        this.state.valueRight.setValue(SceneWidth);
        Animated.spring(
            this.state.valueRight,
            {
                toValue: SceneWidth * 0.3,
                friction: 5,
            }
        ).start();

        this.loadData();


    }
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        const dataSource = new ListView.DataSource({
            rowHasChanged:(r1,r2)=>r1!==r2,
        });

        this.state = {
            dataSource:dataSource,
            valueRight: new Animated.Value(0),
        };
    }

    loadData=()=>{

        this.props.showLoadModel(true);

        request(this.props.isZs?appUrls.ZS_GET_CITY:appUrls.GET_PROVINCE,'post',this.props.isZs?{province_name:selectData.city_name, payment_type:'ZS'}:{'prov_id':selectData.provice_id})
            .then((response) => {

                this.props.showLoadModel(false);

                if(response.mycode ==1){
                    this.setState(
                        {dataSource:this.state.dataSource.cloneWithRows(response.mjson.data)}
                    );
                }


            }, (error) => {
                this.props.showLoadModel(false);

                console.log(error);

            });
    }
    render(){
        return(
            <Animated.View style={[styles.cityContainer,{left:this.state.valueRight}]}>
                <ListView dataSource={this.state.dataSource}
                          renderRow={this.renderRow}
                          removeClippedSubviews={false}
                          enableEmptySections={true}
                          renderHeader={()=>{
                              return(
                                  <TouchableOpacity style={styles.sectionHeader} onPress={()=>{
                                      if(this.props.isSelectProvince)
                                      {
                                          this.props.checkedCityClick();
                                      }
                                  }} activeOpacity={1}>
                                      <Text allowFontScaling={false}  style={styles.sectionText}>{selectData.city_name}</Text>
                                  </TouchableOpacity>
                              )}}/>
            </Animated.View>
        )
    }
    // 每一行中的数据
    renderRow = (rowData) => {
        return (

            <TouchableOpacity style={styles.rowCell} onPress={()=>{
                selectData.city_name=rowData.city_name;
                selectData.city_id=rowData.city_id;
                this.props.checkedCityClick();
            }}>
                <Text allowFontScaling={false}  style={styles.rowCellText}>{rowData.city_name}</Text>
            </TouchableOpacity>
        )
    };
}

const styles = StyleSheet.create({

    rootContainer:{
        flex:1,
        backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR,
        paddingTop:Pixel.getTitlePixel(64),
    },
    sectionHeader: {
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
        height: Pixel.getPixel(40),
        justifyContent: 'center'
    },
    sectionText: {
        marginLeft: Pixel.getPixel(15),
        color: fontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
    },
    rowCell: {

        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: fontAndColor.THEME_BACKGROUND_COLOR,
        height: Pixel.getPixel(44),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',

    },
    rowCellText: {
        marginLeft: Pixel.getPixel(15),
        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
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
        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT),
        textAlign: 'center',
    },
    cityContainer:{
        backgroundColor: 'white',
        top: Pixel.getTitlePixel(64),
        bottom: 0,
        position: 'absolute',
        width: SceneWidth * 0.7,
        borderLeftWidth: 2,
        borderLeftColor: fontAndColor.THEME_BACKGROUND_COLOR,
    },

});