import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    TouchableOpacity,
    Text,
    TextInput,
    Dimensions,
    Image,
    KeyboardAvoidingView,
} from 'react-native';

import BaseComponent from "../component/BaseComponent";
import MyBaseNaviComponent from "../component/MyBaseNaviComponent";
import MyBaseComponent from "../component/MyBaseComponent";
import AllNavigationView from  '../component/AllNavigationView';
import *as fontAndColor from  '../constant/FontAndColor';
import PixelUtil from  '../utils/PixelUtils';
import * as AppUrls from "../constant/appUrls";
import  {request}   from '../utils/RequestUtil';
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";

let Pixel = new  PixelUtil();
const sceneWidth = Dimensions.get('window').width;

export default class CarSaledStaffListScene extends  MyBaseNaviComponent{

    initFinish=()=>{
        this.setState({
            title:'销售员工'
        })
        this.getStaffData();
    }

    getStaffData=()=>{

        this.setState({
            renderPlaceholderOnly:'loading'
        });
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if(data.code == 1 && data.result != '')
            {
                let enters = JSON.parse(data.result);
                request(AppUrls.CAR_CHESHANG_GET_ALLCHILD, 'post', {
                    account_code:enters.company_base_id,
                }).then((response) => {

                    let array = [];
                    if(response.mjson.data.accountObject.length>0){
                        for(let item of response.mjson.data.accountObject){
                            array.push({
                                account_code:item.account_code,
                                real_name:item.real_name,
                                mobile:item.mobile,
                            });
                        }
                    }
                    if(response.mjson.data.childList.length>0){
                        for(let item of response.mjson.data.childList){
                            array.push({
                                account_code:item.account_code,
                                real_name:item.child_account_name,
                                mobile:item.child_account_mobile,
                            });
                        }
                    }

                    if(array.length>0){
                        this.setState({
                            sourceData:this.state.sourceData.cloneWithRows(array),
                            renderPlaceholderOnly:'success'
                        });
                    }else {
                        this.setState({
                            renderPlaceholderOnly:'null'
                        });
                    }

                }, (error) => {
                    this.props.showToast(error.mjson.msg);
                    this.setState({
                        renderPlaceholderOnly:'error'
                    });
                });

            }else{
                this.setState({
                    renderPlaceholderOnly:'error'
                });
                this.props.showToast('无法找到所属商户');
            }
        });

    }



    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly:'loading',
            sourceData:new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id != r2.id})
        };
    }


    renderView(){

        return(
            <View style={styles.rootContaier}>
                <ListView style={{flex:1}} renderRow={this.renderRow} dataSource={this.state.sourceData}/>
            </View>
        )
    }

    renderRow = (rowData, sectionID, rowID) => {

        return (
            <TouchableOpacity onPress={() => {

                this.props.clickSaledStaff(rowData);
                this.backPage();

            }}>
                <View style={styles.rowCell}>
                    <Text allowFontScaling={false}  style={styles.rowCellText}>{rowData.real_name}</Text>
                </View>
            </TouchableOpacity>
        )
    };

}



const styles = StyleSheet.create({
    rootContaier:{
        backgroundColor:fontAndColor.COLORA3,
        flex:1,
        marginTop:Pixel.getTitlePixel(64),
    },
    rowCell: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(44),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingLeft:Pixel.getPixel(15),

    },
    rowCellText: {
        marginLeft: Pixel.getPixel(5),
        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
    },
})