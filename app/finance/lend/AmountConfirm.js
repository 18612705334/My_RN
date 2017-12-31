import React, {Component,} from "react";
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
} from "react-native";
import BaseComponent from "../../component/BaseComponent";
import NavigationBar from "../../component/NavigationBar";
import * as FontAndColor from "../../constant/FontAndColor";
import PixelUtil from "../../utils/PixelUtils";
import MyButton from '../../component/MyButton';
import * as AppUrls from "../../constant/appUrls";
import {request} from "../../utils/RequestUtil";

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Pixel = new PixelUtil();
var onePT = 1 / PixelRatio.get(); //一个像素
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class AmountConfirm extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            renderPlaceholderOnly: 'blank',
            values: "",//输入框输入内容
            carNumber: 0,
            totalMoney: 0,
            car_lists: '',
        };
        this.contents = [];
        this.map = new Map();

    }

    initFinish = () => {
        this.getAutoList();
    }

    render() {

        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={{flex: 1, backgroundColor: FontAndColor.COLORA3}}>
                    <NavigationBar
                        leftImageShow={false}
                        leftTextShow={true}
                        leftText={""}
                        centerText={"确认金额"}
                        rightText={""}/>
                    {this.loadView()}
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <NavigationBar
                    leftImageShow={true}
                    leftTextShow={false}
                    centerText={"确认金额"}
                    rightText={"  "}
                    leftImageCallBack={this.backPage}/>

                <View style={{
                    width: width,
                    height: 40,
                    flexDirection: 'row',
                    backgroundColor: '#ffffff',
                    paddingLeft: Pixel.getPixel(15),
                    paddingRight: Pixel.getPixel(15),
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text allowFontScaling={false}  style={{color: FontAndColor.COLORA1, fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT)}}>借款单号</Text>
                    <Text allowFontScaling={false}  style={{
                        flex: 1,
                        textAlign: 'right',
                        color: FontAndColor.COLORA0,
                        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
                    }}>{this.props.loan_code}</Text>
                </View>

                <Text allowFontScaling={false}  style={{
                    color: FontAndColor.COLORA1,
                    fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT),
                    marginLeft: Pixel.getPixel(15),
                    marginTop: Pixel.getPixel(10),
                    marginBottom: Pixel.getPixel(10),
                }}>融资车辆</Text>

                <ListView
                    removeClippedSubviews={false}
                    stickyHeaderIndices={[]}
                    onEndReachedThreshold={1}
                    scrollRenderAheadDistance={1}
                    pageSize={3}
                    contentContainerStyle={styles.listStyle}
                    dataSource={this.state.source}
                    style={{
                        backgroundColor: '#ffffff'
                    }}
                    renderRow={this._renderRow}
                />

                <View style={{
                    width: width,
                    height: Pixel.getPixel(36),
                    backgroundColor: '#fff8ea',
                    flexDirection: 'row',
                    paddingLeft: Pixel.getPixel(15),
                    paddingRight: Pixel.getPixel(15),
                    alignItems: 'center',
                }}>
                    <Text allowFontScaling={false}  style={styles.bottomItemTextStyle}>您采购的</Text>
                    <Text allowFontScaling={false}  style={[styles.bottomItemTextStyle, {fontWeight: 'bold'}]}>{this.state.carNumber}辆</Text>
                    <Text allowFontScaling={false}  style={styles.bottomItemTextStyle}>车辆最高融资为</Text>
                    <Text allowFontScaling={false}  style={[styles.bottomItemTextStyle, {fontWeight: 'bold'}]}>{this.state.totalMoney}万元，</Text>
                    <Text allowFontScaling={false}  style={styles.bottomItemTextStyle}>请确认借款金额。</Text>
                </View>

                <View style={{width: width, height: onePT, backgroundColor: FontAndColor.COLORA4}}/>

                <View style={{
                    width: width,
                    height: Pixel.getPixel(50),
                    backgroundColor: '#ffffff',
                    flexDirection: 'row',
                    paddingLeft: Pixel.getPixel(15),
                    paddingRight: Pixel.getPixel(15),
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT), color: FontAndColor.COLORA0}}>借款金额：</Text>
                    <TextInput
                        ref="inputTexts"
                        underlineColorAndroid={"#00000000"}
                        placeholderTextColor={FontAndColor.COLORA4}
                        placeholder={'0.00'}
                        style={{
                            flex: 1,
                            fontWeight: 'bold',
                            fontSize: Pixel.getFontPixel(22),
                            color: FontAndColor.COLORA0,
                        }}
                        value={this.state.values}
                        onChangeText={(text) => {
                            this.setState({
                                values: text
                            });
                        }}/>
                    <Text allowFontScaling={false}  style={{
                        flex: 2,
                        fontWeight: 'bold',
                        fontSize: Pixel.getFontPixel(22),
                        color: FontAndColor.COLORA0
                    }}>万元</Text>
                    <MyButton buttonType={MyButton.TEXTBUTTON} content="确认" parentStyle={styles.buttonStyle}
                              childStyle={styles.buttonTextStyle} mOnPress={() => {
                        this.makeSure();
                    }}/>
                </View>
            </View>
        );
    }

    _renderRow = (data, sindex, rowID) => {
        return (
            <TouchableOpacity onPress={() => this.finshPage(data, rowID)}>
                <View style={styles.itemStyle}>
                    {typeof(this.map.get(data.info_id)) == 'undefined' ?
                        <Image source={require("./../../../image/login/amou_unchoose.png")}
                               style={styles.itemIconStyle}/>
                        :
                        <Image source={require("./../../../image/login/amou_choose.png")}
                               style={styles.itemIconStyle}/>
                    }
                    <View style={{flex: 1, marginLeft: Pixel.getPixel(15)}}>
                        <Text allowFontScaling={false}  style={styles.itemTextStyle}>{data.model_name}</Text>
                        <Text allowFontScaling={false}  style={[styles.itemTextStyle, {
                            color: FontAndColor.COLORA1,
                            fontSize: FontAndColor.CONTENTFONT
                        }]}>
                            {'初评放款额' + " : "}
                            <Text allowFontScaling={false}  style={{color: FontAndColor.COLORB2, fontSize: FontAndColor.CONTENTFONT}}>
                                {data.first_assess_loan}万
                            </Text>
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

        )
    }

    finshPage = (data, rowID) => {
        if (typeof(this.map.get(data.info_id)) == 'undefined') {
            this.map.set(data.info_id, data);
        } else {
            this.map.delete(data.info_id);
        }
        let money = 0;
        for (let key of this.map.keys()) {
            money = money + this.map.get(key).first_assess_loan;
        }

        let car_lists = "";
        for (let key of this.contents) {
            if (this.map.get(key.info_id) == undefined) {
                car_lists = car_lists + key.info_id + ",";
            }
        }
        this.setState({
            carNumber: this.map.size,
            totalMoney: money,
            car_lists: car_lists,
            source: ds.cloneWithRows(this.contents),
        });
    }


    //  获取采购贷车辆列表
    getAutoList = () => {
        this.setState({renderPlaceholderOnly: 'loading'});
        let maps = {
            api: AppUrls.PURCHAAUTOAUTOLIST,
            payment_number: this.props.loan_code,
        };
        request(AppUrls.FINANCE, 'Post', maps)
            .then((response) => {
                    this.contents = response.mjson.data.list;
                    this.setState({
                        renderPlaceholderOnly: 'success',
                        source: ds.cloneWithRows(this.contents),
                    });
                }, (error) => {
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.setState({
                            renderPlaceholderOnly: 'error',
                        })
                    } else {
                        if (error.mycode == -1) {
                            this.setState({
                                renderPlaceholderOnly: 'null',
                            })
                        } else {
                            this.props.showToast(error.mjson.msg + "");
                            this.setState({
                                renderPlaceholderOnly: 'error',
                            })
                        }
                    }
                }
            )
    }

    //  采购贷确认借款金额
    makeSure = () => {
        if (this.state.values > this.state.totalMoney) {
            this.props.showToast("借款金额不能大于最高融资额");
        } else {
            let maps = {
                car_lists: this.state.car_lists,
                loan_code: this.props.loan_code,
                loan_mny: this.state.values,
                api: AppUrls.ACCOUNTCONFIRM_AMOUNT,
            };
            this.props.showModal(true);
            request(AppUrls.FINANCE, 'Post', maps)
                .then((response) => {
                        this.props.showModal(false);
                        this.props.showToast("确认成功");
                        this.props.callback(),
                            this.backPage();
                    }, (error) => {
                        this.props.showModal(false);
                        if (error.mycode == -300 || error.mycode == -500) {
                            this.props.showToast("网络请求失败");
                        } else {
                            this.props.showToast(error.mjson.msg + "");
                        }
                    }
                )
        }
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: FontAndColor.THEME_BACKGROUND_COLOR,
    },
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: 'white',
        backgroundColor: FontAndColor.THEME_BACKGROUND_COLOR,
    },
    listStyle: {
        // justifyContent: 'flex-start',
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        // alignItems: 'flex-start',
    },
    itemStyle: {
        width: width,
        height: Pixel.getPixel(75),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: Pixel.getPixel(1),
        borderBottomColor: FontAndColor.COLORA4,
        justifyContent: 'center',

    },
    itemIconStyle: {
        width: 25,
        height: 25,
        marginLeft: 15,
        borderRadius: 15,
        paddingTop: 5,
        paddingBottom: 5,
        borderColor: FontAndColor.NAVI_BAR_COLOR,
        borderWidth: Pixel.getPixel(1),
    },
    itemTextStyle: {
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
        color: FontAndColor.COLORA0,
        paddingTop: Pixel.getPixel(2),
        paddingBottom: Pixel.getPixel(2),
    },
    buttonTextStyle: {
        color: FontAndColor.THEME_BACKGROUND_COLOR,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },
    buttonStyle: {
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(32),
        backgroundColor: FontAndColor.NAVI_BAR_COLOR,
        alignItems: 'center',
        justifyContent: 'center',

    },
    bottomItemTextStyle: {
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
        color: FontAndColor.COLORB2
    }
})
