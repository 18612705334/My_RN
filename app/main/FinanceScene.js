
import  React, {Component, PropTypes} from  'react'
import  {
    View,
    Text,
    ListView,
    StyleSheet,
    Dimensions,
    Image,
    InteractionManager,
    TouchableOpacity,
    RefreshControl,
    NativeModules,
    BackAndroid
} from  'react-native'

import  HomeHeaderItem from './component/HomeHeaderItem';
import  PixelUtil from '../utils/PixelUtils'
import KurongDetaileScene from '../finance/lend/KurongDetaileScene';
import ChedidaiDetaileScene from '../finance/lend/ChedidaiDetaileScene';
import DDDetailScene from '../finance/lend/DDDetailScene';
import DDApplyLendScene from '../finance/lend/DDApplyLendScene';

import CGDDetailSence from '../finance/lend/CGDDetailSence';
import SingDetaileSence from '../finance/lend/SingDetaileSence';
import  StorageUtil from '../utils/StorageUtil';
import * as storageKeyNames from '../constant/storageKeyNames';
let Pixel = new PixelUtil();
/*
 * 获取屏幕的宽和高
 **/
const {width, height} = Dimensions.get('window');
import LendMoneySence from '../finance/lend/LendMoneyScene';

import MyButton from '../component/MyButton';
import RepaymentScene from '../finance/repayment/RepaymentScene';
import BaseComponent from '../component/BaseComponent';
import {request} from '../utils/RequestUtil';
import  LoadMoreFooter from '../component/LoadMoreFooter';
import * as Urls from '../constant/appUrls';
import * as fontAndColor from '../constant/FontAndColor';
import SelectCompanyScene from '../finance/SelectCompanyScene';
import AginSelectCompanyScene from '../finance/AginSelectCompanyScene';
import QuotaApplication from '../login/QuotaApplication';
import {LendSuccessAlert} from '../finance/lend/component/ModelComponent'
let loanList = [];
import CGDLendScenes from '../finance/lend/CGDLendScenes';
import AccountModal from '../component/AccountModal';
import ReceiptInfoScene from '../finance/page/ReceiptInfoScene';
import AccountTypeSelectScene from '../mine/accountManage/AccountTypeSelectScene'
import WaitActivationAccountScene from '../mine/accountManage/WaitActivationAccountScene'
import BindCardScene from '../mine/accountManage/BindCardScene'
import FinanceItem from '../finance/component/FinanceItem'

let firstType = '-1';
let lastType = '-1';

let mnyData = {};
let movies = [];
let page = 1;
let allPage = 0;


let ds = new ListView.DataSource({rowHasChanged:(r1, r2)=>r1!==r2});

export default  class FinanceScene extends BaseComponent{

    constructor(props) {
        super(props);
        firstType = '-1';
        lastType = '-1';
        movies = [];
        page = 1;
        this.state = {
            source: ds.cloneWithRows([]),
            allData: {
                keyongedu: mnyData.credit_maxloanmny / 10000,
                daikuanyue: mnyData.loan_balance_mny / 10000,
                baozhengjinedu: mnyData.bond_total_mny / 10000,
                baozhengjinyue: mnyData.bond_mny / 10000,
                microchineseTitle: '',
            },
            mnyData: mnyData,
            renderPlaceholderOnly: 'loading',
            isRefreshing: false,
            customerName: ''
        };
    }

    componentDidMount(){
        super.componentDidMount()
    }


    initFinish = () =>{
        this.getMnyData();
        this.getAccountInfo();
    }

