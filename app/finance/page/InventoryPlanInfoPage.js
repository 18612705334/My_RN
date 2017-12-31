/**
 * Created by lhc on 2017/2/15.
 */
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
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
let movies = {};
import BaseComponent from '../../component/BaseComponent';
import  InventoryRepaymentInfoTop from '../repayment/component/NewInventoryRepaymentInfoTop';
import  InventoryAdjustInfoScene from '../repayment/InventoryAdjustInfoScene';
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
export default class InventoryRepaymentInfoScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            source: [],
            renderPlaceholderOnly: 'blank'
        };
    }

    componentDidMount() {
        //InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: 'loading'});
            this.initFinish();
        //});
    }

    initFinish = () => {
        this.getData();
    }

    allRefresh = () => {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.getData();
    }

    getData = () => {
        let maps = {
            api: Urls.REPAYMENT_GETONLINEINFO,
            loan_id: this.props.loan_id,
            type: '4',
        };
        request(Urls.FINANCE, 'Post', maps)
            .then((response) => {
                    movies = response.mjson.data;
                    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    this.setState({renderPlaceholderOnly: 'success', source: ds.cloneWithRows(movies.list)});
                },
                (error) => {
                    this.setState({renderPlaceholderOnly: 'error'});
                });
    }



    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <InventoryRepaymentInfoTop itemData={movies}/>
                <ListView
                    removeClippedSubviews={false}
                    style={{marginTop: Pixel.getPixel(10)}}
                    dataSource={this.state.source}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor:fontAndColor.COLORA3,alignItems: 'center'}}>
                {this.loadView()}
            </View>
        );
    }

    _renderRow = (movie, sectionId, rowId) => {
        let repaymentStatus = '';
        if (movie.status == '0') {
            repaymentStatus = '未还';
        } else if (movie.status == '1') {
            repaymentStatus = '待确认';
        } else {
            repaymentStatus = '已还';
        }
        return (
            <TouchableOpacity onPress={()=>{
                 if(movie.adjustmoney!=null&&movie.adjustmoney!='0'&&movie.adjustmoney!='无'&&movie.adjustmoney!=' '){

                     this.props.callBack({name:'InventoryAdjustInfoScene',component:InventoryAdjustInfoScene,params:{planid:movie.planid}});
                 }
            }} activeOpacity={0.8}
                              style={{width:width,height:Pixel.getPixel(75),
                backgroundColor: '#ffffff',flexDirection:'row',
                paddingRight:Pixel.getPixel(15),paddingLeft:Pixel.getPixel(15)}}>
                <View style={{flex:1,justifyContent:'center'}}>
                    <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30), color:fontAndColor.COLORA0}}>
                        还款日：{movie.dead_line}</Text>
                    <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                    color:fontAndColor.COLORA1,marginTop:Pixel.getPixel(9)}}>{repaymentStatus}</Text>
                </View>
                <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                    <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                    color:fontAndColor.COLORB2,}}>
                        {movie.plantype == '1' ? '本'+movie.repaymentmny : '息'+movie.repaymentmny}
                    </Text>
                    <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                    color:fontAndColor.COLORA1,marginTop:Pixel.getPixel(9)}}>调整：{movie.adjustmoney}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _renderSeparator(sectionId, rowId) {

        return (
            <View style={styles.Separator} key={sectionId + rowId}>
            </View>
        )
    }

}
const styles = StyleSheet.create({

    image: {
        width: 43,
        height: 43,
    },
    Separator: {
        height: Pixel.getPixel(1),
        backgroundColor: fontAndColor.COLORA3

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'},
    parentStyle: {
        height: Pixel.getPixel(44),
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        backgroundColor: fontAndColor.COLORB0,
    },
    childStyle: {
        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
        color: '#ffffff',
    }
})