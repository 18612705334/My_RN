
import React, {Component, PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';
import Confirm from './Confirm'
import Toast from './Toast'


const {width, height}  = Dimensions.get('window');


export default class ShowToast extends PureComponent{

    static TOAST = '1';
    static CONFIRM = '2';

    constructor(props){
        super(props);

        this.state = {
            msg:'',
            height:0,
        }
    }

    _toastOnPress = ()=>{
        this.setState({height:height});
        this.refs.toast.changeType(this.state.toastType);
        this.refs.toast.open();
        this.timer = setTimeout(()=>{},1000);
    }

    _confirmOnPress = ()=>{
        this.refs.confirm.open()
    }


    changeType = (_type, msg) => {
        if (_type === ShowToast.TOAST) {
            this.setState({
                msg: msg
            });
            this._toastOnPress();
        } else if (_type === ShowToast.CONFIRM) {
            this._confirmOnPress();
        }
    }

    showModal=(value)=>{
        if (value){
            this.setState({
                height:height
            })
        }else {
            this.setState({
                height:0
            })
        }
        this.refs.toast.openLoading(value);

    }


    render(){
        return (
            <View style={{width:width,height:this.state.height,position:'absolute',overflow:'hidden'}}>
                <Toast hide = {()=>{this.setState({height:0});}} ref='toast' msg = {this.state.msg}/>
                <Confirm ref='confirm' leftFunc={this.props.leftCallBack} rightFunc={this.props.rightCallBack}
                         btnLeftText={this.props.leftText}
                         btnRightText={this.props.rightText} title={this.props.title} msg={this.props.msg}/>

            </View>
        )
    }


}

//
// const styles = StyleSheet.create({
//     style_container : {
//         width:width,
//         height:this.state.height,
//         position:'absolute',
//         overflow:'hidden'
//     }
// })




