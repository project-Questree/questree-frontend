// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View, Button } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";

// import HomeScreen from "./screens/HomeScreen";
// import LoginScreen from "./screens/LoginScreen";

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <NavigationContainer>
//         <Stack.Navigator>
//           <Stack.Screen
//             name="Home"
//             component={HomeScreen}
//             options={({ navigation }) => ({
//               title: "홈",
//               headerRight: () => (
//                 <Button
//                   title="로그인"
//                   onPress={() => navigation.navigate("Login")}
//                 />
//               ),
//             })}
//           />
//           <Stack.Screen
//             name="Login"
//             component={LoginScreen}
//             options={{ title: "로그인" }}
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
// });

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
