
import React,{ Component } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    ListView,
} from 'react-native';

import * as fontAndColor from '../../constant/FontAndColor';
import PixelUtil from '../../utils/PixelUtils';
const Pixel = new PixelUtil();
const {width,height} = Dimensions.get('window');

export default class VinInfo extends Component{

    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: this.ds.cloneWithRows(this.props.viewData),
            modalVisible: false
        };
    }

    refresh(data){
        this.setState({
            dataSource:this.ds.cloneWithRows(data)
        })
    }

    openModal(mType){
        this.setState({
            modalVisible:true
        })
        this.mType = mType;
    }


    hideModal=()=>{

        this.setState({
            modalVisible: false
        });
    }


    render(){

        return(
            <Modal
                style={{backgroundColor:'red'}}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {}}
                animationType={'fade'}
            >
                <TouchableOpacity
                    style={styles.container}
                    activeOpacity={1}
                    onPress={this.hideModal}
                >
                    <View>
                        <ListView
                            removeClippedSubviews={false}
                            dataSource={this.state.dataSource}
                            renderRow={this._renderRow}

                        />
                    </View>


                </TouchableOpacity>


            </Modal>


        )
    }


    _renderRow = (rowData,sectionID,rowID)=> {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                key={rowID}
                onPress={()=>{this.props.vinPress(this.mType,rowID),this.hideModal()}}>
                <View  style={styles.rowStyle}>
                    <Text allowFontScaling={false}  style={styles.fontMain}>{rowData.model_name}</Text>
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



