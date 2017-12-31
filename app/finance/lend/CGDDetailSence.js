import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Image,
    Text
} from 'react-native';
import AllNavigatior from '../../component/AllNavigationView'
import {CommnetListItem, CommentHandItem, commnetStyle, CommenButton, CGDCarItems} from './component/ComponentBlob'
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
import {request} from '../../utils/RequestUtil'
import *as apis from '../../constant/appUrls'
import ImagePageView from 'react-native-viewpager'
import AmountConfirm from './AmountConfirm';
import CGDCarDetailScenes from './CGDCarDetailScenes'
import PurchaseLoanStatusScene from './PurchaseLoanStatusScene'
import {LendSuccessAlert, ModalAlert} from './component/ModelComponent'
let ControlState = [];
let loan_code;
import ContractInfoScene from './ContractInfoScene';

export default class OrderCarDetailScene extends BaseComponent {

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
            dataSource: ds.cloneWithRowsAndSections(this.titleNameBlob({}, [])),
            renderPlaceholderOnly: STATECODE.loading,
        }
        OrderHanderState = [];
    }

    initFinish() {
        this.getLendInfo();
    }

    getLendInfo = () => {

        let maps = {
            api: apis.GET_APPLY_INFO,
            loan_code: this.props.loanNumber
        };

        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                    let tempjson = response.mjson.data;
                    ControlState = this.confimOrderState(parseInt(tempjson.payment_status), parseInt(tempjson.payment_schedule))

                    this.getCarListInfo(tempjson);
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
    getCarListInfo = (lendInfo) => {
        let maps = {
            api: apis.AUTOLIST,
            payment_number: this.props.loanNumber
        };
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                    let tempjson = response.mjson.data;
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.titleNameBlob(lendInfo, tempjson.list)),
                        renderPlaceholderOnly: STATECODE.loadSuccess
                    })
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
    carItemClick = (carId) => {

        navigatorParams = {
            name: 'CGDCarDetailScenes',
            component: CGDCarDetailScenes,
            params: {
                carId: carId
            }
        }
        this.toNextPage(navigatorParams);
    }
    canclelend = () => {

        let maps = {
            api: apis.CANCEL_LOAN,
            loan_code: this.props.loanNumber
        };
        this.props.showModal(true);
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    this.cancleSuccess.setModelVisible(true);
                },
                (error) => {
                    this.props.showModal(false)
                    if (error.mycode != -300 || error.mycode != -500) {
                        this.props.showToast(error.mjson.msg);

                    } else {

                        this.props.showToast('服务器连接有问题')
                    }
                });

    }


    titleNameBlob = (jsonData, carData) => {
        loan_code = jsonData.loan_code;
        let dataSource = {};
        let section1 = [
            {title: '借款单号', key: jsonData.loan_code},
            {title: '状态', key: jsonData.payment_status_str},
            {title: '产品类型', key: jsonData.product_type},
            //{title: '借款类型', key: '---'},
            {title: '借款金额', key: jsonData.payment_loanmny_str},
            {title: '借款费率', key: jsonData.payment_rate_str},
            {title: '借款期限', key: jsonData.loanperiodstr},
            {title: '用款时间', key: jsonData.use_time_str},
        ]
        dataSource['section1'] = section1
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
                        model_name: item.model_name,
                        init_reg: item.init_reg,
                        base_id: item.base_id,
                        mileage: item.mileage,
                        invoice_upload_status: item.invoice_upload_status,
                        obd_audit_status: item.obd_audit_status,
                        invoice_audit_status: item.invoice_audit_status
                    }
                )
                dataSource['section2'] = tempCarDate;
            })
        }
        return dataSource;
    }

    /**
     * from @zhaojian
     *
     * 根据状态给予对应名称
     **/
    confimOrderState = (state, isComplete, status) => {
        let NameBlobs = [];
        if (status == '8') {
            NameBlobs = ['资金方签署中']
        } else {
            if (state > 0 && state <= 32 || state == 50) {
                NameBlobs = ['取消借款']
            } else if (state == 33) {
                NameBlobs = ['取消借款', '确认金额']
            } else if (state === 35) {
                NameBlobs = ['取消借款', '签署合同']
            } else if (state == 40 || state == 42 || isComplete == 4) {
                NameBlobs = ['查看合同']
            } else if (state == 41) {
                NameBlobs = ['取消借款', '确认金额', '查看合同']
            }
        }
        return NameBlobs;
    }


    renderRow = (rowData, sectionID, rowId, highlightRow) => {

        if (sectionID === 'section1') {

            if (rowData.title === '状态') {

                return (
                    <CommentHandItem warpstyle={{height: adapeSize(44)}} leftTitle={rowData.title}
                                     showValue={rowData.key} textStyle={{color: PAGECOLOR.COLORA1}} handel={() => {

                        navigatorParams = {
                            name: 'PurchaseLoanStatusScene',
                            component: PurchaseLoanStatusScene,
                            params: {
                                loanNumber: this.props.loanNumber
                            }
                        }
                        this.toNextPage(navigatorParams);

                    }}/>
                )
            }
            return (
                <CommnetListItem leftTitle={rowData.title} showValue={rowData.key}/>
            );

        }
        if (sectionID === 'section2') {
            //
            return (<CGDCarItems url={rowData.icon} title={rowData.model_name}
                                 invoice_upload_status={rowData.invoice_upload_status}
                                 obd_bind_status={rowData.obd_bind_status}
                                 obd_audit_status={rowData.obd_audit_status}
                                 invoice_audit_status={rowData.invoice_audit_status}
                                 date={rowData.init_reg+' / '+rowData.mileage+'万公里'} onPress={() => {
                this.carItemClick(rowData.info_id);
            }}/>)
        }

    }
    renderSectionHeader = (sectionData, sectionID) => {

        if (sectionID === 'section2') {

            return (
                <View style={styles.section2Style}>
                    <Text allowFontScaling={false} style={styles.sectionText}>车辆信息</Text>
                </View>
            )
        }
        return (
            <View style={styles.sectionStyle}>
            </View>
        )
    }
    renderSeparator = (sectionID, rowId, adjacentRowHighlighted) => {

        let separtrorHegigth = 1;
        if (rowId === '1') {
            separtrorHegigth = 10;
        }
        return (
            <View key={`${sectionID}-${rowId}`} style={{
                height: adjacentRowHighlighted ? 2 : separtrorHegigth,
                backgroundColor: PAGECOLOR.COLORA3
            }}>
            </View>
        )
    }
    buttonClick = (title) => {
        if (title == '确认金额') {
            this.toNextPage({
                name: 'AmountConfirm',
                component: AmountConfirm,
                params: {
                    loan_code: loan_code,
                    callback: () => {
                        this.getLendInfo();
                    }
                },
            })
        } else if (title == '签署合同') {
            this.toNextPage({
                name: 'ContractInfoScene', component: ContractInfoScene,
                params: {
                    loan_code: loan_code, showButton: true, callbackfresh: () => {
                        this.initFinish();
                        this.props.backRefresh();
                    }
                }
            })
        } else if (title == '查看合同') {
            this.toNextPage({
                name: 'ContractInfoScene', component: ContractInfoScene,
                params: {loan_code: loan_code, showButton: false}
            })
        } else if (title == '资金方签署中') {
            this.toNextPage({
                name: 'ContractInfoScene', component: ContractInfoScene,
                params: {loan_code: loan_code, showButton: false}
            })
        } else if (title == '取消借款') {

            this.cancle.setModelVisible(true);
        }
    }


    render() {

        if (this.state.renderPlaceholderOnly !== STATECODE.loadSuccess) {
            return ( <View style={styles.container}>
                {this.loadView()}
                <AllNavigatior title='借款详情' backIconClick={() => {
                    this.backPage();
                }}/>

            </View>);
        }

        let tempBlobs = [];
        if (ControlState.length > 0) {
            let lengegth = ControlState.length - 1
            ControlState.map((item, index) => {

                tempBlobs.push(<CommenButton key={item}
                                             textStyle={index == lengegth ? {color: 'white'} : {color: PAGECOLOR.COLORB0}}
                                             buttonStyle={index == lengegth ? styles.buttonStyleFill : styles.buttonStyleNotFill}
                                             onPress={() => {

                                                 this.buttonClick(item);
                                             }} title={item}/>)
            })

        }
        return (

            <View style={styles.container}>
                <ListView
                    removeClippedSubviews={false}
                    style={commnetStyle.ListWarp}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    renderSectionHeader={this.renderSectionHeader}
                />
                <View style={[commnetStyle.bottomWarp, styles.buttonsFlex]}>{tempBlobs}</View>
                <AllNavigationView title='借款详情' backIconClick={() => {
                    this.backPage();
                }}/>

                <ModalAlert ref={(deleteCar)=>{this.cancle=deleteCar}} title='取消借款' subtitle='您确定要取消借款' confimClick={(setHide)=>{
                    setHide(false);
                    this.canclelend();
                }} cancleClick={(setHide)=>{setHide(false)}}/>
                <LendSuccessAlert title="取消成功" subtitle='恭喜您取消成功' ref={(success)=>{this.cancleSuccess=success}}
                                  confimClick={()=>{
                                      this.props.backRefresh();
                                      this.backToTop()
                                  }}/>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        backgroundColor: PAGECOLOR.COLORA3
    },
    ImageBackView: {
        backgroundColor: 'white'

    },
    buttonsFlex: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row'

    },

    thumbTitle: {
        marginTop: adapeSize(16),
        marginBottom: adapeSize(12),
        fontSize: fontadapeSize(15),
        marginLeft: adapeSize(14),
    },
    thumb: {
        backgroundColor: 'white',
        height: adapeSize(250),
        width: width - adapeSize(24),
        marginLeft: adapeSize(14),
        marginRight: adapeSize(14)
    },
    sectionStyle: {
        backgroundColor: PAGECOLOR.COLORA3,
        height: adapeSize(10),
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    section2Style: {

        backgroundColor: PAGECOLOR.COLORA3,
        height: adapeSize(30),
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    sectionText: {

        marginLeft: adapeSize(14),
        color: PAGECOLOR.COLORA2
    },
    buttonStyleFill: {

        height: adapeSize(32),
        backgroundColor: PAGECOLOR.COLORB0,
        marginRight: adapeSize(15),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        borderRadius: 5,
        width: adapeSize(80)
    },
    buttonStyleNotFill: {

        height: adapeSize(32),
        backgroundColor: 'white',
        marginRight: adapeSize(15),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        borderRadius: 5,
        width: adapeSize(80),
        borderColor: PAGECOLOR.COLORB0,
        borderWidth: 1


    },

})