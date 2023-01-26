/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs';
import Tab1 from '../screens/Tab1/Tab1';
import Tab2 from '../screens/Tab2/Tab2';
import Tab3 from '../screens/Tab3/Tab3';
import Tab4 from '../screens/Tab4/Tab4';
import Tab5 from '../screens/Tab5/Tab5';
import {
  BooksIcon,
  Tab1Icon,
  Tab2Icon,
  Tab3Icon,
  Tab4Icon,
} from '../Component/MyIcons';
import { colorApp } from '../theme/Colors';
import FastImage from 'react-native-fast-image';
import { strings } from '../Localization/Localization';
import { Text, View } from 'react-native';
import FirstScreen from '../screens/Auth/FirstScreen';
import Login from '../screens/Auth/Login';
import Registr from '../screens/Auth/Registr';
import RestorePassword from '../screens/Auth/RestorePassword';

import NoteAdd from '../screens/Tab2/NoteAdd';
import AboutUs from '../screens/Profile/AboutUs';
import AboutProgram from '../screens/Profile/AboutProgram';
import PushTable from '../screens/Profile/PushTable';
import Profile from '../screens/Profile/Profile';
import QuestHistory from '../screens/Profile/QuestHistory';
import EditProfile from '../screens/Profile/EditProfile';
import EditLocal from '../screens/Profile/EditLocal';
import Category from '../screens/Tab5/Category';
import EditPwd from '../screens/Profile/EditPwd';
import AddWallet from '../screens/Tab4/AddWallet';
import TaskAdd from '../screens/Tab1/TaskAdd';
import HabitAdd from '../screens/Tab1/HabitAdd';
import Translation from '../screens/Tab4/Translation';
import ChooseIcons from '../screens/Tab4/ChooseIcons';
import Wallet from '../screens/Tab4/Wallet';
import Statistics from '../screens/Tab4/Statistics';
import Book from '../screens/Tab3/Book';
import MyBooks from '../screens/Profile/MyBooks';
import MyGoals from '../screens/Profile/MyGoals';
import Goals from '../screens/Profile/Goals';
import AddGoal from '../screens/Profile/AddGoal';
import Replenishment from '../screens/Tab4/Replenishment';
import ReadBook from '../screens/Tab3/ReadBook';
import AddFolder from '../screens/Tab2/AddFolder';
import NotesList from '../screens/Tab2/NotesList';
import ModalDrax from '../screens/Tab1/ModalDrax';
import DuaList from '../screens/Dua/DuaList';
import SingleDua from '../screens/Dua/SingleDua';
import SearchNote from '../screens/Tab2/SearchNote';
import { navigationRef } from './RootNavigation';
import Unfulfilled_tasks from '../screens/Unfulfilled_tasks';
import TestApp from '../screens/TestApp';
import Splash from '../screens/Splash';
/////////STACKS/////////

const _Tab1 = createNativeStackNavigator();

function Tab1Stack() {
  const heightBottom = useBottomTabBarHeight();
  return (
    <View style={{ flex: 1 }}>
      <_Tab1.Navigator initialRouteName="Tab1">
        <_Tab1.Screen
          name="ModalDrax"
          component={ModalDrax}
          options={{ headerShown: false }}
        />
        <_Tab1.Screen
          name="Tab1"
          component={Tab1}
          options={{ headerShown: false }}
        />

        <_Tab1.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{ headerShown: false }}
        />
      </_Tab1.Navigator>
      {/* <Player style={{bottom: heightBottom}} /> */}
    </View>
  );
}

const _Tab2 = createNativeStackNavigator();

function Tab2Stack() {
  const heightBottom = useBottomTabBarHeight();
  return (
    <View style={{ flex: 1 }}>
      <_Tab2.Navigator>
        <_Tab2.Screen
          name="Tab2"
          component={Tab2}
          options={{ headerShown: false }}
        />
        <_Tab2.Screen
          name="AddFolder"
          component={AddFolder}
          options={{ headerShown: false }}
        />

        <_Tab2.Screen
          name="NotesList"
          component={NotesList}
          options={{ headerShown: false }}
        />


        <_Tab2.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{ headerShown: false }}
        />
      </_Tab2.Navigator>
      {/* <Player style={{bottom: heightBottom}} /> */}
    </View>
  );
}

const _Tab3 = createNativeStackNavigator();

