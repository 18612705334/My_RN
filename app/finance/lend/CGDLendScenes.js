/**
 * Created by lhc on 2017/2/20.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

let PostData = {
    apply_type: '5',
    loan_mny: '',
    archives_type:'1',
    use_time:'',
}
let showData={
    maxMoney:'',
    rate:'',
    tempMin:'',
    tempMax:'',
    tempCarList:[],
    tempLendInfo:{},
    tempDetailInfo:{},
}
const tempDelete={
    base_id:'',
    info_id:'',
    itemAtInex:''
}

const verificationtips={
    use_time:'请选择用款时间',
    loan_mny:'请输入用款金额',
}
import BaseComponent from '../../component/BaseComponent';

import {LendDatePike, LendInputItem, LendItem, CGDCarItem, CommenButton,commnetStyle,} from './component/ComponentBlob'
import {width, adapeSize,PAGECOLOR,changeToMillion,getRowData,getSectionData,dateFormat,STATECODE} from './component/MethodComponent'
import {ModalAlert,LendSuccessAlert} from './component/ModelComponent'
import CGDaddCarScenes from './CGDaddCarScenes';
import  AllNavigatior from '../../component/AllNavigationView'
import {ModalCGD} from './component/ModelComponent'
import DateTimePicker from 'react-native-modal-datetime-picker'
import {request} from '../../utils/RequestUtil'
import *as apis from '../../constant/appUrls'
import CGDAddCarScene from './CGDAddCarScene'
import PixelUtil from '../../utils/PixelUtils';
const Pixel = new PixelUtil();

export  default  class CGDLendScenes extends BaseComponent {

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
        );
        //
        this.state = {
            dataSource: ds.cloneWithRowsAndSections(this.titleNameBlob({},[])),
            isDateTimePickerVisible: false,
            renderPlaceholderOnly: STATECODE.loading
        }
    }

    componentWillUnmount(){
        PostData.use_time='';
        PostData.loan_mny='';

    }



    initFinish() {

        if(this.props.loan_code){
            this.getLenddetail()

        }else {
            this.getLendInfo(this.props.isOBD,this.props.isCarinvoice);
        }


    }


    getType=(state)=>{

        let  temp =parseInt(state);

        return temp==1?'有':'无'
    }

    refreshAll=()=>{
        this.setState({
            renderPlaceholderOnly: STATECODE.loading
        })
        this.getCarListInfo(showData.tempLendInfo)
    }


    titleNameBlob = (jsonData, carData) => {

        let dataSource = {};

        let type=this.getType(this.props.loan_code?showData.tempDetailInfo.isobd:this.props.isCarinvoice)+'票'+this.getType(this.props.loan_code?showData.tempDetailInfo.isinvoice:this.props.isOBD)+'OBD';

        dataSource['section1'] = [
            {title: '模式', value:type},
            {title: '借款额度', value: changeToMillion(jsonData.min_loanmny) + '-' + changeToMillion(jsonData.max_loanmny) + '万'},
            {title: '借款费率', value: jsonData.rate}
        ]
        dataSource['section2']=[
            {title: '用款金额', key: 'orderState'},
            {title: '用款时间', key: 'date'},
        ]

        if (carData.length > 0) {

            let tempCarDate = [];

            carData.map((item) => {

                tempCarDate.push(
                    {
                        brand_name: item.brand_name,
                        icon: item.cover.icon,
                        frame_number: item.frame_number,
                        price: item.first_assess_loan,//放款额
                        obd_bind_status: item.obd_bind_status,//车牌号
                        info_id: item.info_id,
                        model_name:item.model_name,
                        init_reg:item.init_reg,
                        base_id:item.base_id,
                        invoice_upload_status:item.invoice_upload_status,
                        mileage:item.mileage
                    }
                )
                dataSource['section3'] = tempCarDate;
            })
        }
        return dataSource;
    }
    getLendInfo=(obdState,invoiceState)=>{

        let maps = {
            api: apis.GET_APPLY_LOAN_DATA,
            apply_type:'5',
            archives_type:'1',
            isinvoice:invoiceState,
            isobd:obdState
        };

        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                    let tempjson = response.mjson.data;
                    showData.tempMin=changeToMillion(tempjson.min_loanmny);
                    showData.tempMax=changeToMillion(tempjson.max_loanmny);
                    showData.tempLendInfo=tempjson;
                    this.getCarListInfo(tempjson);

                },
                (error) => {
                    this.props.showModal(false);
                    this.setState({
                        renderPlaceholderOnly:STATECODE.loadError
                    })
                    if(error.mycode!= -300||error.mycode!= -500){
                        this.props.showToast(error.mjson.msg);
                    }else {

                        this.props.showToast('服务器连接有问题')
                    }
                });


    }

    getLenddetail = () => {

        let maps = {
            api: apis.GET_APPLY_INFO,

        };
        if(this.props.loan_code){
            Object.assign(maps,{loan_code: this.props.loan_code})
        }

        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                    let tempjson = response.mjson.data;

                    showData.tempDetailInfo={
                        isinvoice:tempjson.isinvoice=='有'?1:0,
                        isobd:tempjson.isobd=='有'?1:0,
                        payment_loanmny_str:tempjson.payment_loanmny_str,
                        createtimestr:tempjson.createtimestr,
                        payment_audit_reason:tempjson.payment_audit_reason,
                    };

                    PostData.loan_mny=(parseFloat(tempjson.payment_loanmny_str)).toString();
                    PostData.use_time=tempjson.use_time_str;
                    this.getLendInfo(showData.tempDetailInfo.isobd,showData.tempDetailInfo.isinvoice);
                },
                (error) => {

                    this.setState({
                        renderPlaceholderOnly: STATECODE.loadError
                    })
                    if (error.mycode != -300 || error.mycode != -500) {
                        this.props.showToast(error.mjson.msg);

                    } else {
                        this.props.showToast('服务器连接有问题')
                    }
                });


    }

    getCarListInfo=(templendInfo)=>{
        let maps = {
            api: apis.AUTOLIST,

        };
        if(this.props.loan_code){
            Object.assign(maps,{payment_number:this.props.loan_code})
        }

        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    let tempjson = response.mjson.data;
                    showData.tempCarList=tempjson.list;
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.titleNameBlob(templendInfo, tempjson.list)),
                        renderPlaceholderOnly: STATECODE.loadSuccess
                    })

                },
                (error) => {
                    this.props.showModal(false);
                    this.setState({
                        renderPlaceholderOnly:STATECODE.loadError
                    })
                    if(error.mycode!= -300||error.mycode!= -500){
                        this.props.showToast(error.mjson.msg);

                    }else {

                        this.props.showToast('服务器连接有问题')
                    }
                });
    }

    verificationInfo=()=>{

        let infoIsall =true;
        let isHasCar =true;
        let  moneyAdape=true;
        for(temp in PostData){
            let tempData =PostData[temp];
            if(tempData=='')
            {
                this.props.showToast(verificationtips[temp]);
                infoIsall=false;
                break;
            }}
        if (infoIsall){
            let CarList =this.state.dataSource._dataBlob['section3'];
            if(!CarList||CarList.length==0)
            {this.props.showToast('请添加车辆');
                isHasCar=false
            }
        }

        if (infoIsall&&isHasCar){
            if (parseFloat(PostData.loan_mny)<parseFloat(showData.tempMin)||parseFloat(PostData.loan_mny)>parseFloat(showData.tempMax)){
                moneyAdape=false;
                this.props.showToast('借款金额范围为'+showData.tempMin+'-'+showData.tempMax+'万元')
            }
        }
        if(infoIsall&&isHasCar&&moneyAdape){
            let tempisObd=this.props.loan_code?showData.tempDetailInfo.isobd:this.props.isOBD;
            let isinvoice =this.props.loan_code?showData.tempDetailInfo.isinvoice:this.props.isCarinvoice;

            showData.tempCarList.map((item)=>{
                let obdState =parseInt(item.obd_bind_status);
                let invoice  =parseInt(item.invoice_upload_status);
                if(invoice<isinvoice){
                    this.props.showToast('请补全票据信息')
                    return
                }
                if((tempisObd==obdState)&&(invoice==isinvoice)){
                    this.lendMoneyClick();
                }else{
                    if(obdState==1&&tempisObd==0){
                        this.infoMessage.setModelVisible(true)
                    }else if(obdState==0&&tempisObd==1){
                        this.props.showToast('请完成车辆OBD绑定')
                    }else{
                        this.lendMoneyClick();
                    }
                }
            })
        }

    }

    lendMoneyClick=()=>{

        let CarList =this.state.dataSource._dataBlob['section3']
        let tempCarList=[]
        CarList.map((item)=>{tempCarList.push(item.info_id)})
        let carIdList =tempCarList.join(',')
        let tempOBDState=this.props.loan_code?showData.tempDetailInfo.isobd:this.props.isOBD;
        let tempCarinvoice =this.props.loan_code?showData.tempDetailInfo.isinvoice:this.props.isCarinvoice;

        let maps = {
            api: apis.APPLY_LOAN,
            apply_type: PostData.apply_type,
            isobd: tempOBDState,
            isinvoice: tempCarinvoice,
            loan_mny: PostData.loan_mny,
            use_time: PostData.use_time,
            car_lists: carIdList,
            archives_type: PostData.archives_type,
            loan_code: this.props.loan_code
        }
        this.props.showModal(true);
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    this.apSuccess.setModelVisible(true);
                },
                (error) => {
                    this.props.showModal(false);
                    if(error.mycode!= -300||error.mycode!= -500){
                        this.props.showToast(error.mjson.msg);

                    }else {

                        this.props.showToast('服务器连接有问题')
                    }
                });


    }
    deleteCarClick=(info_id,base_id)=>{
        let maps = {
            api: apis.DELETEAUTO,
            base_id:base_id,
            info_id:info_id,
        };
        this.props.showModal(true);
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);

                    showData.tempCarList.splice(tempDelete.itemAtInex,1);
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.titleNameBlob(showData.tempLendInfo, showData.tempCarList)),
                    })
                    this.props.showToast('删除成功');
                },
                (error) => {
                    this.props.showModal(false);
                    if(error.mycode!= -300||error.mycode!= -500){
                        this.props.showToast(error.mjson.msg);

                    }else {

                        this.props.showToast('服务器连接有问题')
                    }
                });





    }

    carItemClick=(infoId,base_id)=>{
        this.navigatorParams.name = "CGDAddCarScene";
        this.navigatorParams.component = CGDAddCarScene;
        let tempOBDState=this.props.loan_code?showData.tempDetailInfo.isobd:this.props.isOBD;
        let tempCarinvoice =this.props.loan_code?showData.tempDetailInfo.isinvoice:this.props.isCarinvoice;
        this.navigatorParams.params = {isOBD:tempOBDState,isCarinvoice:tempCarinvoice,InfoId:infoId,baseID:base_id,updateCar:true,
            backRefresh:()=>{
                this.refreshAll();
            }};
        this.toNextPage(this.navigatorParams)

    }



    //datePiker的方法
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false })
    //datePiker的回调
    _handleDatePicked = (date) => {
        let tempdate=dateFormat(date,'yyyy-MM-dd')
        this.datePiker.changeText(tempdate);
        PostData.use_time=tempdate;
        this._hideDateTimePicker();
    }

    onPress = (changeText)=> {

        this.setState({ isDateTimePickerVisible: true });
    }


    renderRow = (rowData, sectionID, rowID, highLght) => {

        if (sectionID === 'section1') {

            return (<LendItem leftTitle={rowData.title} rightTitle={rowData.value}/>)
        } else if (sectionID === 'section2' && rowID === '0') {

            return <LendInputItem placeholder={'请输入借款金额'} title={rowData.title} onChangeText={(text)=>{PostData.loan_mny=text} } showValue={PostData.loan_mny}/>
        } else if (sectionID === 'section2' && rowID === '1') {

            return <LendDatePike ref={(piker)=>{this.datePiker =piker}} showData={'3333'} lefTitle={rowData.title} placeholder='请选择用款时间'
                                 imageSouce={require('../../../image/financeImages/dateIcon.png')} onPress={this.onPress} defaultShowValue={PostData.use_time}/>
        } else {
            return (

                <CGDCarItem  url={rowData.icon}title={rowData.model_name}obdState={rowData.obd_bind_status} shouxuState={rowData.invoice_upload_status} date={rowData.init_reg+' / '+rowData.mileage+'万公里'}
                             onPress={()=>{
                                 this.carItemClick(rowData.info_id,rowData.base_id);
                             }} deletePress={()=>{
                    this.deleteCar.setModelVisible(true);
                    tempDelete.base_id=rowData.base_id
                    tempDelete.info_id=rowData.info_id
                    tempDelete.itemAtInex=rowID
                }}/>
            )
        }
    }
    renderSeparator = (sectionID, rowId, adjacentRowHighlighted) => {

        return (
            <View key={`${sectionID}-${rowId}`} style={{
                height: adjacentRowHighlighted ? 1 : 1,
                backgroundColor: adjacentRowHighlighted ? PAGECOLOR.COLORA4 : '#CCCCCC'
            }}>
            </View>
        )
    }


    renderSectionHeader = (_, sectionId) => {

        if(sectionId=='section1'&&this.props.loan_code){

            return (
                <View style={styles.sections}>
                    <Text allowFontScaling={false}  style={{color:'#ff0000',fontSize:Pixel.getFontPixel(14)}}> {'审核未通过:'}</Text>
                    <Text allowFontScaling={false}  style={{color:'#000000',fontSize:Pixel.getFontPixel(14)}} numberOfLines={2}>{showData.tempDetailInfo.payment_audit_reason}</Text>
                </View>
            )
        }
        else if (sectionId !== 'section3') {

            return <View style={{height: adapeSize(15), backgroundColor: '#f0eff5'}}></View>
        }
        return (
            <View style={styles.section}>
                <Text allowFontScaling={false} >采购车辆</Text>
            </View>
        )
    }
    navigatorParams={
        name:'CGDaddCarScenes',
        component:CGDaddCarScenes,
        params:{}
    }

    render() {

        if(this.state.renderPlaceholderOnly!==STATECODE.loadSuccess){
            return( <View style={styles.container}>
                {this.loadView()}
                <AllNavigatior title='采购融资' backIconClick={()=>{
                    this.backPage();
                }}/>

            </View>);
        }
        return (
            <View style={commnetStyle.container}>

                <View style={commnetStyle.ListWarp}>
                    <ListView
                        removeClippedSubviews={false}
                        enableEmptySections={true}
                        style={{flex:1}}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        renderSectionHeader={this.renderSectionHeader}
                        renderSeparator={this.renderSeparator}
                    />
                </View>
                <View style={[commnetStyle.bottomWarp,{flexDirection:'row', justifyContent: 'flex-end',
                    alignItems: 'center'}]}>

                    <CommenButton textStyle={styles.textLeft} buttonStyle={styles.buttonStyleRight} onPress={() => {
                        this.navigatorParams.name = "CGDAddCarScene";
                        this.navigatorParams.component = CGDAddCarScene;
                        let tempOBDState=this.props.loan_code?showData.tempDetailInfo.isobd:this.props.isOBD;
                        let tempCarinvoice =this.props.loan_code?showData.tempDetailInfo.isinvoice:this.props.isCarinvoice;
                        this.navigatorParams.params = {isOBD:tempOBDState,
                            isCarinvoice:tempCarinvoice,paymentId:this.props.loan_code,backRefresh:()=>{
                                this.refreshAll();
                            }};
                        this.toNextPage(this.navigatorParams)
                    }} title="添加车辆"/>
                    <CommenButton textStyle={{color: 'white'}} buttonStyle={styles.buttonStyleLeft} onPress={this.verificationInfo} title="申请借款"/>
                </View>

                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    titleIOS="请选择日期"
                    confirmTextIOS='确定'
                    cancelTextIOS='取消'
                />
                <ModalAlert ref={(deleteCar)=>{this.deleteCar=deleteCar}} title='删除车辆'subtitle='您确定要删除车辆吗' confimClick={(setHide)=>{
                    setHide(false);
                    this.deleteCarClick(tempDelete.info_id,tempDelete.base_id);
                }} cancleClick={(setHide)=>{setHide(false)}}/>
                <LendSuccessAlert  title="借款成功"subtitle='恭喜您借款成功' ref={(success)=>{this.apSuccess=success}} confimClick={()=>{
                    this.props.backRefresh();
                    this.backToTop()
                }}/>
                <ModalAlert ref={(alert)=>{this.infoMessage=alert}} title='解绑提示'subtitle='继续借款将会解绑车辆OBD' confimClick={(setHide)=>{
                    setHide(false);
                    this.lendMoneyClick()
                }} cancleClick={(setHide)=>{setHide(false)}}/>
                <AllNavigatior title='采购融资' backIconClick={()=>{
                    this.backPage();
                }}/>
            </View>

        )
    }


}


const styles = StyleSheet.create({
    container: {

        flex: 1,
        backgroundColor:PAGECOLOR.COLORA3,
    },
    handelWarper: {
        height: adapeSize(50),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: adapeSize(16),
        width: width,
        flexDirection: 'row',
    },
    buttonStyleRight: {

        height: adapeSize(32),
        marginLeft: adapeSize(15),
        justifyContent: 'center',
        width:adapeSize(100),
        alignItems: 'center',
        marginRight: 5,
        borderColor: PAGECOLOR.COLORB0,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
        width:adapeSize(100)
    },
    buttonStyleLeft: {

        height: adapeSize(32),
        backgroundColor: PAGECOLOR.COLORB0,
        marginRight: adapeSize(15),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        borderRadius: 5,
        width:adapeSize(100)
    },

    textLeft: {

        color: '#05c5c2'
    },
    section:{

        backgroundColor: '#f0eff5',
        flexDirection: 'row',
        height: 30,
        alignItems: 'center',
        paddingLeft: 15
    }
    ,
    sections:{
        height:adapeSize(70),width:width,backgroundColor:'rgb(254,253,233)',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15
    }


})