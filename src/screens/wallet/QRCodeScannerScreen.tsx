import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { Camera, CameraView } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NavigationProp } from '../../types/navigation';

export default function QRScannerScreen() {
  return (
    <Scanner />
  );
}

export function Scanner() {
  const [hasPermission, setHasPermission] = useState<any>(null);
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermission();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const toggleTorch = () => {
    setTorch((current) => (current === false ? true : false));
  };

  const handleScanResult = async ({ data }: any ) => {
    console.log(data)
    setScanned(true);
    let dateObj = new Date();
    let dateString = dateObj.toISOString();
    let date = dateString
      .slice(0, dateString.indexOf("T"))
      .split("-")
      .reverse()
      .join("-");

    await navigation.navigate("Send", {qrData: data});
  };

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleScanResult}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
        enableTorch={torch}
      />
      {scanned && (
        <Button title="TAP TO SCAN AGAIN" onPress={() => setScanned(false)} />
      )}
      <View style={{ flex: 1, margin: 50 }}>
        <TouchableOpacity style={styles.button} onPress={toggleTorch}>
          <Text>
            {torch === false ? (
              <Ionicons name="flashlight-outline" size={30} color="white" />
            ) : (
              <Ionicons name="flash-off-outline" size={30} color="white" />
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
});