function Tab3Stack() {
  const heightBottom = useBottomTabBarHeight();
  return (
    <View style={{ flex: 1 }}>
      <_Tab3.Navigator>
        <_Tab3.Screen
          name="Tab3"
          component={Tab3}
          options={{ headerShown: false }}
        />
        <_Tab3.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{ headerShown: false }}
        />
        <_Tab3.Screen
          name="Book"
          component={Book}
          options={{ headerShown: false }}
        />
        <_Tab3.Screen
          name="ReadBook"
          component={ReadBook}
          options={{ headerShown: false }}
        />
      </_Tab3.Navigator>
      {/* <Player style={{bottom: heightBottom}} /> */}
    </View>
  );
}


function TabDuaStack() {
  const heightBottom = useBottomTabBarHeight();
  return (
    <View style={{ flex: 1 }}>
      <_Tab3.Navigator>
        <_Tab3.Screen
          name="DuaList"
          component={DuaList}
          options={{ headerShown: false }}
        />
        <_Tab3.Screen
          name="SingleDua"
          component={SingleDua}
          options={{ headerShown: false }}
        />

      </_Tab3.Navigator>
      {/* <Player style={{bottom: heightBottom}} /> */}
    </View>
  );
}







const _Tab4 = createNativeStackNavigator();

function Tab4Stack() {
  const heightBottom = useBottomTabBarHeight();
  return (
    <View style={{ flex: 1 }}>
      <_Tab4.Navigator>
        <_Tab4.Screen
          name="Tab4"
          component={Tab4}
          options={{ headerShown: false }}
        />
        <_Tab4.Screen
          name="AddWallet"
          component={AddWallet}
          options={{ headerShown: false }}
        />

        <_Tab4.Screen
          name="Replenishment"
          component={Replenishment}
          options={{ headerShown: false, animation: 'fade' }}
        />
        <_Tab4.Screen
          name="Translation"
          component={Translation}
          options={{ headerShown: false, animation: 'fade' }}
        />
        <_Tab4.Screen
          name="ChooseIcons"
          component={ChooseIcons}
          options={{ headerShown: false }}
        />
        <_Tab4.Screen
          name="Wallet"
          component={Wallet}
          options={{ headerShown: false }}
        />
        <_Tab4.Screen
          name="Statistics"
          component={Statistics}
          options={{ headerShown: false }}
        />
        <_Tab4.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{ headerShown: false }}
        />
      </_Tab4.Navigator>
      {/* <Player style={{bottom: heightBottom}} /> */}
    </View>
  );
}

const _Tab5 = createNativeStackNavigator();
function Tab5Stack() {
  const heightBottom = useBottomTabBarHeight();
  return (
    <View style={{ flex: 1 }}>
      <_Tab5.Navigator>
        <_Tab5.Screen
          name="Tab5"
          component={Tab5}
          options={{ headerShown: false, animation: 'fade' }}
        />
        <_Tab5.Screen
          name="Category"
          component={Category}
          options={{ headerShown: false }}
        />
        <_Tab5.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{ headerShown: false }}
        />
      </_Tab5.Navigator>
      {/* <Player style={{bottom: heightBottom}} /> */}
    </View>
  );
}

