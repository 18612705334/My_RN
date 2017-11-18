import React from 'react';
import {
    AppRegistry,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
    Linking,
    NativeModules,
    BackAndroid,
    InteractionManager,
    ListView
} from 'react-native';

import BaseComponent from '../component/BaseComponent';
var {height, width} = Dimensions.get('window');
import * as fontAndColor  from '../constant/FontAndColor';
import  PixelUtil from '../utils/PixelUtils'
let Pixel = new PixelUtil();
import NavigationView from '../component/NavigationBar';
import GetPermissionUtil from '../utils/GetPermissionUtil';
const GetPermission = new GetPermissionUtil();
import WorkBenchItem from './component/WorkBenchItem';




export default  class WorkBenchScene extends BaseComponent{

    constructor(props){
        super(props)

        this.state ={
            renderPlaceHolderOnly:'loading',
            source:[]
        }

    }

    initFinish = ()=>{

        GetPermission.getAllList((list)=>{
            let ds  = new ListView.DataSource({rowHasChanged:(r1, r2)=>r1!==r2})
            console.log(list)
            this.setState({
                renderPlaceHolderOnly:'success',
                source:ds.cloneWithRows(list)
            })
        })

    }



    render(){

        if (this.state.renderPlaceHolderOnly !== 'success'){

            return(
                <View style = {{flex:1, backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR}}>
                    <NavigationView
                        leftImageShow={false}
                        centerText={'工作台'}
                        rightTextShow={false}
                    />
                </View>
            )
        }

        return(
            <View style = {{flex:1, backgroundColor:fontAndColor.THEME_BACKGROUND_COLOR}}>
                <NavigationView
                    leftImageShow={false}
                    centerText={'工作台'}
                    rightTextShow={false}
                />

                <ListView
                    removeClippedSubviews={false}
                    dataSource = {this.state.source}
                    renderRow = {this._renderRow}
                    showsVerticalScrollIndicator={false}
                    renderSeparator = {this._renderSeparator}
                />
            </View>
        )
    }

    _renderSeparator = (sectionID, rowID)=>{
        return(
            <View style = {{height:1, backgroundColor:fontAndColor.COLORA4}}/>
        )
    }


    _renderRow = (data, sectionID, rowID) =>{

        return(
            <WorkBenchItem
                items = {data}
                callBack = {this.props.callBack}
            />
        )
    }
}


