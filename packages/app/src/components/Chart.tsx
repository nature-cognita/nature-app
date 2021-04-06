import React from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export const Chart = ({ timestamps, data }) => {
  return (
    <LineChart
      data={{
        labels: timestamps,
        datasets: [
          {
            data: data,
          },
        ],
      }}
      withInnerLines={false}
      withVerticalLabels={false}
      width={Dimensions.get("window").width - 10} // from react-native
      height={120}
      chartConfig={{
        backgroundColor: "#000000",
        // backgroundGradientFrom: "#000000",
        // backgroundGradientTo: "#00FF00",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        propsForDots: {
          r: "1",
        },
      }}
      bezier
      style={{
        marginVertical: 10,
        borderRadius: 5,
      }}
    />
  );
};
