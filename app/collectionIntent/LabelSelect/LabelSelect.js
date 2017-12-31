/**
 * Created by TinySymphony on 2017-01-03.
 */

import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    Image,
    Modal,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native';
import Styles, {IMG} from './LabelSelectStyle';

class LabelSelect extends Component {
    addIcon = {
        uri: IMG.addIcon
    }
    static propTypes = {
        title: PropTypes.string,
        readOnly: PropTypes.bool,
        enable: PropTypes.bool,
        isBigSize: PropTypes.bool,
        onConfirm: PropTypes.func,
        enableAddBtn: PropTypes.bool
    }
    static defaultProps = {
        style: {},
        title: ' ',
        enable: true,
        isBigSize: false,
        readOnly: false,
        onConfirm: () => {
        },
        enableAddBtn: true
    }

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isModalVisible: false,
        };
        this.selectedList = [];
        this.toggleSelect = this.toggleSelect.bind(this);
        this.cancelSelect = this.cancelSelect.bind(this);
        this.confirmSelect = this.confirmSelect.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    setModalVisible(isVisible) {
        this.setState({isModalVisible: isVisible});
    }

    cancelSelect() {
        this.selectedList = [];
        this.setModalVisible(false);
    }

    confirmSelect() {
        const {onConfirm} = this.props;
        onConfirm(this.selectedList);
        this.selectedList = [];
        this.cancelSelect();
    }

    openModal() {
        if (!React.Children.toArray(this.props.children).filter(item => item.type === ModalItem).length) {
            // TODO
        }
        this.props.enable && !this.props.readOnly && this.setModalVisible(true);
    }

    toggleSelect(time) {
        let index = this.selectedList.findIndex(item => item === time);
        if (~index) {
            this.selectedList.splice(index, 1);
        }
        else {
            this.selectedList.push(time);
        }
    }

    render() {
        const {readOnly, enable, title, style, enableAddBtn, isBigSize} = this.props;
        let selectedLabels = React.Children.toArray(this.props.children)
            .filter(item => item.type === Label)
            .map((child, index) => {
                return React.cloneElement(child, {
                    enable: enable,
                    isBigSize: isBigSize,
                    readOnly: readOnly
                });
            });

        let modalItems = this.state.isModalVisible ? React.Children.toArray(this.props.children)
            .filter(item => item.type === ModalItem)
            .map((child, index) => {
                return React.cloneElement(child, {
                    toggleSelect: this.toggleSelect
                });
            }) : null;

        return (
            <View style={[Styles.selectedView, style]}>
                {selectedLabels}
                <Modal
                    transparent={true}
                    visible={false}
                    onRequestClose={() => {
                    }}>
                    <View style={{flex: 1}}>
                        <TouchableHighlight
                            style={Styles.modalMask}
                            activeOpacity={1}
                            underlayColor="#00000077"
                            onPress={this.cancelSelect}>
                            <View style={Styles.modalContainer}>
                                <View style={Styles.modal}>
                                    <View style={Styles.title}><Text allowFontScaling={false}  style={Styles.titleText}>{title}</Text></View>
                                    <View style={Styles.scrollView}>
                                        <ScrollView>
                                            {modalItems}
                                        </ScrollView>
                                    </View>
                                    <View style={Styles.buttonView}>
                                        <TouchableHighlight
                                            underlayColor="transparent"
                                            style={Styles.modalButton}
                                            onPress={this.cancelSelect}>
                                            <Text allowFontScaling={false}  style={Styles.buttonText}>Cancel</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight
                                            underlayColor="transparent"
                                            onPress={this.confirmSelect}
                                            style={[Styles.modalButton, Styles.confirmButton]}>
                                            <Text allowFontScaling={false}  style={Styles.buttonText}>Confirm</Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                </Modal>
            </View>
        );
    }
}

class Label extends Component {
    closeIcon = {
        uri: IMG.closeIcon
    }
    static propTypes = {
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
    }

    constructor(props) {
        super(props);
        this.state = {
            enable: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.state = {
            enable: nextProps.enables,
        };
    }

    setPressDown = () => {
        let en = this.state.enable;
        this.setState({enable: !en});
    }

    render() {
        const {readOnly, onCancel, isBigSize} = this.props;
        return (
            <TouchableOpacity
                style={[Styles.selectedItem, this.state.enable && Styles.disableColor, !isBigSize && Styles.layoutSize]}
                onPress={() => {
                    if (!readOnly) {
                        onCancel();
                    } else {
                        this.setPressDown()
                        onCancel();
                    }
                }}>
                <Text allowFontScaling={false}
                      style={[Styles.labelText, this.state.enable && Styles.disableText]}>{this.props.children}</Text>

                {!readOnly && <TouchableOpacity
                    style={Styles.closeContainer}
                    underlayColor="transparent"
                    activeOpacity={0.5} onPress={() => {
                    if (!readOnly) {
                        onCancel();
                    } else {
                        this.setPressDown()
                        onCancel();
                    }
                }}>
                    <View>
                        <Image
                            style={Styles.closeIcon}
                            source={require('../../../image/deleteIcon2x.png')}
                            resizeMode="cover"/>
                    </View>
                </TouchableOpacity>}
            </TouchableOpacity>

        );
    }
}

class ModalItem extends Component {
    static propTypes = {
        toggleSelect: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.isSelected = false;
        this._toggleSelect = this._toggleSelect.bind(this);
    }

    _toggleSelect() {
        const {toggleSelect, data} = this.props;
        this.isSelected = !this.isSelected;
        this.forceUpdate();
        toggleSelect(data);
    }

    render() {
        return (
            <TouchableHighlight
                activeOpacity={0.5}
                underlayColor="transparent"
                onPress={this._toggleSelect}>
                <View style={Styles.modalItem}>
                    <Text allowFontScaling={false}  style={Styles.modalText}>{this.props.children}</Text>
                    <View style={[Styles.outerCircle, this.isSelected ? Styles.enableCircle : {}]}>
                        {this.isSelected && <View style={Styles.innerCircle}/>}
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

LabelSelect.Label = Label;
LabelSelect.ModalItem = ModalItem;

export default LabelSelect;
