import * as SQLite from "expo-sqlite";
import React from "react";

const db = SQLite.openDatabase("plantsData");
console.log("Initializing DB");

db.transaction((tx) => {
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS data(date text, sensor_values text);",
    [],
    (_tx, _result) => {
      console.log("Table created successfully");
    },
    (_tx, error) => {
      console.log("Can't create table");
      console.log(error);

      return true;
    }
  );
});

export const DatabaseContext = React.createContext({ db });
