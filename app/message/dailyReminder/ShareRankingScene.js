import React, {Component, PropTypes} from 'react'
import {
    StyleSheet,
    View,
    Text,
    ListView,
    TouchableOpacity,
    Dimensions,
    Image
} from 'react-native'

const {width, height} = Dimensions.get('window');
import BaseComponent from "../../component/BaseComponent";
import * as fontAndColor from '../../constant/FontAndColor';
import NavigatorView from '../../component/AllNavigationView';
import PixelUtil from '../../utils/PixelUtils'
import MyBaseComponent from '../../component/MyBaseComponent'
import SaasText from "../../component/SaasText";


let Pixel = new PixelUtil();

export default class ShareRankingScene extends MyBaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            renderPlaceHolderOnly: 'blank'
        }

    }

    initFinish = () => {

        let data = this.props.info;
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

        this.setState({
            dataSource: ds.cloneWithRows(data),
            // renderPlaceHolderOnly: 'success'
            renderPlaceholderOnly:'success'
        })


    }

    renderView = () => {

        return (<View style={styles.container}>
            <NavigatorView title='分享排行榜' backIconClick={this.backPage}/>
            <ListView style={{backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR, marginTop: Pixel.getTitlePixel(64), paddingTop:10}}
                      dataSource={this.state.dataSource}
                      removeClippedSubviews={false}
                      renderRow={this._renderRow}
                      enableEmptySections={true}
                      renderSeparator={this._renderSeperator}/>
        </View>);

    }

    _renderRow = (rowData, sectionID, rowID) => {
        return (
            <View style={styles.listItem}>
                {
                    rowID == 0 && <Image source={require('../../../image/message/champion.png')}
                                          style={{
                                              //marginLeft: Pixel.getPixel(15),
                                              height: Pixel.getPixel(25),
                                              width: Pixel.getPixel(25),
                                              marginLeft:15
                                          }}/>
                }
                {
                    rowID == 1 && <Image source={require('../../../image/message/second.png')}
                                          style={{
                                              //marginLeft: Pixel.getPixel(15),
                                              height: Pixel.getPixel(25),
                                              width: Pixel.getPixel(25),
                                              marginLeft:15
                                          }}/>
                }
                {
                    rowID == 2 && <Image source={require('../../../image/message/third.png')}
                                          style={{
                                              //marginLeft: Pixel.getPixel(15),
                                              height: Pixel.getPixel(25),
                                              width: Pixel.getPixel(25)
                                              ,   marginLeft:15
                                          }}/>
                }
                {
                    rowID >= 3 && <Text
                        allowFontScaling={false}
                        style={{
                            textAlign: 'center',
                            //marginLeft: Pixel.getPixel(15),
                            fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color: fontAndColor.COLORA1,
                            marginLeft:15
                        }}>{parseInt(rowID) + 1}</Text>
                }
                <SaasText style={{
                    fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                    color: fontAndColor.COLORA0
                }}>{rowData.name}</SaasText>
                <View style={{flex: 1}}/>
                <SaasText style={{
                    marginRight: Pixel.getPixel(15),
                    fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                    color: rowID === 1 || rowID === 2 || rowID === 0 ? fontAndColor.COLORB2 : fontAndColor.COLORA1
                }}>分享{rowData.count}次</SaasText>


            </View>

        )
    }

    _renderSeperator = (sectionID, rowID) => {
        return (
            <View
                key={sectionID + rowID + ''}
                style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(1)}}/>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3,
    },
    separatedLine: {
        height: 1,
        backgroundColor: fontAndColor.COLORA4
    },
    listItem: {
        alignItems: 'center',
        flexDirection: 'row',
        height: Pixel.getPixel(44),
        backgroundColor: '#ffffff',
    }
});