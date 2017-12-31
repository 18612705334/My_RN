/**
 * Created by lhc on 2017/2/15.
 */
//单车借款列表
//ok
import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import  {
    LendDatePike,
    LendInputItem,
    LendItem,
    LendRate,
    LendUseful,
    CommenButton,
} from './component/ComponentBlob'

import {width, adapeSize, fontadapeSize, PAGECOLOR,dateFormat,changeToMillion,STATECODE} from './component/MethodComponent';
import BaseComponent from '../../component/BaseComponent';
import AllNavigatior from '../../component/AllNavigationView'
import DateTimePicker from 'react-native-modal-datetime-picker'
import Picker from 'react-native-picker';
import {request} from '../../utils/RequestUtil'
import *as apis from '../../constant/appUrls'
import {LendSuccessAlert} from './component/ModelComponent'
const PostData = {
    apply_type: '4',
    loan_mny: '',
    loan_life:'',
    use_time: '',
    remark: '',
}

const ShowData={
    companyName: '',
    lendType: '',
    type: '',
    maxMoney:'',
    rate:'',
    tempMin:'',
    tempMax:''
}
const verificationtips={
    loan_mny:'请输入借款金额',
    remark:'请输入借款用途',
    use_time:'请选择用款时间',
    loan_life:'请选择用款期限',

}

const imageSouce =require('../../../image/financeImages/dateIcon.png')
import PixelUtil from '../../utils/PixelUtils';
const Pixel = new PixelUtil();
export default class KurongSence extends BaseComponent {
    state = {

        isDateTimePickerVisible: false,
        renderPlaceholderOnly: STATECODE.loading
    }
    dataSourceBlob = [
        {title: '借款主体', key: 'companyName'},
        {title: '借贷类型', key: 'lendType'},
        {title: '可借额度', key: 'maxMoney'},
        {title: '借款类型', key: 'type'}
    ];
    dateBlob =['30天','90天','180天','360天'];
    initFinish() {
        this.getData('');

    }
    getData = (loan_life) => {
        let maps = {
            api: apis.GET_APPLY_LOAN_DATA,
            apply_type:PostData.apply_type,
            loan_life:loan_life
        };
        if(loan_life!=''){
            this.props.showModal(true);
        }
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                    if(loan_life!=''){
                        this.props.showModal(false);
                    }
                    let tempjson =response.mjson.data;
                    ShowData.companyName=this.props.customerName;
                    ShowData.lendType=tempjson.product_type;
                    if(tempjson.min_loanmny<3){
                        ShowData.maxMoney='额度不足';
                    }else if(tempjson.min_loanmny==3){
                        ShowData.maxMoney='3万';
                    }else {
                        ShowData.maxMoney=changeToMillion(tempjson.min_loanmny)+'-'+changeToMillion(tempjson.max_loanmny)+'万';
                    }
                    ShowData.rate=tempjson.rate;
                    ShowData.type=tempjson.loantype_str;
                    ShowData.tempMin=changeToMillion(tempjson.min_loanmny);
                    ShowData.tempMax=changeToMillion(tempjson.max_loanmny);
                    this.setState({
                        renderPlaceholderOnly:STATECODE.loadSuccess
                    })
                    console.log(tempjson.oneyear_inventory_financing_status);
                    if(tempjson.oneyear_inventory_financing_status=='1'){
                        this.dateBlob =['30天','90天','180天','360天'];
                    }else{
                        this.dateBlob =['30天','90天','180天'];
                    }
                },
                (error) => {
                    if(loan_life!=''){
                        this.props.showModal(false);
                    }
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
    //datePiker的方法
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false })
    //datePiker的回调
    _handleDatePicked = (date) => {
        changeDate(dateFormat(date,'yyyy-MM-dd'));
        PostData.use_time=dateFormat(date,'yyyy-MM-dd');
        this._hideDateTimePicker();
    }
//日历按钮事件
    onPress = (changeText)=> {
        changeDate=changeText;
        this.setState({ isDateTimePickerVisible: true });
    }
