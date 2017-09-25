import React, {Component, PropTypes} from "react";
import {StyleSheet, Text, View, PixelRatio, TextInput, Image} from "react-native";
import * as FontAndColor from "../../constant/FontAndColor";
import PixelUtil from "../../utils/PixelUtils";
import MyButton from "../../component/MyButton";

var Dimension = require('Dimensions');
var {width, height} = Dimension.get('window');
var onePT = 1 / PixelRatio.get();
var Pixel = new PixelUtil;


export default class Search extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: '',
        }
    }

    static defaultProps = {
        leftIconShow: true,
        clearValue: false,
        inputPlaceHolder: '请输入用户名',
        leftIconUri: '../../images/login/phone.png',
        keyboardType: null,
    }

    static propsType = {
        leftIconShow: PropTypes.bool,
        clearValue: PropTypes.bool,

        inputPlaceHolder: PropTypes.string,
        keyboardType: PropTypes.string,

        inputTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        leftIconStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        itemStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

        callBackSearchResult: PropTypes.func,

    }

    getInputTextValue = ()=>{
        return this.state.value;
    }

    showDefultContext = () => {


    }

    goSearch = (text) => {
        if (text == "") {
            this.props.callBackSearchResult(true);
        } else {
            this.props.callBackSearchResult(false);
        }
        this.setState({
            value: text
        })
    }

    clearValue = () => {
        this.props.callBackSearchResult(true);
        this.setState({
            value: "",
        });
    }

    render() {
        return (
            <View style={[styles.width, this.props.itemStyle]}>
                <View style={[styles.flexDirection, styles.inputHeigth]}>
                    {
                        this.props.leftIconShow ?
                            <Image style={[styles.iconStyle, this.props.leftIconStyle]}
                                   source={require('./../../../image/login/phone.png')}/>
                            : null
                    }

                    <TextInput
                        style={[styles.inputs, this.props.inputTextStyle]}
                        returnKeyType={'search'}
                        placeholder={this.props.inputPlaceHolder}
                        underlineColorAndriod={'#0000000'}
                        value={this.state.value}
                        onFocus={this.showDefultContext}
                        keyboardType={this.props.keyboardType}
                        maxLength={11}
                        onChangeText={this.goSearch}
                        placeholderTextColor={FontAndColor.COLORA1}
                    />

                    {
                        this.props.clearValue && this.state.value.length > 0 ?
                            <MyButton
                                buttonType={MyButton.IMAGEBUTTON}
                                content={require('../../../image/login/clear.png')}
                                parentStyle={{padding: Pixel.getPixel(5)}}
                                childStyle={{width: Pixel.getPixel(17), height: Pixel.getPixel(17)}}
                                mOnPress={this.clearValue}
                            />
                            : null
                    }

                </View>
            </View>


        )

    }


}

const styles = StyleSheet.create({

    flex: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },

    flexDirection: {
        flexDirection: 'row',
        //justifyContent:'center',
        alignItems: 'center',
        borderBottomColor: FontAndColor.COLORA4,
        borderBottomWidth: onePT,
    },

    inputs: {
        flex: 1,
        height: Pixel.getPixel(44),
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(2),
        color: FontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
    },

    inputHeigth: {
        height: Pixel.getPixel(44),
    },
    iconStyle: {
        width: Pixel.getPixel(25),
        height: Pixel.getPixel(25),
        // resizeMode:'contain'
    },

    width: {
        width: width - Pixel.getPixel(30),

    }

});