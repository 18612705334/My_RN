import React, {Component,PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import * as  fontAndColor from '../../../constant/FontAndColor';
import PixelUtil from '../../../utils/PixelUtils';
import SaasText from "../../../component/SaasText";
const Pixel = new PixelUtil();



export default class ChildTabView extends PureComponent{

    constructor(props) {
        super(props);
        this.state = {
            tabName: this.props.tabName
        }
    }

    render(){
        let that = this;
        return(

            <TouchableOpacity
                onPress={()=>{
                    this.props.goToPages(this.props.i)
                }}
                style={styles.tab}
            >
                <View  style={[{flex: 1, height: Pixel.getPixel(38), justifyContent: 'center', alignItems: 'center'}]}>
                    <SaasText
                        ref="ttt"
                        style={[this.props.activeTab === this.props.i ? {color: fontAndColor.COLORB0} : {color: fontAndColor.COLORA0},
                            {fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}]}
                    >
                        {that.state.tabName[this.props.i]}
                    </SaasText>
                </View>
                <View
                    style={[{height:2}, this.props.activeTab === this.props.i?{backgroundColor: fontAndColor.COLORB0} : {backgroundColor: '#ffffff'}]}
                />
            </TouchableOpacity>

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

