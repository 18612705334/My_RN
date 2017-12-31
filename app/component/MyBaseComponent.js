import React, {Component} from "react";
import {
    AppRegistry,
    View,
    TouchableOpacity,
    Navigator,
    TouchableHighlight,
    BackAndroid,
    InteractionManager,
    TouchableWithoutFeedback,
    Dimensions,
    Image,
    Text,
} from "react-native";
import PixelUtil from "../utils/PixelUtils";
import * as fontAndColor from "../constant/FontAndColor";
import MyButton from "./MyButton";

const {width, height} = Dimensions.get('window');
const Pixel = new PixelUtil();
import ConsoleUtils from "../utils/ConsoleUtils";
import BaseComponent from './BaseComponent'

const Console = new ConsoleUtils();
import NavigatorView from '../component/AllNavigationView';


export default class MyBaseComponent extends BaseComponent {

    constructor(props) {
        super(props)
        this.state = {
            title: '导航'
        }
    }

    render() {

        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={{backgroundColor: fontAndColor.THEME_BACKGROUND_COLOR, flex: 1}}>
                    <NavigatorView
                        title={this.state.title}
                    />
                    {this.loadView()}
                </View>
            )
        }

        if (this.state.renderPlaceholderOnly == 'null') {
            return(
                this.renderNullView()
            )
        }
        if (this.state.renderPlaceholderOnly == 'success') {
            return (
                this.renderView()
            )
        }


    }
}