/**
 * Created by Administrator on 2017/2/13.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from 'react-native';

import * as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';
const Pixel = new PixelUtil();
const {width, height} = Dimensions.get('window');
let camera = false;
let gallery = false;
export default class ImageSource extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            cameraClick: () => {
            },
            galleryClick: () => {
            }
        };
    }

    _cancelClick = () => {
        this.setState({
            modalVisible: false
        });
    };

    openModal = (name, cameraClick, galleryClick) => {
        this.name = name;
        this.setState({
            modalVisible: true,
            cameraClick: cameraClick,
            galleryClick: galleryClick
        });
    };

    render() {
        return (
            <Modal
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {}}>
                <View style={styles.container}>
                    <View style={styles.contentContainer}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={()=>{this._cancelClick();camera = true;}}>
                            <View style={styles.btnContainer}>
                                <Text allowFontScaling={false}  style={styles.fontMain}>拍摄</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.splitLine}/>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={()=>{this._cancelClick();gallery = true;}}>
                            <View style={styles.btnContainer}>
                                <Text allowFontScaling={false}  style={styles.fontMain}>从手机相册选择</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.splitView}/>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={()=>{this._cancelClick()}}>
                            <View style={styles.btnContainer}>
                                <Text allowFontScaling={false}  style={styles.fontMain}>取消</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    componentDidUpdate() {
        if (this.state.modalVisible == false && camera == true) {
            this.state.cameraClick();
        }
        if (this.state.modalVisible == false && gallery == true) {
            this.state.galleryClick();
        }
        gallery = false;
        camera = false;
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end'
    },
    contentContainer: {
        backgroundColor: fontAndColor.COLORA3
    },
    btnContainer: {
        width: width,
        height: Pixel.getPixel(44),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF'
    },
    fontMain: {
        color: '#000000',
        fontSize: Pixel.getFontPixel(15)
    },
    splitLine: {
        borderColor: fontAndColor.COLORA4,
        borderWidth: 0.5
    },
    splitView: {
        width: width,
        height: Pixel.getPixel(10),
        backgroundColor: 'transparent'
    }
});


