import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    InteractionManager,
    ListView,
    PixelRatio,
    TextInput,
    Image,
    NativeModules
} from "react-native";
import BaseComponent from "../../component/BaseComponent";
import NavigationBar from "../../component/NavigationBar";
import * as FontAndColor from "../../constant/FontAndColor";
import PixelUtil from "../../utils/PixelUtils";
import MyButton from "../../component/MyButton";
import {request} from "../../utils/RequestUtil";
import * as AppUrls from "../../constant/appUrls";
import PurchasePickerItem from "../component/PurchasePickerItem";
import DeviceNumber from './DeviceNumber';
import WebScene from '../../main/WebScene';
let results = [];
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Pixel = new PixelUtil();
var onePT = 1 / PixelRatio.get(); //一个像素
var Platform = require('Platform');
let childItems = [];
export default class OBDDevice extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            renderPlaceholderOnly: true,
            values: "",//输入框输入内容
            obd_number: "",
            boundState: "未检测",
            source: {},
        };
        this.bind_type = 1;
    }

    componentWillUnmount() {
        results = [];
        childItems = [];
    }

    initFinish = () => {
        if (this.props.fromScene == 'DDApplyLendScene') {

        } else {
            this.getPurchaAutoPicCate();
        }
    }

    render() {
        if (this.state.renderPlaceholderOnly) {
            return (
                <TouchableWithoutFeedback >
                    <View style={styles.container}>
                        {this._topView()}
                        <View style={{
                            width: width,
                            height: Pixel.getPixel(1),
                            flex: 1
                        }}/>
                        <MyButton buttonType={MyButton.TEXTBUTTON}
                                  content={'完成'}
                                  parentStyle={this.state.boundState == '已绑定' ? styles.loginBtnStyle : styles.loginBtnEnStyle}
                                  childStyle={styles.loginButtonTextStyle}
                                  mOnPress={() => {
                                      if (this.state.boundState == '已绑定') {
                                          this.submit();
                                      }
                                  }}/>
                    </View>
                </TouchableWithoutFeedback>);
        } else {
            return (
                <View style={styles.container}>
                    {this._topView()}
                    <View style={{backgroundColor: FontAndColor.COLORA4, width: width, height: Pixel.getPixel(1)}}/>
                    <View style={{
                        width: width,
                        flexDirection: 'column',
                        flex: 1,
                        marginTop: Pixel.getPixel(15)
                    }}>
                        {
                            this.state.source ?
                                <ListView
                                    removeClippedSubviews={false}
                                    dataSource={this.state.source}
                                    renderRow={this._renderRow}
                                    renderSeparator={this._renderSeparator}/>
                                : null
                        }

                    </View>
                    <MyButton buttonType={MyButton.TEXTBUTTON}
                              content={'完成'}
                              parentStyle={this.state.boundState == '已绑定' ? styles.loginBtnStyle : styles.loginBtnEnStyle}
                              childStyle={styles.loginButtonTextStyle}
                              mOnPress={() => {
                                  if (this.state.boundState == '已绑定') {
                                      this.submit();
                                  }
                              }}/>
                </View>
            );
        }
    }

    _topView = () => {
        return (
            <View>
                <NavigationBar
                    leftImageShow={true}
                    leftTextShow={false}
                    centerText={"OBD设备"}
                    rightText={"安装说明"}
                    rightTextCallBack={() => {
                        this.toNextPage({
                            name: 'WebScene',
                            component: WebScene,
                            params: {webUrl: "http://h5.bms.dycd.com/installation.html"}
                        })
                    }}
                    leftImageCallBack={this.backPage}/>

                <View style={{
                    width: width,
                    height: Pixel.getPixel(57),
                    flexDirection: 'row',
                    backgroundColor: '#FFF8EA',
                    paddingLeft: Pixel.getPixel(15),
                    paddingRight: Pixel.getPixel(15),
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image
                        style={{
                            width: Pixel.getPixel(18),
                            height: Pixel.getPixel(18),
                            marginTop: Pixel.getPixel(-13)
                        }}
                        source={require('./../../../image/login/tanhao.png')}/>

                    <Text allowFontScaling={false}  style={{
                        flex: 1,
                        color: FontAndColor.COLORB2,
                        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
                        marginLeft: Pixel.getPixel(15),
                        fontWeight: 'bold'
                    }}>提示：<Text allowFontScaling={false}  style={{fontWeight: 'normal'}}>请将OBD设备安装后进行检测，绑定失败或2015年以前的车请进行手动绑定。</Text></Text>
                </View>
                <View style={{
                    marginTop: Pixel.getPixel(10),
                    paddingLeft: Pixel.getPixel(15),
                    paddingRight: Pixel.getPixel(15),
                    backgroundColor: '#ffffff',
                    width: width,
                    height: Pixel.getPixel(44),
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Text allowFontScaling={false}  style={{
                        color: FontAndColor.COLORA0,
                        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT28),
                    }}>绑定状态</Text>
                    <Text allowFontScaling={false}
                          style={this.props.carData.obd_bind_status == "1" ? styles.boundSuccessStyle :
                              this.state.boundState == "已绑定" ? styles.boundSuccessStyle : styles.boundStateStyle }>
                        {this.props.carData.obd_bind_status == "1" ? "已绑定" : this.state.boundState}
                    </Text>
                </View>
                <View style={{backgroundColor: FontAndColor.COLORA4, width: width, height: Pixel.getPixel(1)}}/>
                <View style={{
                    paddingLeft: Pixel.getPixel(15),
                    paddingRight: Pixel.getPixel(15),
                    backgroundColor: '#ffffff',
                    width: width,
                    height: Pixel.getPixel(44),
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Text allowFontScaling={false}  style={{
                        color: FontAndColor.COLORA0,
                        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT28),
                    }}>设备号</Text>
                    {
                        this.props.carData.obd_bind_status == "1" ? <Text allowFontScaling={false}  style={{
                                color: FontAndColor.COLORA0,
                                fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT30),
                                textAlign: 'right',
                                flex: 1
                            }}>{this.props.carData.obd_number}</Text> :
                            this.state.obd_number ?
                                <Text allowFontScaling={false}  style={{
                                    color: FontAndColor.COLORA0,
                                    fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT30),
                                    textAlign: 'right',
                                    flex: 1
                                }}>{this.state.obd_number}</Text>
                                :
                                <Text allowFontScaling={false}  style={{
                                    color: FontAndColor.COLORA1,
                                    fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT30),
                                    textAlign: 'right',
                                    flex: 1
                                }}>请输入</Text>
                    }

                </View>
                <View style={{backgroundColor: FontAndColor.COLORA4, width: width, height: Pixel.getPixel(1)}}/>
                <View style={{
                    paddingLeft: Pixel.getPixel(15),
                    paddingRight: Pixel.getPixel(15),
                    backgroundColor: '#ffffff',
                    width: width,
                    height: Pixel.getPixel(70),
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <View style={{flex: 1}}/>
                    <MyButton buttonType={MyButton.TEXTBUTTON} content="检测"
                              parentStyle={this.state.boundState == '已绑定' ? styles.buttonSelectStyle : styles.buttonStyle}
                              childStyle={this.state.boundState == '已绑定' ? styles.buttonTextSelectStyle : styles.buttonTextStyle  }
                              mOnPress={() => {
                                  this.checkOBD(this.bind_type);
                              }}/>
                    <View style={{width: Pixel.getPixel(22)}}/>
                    <MyButton buttonType={MyButton.TEXTBUTTON} content="手动绑定" parentStyle={styles.buttonStyle}
                              childStyle={styles.buttonTextStyle} mOnPress={() => {
                        NativeModules.QrScan.scan().then((data) => {
                            console.log(data)
                            if (data.scan_hand == "input") {
                                this.toNextPage({
                                    name: 'DeviceNumber',
                                    component: DeviceNumber,
                                    params: {
                                        callBack: (obd_number) => {
                                            if (obd_number != '') {
                                                this.setState({
                                                    obd_number: obd_number,
                                                    boundState: '未检测',
                                                });
                                                this.bind_type = 2;
                                            }
                                        }
                                    },
                                })
                            } else {
                                this.setState({
                                    obd_number: data.scan_result,
                                    boundState: '未检测',
                                });
                                this.bind_type = 2;
                            }
                        }, (error) => {
                        });
                    }}/>
                </View>
            </View>)

    }


    _renderRow = (movie, sectionId, rowId) => {
        return (
            <PurchasePickerItem results={results} showModal={(value) => {
                this.props.showModal(value)
            }}
                                showToast={(value) => {
                                    this.props.showToast(value)
                                }} items={movie} childList={childItems[rowId]}/>
        )
    }

    _renderSeparator(sectionId, rowId) {
        return (
            <View style={styles.Separator} key={sectionId + rowId}>
            </View>
        )
    }

    // 绑定OBD设备
    submit = () => {
        if (results.length > 0 || (this.props.fromScene == 'DDApplyLendScene')) {
            let maps;
            if (this.props.fromScene == 'DDApplyLendScene') {
                maps = {
                    api: AppUrls.BINDOBDDDRZ,
                    info_id: this.props.carData.info_id,
                    obd_number: this.state.obd_number,
                };
            } else {
                maps = {
                    api: AppUrls.BINDOBD,
                    bind_type: this.bind_type,
                    file_list: JSON.stringify(results),
                    info_id: this.props.carData.info_id,
                    obd_number: this.state.obd_number,
                };

            }
            this.props.showModal(true);
            request(AppUrls.FINANCE, 'Post', maps)
                .then((response) => {
                        this.props.showModal(false);
                        this.props.showToast("OBD绑定成功");
                        this.props.backRefresh();
                        if (this.props.fromScene == 'DDApplyLendScene') {
                            this.backPage();
                        } else {
                            const navigator = this.props.navigator;
                            if (navigator) {
                                for (let i = 0; i < navigator.getCurrentRoutes().length; i++) {
                                    if (navigator.getCurrentRoutes()[i].name == 'CGDLendScenes') {
                                        navigator.popToRoute(navigator.getCurrentRoutes()[i]);
                                        break;
                                    }
                                }
                            }
                        }
                    }, (error) => {
                        this.props.showModal(false);
                        if (error.mycode == -300 || error.mycode == -500) {
                            this.props.showToast("网络请求失败");
                        } else {
                            this.props.showToast(error.mjson.msg + "");
                        }
                    }
                )
        } else {
            this.props.showToast("照片不能为空");
        }

    }

    // 检测OBD设备号
    checkOBD = (bind_type) => {
        let maps;
        if (bind_type == 1) {
            maps = {
                api: AppUrls.AUTODETECTOBD,
                frame_number: this.props.carData.frame_number,
            };
        } else {
            maps = {
                api: AppUrls.AUTODETECTOBD,
                frame_number: this.props.carData.frame_number,
                obd_number: this.state.obd_number,
            };
        }
        this.props.showModal(true);
        this.props.carData.obd_bind_status = 0;
        request(AppUrls.FINANCE, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    this.props.showToast("OBD检测成功");
                    this.setState({
                        boundState: '已绑定',
                        obd_number: response.mjson.data.obd_number,
                    });
                }, (error) => {
                    this.props.showModal(false);
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast("网络请求失败");
                    } else {
                        this.setState({
                            boundState: '未绑定',
                        });
                        this.props.showToast(error.mjson.msg + "");
                    }
                }
            )
    }

    // 获取采购贷车辆照片分类
    getPurchaAutoPicCate = () => {
        let maps = {
            api: AppUrls.GETPURCHAAUTOPICCATE,
            source_type: '3',
            archives_status: '2',
        };
        request(AppUrls.FINANCE, 'Post', maps)
            .then((response) => {
                    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    for (let i = 0; i < response.mjson.data.cate_list.length; i++) {
                        childItems.push({
                            code: response.mjson.data.cate_list[i].code,
                            id: response.mjson.data.cate_list[i].id,
                            list: []
                        });
                    }
                    if (this.props.carData.obd_bind_status == '1') {
                        for (let i = 0; i < childItems.length; i++) {
                            for (let j = 0; j < this.props.carData.file_list.length; j++) {
                                if (childItems[i].code == this.props.carData.file_list[j].code) {
                                    childItems[i].list.push({
                                        url: this.props.carData.file_list[j].icon,
                                        fileId: this.props.carData.file_list[j].file_id
                                    });
                                    results.push({
                                        code: this.props.carData.file_list[j].code,
                                        code_id: this.props.carData.file_list[j].id,
                                        file_id: this.props.carData.file_list[j].file_id
                                    });
                                }
                            }
                        }
                    }
                    this.setState({
                        source: ds.cloneWithRows(response.mjson.data.cate_list),
                        renderPlaceholderOnly: false
                    });
                }, (error) => {
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast("网络请求失败");
                    } else {
                        this.props.showToast(error.mjson.msg + "");
                    }
                }
            )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: FontAndColor.THEME_BACKGROUND_COLOR,
        alignItems: 'center'
    },
    buttonTextStyle: {
        color: FontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },
    buttonStyle: {
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(32),
        backgroundColor: FontAndColor.NAVI_BAR_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonStyle: {
        borderColor: FontAndColor.NAVI_BAR_COLOR,
        borderWidth: 1,
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(32),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Pixel.getPixel(12),
        marginBottom: Pixel.getPixel(12),
    },
    buttonTextStyle: {
        fontSize: Pixel.getFontPixel(18),
        color: FontAndColor.NAVI_BAR_COLOR,
    },
    buttonSelectStyle: {
        borderColor: FontAndColor.COLORA2,
        borderWidth: 1,
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(32),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Pixel.getPixel(12),
        marginBottom: Pixel.getPixel(12),
    },
    buttonTextSelectStyle: {
        fontSize: Pixel.getFontPixel(18),
        color: FontAndColor.COLORA2,
    },
    loginBtnStyle: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: FontAndColor.NAVI_BAR_COLOR,
        marginTop: Pixel.getPixel(20),
        marginBottom: Pixel.getPixel(15),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
    },
    loginBtnEnStyle: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: "#69DCDA",
        marginTop: Pixel.getPixel(20),
        marginBottom: Pixel.getPixel(15),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
    },
    loginButtonTextStyle: {
        color: FontAndColor.THEME_BACKGROUND_COLOR,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },
    boundStateStyle: {
        flex: 1,
        color: FontAndColor.COLORB2,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT),
        textAlign: 'right'
    },
    boundSuccessStyle: {
        flex: 1,
        color: FontAndColor.NAVI_BAR_COLOR,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT),
        textAlign: 'right'
    },
    Separator: {
        backgroundColor: FontAndColor.THEME_BACKGROUND_COLOR,
        height: Pixel.getPixel(10),
    },
})