const _ProfileTab = createNativeStackNavigator();
function ProfileStack() {
  const heightBottom = useBottomTabBarHeight();
  return (
    <_ProfileTab.Navigator initialRouteName="ProfileStack">
      <_ProfileTab.Screen
        name="AboutUs"
        component={AboutUs}
        options={{ headerShown: false }}
      />
      <_ProfileTab.Screen
        name="AboutProgram"
        component={AboutProgram}
        options={{ headerShown: false }}
      />
      <_ProfileTab.Screen
        name="PushTable"
        component={PushTable}
        options={{ headerShown: false }}
      />
      <_ProfileTab.Screen
        name="QuestHistory"
        component={QuestHistory}
        options={{ headerShown: false }}
      />
      <_ProfileTab.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <_ProfileTab.Screen
        name="EditPwd"
        component={EditPwd}
        options={{ headerShown: false }}
      />
      <_ProfileTab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />

      {/* <_ProfileTab.Screen
        name="MyGoals"
        component={MyGoals}
        options={{ headerShown: false }}
      /> */}

      {/* <_ProfileTab.Screen
        name="Goals"
        component={Goals}
        options={{ headerShown: false }}
      />

      <_ProfileTab.Screen
        name="AddGoal"
        component={AddGoal}
        options={{ headerShown: false }}
      /> */}

      <_ProfileTab.Screen
        name="MyBooks"
        component={MyBooks}
        options={{ headerShown: false }}
      />
      <_ProfileTab.Screen
        name="Book"
        component={Book}
        options={{ headerShown: false }}
      />
      <_ProfileTab.Screen
        name="ReadBook"
        component={ReadBook}
        options={{ headerShown: false }}
      />
    </_ProfileTab.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function TabStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colorApp.blueDark,
        tabBarInactiveTintColor: '#999999',
      }}>
      <Tab.Screen
        name="Tab1Stack"
        component={Tab1Stack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Tab1Icon stroke={color} />,
          tabBarLabel: ({ color }) => (
            <Text
              style={{
                fontSize: 12,
                color: color,
              }}>
              {strings.tab1}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Tab2Stack"
        component={Tab2Stack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Tab2Icon stroke={color} />,
          tabBarLabel: ({ color }) => (
            <Text
              style={{
                fontSize: 12,
                color: color,
              }}>
              {strings.tab2}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Tab3Stack"
        component={TabDuaStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) =>
            <FastImage
              source={require('../assets/dua.png')}
              style={{ width: 32, height: 32, tintColor: { color } }}
              tintColor={color}
            />
          ,
          tabBarLabel: ({ color }) => (
            <Text
              style={{
                fontSize: 12,
                color: color,
              }}>
              {strings.dua}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Tab4Stack"
        component={Tab4Stack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Tab4Icon stroke={color} />,
          tabBarLabel: ({ color }) => (
            <Text
              style={{
                fontSize: 12,
                color: color,
              }}>
              {strings.tab4}
            </Text>
          ),
        }}
      />
      {/* <Tab.Screen
        name="Tab5Stack"
        component={Tab5Stack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Tab3Icon stroke={color} />,
          tabBarLabel: ({ color }) => (
            <Text
              style={{
                fontSize: 12,
                color: color,
              }}>
              {strings.tab3}
            </Text>
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}

const AuthTab = createNativeStackNavigator();

function AuthStack() {
  return (
    <AuthTab.Navigator initialRouteName={'FirstScreen'}>
      <AuthTab.Screen
        name="FirstScreen"
        options={{ headerShown: false }}
        component={FirstScreen}
      />
      <AuthTab.Screen
        name="Login"
        options={{ headerShown: false }}
        component={Login}
      />
      <Stack.Screen
        name="EditLocal"
        component={EditLocal}
        options={{ headerShown: false, animation: 'fade' }}
      />

      <AuthTab.Screen
        name="Registr"
        options={{ headerShown: false }}
        component={Registr}
      />
      <AuthTab.Screen
        name="RestorePassword"
        options={{ headerShown: false }}
        component={RestorePassword}
      />
    </AuthTab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer
      ref={navigationRef}
    >
      <Stack.Navigator initialRouteName={'Splash'}>

        <Stack.Screen
          name="Splash"
          options={{ headerShown: false }}
          component={Splash}
        />

        <Stack.Screen
          name="AuthStack"
          options={{ headerShown: false }}
          component={AuthStack}
        />

        <Stack.Screen
          name="TabStack"
          options={{ headerShown: false }}
          component={TabStack}
        />

        <Stack.Screen
          name="TestApp"
          options={{ headerShown: false }}
          component={TestApp}
        />

        <Stack.Screen
          name="TaskAdd"
          component={TaskAdd}
          options={{ headerShown: false }}
        />


        <Stack.Screen
          name="HabitAdd"
          component={HabitAdd}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Unfulfilled_tasks"
          options={{ headerShown: false }}
          component={Unfulfilled_tasks}
        />

        <Stack.Screen
          name="QuestHistory"
          options={{ headerShown: false }}
          component={QuestHistory}
        />


        <Stack.Screen
          name="PushTable"
          component={PushTable}
          options={{ headerShown: false }}
        />


        <Stack.Screen
          name="EditLocal"
          component={EditLocal}
          options={{ headerShown: false, animation: 'fade' }}
        />
        <Stack.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{ headerShown: false, animation: 'fade' }}
        />

        <Stack.Screen
          name="MyGoals"
          component={MyGoals}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Goals"
          component={Goals}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AddGoal"
          component={AddGoal}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="NoteAdd"
          component={NoteAdd}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SearchNote"
          component={SearchNote}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
