import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Accelerometer } from "expo-sensors";
import { serverAddress } from "./settings.json";
export default function App() {
  const ws = new WebSocket(`ws://${serverAddress}`);
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(100);

  const _subscribe = () => {
    setSubscription(Accelerometer.addListener(setData));
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);
  //wysłanie danych na serwer przy podłączeniu klienta do serwera

  ws.onopen = () => {
    ws.send(JSON.stringify({ x: x, y: y, z: z }));
  };

  //odebranie danych z serwera i reakcja na nie, po sekundzie

  // ws.onmessage = (e) => {
  //   // console.log(e.data);
  //   // setTimeout(function () {
  //   //   ws.send("timestamp z klienta: " + Date.now());
  //   // }, 1000);
  // };

  ws.onerror = (e) => {
    console.log(e.message);
  };

  ws.onclose = (e) => {
    console.log(e.code, e.reason);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Accelerometer</Text>
      <Text style={styles.text}>x: {x.toFixed(2)}</Text>
      <Text style={styles.text}>y: {y.toFixed(2)}</Text>
      <Text style={styles.text}>z: {z.toFixed(2)}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={subscription ? _unsubscribe : _subscribe}
          style={styles.button}
        >
          <Text>{subscription ? "Turn Off" : "Turn On"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={_slow}
          style={[styles.button, styles.middleButton]}
        >
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#29b6f6",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 56,
    color: "#000000",
  },
  text: {
    fontWeight: "bold",
    fontSize: 48,
    margin: 10,
    color: "#0086c3",
  },
  buttonContainer: {
    flexDirection: "row",
  },

  button: {
    padding: 25,
    margin: 10,
    borderColor: "cyan",
    borderWidth: 1,
    borderRadius: 100,
  },
});
