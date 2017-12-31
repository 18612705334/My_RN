
import React,{ Component } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    ListView
} from 'react-native';

import * as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';
const Pixel = new PixelUtil();
const {width,height} = Dimensions.get('window');

export default class EnterpriseInfo extends Component{

    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: this.ds.cloneWithRows(this.props.viewData),
            modalVisible: false
        };
    }


    refresh = (data)=>{
        this.setState({
            dataSource: this.ds.cloneWithRows(data),
        });
    };

    _hiedModal = ()=>{
        this.setState({
            modalVisible: false
        });
    };

    openModal = ()=>{
        this.setState({
            modalVisible: true
        });
    };

    render(){
        return(
            <Modal
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {}}>
                <View style={styles.container}>
                    <View>
                        <ListView
                            removeClippedSubviews={false}
                            dataSource={this.state.dataSource}
                            renderRow={this._renderRow}
                        />
                    </View>
                </View>
            </Modal>
        );
    }


    // 每一行中的数据
    _renderRow = (rowData,sectionID,rowID)=> {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                key={rowID}
                onPress={()=>{this.props.enterpricePress(rowID),this._hiedModal()}}>
                <View  style={styles.rowStyle}>
                    <Text allowFontScaling={false}  style={styles.fontMain}>{rowData.enterprise_name}</Text>
                </View>
            </TouchableOpacity>
        );
    };

}

const styles = StyleSheet.create({
    container:{
        width:width,
        flex:1,
        backgroundColor:'rgba(0,0,0,0.3)',
        justifyContent:'flex-end'
    },
    rowStyle:{
        backgroundColor:'#FFFFFF',
        height:Pixel.getPixel(44),
        alignItems:'center',
        justifyContent:'center',
        borderBottomColor:fontAndColor.COLORA4,
        borderBottomWidth:0.5
    },
    fontMain:{
        color:'#000000',
        fontSize:Pixel.getFontPixel(14)
    },
    splitLine:{
        borderColor:fontAndColor.COLORA4,
        borderWidth:0.5
    }
});



