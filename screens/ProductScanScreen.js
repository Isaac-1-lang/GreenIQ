import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Camera, CameraView } from "expo-camera";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getProductGrades } from "../utils/ProductGrade";
import NoProductImage from "../assets/NoProductImage.png";
import axios from "axios";
import { deepSeekRecommendation } from "../utils/DeepSeekAnalysis";
import { cleanText } from "../utils/cleanText";
import { extractYoutubeUrl } from "../utils/extractYoutubeURL";
import { WebView } from "react-native-webview";

const ProductScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [scanned, setScanner] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraClicked, setCameraClicked] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [videoId, setVideoId] = useState("");
  useEffect(() => {
    if (cameraClicked && hasPermission !== true) {
      const getCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        const granted = status === "granted";
        setHasPermission(granted);
        if (granted) {
          setShowCamera(true);
        }
      };
      getCameraPermission();
    }
  }, [cameraClicked]);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleScanProduct = async (barcode) => {
    try {
      const response = await axios.post(
        "https://trash2treasure-backend.onrender.com/scanProduct",
        {
          barcode: barcode,
        }
      );

      Alert.alert(response.data.message)
    } catch (error) {
      Alert.alert(error?.response?.data?.message || "Unexpected error")
    }
  };

  const handleBarcodeScanned = async ({ type, data }) => {
    setLoading(true);
    setTimeout(() => {
      if (isMounted.current) {
        setScanner(true);
        setShowCamera(false);
        setCameraClicked(false);
      }
    }, 500);
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${data}.json`
      );
      const json = await response.json();

      if (json.status === 1) {
        const gradedProduct = await getProductGrades([json.product]);
        setProduct(gradedProduct[0]);

        const deepSeekAnalysis = await deepSeekRecommendation(json.product);
        const videoId = await extractYoutubeUrl();
        const cleanedText = await cleanText(deepSeekAnalysis);
        setAnalysis(cleanedText);
        setVideoId(videoId);
        await handleScanProduct(gradedProduct[0].code);
      } else {
        Alert.alert("No product found");
      }
    } catch (error) {
      Alert.alert("An error occured")
    }
    setLoading(false);
  };

  if (hasPermission == false) {
    return <Text>No camera permission</Text>;
  }

  const giveColor = (grade) => {
    switch (grade) {
      case "a":
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.circle}>
              <Text style={styles.gradeText}>A</Text>
            </View>
            <Text
              style={{
                paddingLeft: 10,
                fontWeight: "bold",
                fontSize: 15,
                color: "#00A784",
              }}
            >
              Eco Friendly
            </Text>
          </View>
        );
        break;

      case "b":
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.circle}>
              <Text style={styles.gradeText}>B</Text>
            </View>
            <Text
              style={{
                paddingLeft: 10,
                fontWeight: "bold",
                fontSize: 15,
                color: "#00A784",
              }}
            >
              Eco Friendly
            </Text>
          </View>
        );
        break;

      case "c":
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.circleYellow}>
              <Text style={styles.gradeText}>C</Text>
            </View>
            <Text
              style={{
                paddingLeft: 10,
                fontWeight: "bold",
                fontSize: 15,
                color: "#f0fc06ff",
              }}
            >
              Eco Friendly
            </Text>
          </View>
        );
        break;

      case "d":
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.circleRed}>
              <Text style={styles.gradeText}>D</Text>
            </View>
            <Text
              style={{
                paddingLeft: 10,
                fontWeight: "bold",
                fontSize: 15,
                color: "#ff0303ff",
              }}
            >
              Not Eco Friendly
            </Text>
          </View>
        );
        break;

      case "e":
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.circleRed}>
              <Text style={styles.gradeText}>E</Text>
            </View>
            <Text
              style={{
                paddingLeft: 10,
                fontWeight: "bold",
                fontSize: 15,
                color: "#ff0303ff",
              }}
            >
              Not Eco Friendly
            </Text>
          </View>
        );
        break;

      case "unknown":
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.circlePurple}>
              <Text style={styles.gradeText}>?</Text>
            </View>
            <Text
              style={{
                paddingLeft: 8,
                fontWeight: "bold",
                fontSize: 10,
                color: "#ff6ae4ff",
              }}
            >
              Refer to analysis
            </Text>
          </View>
        );
        break;
      default:
        return null;
    }
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1 }}
        edges={["top","bottom", "left", "right"]}
      >
        {showCamera && (
          <View
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              backgroundColor: "none",
            }}
          >
            <CameraView
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              style={{ flex: 1 }}
            />
            <View
              style={{
                position: "absolute",
                top: hp("35%"),
                left: wp("20%"),
                width: wp("60%"),
                height: hp("30%"),
                borderWidth: 10,
                borderColor: "white",
                borderRadius: 20,
                zIndex: 10,
              }}
            />
          </View>
        )}
        <ScrollView>
          {loading && <ActivityIndicator size="large" color="#00A784"/>}
          {!cameraClicked && (
            <Pressable
              style={styles.cameraHolder}
              onPress={() => {
                setCameraClicked(true);
                setProduct(null);
                setShowCamera(true);
                setScanner(false);
                setVideoId("");
                setAnalysis(null);

              }}
            >
              <FontAwesome name="camera" size={30} style={{ color: "white" }} />
              <Text style={{ color: "white", marginTop: 2 }}>
                Scan a product
              </Text>
            </Pressable>
          )}

          {product && (
            <View>
              <View style={styles.container}>
                <View>
                  <Image
                    source={
                      product.image ? { uri: product.image } : NoProductImage
                    }
                    style={styles.productImage}
                  />
                </View>
                <View style={styles.aboutHotels}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      paddingBottom: 8,
                    }}
                  >
                    {product.product_name}
                  </Text>
                  <Text style={{ paddingBottom: 3, fontWeight: "bold" }}>
                    Grade: {product.grade}
                  </Text>
                  {giveColor(product.grade)}
                </View>
              </View>
            </View>
          )}

          {analysis && (
            <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
              <Text
                style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}
              >
                Environmental Impact Analysis:
              </Text>
              <Text style={styles.paragraph}>{analysis}</Text>
            </View>
          )}

          {videoId !== "" && (
            <View style={styles.videoView}>
              <WebView
                source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
                javaScriptEnabled={true}
                allowsFullscreenVideo={true}
                domStorageEnabled={true}
                style={{ flex: 1 }}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  cameraHolder: {
    backgroundColor: "#00A784",
    height: 200,
    width: 300,
    marginTop: 30,
    marginLeft: 30,
    borderRadius: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    display: "flex",
    flexDirection: "row",
    paddingLeft: 20,
    paddingTop: 30,
    overflow: "hidden",
  },
  productImage: {
    resizeMode: "cover",
    width: wp("40%"),
    height: hp("20%"),
    borderRadius: 20,
  },

  aboutHotels: {
    display: "flex",
    justifyContent: "center",
    padding: 12,
  },

  circle: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    backgroundColor: "#00A784",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginTop: 2,
  },

  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginVertical: 8,
    textAlign: "left",
  },

  circleYellow: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    backgroundColor: "#f0fc06ff",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginTop: 2,
  },

  circleRed: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    backgroundColor: "#ff0303ff",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginTop: 2,
  },

  circlePurple: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    backgroundColor: "#ff6ae4ff",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginTop: 2,
  },

  gradeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },

  videoView: {
    height: 230,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    backgroundColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
export default ProductScanScreen;
