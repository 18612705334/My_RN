import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    TextInput,
    Platform,
    Dimensions
} from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import MyBaseNaviComponent from '../../component/MyBaseNaviComponent';
import MyBaseComponent from '../../component/MyBaseComponent';
import AllNavigationView from  '../../component/AllNavigationView';
import *as fontAndColor from  '../../constant/FontAndColor';
import PlateModal from '../../publish/component/PlateModal';
import PixelUtil from  '../../utils/PixelUtils';
let Pixel = new  PixelUtil();

const sceneWidth = Dimensions.get('window').width;
const background = require('../../../image/publish/background.png');
const preBg = require('../../../image/publish/car-plate-pre.png');
const proBg = require('../../../image/publish/car-plate.png');
const IS_ANDROID = Platform.OS === 'android';


export default class CarDischargeScene extends  MyBaseNaviComponent {

    initFinish(){
        this.setState({
            renderPlaceholderOnly:'success',
            title:'车牌号'
        })
    }
    _openModal = ()=>{
        this.plateModal.openModal();
    };
    chkNumber=(obj)=> {
        obj = obj.toUpperCase();
        return obj.replace(/[^\w\/]/ig,'');
    }
    _onClose =(city)=>{
        this.setState({
            city:city
        });
        this.initValue[0] = city;
    };


    _onPlateChange= (text,type) =>{

        this.initValue[type] = text;
        if(text.length !== 0){
            switch (type){
                case 1:
                    this.firstInput.setNativeProps({
                        text:text
                    });
                    this.secondInput.focus();
                    break;
                case 2:
                    this.secondInput.setNativeProps({
                        text:text
                    });
                    this.threeInput.focus();
                    break;
                case 3:
                    this.threeInput.setNativeProps({
                        text:text
                    });
                    this.fourInput.focus();
                    break;
                case 4:
                    this.fourInput.setNativeProps({
                        text:text
                    });
                    this.fiveInput.focus();
                    break;
                case 5:
                    this.fiveInput.setNativeProps({
                        text:text
                    });
                    this.sixInput.focus();
                    break;
                case 6:
                    this.sixInput.setNativeProps({
                        text:text
                    });
                    break;
            }
        }
    };

    constructor(props) {

        super(props);

        this.initValue = ['', '', '', '', '', '', ''];
        if (this.props.currentChecked.length > 6) {
            for (let i = 0; i < 7; i++) {
                this.initValue[i] = this.props.currentChecked.charAt(i);
            }
        }
        if (this.initValue[0] === '') {
            this.initValue[0] = '京';
        }

        this.state = {
            city: this.initValue[0],
        }
    }

    backPage=()=>{
        this.backAction()
    }

