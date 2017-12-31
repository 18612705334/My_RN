/**
 * Created by zhengnan on 2017/3/23.
 */

import React, {Component} from 'react';
import {

    StyleSheet,
    View,
    ListView,
    Text,
    TouchableOpacity,
    Dimensions,
    Image

} from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import NavigatorView from  '../../component/AllNavigationView';
import *as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';
const Pixel = new PixelUtil();
import {request} from "../../utils/RequestUtil";
import * as AppUrls from "../../constant/appUrls";
import CGDLendScenes from './CGDLendScenes'

var ScreenWidth = Dimensions.get('window').width;
let isCarinvoice = 0;
let isOBD = 0;

export  default  class CGDSelectPatternScene extends BaseComponent {


    initFinish = () => {

        isCarinvoice = 1;
        isOBD = 1;
        this.loadData();

    }

    loadData = () => {

        this.props.showModal(true);
        this.setState({

            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            renderPlaceholderOnly: 'success',

        });
        request(AppUrls.FINANCE, 'post', {

            obd_status: isOBD,
            invoice_status: isCarinvoice,
            api: AppUrls.APPLY_PATTERN_LIST,

        }).then((response) => {

            this.props.showModal(false);
            console.log(response.mjson);
            if (response.mjson.code == 1) {

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(response.mjson.data),
                });

            } else {
                this.props.showToast(response.mjson.msg);
            }

        }, (error) => {

            this.props.showModal(false);
            this.setState({
                renderPlaceholderOnly: 'error',

            });

        });
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds,
            renderPlaceholderOnly: 'success',
        };
    }


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={{flex: 1, backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR}}>
                    {this.loadView()}
                    <NavigatorView title='选择模式' backIconClick={() => {
                        this.backPage()
                    }}/>
                </View>)
        }

        return (
            <View style={styles.rootContainer}>
                <ListView style={{marginBottom:Pixel.getPixel(44)}}
                          dataSource={this.state.dataSource}
                          removeClippedSubviews={false}
                          renderRow={this.renderRow}
                          renderHeader={this.renderHeadView}
                />
                <TouchableOpacity style={styles.footButton} onPress={() => {
                    let colorParams = {
                        name: 'CGDLendScenes',
                        component: CGDLendScenes,
                        params: {
                            isCarinvoice: isCarinvoice,
                            isOBD: isOBD,
                            customerName: this.props.customerName,
                            backRefresh: () => {
                                this.props.backRefresh();
                            }
                        }
                    };
                    this.toNextPage(colorParams);
                }}>
                    <Text allowFontScaling={false}  style={styles.footButtonText}>确定</Text>
                </TouchableOpacity>
                <NavigatorView title='选择模式' backIconClick={() => {
                    this.backPage()
                }}/>
            </View>
        )
    }

    renderRow = (rowData) => {

        return (
            <CGDSelectPatternCell cellData={rowData}/>
        )
    };

    renderHeadView = () => {
        return (
            <View style={styles.headViewContainer}>
                <View style={styles.headViewHintView}>
                    <Image style={{width: 20, height: 20}}
                           source={require('../../../image/financeImages/hintImage.png')}/>
                    <Text allowFontScaling={false}  style={styles.headViewHintText}>模式一旦选择将不可变更</Text>
                </View>
                <CGDSelectView title="二手车交易发票" selectClick={(btnType) => {
                    isCarinvoice = btnType;
                    this.loadData();
                }}/>
                <CGDSelectView title="OBD设备" selectClick={(btnType) => {
                    isOBD = btnType;
                    this.loadData();
                }}/>
                <View style={styles.headViewTitleView}>
                    <Text allowFontScaling={false}  style={styles.headViewTitleText}>该模式收费标准</Text>
                    <Text allowFontScaling={false}  style={styles.headViewTitleSubText}>（放款时按每台车融资额砍头收取）</Text>
                </View>
            </View>
        )
    }

}

class CGDSelectView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isConfirm: true,
            currentIndex: 1,
        };
    }

    render() {
        return (
            <View style={styles.headViewSelectView}>
                <View style={styles.headViewSelectLeftView}>
                    <Text allowFontScaling={false}  style={styles.headViewSelectTitle}>{this.props.title}</Text>
                </View>
                <View style={styles.headViewSelectRightView}>
                    <TouchableOpacity onPress={() => {
                        this.selectBtnCilck(1)
                    }}>
                        <View
                            style={[styles.headViewSelectBtn, {marginRight: 10}, this.state.isConfirm && {borderColor: fontAndColor.NAVI_BAR_COLOR}]}>
                            <Text allowFontScaling={false}
                                  style={[styles.headViewSelectBtnText, this.state.isConfirm && {color: fontAndColor.NAVI_BAR_COLOR}]}>有</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.selectBtnCilck(0)
                    }}>
                        <View
                            style={[styles.headViewSelectBtn, !this.state.isConfirm && {borderColor: fontAndColor.NAVI_BAR_COLOR}]}>
                            <Text allowFontScaling={false}
                                  style={[styles.headViewSelectBtnText, !this.state.isConfirm && {color: fontAndColor.NAVI_BAR_COLOR}]}>无</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    selectBtnCilck = (btnType) => {

        if (this.state.currentIndex == btnType) return;
        this.props.selectClick(btnType);
        this.setState({
            currentIndex: btnType,
            isConfirm: !this.state.isConfirm,
        });

    };
}

