import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    Image,
    Platform,
    Alert,
    AppState
} from 'react-native';

import * as WeChat from 'react-native-wechat'
import MyNavigator from './component/MyNavigator'
import ShowToast from './component/toast/ShowToast'

export default class Root extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount(){
        //WeChat.registerApp('wx6211535f6243c779')
        global.iosIDFA = this.props.IDFA;
        global.phoneVersion = this.props.phoneVersion;
        global.phoneModel = this.props.phoneModel;
        global.appVersion = this.props.appVersion;

    }

    render() {
        return (

            <View style={styles.style_contain}>
                <MyNavigator
                    showToast={(content) => {
                        this.showToast(content)
                    }}
                    showModel = {(value)=>{
                        this.showModel(value)
                    }}
                />
                <ShowToast ref='toast' msg = {''} />
            </View>

        )
    }

    showToast = (content) => {


    }

    showModel = (value) => {


    }
}


const styles = StyleSheet.create({
    style_contain: {
        flex: 1,
    }
})