    renderView(){
        return(
            <View style={styles.rootContainer}>
                <Image  style={{width:sceneWidth, alignItems:'center',paddingTop:Pixel.getPixel(20)}} source={background}>
                    <PlateModal onClose={this._onClose} ref={(modal) => {this.plateModal = modal}}/>
                    <View style={styles.plateContainer}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={()=>{this._openModal()}}
                            style={styles.preContainer}>
                            <Image style={styles.preContainer} source={preBg}>
                                <Text allowFontScaling={false}  style={styles.fontPre}>{this.state.city}</Text>
                            </Image>
                        </TouchableOpacity>

                        <Image style={styles.proContainer} source={proBg}>
                            <TextInput ref={(input)=>{this.firstInput = input}}
                                       style={IS_ANDROID ? styles.fontAndroidBold: styles.fontIOSBold} underlineColorAndroid='transparent'
                                       defaultValue={this.initValue[1]}
                                       maxLength={1}
                                       onChangeText={(text)=>
                                       {
                                           let number = this.chkNumber(text);
                                           this.firstInput.setNativeProps({
                                               text: number,
                                           });
                                           this._onPlateChange(number,1)
                                       }
                                       }/>
                            <TextInput ref={(input)=>{this.secondInput = input}}
                                       style={IS_ANDROID ? styles.fontAndroidBold: styles.fontIOSBold} underlineColorAndroid='transparent'
                                       defaultValue={this.initValue[2]} maxLength={1}
                                       onChangeText={(text)=>
                                       {
                                           let number = this.chkNumber(text);
                                           this.secondInput.setNativeProps({
                                               text: number,
                                           });
                                           this._onPlateChange(number,2)
                                       }}/>
                            <TextInput ref={(input)=>{this.threeInput = input}}
                                       style={IS_ANDROID ? styles.fontAndroidBold: styles.fontIOSBold} underlineColorAndroid='transparent'
                                       defaultValue={this.initValue[3]} maxLength={1}
                                       onChangeText={(text)=>
                                       {
                                           let number = this.chkNumber(text);
                                           this.threeInput.setNativeProps({
                                               text: number,
                                           });
                                           this._onPlateChange(number,3)
                                       }}/>
                            <TextInput ref={(input)=>{this.fourInput = input}}
                                       style={IS_ANDROID ? styles.fontAndroidBold: styles.fontIOSBold} underlineColorAndroid='transparent'
                                       defaultValue={this.initValue[4]} maxLength={1}
                                       onChangeText={(text)=>
                                       {
                                           let number = this.chkNumber(text);
                                           this.fourInput.setNativeProps({
                                               text: number,
                                           });
                                           this._onPlateChange(number,4)
                                       }}/>
                            <TextInput ref={(input)=>{this.fiveInput = input}}
                                       style={IS_ANDROID ? styles.fontAndroidBold: styles.fontIOSBold} underlineColorAndroid='transparent'
                                       defaultValue={this.initValue[5]} maxLength={1}
                                       onChangeText={(text)=>
                                       {
                                           let number = this.chkNumber(text);
                                           this.fiveInput.setNativeProps({
                                               text: number,
                                           });
                                           this._onPlateChange(number,5)
                                       }}/>
                            <TextInput ref={(input)=>{this.sixInput = input}}
                                       style={IS_ANDROID ? styles.fontAndroidBold: styles.fontIOSBold} underlineColorAndroid='transparent'
                                       defaultValue={this.initValue[6]} maxLength={1}
                                       onChangeText={(text)=>
                                       {
                                           let number = this.chkNumber(text);
                                           this.sixInput.setNativeProps({
                                               text: number,
                                           });
                                           this._onPlateChange(number,6)
                                       }}/>
                        </Image>
                    </View>
                </Image>

            </View>
        )
    }
    backAction=()=>{
        let number ='';
        this.initValue.map((data,index)=>{
            if(data!='')
            {
                number+=data;
            }
        });
        if(number.length==7){

            this.props.checkedCarlicenseTagClick(number);
        }
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.pop();
        }

    }

}

const styles = StyleSheet.create({
    rootContainer:{
        flex:1,
        backgroundColor:fontAndColor.COLORA3,
        marginTop:Pixel.getTitlePixel(64),
    },plateContainer: {
        flexDirection: 'row',
        marginTop: Pixel.getPixel(207),
        alignItems:'center',
        width:Pixel.getPixel(320),
        justifyContent:'center',
    },
    preContainer: {
        height: Pixel.getPixel(44),
        width: Pixel.getPixel(44),
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)'
    },
    proContainer: {
        flex:1,
        height: Pixel.getPixel(44),
        width: Pixel.getPixel(264),
        marginLeft: Pixel.getPixel(12),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)'
    },
    fontPre: {
        fontSize: Pixel.getFontPixel(20),
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign:'center'
    },
    fontAndroidBold: {
        height: Pixel.getPixel(44),
        width: Pixel.getPixel(44),
        fontSize: Pixel.getFontPixel(20),
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign:'left'
    },
    fontIOSBold: {
        height: Pixel.getPixel(44),
        width: Pixel.getPixel(44),
        fontSize: Pixel.getFontPixel(20),
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign:'center'
    },
    wrapStyle:{
        backgroundColor:'transparent'
    },
    rightTitleText: {
        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.NAVIGATORFONT34),
        textAlign: 'right',
        backgroundColor: 'transparent'
    }

});
