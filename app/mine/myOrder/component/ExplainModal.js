/**
 * Created by hanmeng on 2017/5/15.
 */
import React, {Component} from 'react';
import {
    Dimensions,
    AppRegistry,
    View,
    StatusBar,
    Modal,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import PixelUtil from "../../../utils/PixelUtils";
let Pixel = new PixelUtil();
let {width, height} = Dimensions.get('window');
import  * as fontAndColor from '../../../constant/FontAndColor';
export default class ExplainModal extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isShow: false,
            title: this.props.title,
            content: this.props.content,
            text: this.props.text
        };
    }

    changeShowType = (value, title, content, text) => {
        this.setState({
            isShow: value,
            title: title,
            content: content,
            text: text
        });
    };

    render() {
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.state.isShow}
                onRequestClose={() => {
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            isShow: false
                        });
                    }}
                    activeOpacity={1}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.3)'
                    }}>
                    <View style={{
                        width: width - width / 4,
                        //height: Pixel.getPixel(155),
                        backgroundColor: '#fff',
                        paddingLeft: Pixel.getPixel(20),
                        paddingRight: Pixel.getPixel(20),
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text allowFontScaling={false}  style={{
                            marginTop: Pixel.getPixel(23),
                            fontSize: Pixel.getPixel(17),
                            fontWeight: 'bold',
                            color: '#000'
                        }}>{this.state.title}</Text>
                        <Text allowFontScaling={false}  style={{
                            textAlign: 'center', fontSize: Pixel.getPixel(14),
                            marginTop: Pixel.getPixel(11), color: '#000'
                        }}>
                            {this.state.content}
                        </Text>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                isShow: false
                            });
                        }} activeOpacity={0.9} style={this.props.buttonStyle}>
                            <Text allowFontScaling={false}  style={this.props.textStyle}>{this.state.text}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }
}
/*
 style={{
 marginBottom: Pixel.getPixel(20),
 width: width - width / 4 - Pixel.getPixel(40),
 height: Pixel.getPixel(35),
 marginTop: Pixel.getPixel(16),
 flexDirection: 'row',
 justifyContent: 'center',
 alignItems: 'center',
 borderRadius: 3,
 borderWidth: 1,
 borderColor: fontAndColor.COLORB0
 }}
 {
 fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),
 color: fontAndColor.COLORB0
 }
 */