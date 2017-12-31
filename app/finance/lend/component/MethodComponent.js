
import { Dimensions } from 'react-native';

const STATECODE ={

    loading:'blank',
    loadSuccess:'success',
    loadError:'error',
    empty:'empty'

}

const PAGECOLOR = {

    COLORA0 : "#000000",
    COLORA1 : "#9e9e9e",
    COLORA2 : "#90a1b5",
    COLORA3 : "#f0eff5",
    COLORA4 : "#d8d8d8",
    COLORB0 : "#05c5c2",
    COLORB1 : "#3ac87e",
    COLORB2 : "#fa5741",
    COLORB3 : "#ffbd2f",
    COLORB4 : "#2f9bfa",
    COLORB5 : "#69dcda",
}

const {width, height} = Dimensions.get('window')

const changeToMillion=(number)=>{

    let temp =parseFloat(number);

    return Math.floor(temp/10000*10000)/10000
}

const dateFormat = (date,fmt) => {
    let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

const adapeSize = (size)=> {

    return ((size / 375.0) * width);
}
const fontadapeSize = (size)=> {

    return adapeSize(size) + 2;
}

const getSectionData = (dataBlob, sectionID) => {

    return dataBlob[sectionID];
}
const getRowData = (datatBlob, sectionId, rowId) => {

    return datatBlob[sectionId][rowId];
}


export {STATECODE,PAGECOLOR,width,height,dateFormat,adapeSize,fontadapeSize,changeToMillion,getSectionData,getRowData}