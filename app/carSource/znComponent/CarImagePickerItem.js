/**
 * Created by zhengnan on 2017/5/18.
 */
/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component, PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ListView
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtils';
const Pixel = new PixelUtil();
const childWidth = (width - Pixel.getPixel(30)) / 4 - Pixel.getPixel(7);
export  default class CarImagePickerItem extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        if ((this.props.index === 0 && this.props.allLength === 0) ||
            ((this.props.index === this.props.allLength) && this.props.allLength < 8)) {
            return (
                <View style={styles.parentView}>
                    <TouchableOpacity activeOpacity={0.8}
                                      style={{
                                          width: childWidth,
                                          height: Pixel.getPixel(66) - Pixel.getPixel(7),
                                          marginLeft: Pixel.getPixel(7),
                                          marginTop: Pixel.getPixel(7)
                                      }} onPress={() => {
                        this.props.mOnPress(this.props.index);
                    }}>
                        <Image style={{
                            width: childWidth,
                            height: Pixel.getPixel(66) - Pixel.getPixel(7),
                        }} source={require('../../../image/financeImages/addPicker.png')}/>
                    </TouchableOpacity>
                </View>
            );
        }
        return (
            <View style={styles.parentView}>
                <TouchableOpacity activeOpacity={0.8}
                                  style={{
                                      width: childWidth,
                                      height: Pixel.getPixel(66) - Pixel.getPixel(7),
                                      marginLeft: Pixel.getPixel(7),
                                      marginTop: Pixel.getPixel(7)
                                  }} onPress={() => {
                    this.props.showOnPress(this.props.index);
                }}>
                    <Image style={{
                        width: childWidth,
                        height: Pixel.getPixel(66) - Pixel.getPixel(7),
                    }} source={{uri: this.props.imgUrl.url}}/>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8}
                                  style={{
                                      width: Pixel.getPixel(14),
                                      height: Pixel.getPixel(14),
                                      position: 'absolute'
                                  }} onPress={() => {
                    this.props.deleteOnPress(this.props.index,this.props.fileId.file_id);
                }}>
                    <Image style={{
                        width: Pixel.getPixel(14),
                        height: Pixel.getPixel(14),
                    }} source={require('../../../image/financeImages/deleteIcon.png')}/>
                </TouchableOpacity>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    parentView: {
        width: (width - Pixel.getPixel(30)) / 4,
        height: Pixel.getPixel(66),
    }
})