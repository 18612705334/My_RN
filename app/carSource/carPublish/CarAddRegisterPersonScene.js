/**
 * Created by zhengnan on 2017/5/12.
 */
import React,    {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    Platform
}   from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import AllNavigationView from '../../component/AllNavigationView';
import {CellView,CellSelectView} from '../znComponent/CarPublishCell';
import *as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';

import *as AppUrls from '../../constant/appUrls';
import * as Net from '../../utils/RequestUtil';

const Pixel = new  PixelUtil();
const sceneWidth = Dimensions.get('window').width;
const IS_ANDROID = Platform.OS === 'android';



export default class CarAddRegisterPersonScene extends BaseComponent{

    initFinish=()=>{

    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.personData={};
        this.titleData = [
            [
                {
                    title:'姓名',
                    isShowTag:true,
                    isShowTail:true,
                    tailView:()=>{
                        return(
                            <View>
                                <TextInput
                                    style={styles.textInput}
                                    underlineColorAndroid='transparent'
                                    placeholder='请输入'
                                    onChangeText={(text)=>{
                                        this.personData['business_name'] = this.trimString(text);
                                    }}
                                />
                            </View>
                        )
                    }
                },{
                title:'手机号',
                isShowTag:true,
                isShowTail:true,
                tailView:()=>{
                    return(
                        <View>
                            <TextInput style={styles.textInput}
                                       underlineColorAndroid='transparent'
                                       placeholder='请输入'
                                       maxLength={11}
                                       keyboardType={'phone-pad'}
                                       onChangeText={(text)=>{
                                           this.personData['phone'] = text;
                                       }}
                            />
                        </View>
                    )
                }
            },{
                title:'身份证号码',
                isShowTag:true,
                isShowTail:true,
                tailView:()=>{
                    return(
                        <View>
                            <TextInput
                                style={styles.textInput}
                                underlineColorAndroid='transparent'
                                placeholder='请输入'
                                maxLength={18}
                                keyboardType={'numbers-and-punctuation'}
                                onChangeText={(text)=>{
                                    this.personData['cardid'] = text;
                                }}
                            />
                        </View>
                    )
                }
            },{
                title:'与本公司合作年限',
                isShowTag:true,
                isShowTail:true,
                tailView:()=>{
                    return(
                        <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                            <TextInput
                                style={styles.textInput}
                                underlineColorAndroid='transparent'
                                placeholder='请输入'
                                keyboardType={'number-pad'}
                                onChangeText={(text)=>{
                                    this.personData['cooperation_year'] = this.trimString(text);
                                }}
                            />
                            <Text allowFontScaling={false}
                                  style={styles.textInputTitle}>年</Text>
                        </View>)
                }
            },{
                title:'职位',
                isShowTag:true,
                isShowTail:true,
                tailView:()=>{
                    return(
                        <View>
                            <TextInput
                                style={styles.textInput}
                                underlineColorAndroid='transparent'
                                placeholder='请输入'
                                onChangeText={(text)=>{
                                    this.personData['position'] = this.trimString(text);
                                }}
                            />
                        </View>
                    )
                }
            },
            ]

        ];

        this.state = {
            titleData:this.titleData,
        };
    }

    render(){
        return(
            <View style={styles.rootContainer}>
                <KeyboardAvoidingView  keyboardVerticalOffset={Pixel.getTitlePixel(-64)}>
                    <ScrollView style={{width:sceneWidth,height:Dimensions.get('window').height - Pixel.getTitlePixel(64)}}>
                        {
                            this.state.titleData.map((data,index)=>{
                                return(
                                    <View style={{marginTop:10,backgroundColor:'white'}} key={index}>
                                        {
                                            data.map((rowData,subIndex)=>{
                                                return(
                                                    <CellView cellData={rowData} key={subIndex}/>
                                                )
                                            })
                                        }
                                    </View>
                                )
                            })
                        }
                        <View style={styles.footContainer}>
                            <Text allowFontScaling={false}
                                  style={{marginLeft:Pixel.getFontPixel(15),color:fontAndColor.COLORA1, fontSize:fontAndColor.LITTLEFONT28,marginBottom:Pixel.getPixel(17)}}>请确保您的企业信息填写正确</Text>
                            <TouchableOpacity onPress={this.addPersonAction}>
                                <View style={styles.footView}>
                                    <Text allowFontScaling={false}    style={styles.footText}>提交</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <AllNavigationView title="添加登记人" backIconClick={this.backPage}/>
            </View>
        )
    }


