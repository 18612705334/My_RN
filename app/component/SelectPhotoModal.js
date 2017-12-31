import React, {Component} from 'react';
import {
    AppRegistry,
    View,
    StatusBar,
    Modal,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import  PixelUtil from '../utils/PixelUtils'
let Pixel = new PixelUtil();
let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
import  * as fontAndColor from '../constant/FontAndColor';
export default class SelectPhotoModal extends Component {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isShow: false
        };
    }

    /**
     * from @zhaojian
     *
     * 控制弹框显示或隐藏
     **/
    changeShowType = (value) => {
        this.setState({
            isShow: value
        });
    }


    render() {
        return (
            <Modal
                ref='loadingModal'
                animationType={"none"}
                transparent={true}
                visible={this.state.isShow}
                onRequestClose={() => {}}
            >
                <TouchableOpacity
                    onPress={()=>{
                        this.setState({
                            isShow: false
                        });
                    }}
                    activeOpacity={1}
                    style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.3)'}}>
                    <View style={{width:width-width/4,height:Pixel.getPixel(155),backgroundColor:'#fff',
                        paddingLeft:Pixel.getPixel(20),paddingRight:Pixel.getPixel(20),justifyContent:'center',alignItems: 'center'}}>
                        <View style={{width:width-width/4-Pixel.getPixel(40),height:Pixel.getPixel(40),backgroundColor:fontAndColor.BUTTONFONT30}}></View>

                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }
}