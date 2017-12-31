/**
 * Created by TinySymphony on 2017-01-03.
 */

import {Dimensions, StyleSheet} from 'react-native';
const window = Dimensions.get('window');
const {width, height, scale} = window;
import * as FontAndColor from "../../constant/FontAndColor";
import PixelUtil from "../../utils/PixelUtils";
var Pixel = new PixelUtil();

export const Color = {
    disableColor: '#40cca2',
    main: '#40cca2'
};
export const IMG = {
    closeIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABnElEQVRYR8WXy1HDMBCG/734Sjoh6QAqgBKgg/gij29wtC4uAegAKoASXEJKCFfPeMTIYxn5IVmvTHJM4v0+rbS7MuHKH7oyH6NAXde7tm3fpBARvTLGmpRynPM9gD4+gGcVfxTgnH8CeBj+cAZwn0pigH8D2A3xG8bYoV+sWuVMQH6dRGIFLmN/McYe5wJ7IcQPEd1oqY+SWIMLIX6J6G6xBRIqH0gl4QKfZEDbimgJV/iqQGwmfOBGgVAJX7hVwFciBL4p4CoRCncS2JIYDq/eZDAvNVtHdZ4FlhKV8VWH84I7Z2CjRMcF+qxcPeScgS2JELh3BtR5ADDZ85gB5pUBw2DRz5j37HAWMJVan8aIAeYkYKtzKRAzwDYFXJpMzBS1CrjAY6eoUcAHHiOxKhACD5VYCMTAQyQmAingvhL6rVje24On2trEM1VH13WHsixPk1ZcVVVDRLcqUGhvn4sYJJbXcl0gFdy0HUKIj6IoniYZGEzfiUj282OqtyJdAsCLEOKcZdkxz3PJ+X8zst1aLvnbZiu+JFzG/gPiB7Awgm9hrgAAAABJRU5ErkJggg==',
    addIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA7ElEQVRYR+2X0QnCQAyG87cLuIF1EusEOoq+NPTJ+lSuLzqKTmDdRDdwgbvISRVEhGuVFiGBe8td/nyB+wlo4MDA9amzgLIskyiKjr4B59wsz/Nzl2Y6CzDGLAFsfVERWTHzrm8BBYB1I2DDzIUKUAJKQAn8NwH/t8dxPAcwCulERFIi8sdHDaAOvHe11h4e3vH0gqqqvJmMQx75NkdEzsw88e8MIoCILlmWJS8CGntdEFHQCAB4/NOGxklEgkZARFfn3P5tBG2xGmPUDZWAElACSmDYxaSx7/v/b61Ne1/N2nrHp/zOu+GvBNwAa6vsIVXzFTsAAAAASUVORK5CYII='
};

export default StyleSheet.create({
    selectedView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    selectedItem: {
        marginBottom: Pixel.getPixel(15),
        marginRight: Pixel.getPixel(6),
        height: Pixel.getPixel(24),
        borderWidth: 2 / scale,
        borderRadius: 3,
        borderColor: FontAndColor.COLORA2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        padding: Pixel.getPixel(6),
    },
    addItem: {
        padding: Pixel.getPixel(7)
    },
    disableColor: {
        borderColor: FontAndColor.NAVI_BAR_COLOR,
    },
    layoutSize:{
        width: Pixel.getPixel(width/4-13),
        padding: 0,
    },
    labelText: {
        fontSize: Pixel.getPixel(13),
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
        backgroundColor: Color.main,
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
        borderColor: FontAndColor.NAVI_BAR_COLOR
    },
    innerCircle: {
        backgroundColor: Color.main,
        width: Pixel.getPixel(16),
        height: Pixel.getPixel(16),
        borderRadius: 8,
        overflow: 'hidden'
    },
    disableText: {
        color: FontAndColor.NAVI_BAR_COLOR
    }
});