    getMnyData = ()=>{
        let maps = {
            api:Urls.GET_MNY
        }

        request(Urls.FINANCE, 'POST', maps, ()=>{}).then((response)=>{
            if (response.mycode === 1){

                mnyData = response.mjson.data;
                let title = '';
                if (mnyData.is_microchinese_mny == 1) {
                    title = '立即激活微单额度';
                } else if (mnyData.is_microchinese_mny == 2) {
                    title = '待审核';
                } else if (mnyData.is_microchinese_mny == 4) {
                    title = '审核不通过';
                }
                this.setState({
                    allData: {
                        keyongedu: mnyData.credit_maxloanmny / 10000,
                        daikuanyue: mnyData.loan_balance_mny / 10000,
                        baozhengjinedu: mnyData.bond_total_mny / 10000,
                        baozhengjinyue: mnyData.bond_mny / 10000,
                        microchineseTitle: title,
                    },
                    mnyData: mnyData,
                });
                this.getApplyData();

            }else {
                //this.props.showToast(response.msg)
            }


        }, (error)=>{

            this.setState({renderPlaceholderOnly: 'error'});

        })


    }

    getApplyData =  ()=>{

        let maps = {
            api: Urls.GET_APPLY_LIST,
            p: page
        };
        request(Urls.FINANCE, 'Post', maps, () => {
            this.props.backToLogin();
        })
            .then((response) => {
                    movies.push(...response.mjson.data.list);
                    allPage = response.mjson.data.page;
                    StorageUtil.mGetItem(storageKeyNames.LOAN_SUBJECT, (data) => {
                        if (data.code == 1) {
                            let datas = JSON.parse(data.result);
                            let names = '';
                            if (datas.companyname == null || datas.companyname == '') {
                                names = datas.name;
                            } else {
                                names = datas.companyname;
                            }
                            this.setState({
                                renderPlaceholderOnly: 'success',
                                source: ds.cloneWithRows(movies),
                                isRefreshing: false,
                                customerName: names
                            });
                        }
                    })

                },
                (error) => {
                    if (error.mycode == '-2100045') {
                        StorageUtil.mGetItem(storageKeyNames.LOAN_SUBJECT, (data) => {
                            if (data.code == 1) {
                                let datas = JSON.parse(data.result);
                                this.setState({
                                    isRefreshing: false,
                                    renderPlaceholderOnly: 'success',
                                    source: ds.cloneWithRows(['1']),
                                    customerName: datas.companyname
                                });
                            }
                        })

                    } else {
                        this.setState({renderPlaceholderOnly: 'error'});
                    }
                });

    }

    getAccountInfo = ()=>{

        StorageUtil.mGetItem(storageKeyNames.LOAN_SUBJECT, (data)=>{
            console.log(data)
            if(data.code === 1){
                let result = JSON.parse(data.result)
                let maps = {
                    enter_base_ids: result.company_base_id,
                    child_type:'1'
                }

                request(Urls.USER_ACCOUNT_INFO, 'POST', maps).then((response)=>{
                    if(response.mycode === 1){
                        lastType = response.mjson.data.account.status;
                    }
                }, (error)=>{

                })


            }

        })

    }

    render(){

        if (this.state.renderPlaceholderOnly !== 'success'){

            return(
                <View>{this.loadView()}</View>
            )
        }
        return(


           <ListView
               enableEmptySections = {true}
               removeClippedSubviews = {false}
               dataSource = {this.state.source}
               renderHeader = {this._renderHeader}
               renderRow = {this._renderRow}
               renderFooter = {this._renderFooter}
               onEndReached={this.toEnd}
               onEndReachedThreshold = {1}

               refreshControl = {
                   <RefreshControl
                       refreshing = {this.state.isRefreshing}
                       onRefresh = {this.refreshingData}
                       tintColor={[fontAndColor.NAVI_BAR_COLOR]}
                       colors={[fontAndColor.NAVI_BAR_COLOR]}
                   />
               }
           />
        )
    }


    refreshingData = ()=>{

        this.setState({
            isRefreshing:true,
        })

        page = 1;
        movies = [];
        this.initFinish();
    }

    _renderRow = (data, sectionID, rowID)=>{

        if(data === '1'){
            return(<View/>)
        }
        return(
            <FinanceItem
                onPress = {()=>{}}
                data = {data}
                name = {this.state.customerName}
            />

            )
    }