    addPersonAction=()=>{

        if(!this.personData.business_name||this.personData.business_name==''){
            this.showToast('请输入姓名');
            return;
        }
        if(!this.personData.phone||this.personData.phone==''){
            this.showToast('请输入手机号');
            return;
        }
        if(!this.isPhoneNumber(this.personData.phone)){
            this.showToast('请输入正确的手机号');
            return;
        }
        if(!this.personData.cardid||this.personData.cardid==''){
            this.showToast('请输入身份证号码');
            return;
        }
        if(!this.isCardNo(this.personData.cardid))
        {
            this.showToast('请输入正确的身份证号码');
            return;
        }
        if(!this.personData.cooperation_year||this.personData.cooperation_year==''){
            this.showToast('请输入合作年限');
            return;
        }if(!this.personData.position||this.personData.position==''){
            this.showToast('请输入职位');
            return;
        }

        this.props.showModal(true);
        this.personData['company_base_id'] = this.props.shopID;
        Net.request(AppUrls.ADD_REGISTRANT,'post',this.personData).then((response) => {

            this.props.showModal(false);
            if(response.mycode==1){
                this.props.upDataAction();
                this.backPage();
            }else {
                this.showToast(response.mjson.msg);
            }

        }, (error) => {
            if(error.mycode === -300 || error.mycode === -500){
                this.showToast('网络连接失败');
            }else{
                this.showToast(error.mjson.msg);
            }
        });
    }

    showToast=(errorMsg)=>{
        if(IS_ANDROID === true){
            this.props.showToast(errorMsg);
        }else {
            this.timer = setTimeout(
                () => { this.props.showToast(errorMsg)},
                500
            );
        }
    }

    // isCardNo=(card)=> {
    //     // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    //     var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    //     if(reg.test(card) === false)
    //     {
    //         return  false;
    //     }else {
    //         return true;
    //     }
    // }

    isCardNo=(sId)=> {

        var aCity={ 11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
            21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",
            33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",
            42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",
            51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",
            63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"
        };
        var iSum=0 ;
        var info="" ;
        if(!/^\d{17}(\d|x)$/i.test(sId))
            return false;
        sId=sId.replace(/x$/i,"a");
        if(aCity[parseInt(sId.substr(0,2))]==null)
            return false;
        sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
        var d=new Date(sBirthday.replace(/-/g,"/")) ;
        if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))
            return false;
        for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
        if(iSum%11!=1) return false;
        //aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
        return true;
    }

    isPhoneNumber=(phone)=>{

        if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))){
            return false;
        }else {
            return true
        }
    }

    trimString=(str)=>{
        return str.replace(/(^\s+)|(\s+$)/g, "");
    }
}



const styles = StyleSheet.create({
    rootContainer:{
        flex:1,
        backgroundColor:fontAndColor.COLORA3,
        paddingTop:Pixel.getTitlePixel(64),
    },
    footContainer:{
        justifyContent:'center',
        marginTop:Pixel.getPixel(20),
        marginBottom:Pixel.getPixel(20),
    },
    footView:{
        backgroundColor:fontAndColor.COLORB0,
        height:Pixel.getPixel(44),
        justifyContent:'center',
        alignItems:'center',
        width:sceneWidth-Pixel.getPixel(30),
        borderRadius:Pixel.getPixel(3),
        marginLeft:Pixel.getPixel(15),
    },
    footText:{
        textAlign:'center',
        color:'white',
        fontSize:fontAndColor.BUTTONFONT30
    },
    textInput:{
        height: Pixel.getPixel(30),
        borderColor: fontAndColor.COLORA0,
        width:Pixel.getPixel(160),
        textAlign:'right',
        fontSize:fontAndColor.LITTLEFONT28,
        paddingTop:0,
        paddingBottom:0,
        paddingLeft:0,
        paddingRight:0,
    },
    textInputTitle:{
        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        marginLeft:Pixel.getPixel(5),
        textAlign:'right',
    }
});