import React, {Component} from 'react';
import {Navigator} from 'react-native-deprecated-custom-components'
import {
    View,
    TouchableOpacity,
    TouchableHighlight

} from 'react-native';

var Platform = require('Platform');
import RootScene from '../main/RootScene'
import {setAll} from '../constant/AllBackLogin'
import Login from '../../app/login/LoginScene'

export default class MyNavigator extends Component {

    render() {
        return (
            <Navigator
                initialRoute={{
                    component: Login,
                    name: 'LoginScene'
                }}

                configureScene={(route, routeStack) => {
                    if (Platform.OS === 'ios') {
                        return Navigator.SceneConfigs.FloatFromRight;
                    }
                    return Navigator.SceneConfigs.FloatFromBottomAndroid;
                }}

                renderScene={(route, navigator) => {
                    let Component = route.component;
                    
                    if (route.component) {
                        setAll(navigator);
                        return <Component {...route.params}

                                         navigator={navigator}

                                         showToast={(content) => {
                                             this.props.showToast(content)
                                         }}

                                         showModal={(value) => {
                                             this.props.showModel(value)
                                         }}
                        />

                    }

                }}
            />

        )
    }
}