class CGDSelectPatternCell extends Component {

    render() {
        const {loan_upper, loan_lower, obd_fee, service_fee} = this.props.cellData;

        return (
            <View style={styles.cellContainer}>
                <View style={styles.cellContentView}>
                    <View style={styles.cellContentLeftView}>
                        <Text allowFontScaling={false}
                              style={styles.cellTitleText}>{loan_lower > 0 ? ( loan_lower / 10000 + '-' + loan_upper / 10000 + '万(含)') : (loan_upper / 10000 + '万以下')}</Text>
                    </View>
                    <View style={styles.cellContentRightView}>
                        <View style={styles.cellContentItemView}>
                            <Text allowFontScaling={false}  style={styles.cellContentItemTitle}>采购贷服务费</Text>
                            <Text allowFontScaling={false}  style={styles.cellContentItemText}>{this.carMoneyChange(service_fee)}元</Text>
                        </View>
                        <View style={styles.cellContentItemView}>
                            <Text allowFontScaling={false}  style={styles.cellContentItemTitle}>OBD服务费</Text>
                            <Text allowFontScaling={false}  style={styles.cellContentItemText}>{this.carMoneyChange(obd_fee)}元</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.cellBottomLine}/>
            </View>
        )
    }

    carMoneyChange = (carMoney) => {

        let newCarMoney = parseFloat(carMoney);
        let carMoneyStr = newCarMoney.toFixed(2);
        let moneyArray = carMoneyStr.split(".");

        console.log(carMoney + '/' + newCarMoney + '/' + carMoneyStr + '/' + moneyArray);

        if (moneyArray.length > 1) {
            if (moneyArray[1] > 0) {

                return moneyArray[0] + '.' + moneyArray[1];

            } else {

                return moneyArray[0];
            }

        } else {
            return carMoneyStr;
        }


    }

}

const styles = StyleSheet.create({

    rootContainer: {

        flex: 1,
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
        paddingTop: Pixel.getTitlePixel(64),


    },
    headViewHintView: {
        flexDirection: 'row',
        height: Pixel.getPixel(35),
        alignItems: 'center',
        paddingLeft: Pixel.getPixel(15),
        backgroundColor: fontAndColor.COLORB6,

    },
    headViewHintText: {
        color: fontAndColor.COLORB2,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        marginLeft: Pixel.getPixel(10)
    },
    headViewContainer: {
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
    },
    headViewBottomLine: {
        left: 0,
        right: 0,
        bottom: 0,
        height: StyleSheet.hairlineWidth,
        backgroundColor: fontAndColor.COLORA4,
        position: 'absolute',
    },
    headViewTitleView: {
        flexDirection: 'row',
        paddingLeft: 15,
        alignItems: 'center',
        height: Pixel.getPixel(50),
        backgroundColor: 'white',
        marginTop: Pixel.getPixel(10),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: fontAndColor.COLORA4,
    },
    headViewTitleText: {
        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
    },
    headViewTitleSubText: {
        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
    },
    headViewSelectView: {
        height: Pixel.getPixel(50),
        backgroundColor: 'white',
        flexDirection: 'row',
        marginTop: Pixel.getPixel(10),
    },
    headViewSelectLeftView: {
        width: ScreenWidth / 2,
        justifyContent: 'center',
        paddingLeft: Pixel.getPixel(15),
    },
    headViewSelectRightView: {
        flex: 1,
        width: ScreenWidth / 2,
        justifyContent: 'flex-end',
        paddingRight: Pixel.getPixel(15),
        flexDirection: 'row',
        alignItems: 'center',
    },
    headViewSelectTitle: {
        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
        fontWeight: 'bold'
    },
    headViewSelectBtn: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 2,
        borderColor: fontAndColor.COLORA2,
        width: Pixel.getPixel(57),
        height: Pixel.getPixel(27),
        justifyContent: 'center',
        alignItems: 'center',
    },
    headViewSelectBtnText: {
        color: fontAndColor.COLORA2,
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
    },
    cellContainer: {

        flex: 1,
        height: Pixel.getPixel(66),
        backgroundColor: 'white',

    },
    cellBottomLine: {
        left: Pixel.getPixel(15),
        right: Pixel.getPixel(15),
        bottom: 0,
        height: StyleSheet.hairlineWidth,
        backgroundColor: fontAndColor.COLORA4,
        position: 'absolute',

    },
    cellContentView: {

        flex: 1,
        height: Pixel.getPixel(65),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    cellTitleText: {
        color: fontAndColor.COLORA0,
        fontSize: fontAndColor.BUTTONFONT30,
    },
    cellContentLeftView: {
        justifyContent: 'center',
        paddingLeft: Pixel.getPixel(15),
        width: ScreenWidth / 2
    },
    cellContentRightView: {

        justifyContent: 'space-between',
        width: ScreenWidth / 2,
        paddingRight: Pixel.getPixel(15),
    },

    cellContentItemView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2.5,
        marginTop: 2.5,

    },
    cellContentItemTitle: {

        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
        color: fontAndColor.COLORA1,

    },
    cellContentItemText: {
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
        color: fontAndColor.COLORA0,
    },
    footButton: {

        left: 0,
        right: 0,
        bottom: 0,
        height: Pixel.getPixel(44),
        backgroundColor: fontAndColor.NAVI_BAR_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    footButtonText: {

        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
    },

});