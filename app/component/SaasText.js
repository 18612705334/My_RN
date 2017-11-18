/**
 * Created by dingyonggang on 2017/10/27.
 */
import React, {Component} from "react";
import {
    Text
} from "react-native";

export default class SaasText extends Component{
    render(){
        return(
            <Text
                allowFontScaling = {false}
                {...this.props}
            >{this.props.children}</Text>
        )
    }
}