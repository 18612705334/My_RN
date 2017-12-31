
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
} from 'react-native';

import {
    CommnetListItem,
    LendCarItemCell,
    CommenButton,
    commnetStyle,
    ComentImageButton
} from './component/ComponentBlob'
import {
    width,
    height,
    fontadapeSize,
    adapeSize,
    STATECODE,
    PAGECOLOR,
    getRowData,
    getSectionData,
    changeToMillion
} from './component/MethodComponent'
import  AllNavigationView from '../../component/AllNavigationView';
import BaseComponent from '../../component/BaseComponent';
import {ModifyBorrowing, LendSuccessAlert, ModalAlert} from './component/ModelComponent'
import {request} from '../../utils/RequestUtil'
import *as apis from '../../constant/appUrls'


const controlCode = {

    stateCode: '',
    extendCode: '',
    lendType: '',
    maxLend: '',
    minLend: '',
    changeMoney: ''
}
import ContractInfoScene from './ContractInfoScene';


export  default  class KurongDetaileScene extends BaseComponent {

    // 构造
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
        this.state = {
            dataSource: ds.cloneWithRowsAndSections(this.titleNameBlob({}, [])),
            renderPlaceholderOnly: STATECODE.loading
        }
    }

    initFinish() {

        this.getLendinfo();
    }

    getLendinfo = () => {
        let maps = {
            api: apis.CARLOAN_LOAN_INFO,
            loan_code: this.props.loanNumber
        };
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {

                    let tempjson = response.mjson.data.info;
                    let carNum = parseInt(tempjson.car_count)
                    controlCode.stateCode = tempjson.status
                    controlCode.extendCode = tempjson.is_extend;
                    controlCode.lendType = tempjson.type;
                    controlCode.minLend = changeToMillion(tempjson.min_loanmny);
                    let Maxmum = parseFloat(tempjson.max_loanmny)
                    /*+ parseFloat(tempjson.payment_loanmny)*/
                    controlCode.maxLend = changeToMillion(Maxmum)
                    if (carNum > 0) {

                        this.getOrderCarInfo(tempjson)
                    }
                    else {
                        this.setState({

                            dataSource: this.state.dataSource.cloneWithRowsAndSections(this.titleNameBlob(tempjson, [])),
                            renderPlaceholderOnly: STATECODE.loadSuccess
                        })
                    }

                },
                (error) => {

                    this.setState({
                        renderPlaceholderOnly: STATECODE.loadError,
                    })
                    if (error.mycode != -300 || error.mycode != -500) {

                        this.props.showToast('服务器连接有问题')
                    } else {

                        this.props.showToast(error.mjson.msg);
                    }

                });
    }

    getOrderCarInfo = (lendInfoJson) => {

        let maps = {
            api: apis.GET_APPLY_CARLIST,
            loan_code: this.props.loanNumber
        }
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {

                    let tempCarJson = response.mjson.data.list
                    this.setState({

                        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.titleNameBlob(lendInfoJson, tempCarJson)),
                        renderPlaceholderOnly: STATECODE.loadSuccess
                    })
                },

                (error) => {

                    this.setState({
                        renderPlaceholderOnly: STATECODE.loadError,
                    })
                    if (error.mycode != -300 || error.mycode != -500) {
                        this.props.showToast(error.mjson.msg);

                    } else {
                        this.props.showToast('服务器连接有问题')

                    }
                });


    }
    titleNameBlob = (jsonData, carData) => {

        let dataSource = {};
        dataSource['section1'] = [
            {title: '借款单号', key: jsonData.loan_code},
            {title: '产品类型', key: jsonData.product_type},
            {title: '借款类型', key: jsonData.loantype_str},
            {title: '借款金额', key: jsonData.payment_loanmny_str},
            {title: '综合费率', key: jsonData.payment_rate_str},
            {title: '借款期限', key: jsonData.loanperiodstr},
            {title: '用款时间', key: jsonData.use_time_str},
            {title: '状态', key: jsonData.status_str},
            {title: '放款日期', key: jsonData.loan_time},
            {title: '借款用途', key: jsonData.remarks},
        ]
        if (carData.length > 0) {

            let tempCarDate = [];

            carData.map((item) => {

                tempCarDate.push(
                    {
                        autoid: item.auto_id,
                        model_name: item.model_name,
                        state: item.status_str,
                        order: item.frame_number,
                        price: item.lend_mny,//放款额
                        plate_number: item.plate_number,//车牌号
                        loan_number: item.loan_number,
                    }
                )
            })
            dataSource['section2'] = tempCarDate;
        }

        return dataSource;
    }
    getButtonStyleWithTitle = (title) => {

        switch (title) {

            case '取消借款':
                return styles.cancelButton
            case '签署合同':
                return styles.controlButton
            case '查看合同':
                return styles.cancelButton
            case '申请展期':
                return styles.controlButton
            case '已取消借款':
                return styles.canceledButton
            case '资金方签署中':
                return styles.cancelButton
            default:
                return styles.cancelButton

        }

    }
    modifyLengNum = (callback) => {

        if (controlCode.changeMoney !== '') {
            let maps = {
                api: apis.CARLOAN_SET_APPLY_MNY,
                loan_code: this.props.loanNumber,
                loan_mny: controlCode.changeMoney,
            };

            callback(false);
            this.props.showModal(true);
            request(apis.FINANCE, 'Post', maps)
                .then((response) => {
                        this.props.showModal(false);
                        this.change.setModelVisible(true)
                    },
                    (error) => {
                        this.props.showModal(false);
                        this.props.showToast(error.mjson.msg);
                    });

        }
    }


    controsButtonClick = (title) => {

        if (title === '取消借款') {
            this.canleAlert.setModelVisible(true)
        } else if (title === '签署合同') {
            this.toNextPage({
                name: 'ContractInfoScene',
                component: ContractInfoScene,
                params: {
                    loan_code: this.props.loanNumber, showButton: true, callbackfresh: () => {
                        this.initFinish();
                        this.props.backRefresh();
                    }
                }
            });
        } else if (title === '查看合同') {
            this.toNextPage({
                name: 'ContractInfoScene',
                component: ContractInfoScene,
                params: {loan_code: this.props.loanNumber, showButton: false}
            });
        } else if (title === '资金方签署中') {
            this.toNextPage({
                name: 'ContractInfoScene',
                component: ContractInfoScene,
                params: {loan_code: this.props.loanNumber, showButton: false}
            });
        }
    }


    //获取不同页面的颜色
    getStyle = (state) => {

        switch (state) {
            case '1':
                return PAGECOLOR.COLORB3
                break;
            case '2':
                return PAGECOLOR.COLORB0
                break;
            default:
                return PAGECOLOR.COLORA1
        }
    }
    getControlTitleblob = (stateCode, extendCode) => {

        if (stateCode !== '' && extendCode !== '') {

            let tempTitle = []
            if (stateCode === '8') {
                tempTitle = ['资金方签署中']
            } else if (stateCode === '1') {
                tempTitle = ['取消借款']
            } else if (stateCode === '2') {
                tempTitle = ['签署合同', '取消借款']
            }
            else if (stateCode === '2') {
                tempTitle = ['已取消借款']
            }
            else if (parseInt(stateCode) > 2 && stateCode !== '5') {
                tempTitle = ['查看合同']
            } else if (stateCode == '5') {
                if (parseInt(extendCode) === '1') {
                    tempTitle = ['查看合同', '申请展期']
                } else {
                    tempTitle = ['查看合同']
                }
            }

            return tempTitle;
        }
    }
    renderRow = (rowData, sectionID, rowId, highlightRow) => {

        let Color = this.getStyle(controlCode.stateCode);
        if (sectionID === 'section2') {
            return <LendCarItemCell onPress={()=>{}} carName={rowData.model_name} orderNum={rowData.loan_number}
                                    orderState={rowData.state} price={rowData.price}/>
        }
        return (
            <CommnetListItem textStyle={rowData.title === '状态' ? {color: Color} : null} leftTitle={rowData.title}
                             showValue={rowData.key}/>
        );
    }
    renderSectionHeader = (sectionData, sectionID) => {
        return (

            <View style={[sectionID !== 'section1' && {backgroundColor: '#f0eff5', height: 20}]}>
            </View>
        )

    }
    renderSeparator = (sectionID, rowId, adjacentRowHighlighted) => {

        let separtrorHegigth = 1;
        if (rowId === '2' || rowId === '6' || rowId === '7') {
            separtrorHegigth = 10;
        }
        return (
            <View key={`${sectionID}-${rowId}`} style={{
                height:adjacentRowHighlighted?2:separtrorHegigth,
                backgroundColor:PAGECOLOR.COLORA3
            }}>
            </View>
        )
    }
    cancleLoad = (setModelVis) => {

        setModelVis(false);
        this.props.showModal(true);

        let maps = {
            api: apis.CARLOAN_CANCEL_LOAN,
            loan_code: this.props.loanNumber
        }
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {

                    this.props.showModal(false);
                    this.successCancle.setModelVisible(true)
                },
                (error) => {
                    this.props.showModal(false);
                    if (error.mycode != -300 || error.mycode != -500) {

                        this.props.showToast(error.mjson.msg);
                    } else {

                        this.props.showToast('服务器连接有问题')
                    }


                });
    }


    render() {
        if (this.state.renderPlaceholderOnly !== STATECODE.loadSuccess) {
            return (
                <View style={styles.container}>
                    {this.loadView()}
                    <AllNavigationView title='借款详情' backIconClick={()=>{
                        this.backPage();
                    }}/>

                </View>);
        }

        let tempButtons = [];
        let tempButtonTitles = this.getControlTitleblob(controlCode.stateCode, controlCode.extendCode);

        tempButtonTitles.map((item) => {
                tempButtons.push(<CommenButton buttonStyle={this.getButtonStyleWithTitle(item)}
                                               textStyle={styles.buttontextStyle}
                                               onPress={()=>{this.controsButtonClick(item)}}
                                               title={item}
                                               key={item}
                />)
            }
        )
        return (

            <View style={commnetStyle.container}>

                <ListView
                    removeClippedSubviews={false}
                    style={commnetStyle.ListWarp}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderSectionHeader={this.renderSectionHeader}
                    renderSeparator={this.renderSeparator}
                />

                <View
                    style={[commnetStyle.bottomWarp,{flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}]}>
                    {tempButtons}
                </View>
                <ModifyBorrowing ref={(model)=>{this.modifyb=model}}
                                 onchangeText={(text)=>{controlCode.changeMoney=text}}
                                 minLend={controlCode.minLend}
                                 maxLend={controlCode.maxLend}
                                 confimClick={this.modifyLengNum}
                                 cancleClick={(callback)=>{callback(false)}}/>
                <LendSuccessAlert ref={(lend)=>{this.change=lend}}
                                  confimClick={()=>{this.props.backRefresh();this.backPage()}} title='修改成功'
                                  subtitle='恭喜您修改借款成功'/>
                <ModalAlert title='取消借款' subtitle="您确定要取消借款吗" ref={(cancle)=>{this.canleAlert=cancle}}
                            confimClick={this.cancleLoad} cancleClick={(setmodilVis)=>{setmodilVis(false)}}/>
                <LendSuccessAlert ref={(canleS)=>{this.successCancle=canleS}}
                                  confimClick={()=>{this.props.backRefresh();this.backPage()}} title='取消成功'
                                  subtitle='取消借款成功'/>
                <AllNavigationView
                    title="借款详情"
                    backIconClick={this.backPage}
                    renderRihtFootView={()=>{

                        if(controlCode.stateCode==='1'){

                            return (<ComentImageButton btnStyle={styles.imageButton} ImgSource={require('../../../image/financeImages/modif.png')} onPress={()=>{this.modifyb.setModelVisible(true)}}/>)
                        }
                        return null;

                    }}
                />
            </View>

        );
    }

}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        backgroundColor: PAGECOLOR.COLORA3
    },
    buttonStyle: {

        height: adapeSize(44),
        backgroundColor: '#05c5c2',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: adapeSize(1),
        width: width,
    },
    textStyle: {

        fontSize: fontadapeSize(15),
        color: '#FFFFFF'
    },
    cancelButton: {

        flex: 1,
        backgroundColor: PAGECOLOR.COLORA2,
        height: adapeSize(44),
        justifyContent: 'center'
    },
    canceledButton: {

        flex: 1,
        height: adapeSize(44),
        backgroundColor: PAGECOLOR.COLORA1,
        justifyContent: 'center'

    },
    controlButton: {
        flex: 1,
        height: adapeSize(44),
        backgroundColor: PAGECOLOR.COLORB0,
        justifyContent: 'center'
    },

    buttontextStyle: {

        fontSize: fontadapeSize(15),
        color: 'white',
        textAlign: 'center',
    }

});


