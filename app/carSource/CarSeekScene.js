import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ListView,
    Image,
    Dimensions,
} from 'react-native'

import *as fontAndColor from '../constant/FontAndColor';
import NavigationView from '../component/AllNavigationView';
import PixelUtil from '../utils/PixelUtils';
import SQLiteUtil from '../utils/SQLiteUtil';
import StorageUtil from '../utils/StorageUtil';
import * as StorageKeyName from '../constant/storageKeyNames';
import * as AppUrls from "../constant/appUrls";
import {request} from '../utils/RequestUtil';
import BaseComponent from "../component/BaseComponent";
import SText from '../component/SaasText'
import {THEME_BACKGROUND_COLOR} from "../constant/FontAndColor";

const Pixel = new PixelUtil();
const SQLite = new SQLiteUtil();
let ScreenWidth = Dimensions.get('window').width;
let seekDataArray = [];

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})


export default class CarSeekScene extends BaseComponent {
    constructor(props) {
        super(props)

        this.historySeekData = [];
        this.seekArray = [];
        const seekData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
        const historySeekListData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
        this.state = {
            seekData:seekData,
            historySeekListData:historySeekListData,
            hotWord: []
        }
    }

    initFinish = () => {
        this.loadHotword();
        SQLite.createTable();
        this.getSeekData();
    }


    render() {

        return (
            <View
                style={{backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR, flex: 1}}

            >
                <NavigationView
                    backIconClick={() => {
                        this.backPage()
                    }}
                    title={'车型搜索'}
                />
                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 64,
                    borderBottomWidth: 1,
                    borderBottomColor: fontAndColor.THEME_BACKGROUND_COLOR,
                }}>
                    <TextInput
                        style={{
                            backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
                            flex: 1,
                            marginHorizontal: 15,
                            marginRight: 10,
                            height: 30,
                            marginVertical: 10,
                            paddingHorizontal: 5,
                            fontSize: 15
                        }}
                        placeholder={'搜索车型'}
                        keyboardType={'default'}
                        ref = 'keyword'
                        onChangeText = {(text)=>{
                            this.keyWord = text;
                            this.seekData(text)
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => {

                            if(this.keyWord === '' || this.keyWord === null){
                                this.props.showToast('请输入关键词'); return;
                            }


                            this.saveSeekData(this.keyWord)
                            this.checkedCarClick(this.keyWord)
                            this.backPage()
                        }}
                        style={styles.search_container}

                    >
                        <SText style={{color: fontAndColor.NAVI_BAR_COLOR}}>搜索</SText>
                    </TouchableOpacity>

                </View>
                <ListView
                    //contentContainerStyle = {{backgroundColor:'white'}}
                    //style = {{backgroundColor:'white'}}
                    removeClippedSubviews={false}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                    renderHeader={this._renderHeader}
                    dataSource={this.state.historySeekListData}
                    enableEmptySections={true}
                />
            </View>

        )
    }


    _renderRow = (data) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.checkedCarClick(data)
                    this.backPage();
                }}
                style={{backgroundColor: 'white', height: 40, justifyContent: 'center',}}
            >
                <SText style={{marginLeft: 15}}>{data}</SText>
            </TouchableOpacity>
        )
    }

    _renderSeparator = () => {
        return (
            <View style={{height: 1, backgroundColor: THEME_BACKGROUND_COLOR}}/>
        )
    }

    _renderHeader = () => {

        return (
            <View>
                <View style={{backgroundColor: 'white', flexDirection: 'row', flexWrap: 'wrap',padding:15, paddingBottom:10}}>
                    <SText style = {{fontSize:16,}}>热搜：</SText>
                    {
                        this.state.hotWord.map((obj) => {
                            return<View key = {obj} style = {styles.hot_word_container}>
                                <SText onPress={()=>{
                                    this.checkedCarClick(obj);
                                    this.saveSeekData(obj);
                                    this.backPage();
                                }} style={{}}>{obj}</SText>
                            </View>

                        })
                    }
                </View>

                {

                }

                <View style={{
                    flexDirection: 'row',
                    backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <SText style={{marginLeft: 15, fontSize: 16}}>历史搜索</SText>
                    <TouchableOpacity
                        onPress={() => {
                            this.deleteSeekData()
                        }}
                    >
                        <SText style={{color: fontAndColor.COLORA1, marginRight: 15}}>清除</SText>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }


    loadHotword = () => {

        request(AppUrls.CAR_SEARCH_TOP, 'POST', {}).then((response) => {
            if (response.mycode === 1) {

                seekDataArray = response.mjson.data.list

                for (let i = 0; i < seekDataArray.length; i++) {
                    if (i < 10) {
                        this.state.hotWord.push(seekDataArray[i].name)
                    }
                }

                this.setState({
                    hotWord: this.state.hotWord
                })

            }
        }, (error) => {
            this.props.showToast(error.mjson.data.msg);
        })


    }

    seekData = (text)=>{
        if(text === this.current) return;

        if(text === ''){
            this.seekArray = [];



        }

    }


    getSeekData = ()=>{
        StorageUtil.mGetItem(StorageKeyName.CAR_SEEK_DATA, (data) => {
            if (data.code == 1) {
                if (data.result) {

                    this.historySeekData = JSON.parse(data.result);
                    this.setState({
                        historySeekListData:this.state.historySeekListData.cloneWithRows(this.historySeekData),
                    });
                }
            }
        })
    }
    saveSeekData = (seekName) => {

        let isEqual = false;
        let historySeekData = this.historySeekData;
        let newArray = new Array;

        if (historySeekData.length > 0) {
            newArray.push(seekName);
            historySeekData.map((data, index) => {
                if (data == seekName)
                {
                    isEqual = true;
                }
                newArray.push(data);
            });
        } else {
            newArray.push(seekName);
        }
        if (!isEqual) {
            StorageUtil.mSetItem(StorageKeyName.CAR_SEEK_DATA, JSON.stringify(newArray));
        }
    }
    checkedCarClick = (name)=>{

        this.props.checkedCarClick({
            brand_id:0,
            series_id:0,
            brand_name:name
        });
    }

    deleteSeekData=()=>{
        StorageUtil.mRemoveItem(StorageKeyName.CAR_SEEK_DATA)
        this.historySeekData =[]
        this.setState({
            historySeekListData:this.state.historySeekListData.cloneWithRows(this.historySeekData)
        })
    }

}

const styles = StyleSheet.create({

    search_container: {
        borderColor: fontAndColor.NAVI_BAR_COLOR,
        borderRadius: 4,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        width: 50,
        height: 30,
    },

    hot_word_container: {
        backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 5,
        marginBottom:6,
        justifyContent:'center',
        alignItems:'center'
    }
})
