import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export const HomeScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text> This is my Home screen </Text>
    </View>
  );
};
