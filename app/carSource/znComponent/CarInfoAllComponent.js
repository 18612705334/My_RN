import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ListView,

} from 'react-native';

var ScreenWidth = Dimensions.get('window').width;

import *as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';
import BaseComponent from '../../component/BaseComponent';
import MyBaseComponent from '../../component/MyBaseComponent';

const Pixel = new PixelUtil();

import {request} from "../../utils/RequestUtil";
import * as AppUrls from "../../constant/appUrls";
import SaasText from "../../component/SaasText";


export class CarConfigurationView extends MyBaseComponent {

    constructor(props) {
        super(props)

        const dataSource = new ListView.DataSource({
            getSectionHeaderData: (dataBlob, sectionID) => dataBlob[sectionID],
            getRowData: (dataBlob, sectionID, rowID) => dataBlob[sectionID]['data'][rowID],
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        })

        this.state = {
            renderPlaceholderOnly: this.props.carConfigurationData.length > 0 ? 'success' : 'blank',
            dataSource: dataSource,
        }
    }

    initFinish = () => {
        if (this.props.carConfigurationData.length) {
            this.setData(this.props.carConfigurationData)
        } else {
            this.loadData()
        }

    }

    loadData = () => {

        if (this.props.modelID == '' || this.props.modelID == '0') {
            this.setState({
                renderPlaceholderOnly: 'null'
            })
            return;
        }

        request(AppUrls.CAR_CONFIGURATION, 'POST', {
            model_id: this.props.modelID
        }).then((response) => {

            if (response.mycode == 1) {
                this.setData(response.mjson.data);
                this.props.renderCarConfigurationDataAction && this.props.renderCarConfigurationDataAction(response.mjson.data);
            } else {
                this.setState({
                    renderPlaceholderOnly: 'null',
                });
            }
        }, (error) => {
            this.setState({
                renderPlaceholderOnly: 'error',
            });
        })


    }

    setData = (array) => {

        let sectionID = []
        let rowIDs = []

        for (let i = 0; i < array.length; i++) {
            sectionID.push(i + '')

            let rowID = []
            for (let j = 0; j < array[i].data.length; j++) {
                rowID.push(j + '')
            }
            rowIDs.push(rowID)
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(array, sectionID, rowIDs),
            renderPlaceholderOnly: 'success'
        })

    }

    renderView() {

        if (this.state.renderPlaceholderOnly != 'success') {
            return (
                <View style={{flex: 1, backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR}}>
                    {this.loadView()}
                </View>
            )
        }

        return (
            <View style={{flex: 1, paddingTop: Pixel.getTitlePixel(64)}}>
                <ListView
                    renderRow={this._renderRow}
                    renderSectionHeader={this._renderSectionHeader}
                    removeClippedSubviews={false}
                    dataSource={this.state.dataSource}
                    renderHeader={() => {
                        return (
                            <View style={{
                                paddingHorizontal: Pixel.getPixel(15),
                                paddingVertical: Pixel.getPixel(10),
                                backgroundColor: 'white'
                            }}>
                                <Text allowFontScaling={false} style={{
                                    color: fontAndColor.COLORA0,
                                    fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28)
                                }}>{this.props.carConfiguraInfo}</Text>
                            </View>
                        )
                    }}
                />
            </View>
        )

    }


    _renderRow = (data, sectionID, rowID) => {
        //console.log(data)

        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 35,
                backgroundColor: 'white',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                borderBottomColor:fontAndColor.COLORA4,
                borderBottomWidth:StyleSheet.hairlineWidth
            }}>
                <SaasText style={{color:fontAndColor.COLORA1, fontSize:13}}>{data.title}</SaasText>
                <SaasText style={{ fontSize:14}}>{data.value==1?'标配':(data.value==0?'选配':data.value)}</SaasText>
            </View>
        )
    }

    _renderSectionHeader = (data, sectionID) => {
        return (
            <View style={{
                paddingVertical:10,
                backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR,
                justifyContent:'center',
                paddingLeft:15
            }}>
                <SaasText style={{fontSize: 12, color:fontAndColor.COLORA1,}}>{data.title}</SaasText>
            </View>
        )
    }

}



