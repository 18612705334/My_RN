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
import LoginInputText from '../../login/component/LoginInputText';
import {request} from "../../utils/RequestUtil";
import * as AppUrls from "../../constant/appUrls";
import PurchasePickerItem from '../component/PurchasePickerItem';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Pixel = new PixelUtil();
var onePT = 1 / PixelRatio.get(); //一个像素
var Platform = require('Platform');
const childItems = [];
export default class OBDDevice extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            renderPlaceholderOnly: true,
            obd_number: "",
        };
    }

    initFinish = () => {
        this.setState({
            renderPlaceholderOnly: false
        });
    }

    render() {
        if (this.state.renderPlaceholderOnly) {
            return ( <TouchableWithoutFeedback onPress={() => {
                this.setState({
                    show: false,
                });
            }}>
                <View style={{flex: 1, backgroundColor: FontAndColor.THEME_BACKGROUND_COLOR}}>
                    <NavigationBar
                        leftImageShow={false}
                        leftTextShow={true}
                        leftText={""}
                        centerText={"设备号"}
                        rightText={"保存"}/>
                </View>
            </TouchableWithoutFeedback>);
        }
        return (
            <View style={styles.container}>
                <NavigationBar
                    leftImageShow={true}
                    leftTextShow={false}
                    centerText={"设备号"}
                    rightText={"保存"}
                    rightTextCallBack={() => {
                        let obd_number = this.refs.obd_number.getInputTextValue();
                        if (obd_number != '') {
                            this.props.callBack(obd_number);
                            this.backPage();
                        } else {
                            this.props.showToast("请输入设备号");
                        }

                    }}
                    leftImageCallBack={this.backPage}/>

                <LoginInputText
                    ref="obd_number"
                    textPlaceholder={'请输入设备号'}
                    viewStytle={styles.itemStyel}
                    inputTextStyle={styles.inputTextStyle}
                    leftIcon={false}
                    clearValue={true}
                    rightIcon={false}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: FontAndColor.THEME_BACKGROUND_COLOR,
        alignItems: 'center'
    },
    itemStyel: {
        backgroundColor: '#ffffff',
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
        marginTop: Pixel.getPixel(15),
    },
    inputTextStyle: {
        backgroundColor: '#ffffff',
        paddingLeft: 0,
        paddingRight: 0,
        margin: 0,
        textAlign: 'left',
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT30),
    },
})
