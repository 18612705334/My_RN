import React, {Component,PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import PixelUtil from '../../../utils/PixelUtils';
const Pixel = new PixelUtil();
import ChildTabView from './ChildTabView';


export default class RepaymenyTabBar extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            tabName: this.props.tabName
        }
    }
    goToPages = (i) => {
        this.props.goToPage(i);
    }

    setTabName=(tabName)=>{
        this.setState({
            tabName: tabName,
        });
    }

    render(){

        let tabChild = [];
        this.props.tabs.map((tab, i)=>{
            tabChild.push(
                <ChildTabView key={tab} goToPages={(i) => {
                    this.goToPages(i);
                }} tab={tab} i={i} tabName={this.props.tabName} activeTab={this.props.activeTab}/>
            )
        })

        return(
            <View style={[styles.tabs, this.props.style]}>
                {tabChild}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    tabs: {
        height: Pixel.getPixel(40),
        flexDirection: 'row',
        borderBottomColor: '#fff',
    },
});