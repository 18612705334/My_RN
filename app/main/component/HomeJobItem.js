import React, {Component, PureComponent} from 'react';
import {
    AppRegistry,
    View,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
    Dimensions,
} from 'react-native';

let {height, width} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtils'
import * as fontAndColor from '../../constant/FontAndColor'

var Pixel = new PixelUtil();
import HomeJobButton from './HomeJobButton';
import GetPermissionUtil from '../../utils/GetPermissionUtil';

const GetPermission = new GetPermissionUtil();

export default class HomeJobItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            show: false
        }
    }

    componentWillMount() {
        GetPermission.getLastList((preList) => {
            this.list = preList;
            this.setState({show: true});
        });
    }

    render() {

        let buttons = [];

        if (!this.state.show) {
            return <View></View>
        }

        for (let i = 0; i < this.list.length; i++) {
            if (i == 7) {
                buttons.push(<HomeJobButton key={'job' + i}
                                            image={require('../../../image/workbench/gd.png')}
                                            name='更多'
                                            click={() => {
                                                this.props.jumpScene('sendpage', 'a')
                                            }}/>)
                break;
            }

            buttons.push(<HomeJobButton
                key={'job' + i}
                image={this.list[i].image}
                name={this.list[i].name}
                click={() => {
                    this.props.callBack({
                        name: this.list[i].componentName,
                        component: this.list[i].component, params: {}
                    })
                }}/>)

        }

        return (

            <View
                style={{
                    flexDirection: 'row',
                    flexWrap:'wrap',
                    backgroundColor: 'white',
                    width: width,
                    paddingVertical:10,
                    marginBottom:10,
                }}
            >
                {buttons}
            </View>

        )
    }
}