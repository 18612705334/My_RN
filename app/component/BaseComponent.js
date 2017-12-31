import React, {Component} from "react";
import {
    AppRegistry,
    View,
    TouchableOpacity,
    Navigator,
    TouchableHighlight,
    BackHandler,
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

const Console = new ConsoleUtils();
export default class BaseComponent extends Component {
    /**
     * from @zhaojian
     *
     * 监听回退键
     **/
    handleBack = () => {
        this.backPage();
        return true;
    }

    componentDidMount() {

        // InteractionManager.setDeadline(500);
        try {
            BackHandler.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {

        } finally {
            //InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: 'loading'});
            this.initFinish();
            // });
        }


    }

    toNextPage = (mProps) => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.push({
                ...mProps
            })
        }
    }

    resetRoute = (mProps) => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.immediatelyResetRouteStack([{
                ...mProps
            }])
        }
    }


    backPage = () => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.pop();
        }
    }

    backToTop = () => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.popToTop();
        }
    }


    showConsole = (content) => {
        Console.showConsole(content);
    }

    componentWillUnmount() {
    }

    allRefreshParams = {
        buttonType: MyButton.TEXTBUTTON,
        parentStyle: {
            height: Pixel.getPixel(40),
            width: Pixel.getPixel(140),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: fontAndColor.NAVI_BAR_COLOR,
            marginTop: Pixel.getPixel(66)
        },
        childStyle: {
            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
            color: '#ffffff',
        },
        opacity: 0.8,
        content: '刷新',
        mOnPress: () => {
            this.allRefresh();
        }
    }
    allRefresh = () => {

    }

    loadView = () => {
        let view;
        let margintop = 0;
        if (this.state.loadingMarginTop) {
            margintop = this.state.loadingMarginTop;
        }
        if (this.state.renderPlaceholderOnly === 'blank') {
            view = <View/>
        } else if (this.state.renderPlaceholderOnly === 'loading') {
            view = <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                    style={{
                        width: Pixel.getPixel(150),
                        height: Pixel.getPixel(159),
                        marginTop: Pixel.getTitlePixel(189) - margintop
                    }}
                    source={require('../../image/loading.gif')}/>
                <Text allowFontScaling={false}
                      style={{
                          color: fontAndColor.COLORA0,
                          fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                          marginTop: Pixel.getPixel(32)
                      }}>
                    加载中......
                </Text>
            </View>
        } else if (this.state.renderPlaceholderOnly === 'error') {
            view = <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                    style={{
                        width: Pixel.getPixel(121),
                        height: Pixel.getPixel(163),
                        marginTop: Pixel.getTitlePixel(85 + 64) - margintop
                    }}
                    source={require('../../image/loadingError.png')}/>
                <Text allowFontScaling={false}
                      style={{
                          color: fontAndColor.COLORA0, fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                          marginTop: Pixel.getPixel(27)
                      }}>
                    网络错误
                </Text>
                <Text allowFontScaling={false}
                      style={{
                          color: fontAndColor.COLORA1, fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                          marginTop: Pixel.getPixel(10)
                      }}>
                    当前网络环境较差，请刷新重试
                </Text>
                <MyButton {...this.allRefreshParams} />
            </View>
        } else {

            if (this.renderNullView) {
                return (
                    this.renderNullView()

                )
            }

            view = <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                    style={{
                        width: Pixel.getPixel(121),
                        height: Pixel.getPixel(163),
                        marginTop: Pixel.getTitlePixel(85 + 64) - margintop
                    }}
                    source={require('../../image/noData.png')}/>
                <Text allowFontScaling={false}
                      style={{
                          color: fontAndColor.COLORA0, fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                          marginTop: Pixel.getPixel(27)
                      }}>
                    暂无数据
                </Text>
                <Text allowFontScaling={false}
                      style={{
                          color: fontAndColor.COLORA1, fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                          marginTop: Pixel.getPixel(10)
                      }}>
                </Text>
            </View>
        }
        return view;

    }


    //菊花
    loadingView = () => {
        let view;
        if (this.state.loading === true) {
            view = <TouchableWithoutFeedback onPress={() => {
            }}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        width: width,
                        height: height,
                    }}>
                    <Image style={{width: 60, height: 60}}
                           source={require('../../image/setDataLoading.gif')}/>
                </View>
            </TouchableWithoutFeedback>
        } else {
            view = null;
        }
        return view;
    }
}