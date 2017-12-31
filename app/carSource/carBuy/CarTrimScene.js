import React,{Component} from 'react';
import {

    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    ListView,
    Dimensions,
    DeviceEventEmitter,

} from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import AllNavigationView from  '../../component/AllNavigationView';
import CarTrimHeaderView from './View/CarTrimHeaderView';
import CarTrimTaskCell from './View/CarTrimTaskCell';
import *as fontAndColor from  '../../constant/FontAndColor';
import PixelUtil from  '../../utils/PixelUtils';
import CarInitialTaskScene from "./CarInitialTaskScene";
import CarTrimInformationScene from "./CarTrimInformationScene";
import CarManagerTaskScene from "./CarManagerTaskScene";
import CarOperationScene from "./CarOperationScene";
import EvaluateCarInfo from "../../mine/setting/EvaluateCarInfo";
import WriteArrangeCostDetailTWO from "../../mine/setting/WriteArrangeCostDetailTWO";
import * as AppUrls from "../../constant/appUrls";
import  {request}           from '../../utils/RequestUtil';
import  GetPermissionUtil from '../../utils/GetRoleUtil';

let Pixel = new  PixelUtil();
let getRole = new GetPermissionUtil();
const sceneWidth = Dimensions.get('window').width;


export default class CarTrimScene extends BaseComponent {

