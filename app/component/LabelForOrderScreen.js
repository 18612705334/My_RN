import React, {PureComponent, PropTypes} from 'react';
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
export default class LabelForOrderScreen extends PureComponent {
    /*    static propTypes = {
     onCancel: PropTypes.func,
     readOnly: PropTypes.bool,
     enable: PropTypes.bool,
     layoutSize: PropTypes.bool,
     }
     static defaultProps = {
     onCancel: () => {
     },
     readOnly: false,
     layoutSize: false
     }*/

    constructor(props) {
        super(props);
        this.state = {
            enable: this.props.item.isSelected,
        };
        //console.log('this.props.item.title.length = ',this.props.item.title.length);
    }
    componentWillReceiveProps(nextProps) {
        this.state = {
            enable: nextProps.item.isSelected
        };
    }


    setPressDown = () => {
        let en = this.state.enable;
        if (!en) {
            this.props.value = this.props.item.value;
            this.setState({enable: !en});
        }
        this.props.callBack(this.props.index, this.props.item.value);
        //this.props.select(this.props.key);
        //console.log(this.props.item.value);
    };

    render() {
        return (
            <TouchableOpacity
                style={[Styles.selectedItem, this.state.enable && Styles.disableColor]}
                onPress={() => {
                    this.setPressDown()
                }}>
                <Text allowFontScaling={false}
                      style={
                          this.props.item.title.length > 7 ?
                              [Styles.labelText1, this.state.enable && Styles.disableText] :
                              [Styles.labelText, this.state.enable && Styles.disableText]
                      }>{this.props.item.title}</Text>
            </TouchableOpacity>

        );
    }

    unSelected = () => {
        this.setState({enable: false});
    };
}

const Styles = {
    selectedView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    selectedItem: {
        marginRight: Pixel.getPixel(5),
        height: Pixel.getPixel(35),
        borderWidth: 2 / scale,
        borderRadius: 3,
        borderColor: FontAndColor.COLORA2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        padding: Pixel.getPixel(3),
        flex: 1,
        marginLeft: Pixel.getPixel(5)
    },
    addItem: {
        padding: Pixel.getPixel(7)
    },
    disableColor: {
        borderColor: FontAndColor.COLORB0,
    },
    labelText: {
        fontSize: Pixel.getPixel(14),
        color: FontAndColor.COLORA2
    },
    labelText1: {
        fontSize: Pixel.getPixel(10),
        color: FontAndColor.COLORA2
    },
    closeContainer: {
        paddingLeft: Pixel.getPixel(3),
        paddingRight: Pixel.getPixel(3),

    },
    closeIcon: {
        width: Pixel.getPixel(12),
        height: Pixel.getPixel(12)
    },
    addIcon: {
        width: Pixel.getPixel(12),
        height: Pixel.getPixel(12)
    },
    modalMask: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000077'
    },
    modalContainer: {},
    modal: {
        height: Pixel.getPixel(height * 0.6),
        width: Pixel.getPixel(width * 0.6),
        overflow: 'hidden',
        borderRadius: 10,
        backgroundColor: '#fff'
    },
    title: {
        paddingHorizontal: Pixel.getPixel(20),
        paddingVertical: Pixel.getPixel(10),
        borderBottomWidth: 2 / scale,
        borderBottomColor: '#bbb'
    },
    titleText: {
        fontSize: Pixel.getPixel(18),
        lineHeight: 20
    },
    scrollView: {
        height: Pixel.getPixel(height * 0.6 - 80)
    },
    buttonView: {
        height: 40,
        backgroundColor: FontAndColor.COLORB0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    modalButton: {
        width: Pixel.getPixel(width * 0.3),
        paddingLeft: Pixel.getPixel(20),
        paddingRight: Pixel.getPixel(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalItem: {
        height: Pixel.getPixel(50),
        paddingHorizontal: Pixel.getPixel(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 2 / scale,
        borderBottomColor: '#bbb'
    },
    modalText: {
        fontSize: Pixel.getPixel(16)
    },
    buttonText: {
        color: '#fff',
        fontSize: Pixel.getPixel(16)
    },
    confirmButton: {
        borderLeftWidth: 2 / scale,
        borderLeftColor: '#fff'
    },
    outerCircle: {
        borderWidth: 2 / scale,
        borderColor: '#888',
        width: Pixel.getPixel(20),
        height: Pixel.getPixel(20),
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    enableCircle: {
        borderColor: FontAndColor.COLORB0
    },
    innerCircle: {
        backgroundColor: FontAndColor.COLORB0,
        width: Pixel.getPixel(16),
        height: Pixel.getPixel(16),
        borderRadius: 8,
        overflow: 'hidden'
    },
    disableText: {
        color: FontAndColor.COLORB0
    }
};