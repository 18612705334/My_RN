import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ListView,
    InteractionManager
} from 'react-native';

const {width, height} = Dimensions.get('window');
import PixelUtil from '../utils/PixelUtils';

const Pixel = new PixelUtil();
import * as fontAndColor from '../constant/FontAndColor';
import NavigationBar from '../component/NavigationBar';

import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import BaseComponent from '../component/BaseComponent';
import MainPage from './MainPage';
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";

const childItem = [];

export default class AllSelectCompanyScene extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            renderPlaceholderOnly: 'blank',
            source: []
        };
    }

    initFinish = () => {
        this.getData();
    }


    render() {
        if (this.state.renderPlaceHolderOnly != 'success') {
            return this._renderPlaceholderView();
        }
        return (

            <View style={styles.container}>

                <NavigationBar
                    leftImageShow={false}
                    centerText={'选择公司'}
                    rightTextShow={false}
                />
                <ListView
                    renderRow={this._renderRow}
                    removeClipedSubviews={false}
                    style={{flex: 1, paddingTop: 20}}
                    renderSeparator={this._renderSeparator}
                    dataSource={this.state.source}
                    showsVerticalScrollIndicator={false}
                />

            </View>

        )
    }

    _renderSeparator = (sectionID, rowID) => {
        return(
            <View style = {{flex:1, height:10}} key = {sectionID+''+rowID}/>
        )
    }

    _renderRow = (data, sectionID, rowID) => {

        let names = '';
        if (data.companyname == null || data.companyname == '') {
            names = data.name;
        } else {
            names = data.name + '(' + data.companyname + ')';
        }


        return (
            <TouchableOpacity
                onPress={() => {
                    this.setLoan(data);
                }}

                activeOpacity={.6}
            >

                <View style={styles.row_container}>
                    <Image style={styles.row_icon} source={require('../../image/financeImages/companyIcon.png')}/>
                    <View style={styles.row_text_container}>
                        <Text allowFontScaling={false} style = {styles.row_company_name}>{names}</Text>
                        <Text allowFontScaling={false} style = {styles.row_credit}>{data.is_done_credit == '1' ? '授信额度' + movie.credit_mny / 10000 + '万' : '未完成授信'}</Text>
                    </View>

                    <Image style={styles.row_right_indicator}
                           source={require('../../image/mainImage/celljiantou.png')}/>
                </View>


            </TouchableOpacity>

        )

    }


    setLoan = (movie)=>{
        global.companyBaseID = movie.company_base_id;
        this.props.showModal(true);

        request(Urls.USER_GET_SELECT_ENTERPRISE_INFO, 'POST', {enterprise_id:movie.company_base_id}).then((response)=>{
            if (movie.is_done_credit == '1' ){  //完成授信
                let maps ={
                    api: Urls.OPT_LOAN_SUBJECT,
                    opt_merge_id: movie.merge_id,
                    opt_user_id: movie.user_id,
                }

                request(Urls.FINANCE, 'POST', maps).then((response)=>{
                    this.props.showModal(false);

                    StorageUtil.mSetItem(StorageKeyNames.LOAN_SUBJECT, JSON.stringify(movie)+'');

                    this.resetRoute({name:'MainPage',component:MainPage,params:{}});
                }, (error)=>{
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast('网络连接失败');
                    } else {
                        this.props.showToast(error.mjson.msg);
                    }
                })

            }else{  // 未完成授信


                this.props.showModal(true);

                request(Urls.CONTRACT_APPLYPLSEAL, 'POST', {}).then((response)=>{
                    this.props.showModal(false)
                    StorageUtil.mSetItem(StorageKeyNames.LOAN_SUBJECT, JSON.stringify(movie) + "");
                    this.resetRoute({name:'MainPage',component:MainPage,params:{}});
                }, (error)=>{

                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast('网络连接失败');
                    } else {
                        this.props.showToast(error.mjson.msg);
                    }
                })
            }


        }, (error)=>{
            if(error.mycode == -300 || error.mycode == -500){
                this.props.showToast('网络连接失败')
            }else {
                this.props.showToast(error.mjson.msg);
            }

        })


    }




    getData = () => {
        let maps = {
            api: Urls.LOAN_SUBJECT
        };

        request(Urls.FINANCE, 'Post', maps).then((response) => {

            if (response.mjson.data == null || response.mjson.data.length <= 0) {
                this.setState({
                    renderPlaceHolderOnly: 'null'
                })
            } else {
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
                this.setState({
                    renderPlaceHolderOnly: 'success',
                    source: ds.cloneWithRows(response.mjson.data)
                })
            }
        }, (error) => {
            this.setState({
                renderPlaceHolderOnly: 'error'
            })
        })

    }

    _renderPlaceholderView = () => {
        return (
            <View
                style={{flex: 1, backgroundColor: fontAndColor.COLORA3}}
            >

                <NavigationBar
                    leftImageShow={false}
                    centerText={'选择公司'}
                    rightTextShow={false}
                />
                {this.loadView()}
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3,
    },

    row_container: {
        backgroundColor: 'white',
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',

    },

    row_text_container: {
        flex: 1,
        marginLeft:15,

    },
    row_icon: {
        marginLeft: 15,
        height: 50,
        width: 50
    },

    row_right_indicator: {
        marginRight: 15,
    },

    row_company_name:{
        fontSize: 18,
        color:fontAndColor.COLORA0,
    },

    row_credit:{
        marginTop:10,
        color:fontAndColor.COLORA1,
        fontSize:fontAndColor.BUTTONFONT
    }

})