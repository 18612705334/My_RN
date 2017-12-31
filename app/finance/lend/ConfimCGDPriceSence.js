/**
 * Created by lhc on 2017/2/27.
 */

import React, {Component,PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import {fontadapeSize,PAGECOLOR,adapeSize} from './component/MethodComponent'

class ConfimCarCell extends Component{

    state={
        isSelected:false,
    }

    render(){
        return(
            <View style={styles.warp}>
                <Image style={styles.thumb}/>
                <View style={styles.insertWarp}>
                    <Text allowFontScaling={false}  style={styles.title}></Text>
                    <Text allowFontScaling={false}  style={styles.price}></Text>
                </View>
            </View>
        )
    }
}
export default class ConfimCGDPriceSence extends Component{


    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        const ds = new ListView.DataSource(
            {
                getRowData: this.getRowData,
                getSectionHeaderData: this.getSectionData,
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            }
        );

        this.state = {

            dataSouce:ds.cloneWithRowsAndSections([]),
        };
    }
    getSectionData = (dataBlob, sectionID) => {

        return dataBlob[sectionID];
    }
    getRowData = (datatBlob, sectionId, rowId) => {

        return datatBlob[sectionId][rowId];
    }


}



const  styles =StyleSheet.create({

    warp:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        backgroundColor:'yellow'
    },
    thumb:{

        width:adapeSize(20),
        height:adapeSize(20),
        backgroundColor:'blue'

    },
    insertWarp:{

        marginLeft:adapeSize(20),
        alignItems:'center'
    },
    title:{

        color:'black'
    },
    price:{

        color:'green'
    }

})