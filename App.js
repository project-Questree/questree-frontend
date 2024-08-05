import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import MainToDoScreen from "./screens/MainToDoScreen";
import ExampleScreen from "./screens/exampleScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotIdScreen from "./screens/ForgotIdScreen";
import ForgotPwScreen from "./screens/ForgotPwScreen";
import CalendarScreen from "./screens/CalendarScreen";
import MyPageScreen from "./screens/MyPageScreen";
import SettingScreen from "./screens/SettingScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
            animation: "fade", // 슬라이드 애니메이션 설정
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainToDo"
          component={MainToDoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotId"
          component={ForgotIdScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPw"
          component={ForgotPwScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Example"
          component={ExampleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyPage"
          component={MyPageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Setting"
          component={SettingScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
