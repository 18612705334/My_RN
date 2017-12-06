import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Modal
} from 'react-native';

import * as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';

const Pixel = new PixelUtil();
import SaasText from "../../component/SaasText";


export class DailyReminderSelectView extends Component {
    constructor(props) {
        super(props)
        this.checkedSource = this.props.checkedSource
        this.checkTimeFrameClick = this.props.checkTimeFrameClick;
        this.hideClick = this.props.hideClick;
        this.state = {
            isHide: false,
            checkedTypeString: this.props.checkedTypeString
        }

    }

    changeClick = (isHide, name) => {
        this.setState({
            isHide: isHide,
            checkedTypeString: name
        });
    };

    render() {
        if (this.state.isHide) {
            return (
                <View style={{flex: 1,top: Pixel.getTitlePixel(65), backgroundColor: 'rgba(0,0,0,.4)', position:'absolute', left:0, right:0, bottom:0, }}>
                    <View>
                        <ScrollView style={{backgroundColor: 'white',}}>
                            {
                                this.checkedSource.map((data, index) => {
                                    return (

                                        <TouchableOpacity
                                            style={{
                                                borderBottomColor: fontAndColor.COLORA4,
                                                borderBottomWidth: .5,
                                                paddingVertical: 15
                                            }}
                                            key={index}
                                            onPress={() => {
                                                this.checkTimeFrameClick(data, index)
                                            }}
                                        >

                                            <SaasText style={[{
                                                fontSize: 15,
                                                textAlign: 'center',
                                                color: fontAndColor.COLORA0
                                            }, data.name === this.state.checkedTypeString && {color: fontAndColor.NAVI_BAR_COLOR}]}>{data.name}</SaasText>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>

                    <TouchableOpacity
                        style={{flex: 1}} onPress={() => {
                        //this.hideClick();
                        this.setState({
                            isHide: false
                        });
                    }}
                    />

                </View>
            )

        }

        return (

            null

        )
    }
}