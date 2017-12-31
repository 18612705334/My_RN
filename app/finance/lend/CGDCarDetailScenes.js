/**
 * Created by lcus on 17/3/24.
 */
//采购贷车辆详情页面

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Image,
    Text
} from 'react-native';
import {CommnetListItem, CommentHandItem} from './component/ComponentBlob'
import {width, height, fontadapeSize, adapeSize,STATECODE,PAGECOLOR,getRowData,getSectionData,changeToMillion} from './component/MethodComponent'
import  AllNavigationView from '../../component/AllNavigationView';
import BaseComponent from '../../component/BaseComponent';
import {request} from '../../utils/RequestUtil'
import *as apis from '../../constant/appUrls'
import ImagePageView from 'react-native-viewpager'
import CarTrackScene from './CarTrackScene'

const ImageSouce= {

    imageSouce:[]

}
export default class CGDCarDetailScenes extends BaseComponent{

    constructor(props) {
        super(props);
        // 初始状态
        const ds = new ListView.DataSource(
            {
                getRowData: getRowData,
                getSectionHeaderData: getSectionData,
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            }
        )//
        const ImageData = new ImagePageView.DataSource({pageHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRowsAndSections(this.titleNameBlob({},[])),
            renderPlaceholderOnly: STATECODE.loading,
            carImageData: ImageData.cloneWithPages([]),
        }
    }

    initFinish() {
        this.getCarInfo();
    }

    getCarInfo=()=>{

        let maps = {
            api: apis.PURCHA_AUTO_DETAIL,
            info_id: this.props.carId,

        };
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {

                    let tempjson = response.mjson.data.detail;

                    this.setState({
                        renderPlaceholderOnly: STATECODE.loadSuccess,
                        dataSource:this.state.dataSource.cloneWithRowsAndSections(this.titleNameBlob(tempjson,tempjson.file_list)),
                    })
                },
                (error) => {
                    this.setState({
                        renderPlaceholderOnly:STATECODE.loadError,
                    })
                    if(error.mycode!= -300||error.mycode!= -500){
                        this.props.showToast(error.mjson.msg);

                    }else {
                        this.props.showToast('服务器连接有问题')

                    }
                });
    }


    titleNameBlob=(jsonData,carData)=>{

        let dataSource = {};
        let date = new Date(jsonData.init_reg*1000);
        let seperator1 = "-";
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        let section1=[
            {title: '出售城市', key: jsonData.city_name},
            {title:'车型',key:jsonData.model_name},
            {title: '车架号', key: jsonData.frame_number},
            {title: '外观颜色', key:jsonData.car_color},
            {title: '行驶里程', key: jsonData.mileage},
            {title: '首次上牌时间', key:currentdate },
            {title: '收车人', key: jsonData.rev_user_name},
            {title: '登记人',     key:jsonData.register_user_name},
            {title: '收购价（万元）', key: jsonData.purchas_price+'万元'},
            {title:'放款额',key:jsonData.first_assess_loan+'万元'}
        ]
        if(jsonData.obd_audit_status =='1'){
            section1.push({title: '车辆位置', key: jsonData.obd_track_url})
        }
        dataSource['section1']=section1
        if(carData.length>0){

            let autoBase=[];
            let mention=[];
            let obdBase=[];
            carData.map((item)=>{

                if (item.type=='auto'){
                    autoBase .push(item)
                }else if (item.type=='mention'){
                    mention.push(item)
                }else if (item.type=='obd'){
                    obdBase.push(item)
                }
            })
            let tempData=[autoBase,mention,obdBase]

            dataSource['section2']=tempData;

        }
        return dataSource;
    }

    renderImagePage=(data,pageId)=>{

        return (
            <Image source={{uri:data}} style={styles.thumb}/>
        )

    }

    renderRow = (rowData, sectionID, rowId, highlightRow) => {

        if (sectionID === 'section2') {

            if (rowData.length>0){

                let  temptitle ='';
                if (rowId==0) temptitle='车辆照片';
                if (rowId==1) temptitle='二手车交易发票';
                if (rowId==2) temptitle='OBD照片';
                let tempData=[];
                rowData.map((item)=>{tempData.push(item.url)});

                let temp=this.state.carImageData.cloneWithPages(tempData);
                return(
                    <View style={styles.ImageBackView}>
                        <Text allowFontScaling={false}  style={styles.thumbTitle}>{temptitle}</Text>
                        <ImagePageView
                            dataSource={temp}    //数据源（必须）
                            renderPage={this.renderImagePage}     //page页面渲染方法（必须）
                            isLoop={false}                        //是否可以循环
                            autoPlay={false}                      //是否自动
                            locked={false}                        //为true时禁止滑动翻页
                        />
                    </View>
                )
            }
            return null;


        }else if (rowData.title ==='车辆位置'){

            return (
                <CommentHandItem textStyle={{paddingTop:adapeSize(15),paddingBottom:adapeSize(15)}}
                                 leftTitle={rowData.title} showValue={'点击查看'} handel={()=>{
                    navigatorParams = {
                        name: 'CarTrackScene',
                        component: CarTrackScene,
                        params: {
                            webUrl:rowData.key
                        }
                    }
                    this.toNextPage(navigatorParams);

                }}/>
            )
        }

        return (
            <CommnetListItem textStyle={rowData.title === '放款额' ? {color: PAGECOLOR.COLORB2} : null} leftTitle={rowData.title} showValue={rowData.key}/>
        );
    }
    renderSectionHeader = (sectionData, sectionID) => {
        return (

            <View style={styles.sectionStyle}>

            </View>
        )

    }
    renderSeparator =(sectionID,rowId,adjacentRowHighlighted)=>{

        let separtrorHegigth =1;
        if (rowId==='1'||rowId==='7'||rowId=='9'||rowId=='10'){
            separtrorHegigth=10;
        }
        return (
            <View key={`${sectionID}-${rowId}`} style={{
                height:adjacentRowHighlighted?2:separtrorHegigth,
                backgroundColor:PAGECOLOR.COLORA3
            }}>
            </View>
        )
    }

    render(){

        if(this.state.renderPlaceholderOnly!==STATECODE.loadSuccess)
        {
            return(
                <View style={styles.container}>
                    {this.loadView()}
                    <AllNavigationView title='车辆详情' backIconClick={()=>{
                        this.backPage();
                    }}/>
                </View>);
        }
        return(
            <View style={styles.container}>
                <ListView
                    removeClippedSubviews={false}
                    style={{marginTop:64}}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    renderSectionHeader={this.renderSectionHeader}
                    showsVerticalScrollIndicator={false}
                />
                <AllNavigationView title='车辆详情' backIconClick={()=>{ this.backPage();}}/>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        backgroundColor: PAGECOLOR.COLORA3
    },
    ImageBackView:{
        backgroundColor:'white'

    },
    thumbTitle:{
        marginTop:adapeSize(16),
        marginBottom:adapeSize(12),
        fontSize:fontadapeSize(15),
        marginLeft:adapeSize(14),
    },
    thumb:{
        backgroundColor:'white',
        height: adapeSize(250),
        width:width-adapeSize(24),
        marginLeft:adapeSize(14),
        marginRight:adapeSize(14),
        resizeMode:'stretch'
    },
    sectionStyle:{
        backgroundColor:PAGECOLOR.COLORA3,
        height:adapeSize(10),
        alignItems:'flex-start',
        justifyContent:'center'
    }

})