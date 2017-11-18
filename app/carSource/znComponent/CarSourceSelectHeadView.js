import React, {Component} from 'react';
import {

    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Modal,

} from 'react-native';

import * as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';

var Pixel = new PixelUtil();

export class CarSourceSelectHeadView extends Component {

    constructor() {
        super()
    }

    render() {
        return (
            <View style={styles.container}>
                <OptionButton
                    onPress={this.props.onPress}
                    title='车型'
                />
                <OptionButton
                    onPress={this.props.onPress}
                    title='车龄'
                />
                <OptionButton
                    onPress={this.props.onPress}
                    title='里程'
                />
                <SubscriptionButton
                    onPress={this.props.onPress}
                    title='已订阅'
                />

            </View>
        )
    }
}


class SubscriptionButton extends Component {
    constructor() {
        super()
        this.state = {
            img_source: require('../../../image/carSourceImages/checkIcone_nil.png'),
            is_selected: false,
        }
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this._onPress}
                activeOpacity={.5}
                style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1}}>
                <Image source={this.state.img_source}/>
                <Text style={{marginRight: 5}}>{this.props.title}</Text>
            </TouchableOpacity>
        )
    }

    _onPress = () => {

        const {imgSource, is_selected} = this.state;
        this.setState({
            is_selected: !is_selected,
            img_source: !is_selected ? require('../../../image/carSourceImages/checkIcone.png') : require('../../../image/carSourceImages/checkIcone_nil.png'),
        })
        this.props.onPress(this.props.title, !is_selected);
    }
}


class OptionButton extends Component {
    constructor() {
        super()
        this.state = {
            img_source: require('../../../image/carSourceImages/btnIcon.png'),
            is_selected: false,
        }
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this._onPress}
                activeOpacity={.5}
                style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1}}>

                <Text style={{marginRight: 5}}>{this.props.title}</Text>
                <Image source={this.state.img_source}/>

            </TouchableOpacity>
        )
    }

    _onPress = () => {
        const {imgSource, is_selected} = this.state;

        this.setState({
            is_selected: !is_selected,
            img_source: !is_selected ? require('../../../image/carSourceImages/btnIconHigh.png') : require('../../../image/carSourceImages/btnIcon.png'),
        })
        this.props.onPress(this.props.title, !is_selected);
    }
}

export class CarSourceSelectView extends Component{

    render(){
        const {checkedSource,checkCarAgeAnKMClick,hideClick,checkedTypeString} = this.props;

        return(

            <View>
                <ScrollView>
                    {
                        checkedSource.map((data, index)=>{
                            return(
                                <TouchableOpacity
                                    key = {index}
                                    onPress = {()=>{
                                        checkCarAgeAnKMClick(data,index);
                                    }}
                                >
                                    <View  style = {styles.check_cell}>
                                        <Text allowFontScaling = {false}>{data.name}</Text>
                                    </View>
                                </TouchableOpacity>
                                )
                        })
                    }
                </ScrollView>
                <TouchableOpacity style = {{flex:1, backgroundColor:'0,0,0,.5'}} onPress = {()=>{hideClick()}}/>
            </View>

        )
    }
}


const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 44,
        justifyContent: 'center',
        shadowColor: 'lightgray',
        shadowOpacity: 1,
        shadowOffset: {width: 0, height: 3},
        shadowRadius:0,
    },

    check_cell:{
        backgroundColor: 'white',
        height: Pixel.getPixel(44),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor:fontAndColor.THEME_BACKGROUND_COLOR,
        borderBottomWidth:StyleSheet.hairlineWidth,
    }

})