    render(){
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    {this.loadView()}
                    <AllNavigationView title='车辆整备' backIconClick={this.backPage}/>
                </View>);
        }
        return(
            <View style={styles.rootContainer}>
                <ListView
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderHeader={()=>{return(<TrimTaskHeadView defaultIndex={this.props.defaultIndex} ref="headView" headerViewItemClick={this.headerViewItemClick} selectAction={this.selectAction}/>)}}
                    renderRow={this.renderRow}
                />
                {
                    this.state.isLoading && (
                        <View style={styles.loadingView}>
                            <Image style={{width:60,height:60}} source={require('../../../image/setDataLoading.gif')}/>
                        </View>
                    )
                }
                <AllNavigationView title='车辆整备' backIconClick={this.backPage} renderRightFootView={this.renderRightView}/>

            </View>
        )
    }



    // 构造
    constructor(props) {
        super(props);


        if(this.props.defaultIndex){

            switch(this.props.defaultIndex){
                case 0:
                    this.roleTitle = '手续员';
                    this.roleValue = 'sxy';
                    break;
                case 1:
                    this.roleTitle = '评估师';
                    this.roleValue = 'pgs';
                    break;
                case 2:
                    this.roleTitle = '整备员';
                    this.roleValue = 'zby';
                    break;
                case 3:
                    this.roleTitle = '经理';
                    this.roleValue = 'manager';
                    break;
                case 4:
                    this.roleTitle = '运营专员';
                    this.roleValue = 'yyzy';
                    break;
                default:
                    this.roleTitle = '手续员';
                    this.roleValue = 'sxy';
                    break;
            }

        }else {
            this.roleTitle = '手续员';
            this.roleValue = 'sxy';
        }


        const ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1==r2});
        this.state = {
            isShowHeadView:true,
            dataSource:ds,
            taskType:1,
            renderPlaceholderOnly:'loading',
            isLoading:false,

        };
    }

    renderRow=(rowData)=>{
        return(
            <CarTrimTaskCell cellData={rowData} btnTitle={this.state.taskType == 1? '跟进':'查看'} cellBtnClick={()=>{
                if(this.state.taskType==1){
                    this.cellBtnClick(1,rowData);
                }else {
                    this.cellBtnClick(2,rowData);
                }
            }}/>
        )
    }


    /**
     * 导航右侧按钮
     */
    renderRightView=()=>{

        let isRender = false;
        for(let item of this.roleList)
        {
            if(item.name =='手续员')
            {
                isRender = true;
                break;
            }
        }

        if(!isRender){
            return null;
        }

        return(
            <TouchableOpacity onPress={()=>{

                this.toNextPage(
                    {
                        name: 'CarInitialTaskScene',
                        component: CarInitialTaskScene,
                        params: {

                        }
                    }
                );
            }}>
                <View style={{marginLeft:Pixel.getPixel(20),width:Pixel.getPixel(50),height:Pixel.getPixel(40),justifyContent:'center',
                    alignItems:'center'}}>
                    <Text allowFontScaling={false}  style={{color:'white', fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30)}}>创建</Text>
                </View>
            </TouchableOpacity>
        )
    }

    initFinish=()=>{
        getRole.getRoleList((data)=>{

            this.roleList = data;
            this.setState({
                renderPlaceholderOnly:'success'
            });
            this.loadData(this.roleValue,this.state.taskType);
        });

    }

    componentWillMount() {
        this.subscription = DeviceEventEmitter.addListener('carTrimUpdate',()=>{
            console.log('=======开始更新了');
            this.loadData(this.roleValue,this.state.taskType);
        });
    }

    componentWillUnMount() {
        this.subscription.remove();
    }

    reloadData=()=>{
        this.loadData(this.roleValue,this.state.taskType);
    }



    loadData=(roleValue,type)=>{

        this.setState({
            dataSource:this.state.dataSource.cloneWithRows([]),
            taskType:type
        });

        let isRole = true;
        for(let item of this.roleList)
        {
            if(item.name == this.roleTitle)
            {
                isRole = false;
                break;
            }
        }
        if(type==1)
        {
            if(roleValue=='sxy' ||  isRole)
            {
                return;
            }
        }


        this.setState({isLoading:true});
        request(AppUrls.CAR_CHESHANG_TASKS, 'post', {roleName:roleValue,type:type,}).then((response) => {
            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(response.mjson.data),
                taskType:type,
                isLoading:false
            });

        }, (error) => {
            this.setState({isLoading:false});
            this.props.showToast(error.mjson.msg);
        });
    }

    /**
     * from @zn
     * 角色切换事件
     * @param title
     */
    headerViewItemClick=(title,value)=>{
        this.roleTitle = title;
        this.roleValue = value;
    }

    /**
     * 任务状态切换  1未办理，2已办理
     * @param type
     */
    selectAction=(type)=>{
        this.loadData(this.roleValue,type);
    }


    cellBtnClick=(type,carData)=>{

        // 1 未办理 2，已办理
        if(type==1){
            if(this.roleTitle == '评估师'){

                this.toNextPage(
                    {
                        name: 'EvaluateCarInfo',
                        component: EvaluateCarInfo,
                        params: {
                            carData:carData,
                            reloadTaskData:this.reloadData,
                        }
                    }
                );

            } else if(this.roleTitle == '整备员')
            {
                this.toNextPage(
                    {
                        name: 'CarTrimInformationScene',
                        component: CarTrimInformationScene,
                        params: {
                            type:type,
                            taskid:carData.id,
                            roleName:this.roleValue,
                            reloadTaskData:this.reloadData,
                        }
                    }
                );
            }else if(this.roleTitle == '经理')
            {
                this.toNextPage(
                    {
                        name: 'CarManagerTaskScene',
                        component: CarManagerTaskScene,
                        params: {
                            type:type,
                            taskid:carData.id,
                            roleName:this.roleValue,
                            reloadTaskData:this.reloadData,
                        }
                    }
                );
            }else if(this.roleTitle == '运营专员')
            {
                this.toNextPage(
                    {
                        name: 'CarOperationScene',
                        component: CarOperationScene,
                        params: {
                            type:type,
                            taskid:carData.id,
                            roleName:this.roleValue,
                            reloadTaskData:this.reloadData,
                        }
                    }
                );
            }
        }else {
            if(this.roleTitle =='手续员'){

                this.toNextPage(
                    {
                        name: 'CarInitialTaskScene',
                        component: CarInitialTaskScene,
                        params: {
                            type:type,
                            taskid:carData.id,
                            roleName:this.roleValue
                        }
                    }
                );

            }else if(this.roleTitle == '评估师'){

                this.toNextPage(
                    {
                        name: 'WriteArrangeCostDetailTWO',
                        component: WriteArrangeCostDetailTWO,
                        params: {
                            type:type,
                            taskid:carData.id,
                            roleName:this.roleValue
                        }
                    }
                );

            } else if(this.roleTitle == '整备员')
            {
                this.toNextPage(
                    {
                        name: 'CarTrimInformationScene',
                        component: CarTrimInformationScene,
                        params: {
                            type:type,
                            taskid:carData.id,
                            roleName:this.roleValue,
                            reloadTaskData:this.reloadData,
                        }
                    }
                );
            }else  if(this.roleTitle == '经理')
            {
                this.toNextPage(
                    {
                        name: 'CarManagerTaskScene',
                        component: CarManagerTaskScene,
                        params: {
                            type:type,
                            taskid:carData.id,
                            roleName:this.roleValue,
                        }
                    }
                );
            }else if(this.roleTitle == '运营专员')
            {
                this.toNextPage(
                    {
                        name: 'CarOperationScene',
                        component: CarOperationScene,
                        params: {
                            type:type,
                            taskid:carData.id,
                            roleName:this.roleValue,
                        }
                    }
                );
            }
        }

    }

}

