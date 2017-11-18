/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import {
  AppRegistry,

} from 'react-native';

import Root from './app/root';
import wel from './app/main/WelcomeScene'
import LoginRegister from './app/login/LoginAndRegister'
import Login from './app/login/LoginScene'
import CarList from './app/carSource/CarSourceListScene'

AppRegistry.registerComponent('My_Saas', () => Root);
