import React, {Component, PropTypes, PureComponent} from 'react';
import {
    View,
    Text,
    Image,
    Modal,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native';

import  PixelUtil from '../utils/PixelUtils'
let Pixel = new PixelUtil();
let Dimensions = require('Dimensions');
let {width, height, scale} = Dimensions.get('window');
import  * as FontAndColor from '../constant/FontAndColor';
import  LabelForOrderScreen from './LabelForOrderScreen';

//let clickitems = '0';

export default class LabelParent extends PureComponent {
    constructor(props) {
        super(props);
        //this.clickitems = this.props.orderState;
        this.firstRef = '';
        this.state = {
            clickitems: this.props.orderState,
            items: this.props.items
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            clickitems: nextProps.orderState,
            items: nextProps.items
        });
    }

    resetLabel = () => {
        /*        this.setState({
                 clickitems: clickitems,
                 //items: items
                 });*/
        this.firstRef.setPressDown();
    };

    render() {
        let items = this.state.items;
        //let parameters = this.props.parameters.orderState;
        let item = [];
        let line = Math.ceil(items.length / 3);
        for (let i = 1; i <= line; i++) {
            let childitem = [];
            let allSize = 0;
            if (items.length - (3 * i) < 0) {
                allSize = items.length;
            } else {
                allSize = 3 * i;
            }
            for (let j = 3 * i - 3; j < allSize; j++) {
                //console.log(items[j].title);
                childitem.push(<LabelForOrderScreen callBack={(item, status) => {
                    // console.log(items[j].ref);
                    if (this.state.clickitems !== item) {
                        this.props.updateState(item);
                        this.props.updateStatus(status);
                        items[this.state.clickitems].ref.unSelected();
                        this.state.clickitems = item;
                    }
                }} ref={(modal) => {
                    items[j].ref = modal
                    if (j === 0) {
                        this.firstRef = modal;
                    }
                }} index={j} item={items[j]} key={j + 'child'}/>)
            }
            item.push(<View key={i + 'parent'} style={{
                width: width,
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: Pixel.getPixel(11)
            }}>
                <View style={{flex: 1, height: Pixel.getPixel(32), marginLeft: Pixel.getPixel(10)}}>
                    {childitem[0]}
                </View>
                <View style={{flex: 1, height: Pixel.getPixel(32)}}>
                    {childitem.length > 1 ? childitem[1] : <View/>}
                </View>
                <View style={{flex: 1, height: Pixel.getPixel(32), marginRight: Pixel.getPixel(10)}}>
                    {childitem.length > 2 ? childitem[2] : <View/>}
                </View>

            </View>);
        }
        return (
            <View style={{width: width, backgroundColor: '#fff', marginTop: Pixel.getPixel(10)}}>
                {item}
            </View>

        );
    }

    invertSelection = (ref) => {

    }
}