class TrimTaskHeadView extends Component{
    render(){
        return(
            <View style={{marginBottom:Pixel.getPixel(10)}}>
                <CarTrimHeaderView defaultIndex={this.props.defaultIndex} click={(title,value)=>{this.props.headerViewItemClick(title,value);this.setSelectType(1)}}/>
                <TrimTaskSelectView ref="TrimTaskSelectView" selectAction={this.props.selectAction}/>
            </View>
        )
    }

    setSelectType =(type)=>{
        if(this.refs.TrimTaskSelectView)
        {
            this.refs.TrimTaskSelectView.setSelectType(type);
        }
    }
}


class TrimTaskSelectView extends Component {

    render(){
        return(
            <View style={styles.selectView}>
                <TouchableOpacity onPress={()=>{
                    this.setSelectType(1);
                }}>
                    <View style={[styles.selectContenView,this.state.currentSeletType==1&&{borderBottomColor:fontAndColor.NAVI_BAR_COLOR}]}>
                        <Text style={styles.selectText}>未办任务</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    this.setSelectType(2);
                }}>
                    <View style={[styles.selectContenView,this.state.currentSeletType==2&&{borderBottomColor:fontAndColor.NAVI_BAR_COLOR}]}>
                        <Text style={styles.selectText}>已办任务</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            currentSeletType:1,
        };
    }

    setSelectType=(type)=>{
        this.setState({
            currentSeletType:type,
        });
        this.props.selectAction(type);

    }

}



const styles = StyleSheet.create({
    rootContainer:{
        flex:1,
        backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR,
        paddingTop:Pixel.getTitlePixel(64),
    },
    footBtn:{
        left:0,
        bottom:0,
        right:0,
        backgroundColor:fontAndColor.NAVI_BAR_COLOR,
        justifyContent:'center',
        alignItems:'center',
        position: 'absolute',
        height:Pixel.getPixel(44),
    },
    footBtnText:{
        textAlign:'center',
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        color:'white',
    },
    selectView:{
        height:Pixel.getPixel(44),
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center',
        width:sceneWidth,
    },
    selectContenView:{
        width:sceneWidth *0.5,
        height:Pixel.getPixel(44),
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
        borderBottomColor:'white',
        borderBottomWidth:Pixel.getPixel(2),
    },
    selectText:{
        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
        textAlign:'center',
    },
    loadingView:{
        left:0,
        bottom:0,
        right:0,
        top:0,
        justifyContent:'center',
        alignItems:'center',
        position: 'absolute',
    },
});
