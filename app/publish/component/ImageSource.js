import React,{ Component } from 'react';
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
const {width,height} = Dimensions.get('window');


export default class ImageSource extends Component{
    constructor(props){
        super(props)
        this.state = {
            modalVisible:false
        }
    }

    _cancelClick = ()=>{
        this.setState({
            modalVisible: false
        });
    };

    openModal = (name)=>{
        this.name = name;
        this.setState({
            modalVisible: true
        });
    };

    render(){
        return(
            <Modal
                transparent = {true}
                visible = {this.state.modalVisible}
                onRequestClose = {()=>{}}
            >
                <TouchableOpacity
                    style = {{flex:1}}
                    onPress = {()=>{
                        this._cancelClick()
                    }}
                >
                    <View style = {styles.container}>
                        <View  style = {styles.contentContainer}>
                            <TouchableOpacity
                                onPress = {this.props.cameraClick}
                                activeOpacity = {.8}
                            >
                                <View style = {styles.option_view}>
                                    <Text>拍照</Text>
                                </View>
                            </TouchableOpacity>
                            <View style = {styles.separator}></View>
                            <TouchableOpacity
                                onPress = {this.props.galleryClick}
                                activeOpacity = {.8}
                            >
                                <View style = {styles.option_view}>
                                    <Text>从相册选择</Text>
                                </View>
                            </TouchableOpacity>
                            <View style = {styles.separator}></View>
                            <TouchableOpacity
                                onPress = {this._cancelClick}
                                activeOpacity = {.8}
                            >
                                <View style = {styles.option_view}>
                                    <Text>取消</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                </TouchableOpacity>

            </Modal>

        )
    }
}


const styles = StyleSheet.create({

    container:{
        width:width,
        flex:1,
        backgroundColor:'rgba(0,0,0,.3)',
        justifyContent:'flex-end'
    },

    contentContainer:{
        width:width,
        backgroundColor:'white',
    },

    option_view:{
        height:44,
        width:width,
        justifyContent:'center',
        alignItems:'center',
    },

    separator:{
        backgroundColor:fontAndColor.COLORA4,
        height:.5,
        width:width,
    }

})