//申请借款
    onClickLend = ()=> {

        let infoComolete = true;

        for(temp in PostData){

            if(PostData[temp]===''){
                this.props.showToast(verificationtips[temp]);
                infoComolete=false;
                break;
            }
        }


        if (parseFloat(PostData.loan_mny)<parseFloat(ShowData.tempMin)||parseFloat(PostData.loan_mny)>parseFloat(ShowData.tempMax)){

            infoComolete=false;
            this.props.showToast('借款金额范围为'+ShowData.maxMoney)
        }

        if (infoComolete){

            let maps = {
                api: apis.APPLY_LOAN,
                apply_type:PostData.apply_type,
                loan_mny:PostData.loan_mny,
                remark:PostData.remark,
                use_time:PostData.use_time,
                loan_life:PostData.loan_life
            };
            this.props.showModal(true);
            request(apis.FINANCE, 'Post', maps)
                .then((response) => {
                        this.props.showModal(false);
                        this.lendAlert.setModelVisible(true)
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

    }
    render() {

        if(this.state.renderPlaceholderOnly!==STATECODE.loadSuccess){
            return( <View style={styles.container}>
                {this.loadView()}
                <AllNavigatior title='库融借款' backIconClick={()=>{this.backPage()}}/>

            </View>);
        }
        let itemBlob = [];
        this.dataSourceBlob.map((item)=> {
            itemBlob.push(<LendItem key={item.key} leftTitle={item.title} rightTitle={ShowData[item.key]}/>)
        });
        return (
            <View ref={view=>this.baseView=view} style={styles.container}>
                <ScrollView style={styles.scroller}>
                    <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={5}>
                        <View style={styles.lendInfo}>
                            {itemBlob}
                        </View>
                        <View style={{marginBottom:10}}>
                            <LendDatePike ref={(limit)=>{this.dateLimit=limit}} onPress={()=>{
                                Picker.init({
                                    pickerData: this.dateBlob,
                                    selectedValue: [0],
                                    pickerConfirmBtnText:'确认',
                                    pickerCancelBtnText:'取消',
                                    pickerTitleText:'选择期限天数',
                                    onPickerConfirm: data => {
                                        let tempString=data.toString();
                                        let  placeHodel =tempString==='0'?this.dateBlob[0]:tempString;
                                        let  num = parseInt(placeHodel);
                                        PostData.loan_life=num;
                                        this.dateLimit.changeText(placeHodel);
                                        if(num=="360"){
                                            this.getData("360")
                                        }else{
                                            this.getData(num)
                                        }
                                    },
                                });
                                Picker.show();

                            }} lefTitle="借款期限" placeholder="请选择借款期限" imageSouce={require('../../../image/financeImages/celljiantou.png')}/>

                        </View>

                        <View style={styles.input}>
                            <LendInputItem title='金额' placeholder='请输入借款金额' unit='万' onChangeText={(text)=>{PostData.loan_mny=text}}/>
                        </View>
                        <LendDatePike lefTitle={'用款时间'} placeholder={'选择用款时间'} imageSouce={imageSouce} onPress={this.onPress}/>
                        <LendUseful onEndEidt={(text)=>{PostData.remark=text}}/>
                        <LendRate rate={ShowData.rate}/>
                    </KeyboardAvoidingView>
                </ScrollView>
                <CommenButton
                    buttonStyle={styles.buttonStyle} textStyle={styles.textStyle} onPress={this.onClickLend}
                    title='申请借款'/>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    titleIOS="请选择日期"
                    confirmTextIOS='确定'
                    cancelTextIOS='取消'
                    minimumDate= {new Date()}
                />
                <LendSuccessAlert ref={(lend)=>{this.lendAlert=lend}} confimClick={()=>{
                    this.props.backRefresh();
                    this.backToTop()
                }} title='借款成功'subtitle='恭喜您借款成功'/>
                <AllNavigatior title='库融借款' backIconClick={()=>{ this.backPage()}}/>

            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {

        flex: 1,
        backgroundColor:PAGECOLOR.COLORA3,
    },
    scroller: {

        marginTop: Pixel.getTitlePixel(64),
        backgroundColor: PAGECOLOR.COLORA3,

        marginBottom:adapeSize(60)
    },

    lendInfo: {
        paddingTop: adapeSize(15),
        backgroundColor: PAGECOLOR.COLORA3
    },
    input: {

        paddingBottom: adapeSize(10),
        backgroundColor: PAGECOLOR.COLORA3
    },
    buttonStyle: {


        height: adapeSize(44),
        backgroundColor: '#05c5c2',
        marginLeft: adapeSize(15),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: adapeSize(10),
        width: width - adapeSize(30),
        borderRadius:5,
    },
    textStyle: {

        fontSize: fontadapeSize(15),
        color: '#FFFFFF'
    }
})

