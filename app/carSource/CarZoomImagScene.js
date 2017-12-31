import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    Image

} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';
import BaseComponent from '../component/BaseComponent';
import *as fontAndColor from '../constant/FontAndColor';
import PixelUtil from '../utils/PixelUtils';

const Pixel = new PixelUtil();

export default class CarZoomImagScene extends BaseComponent {


    initFinish = ()=>{

    }


    render() {
        return (
            <ImageViewer
                imageUrls={this.props.images}
                loadingRender={() => {
                    return (
                        <ActivityIndicator
                            color='white'
                            size='large'
                            animating={true}
                        />
                    )
                }}
                onCancel={()=>{
                    this.backPage()
                }}
                onClick={()=>{
                    this.backPage()
                }}
                saveToLocalByLongPress={true}
                index={this.props.index}

            />
        )
    }
}