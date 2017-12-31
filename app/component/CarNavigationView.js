import React, {Component, PureComponent} from 'react';

import {

    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,

} from 'react-native';

import *as fontAndColor from '../constant/FontAndColor';
import PixelUtil from '../utils/PixelUtils';
import SaasText from "./SaasText";

const Pixel = new PixelUtil();

export default class CarNavigationView extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            navigationBackgroundColor: false,

        };

    }

    setNavigationBackgroindColor = (bool) => {
        this.refs.navigationRightView.changeImgClick(bool);
        this.setState({
            navigationBackgroundColor: bool,
        })
    }

    render() {
        const {title, backIconClick, wrapStyle, isStore, addStoreAction, cancelStoreAction, showShared} = this.props;

        return (
            <View
                style={[styles.navigation, wrapStyle, this.state.navigationBackgroundColor && {backgroundColor: fontAndColor.NAVI_BAR_COLOR}]}>
                <View style={styles.content}>
                    <TouchableOpacity
                        onPress={backIconClick}
                        style={{height: 64, width: 100, justifyContent: 'center',}}
                    >
                        {backIconClick && <Image style={styles.backIcon}
                                                 source={this.state.navigationBackgroundColor == false ? require('../../image/carSourceImages/back.png') : require('../../image/mainImage/navigatorBack.png')}/>}
                    </TouchableOpacity>
                    <SaasText style={styles.titleText}>{title}</SaasText>
                    <View style={styles.imageFoot}>
                        <NavigationRightView
                            ref={'navigationRightView'}
                            cancelStoreAction={cancelStoreAction}
                            addStoreAction={addStoreAction}
                            showShared={showShared}
                            isStore={isStore}
                        />
                    </View>
                </View>
            </View>
        )

    }

}

class NavigationRightView extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isStore: this.props.isStore,
            isChangeImg: false
        }
    }

    isStoreClick = (isStore) => {

        this.setState({
            isStore: isStore,
        })
    }


    changeImgClick = (bool) => {
        this.setState({
            isChangeImg: bool,
        })
    }

    render() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        if (this.state.isStore) {
                            this.props.cancelStoreAction(this.isStoreClick)
                        } else {
                            this.props.addStoreAction(this.isStoreClick)
                        }
                    }}
                >
                    <Image
                        source={this.state.isChangeImg === false ? (this.state.isStore ? require('../../image/carSourceImages/presc.png') : require('../../image/carSourceImages/newsc.png')) : (this.state.isStore ? require('../../image/carSourceImages/store.png') : require('../../image/carSourceImages/storenil.png'))}/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={this.props.showShared}
                >
                    <Image
                        source={this.state.isChangeImg === false ? require('../../image/carSourceImages/newfx.png') : require('../../image/carSourceImages/share_nil.png')}/>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({

    content: {
        marginTop: 20,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    backIcon: {

        marginLeft: Pixel.getPixel(12),
    },
    navigation: {
        height: Pixel.getTitlePixel(64),
        backgroundColor: fontAndColor.NAVI_BAR_COLOR,
        left: 0,
        right: 0,
        position: 'absolute',
        top:0
    },

    titleText: {
        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.NAVIGATORFONT34),
        textAlign: 'center',
        backgroundColor: 'transparent',

    },
    imageFoot: {

        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: Pixel.getPixel(80),
        marginRight: Pixel.getPixel(15),


    },
})