    _renderHeader = ()=>{

        return(
            <View>
                <View>
                    <Image
                        source = {require('../../image/financeImages/dinancebg.png')}
                        style = {{width:width, height:230, justifyContent:'center', alignItems:'center'}}
                    >
                        <Text allowFontScaling = {false} style = {{color:'white', fontSize:23, marginBottom:25}}>金融({this.state.customerName})</Text>

                        <View style = {{flexDirection:'row', marginBottom:30}}>
                            <View style = {{flex:1, alignItems:'center', borderRightColor:'white', borderRightWidth:StyleSheet.hairlineWidth}}>
                                <Text allowFontScaling = {false} style = {{color:'white', marginBottom:5}}>可用额度(万)</Text>
                                <Text allowFontScaling = {false} style = {{color:'white', fontSize:30,fontWeight:'bold'}}>{this.state.allData.keyongedu}</Text>

                            </View>
                            <View style = {{flex:1, alignItems:'center'}}>
                                <Text allowFontScaling = {false} style = {{color:'white',marginBottom:5}}>贷款余额(万)</Text>
                                <Text allowFontScaling = {false} style = {{color:'white',fontSize:30,fontWeight:'bold'}}>{this.state.allData.daikuanyue}</Text>

                            </View>

                        </View>


                        <View style = {{backgroundColor:'rgba(56,199,232,0.35)', position:'absolute', height:40, width:width, bottom:0, flexDirection:'row'}} >
                            <View style = {{flex:1, flexDirection:"row", alignItems:'center'}}>
                                <Text allowFontScaling = {false} style = {{color:'white', marginLeft:15,}} >保证金额度:</Text>
                                <Text allowFontScaling = {false} style={{fontWeight:'bold', color:'white'}}>{this.state.allData.baozhengjinedu}万</Text>
                            </View>
                            <View  style = {{flex:1, flexDirection:"row", alignItems:'center'}}>
                                <Text allowFontScaling = {false} style = {{flex:1, color:'white', textAlign:'right'}}>保证金余额: </Text>
                                <Text allowFontScaling = {false} style = {{marginRight:15, color:'white', fontWeight:'bold'}}>{this.state.allData.baozhengjinyue}万</Text>
                            </View>
                        </View>

                    </Image>

                </View>
                <View style = {{flexDirection:'row', flexWrap:'wrap',paddingBottom:10, backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR}}>
                    <HeaderItem
                        image = {require('../../image/financeImages/borrowicon.png')}
                        title = {'借款'}
                        subtitle = {'一步快速搞定'}
                        style = {{borderRightWidth:1, borderRightColor:fontAndColor.COLORA4}}
                        onPress = {()=>{

                        }}

                    />
                    <HeaderItem
                        image = {require('../../image/financeImages/repaymenticon.png')}
                        title = {'还款'}
                        subtitle = {'智能自动提醒'}
                        onPress = {()=>{

                        }}
                    />

                </View>
            </View>
        )

    }

    _renderFooter = ()=>{
        return(

            <View style = {{marginVertical:15, alignItems:'center'}}>
                {
                    page > allPage ?
                        <Text>已无更多数据</Text>
                        :   <Text>loadding...</Text>

                }

            </View>
        )

    }

    toEnd = () => {
        if(page>allPage){
            return;
        }
        page++;
        this.getApplyData();
    }



}

class HeaderItem extends Component{
    render(){
        return(

            <View style = {[{backgroundColor:'white', flexDirection:'row', alignItems:'center', flex:1, height:80, width:width/2}, this.props.style]}>
                <TouchableOpacity
                    onPress = {this.props.onPress}
                    activeOpacity = {.6}
                >
                    <Image source = {this.props.image} style = {{width:46, height:46, marginLeft:15,}}/>
                </TouchableOpacity>

                <View style = {{marginLeft:5}}>
                    <Text allowFontScaling = {false} style = {{fontSize:16, marginBottom:5}}>{this.props.title}</Text>
                    <Text allowFontScaling = {false} style = {{fontSize:15, color:fontAndColor.COLORA1}}>{this.props.subtitle}</Text>
                </View>

            </View>
        )
    }
}







