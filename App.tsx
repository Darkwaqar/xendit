import React, { useState } from "react";
import {
  Text,
  View,
  TouchableHighlight,
  TextInput,
  SafeAreaView,
} from "react-native";
import CheckBox from "expo-checkbox";
import { WebView } from "react-native-webview";

import Xendit, { TokenResponse } from "xendit-js-node";

import styles from "./styles";
import { NativeEventData } from "./types";
import axios from "axios";

const userToken = "";
const baseUrl = "https://www.yourdomain.com/api";

export default function App() {
  const [amount, setAmount] = useState("70000");
  const [cardNumber, setCardNumber] = useState("4000000000000002");
  const [cardExpMonth, setCardExpMonth] = useState("12");
  const [cardExpYear, setCardExpYear] = useState(
    String(new Date().getFullYear() + 1)
  );
  const [cardCvn, setCardCvn] = useState("123");
  const [isMultipleUse, setIsMultipleUse] = useState(false);
  const [isSkip3DS, setIsSkip3DS] = useState(false);
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [isRenderWebview, setIsRenderWebview] = useState(false);
  const [webviewUrl, setWebviewUrl] = useState("");
  const [authenticationId, setAuthenticationId] = useState("");

  function tokenize() {
    setIsTokenizing(true);

    const tokenData = getTokenData();
    Xendit.setPublishableKey(
      // live
      // "xnd_public_production_IPbugJEYoZyhZ95tWukoZqyr3FMdJLDkXTnedvKZX5MZKkzZ76pNkWD5YPcqQJt"
      // test
      "xnd_public_development_TcBLark48OYiB7uqNa9VELCHYqL49y2TFMYY7ZCzvZsO4lH9ouBcGP8y1m1yS"
    );

    Xendit.card.createToken(tokenData, _tokenResponseHandler);
  }

  function onMessage(rawData: any) {
    try {
      const data: NativeEventData = JSON.parse(rawData.nativeEvent.data);
      // result
      // {"MessageType": "profile.complete", "Nonce": "ff78ef7a-6835-4fb5-9cee-a803af42491d", "Results": [{"DataSource": "CardinalData", "ElapsedTime": 467, "Status": true}], "Source": "browser", "Type": "DF"}
      setIsRenderWebview(false);
      alert(JSON.stringify(data));
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  function getTokenData() {
    return {
      amount,
      card_number: cardNumber,
      card_exp_month: cardExpMonth,
      card_exp_year: cardExpYear,
      card_cvn: cardCvn,
      is_multiple_use: isMultipleUse,
      should_authenticate: !isSkip3DS,
    };
  }

  function sendDataToServer(token: TokenResponse) {
    let data = JSON.stringify({
      token: token.id,
      // if you want orignel card number
      // cardNumber: cardNumber,
      // if you want mask card number
      cardNumber: token.masked_card_number,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/cards`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function _tokenResponseHandler(err: any, token: TokenResponse) {
    if (err) {
      alert(JSON.stringify(err));
      console.log("error", JSON.stringify(err));
      setIsTokenizing(false);
      return;
    }
    console.log("token", JSON.stringify(token));
    // {"card_expiration_month": "12", "card_expiration_year": "2024", "card_info": {"bank": "PT BANK RAKYAT INDONESIA TBK", "brand": "VISA", "country": "ID", "fingerprint": "5e85742e0fe8350019d288e1", "type": "CREDIT"}, "id": "648b02560b41eb001a261f07", "masked_card_number": "400000XXXXXX0002", "payer_authentication_url": "https://redirect.xendit.co/callbacks/3ds/enrollments/648b02560b41eb001a261f08/redirect?api_key=xnd_public_production_IPbugJEYoZyhZ95tWukoZqyr3FMdJLDkXTnedvKZX5MZKkzZ76pNkWD5YPcqQJt", "status": "IN_REVIEW"}
    switch (token.status) {
      case "APPROVED":
      case "VERIFIED":
      case "FAILED":
        // {"id":"648b070c04ece6001a63ebad","masked_card_number":"400000XXXXXX0002","status":"VERIFIED","card_info":{"bank":"PT BANK RAKYAT INDONESIA TBK","country":"ID","type":"CREDIT","brand":"VISA","fingerprint":"5e85742e0fe8350019d288e1"},"card_expiration_month":"12","card_expiration_year":"2024"}
        alert(JSON.stringify(token));
        sendDataToServer(token);
        break;
      case "IN_REVIEW":
        // setAuthenticationId(token.authentication_id);
        setWebviewUrl(token.payer_authentication_url);
        setIsRenderWebview(true);
        break;
      default:
        alert("Unknown token status");
        break;
    }

    setIsTokenizing(false);
  }

  const INJECTED_JAVASCRIPT = `(function() {
      var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
      var addEventListener = window[eventMethod];
      var messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';

      addEventListener(messageEvent, function(e) {
        var key = e.message ? 'message' : 'data';
        var messageStr = e[key];

        try {
          window.ReactNativeWebView.postMessage(messageStr);
        } catch (e) {}
    }, false);
  })();`;

  if (isRenderWebview) {
    return (
      <WebView
        originWhitelist={["*"]}
        source={{ uri: webviewUrl }}
        onMessage={onMessage}
        injectedJavaScript={INJECTED_JAVASCRIPT}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Amount"
          defaultValue={amount}
          onChangeText={(text) => setAmount(text)}
          keyboardType={"numeric"}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Card Number"
          maxLength={16}
          defaultValue={cardNumber}
          onChangeText={(text) => setCardNumber(text)}
          keyboardType={"numeric"}
        />

        <View style={styles.secondaryTextContainer}>
          <TextInput
            placeholder="Exp Month"
            maxLength={2}
            style={styles.secondaryTextInput}
            defaultValue={cardExpMonth}
            onChangeText={(text) => setCardExpMonth(text)}
            keyboardType={"numeric"}
          />
          <TextInput
            placeholder="Exp Year"
            maxLength={4}
            style={styles.secondaryTextInput}
            defaultValue={cardExpYear}
            onChangeText={(text) => setCardExpYear(text)}
            keyboardType={"numeric"}
          />
          <TextInput
            placeholder="CVN"
            maxLength={3}
            style={styles.secondaryTextInput}
            defaultValue={cardCvn}
            onChangeText={(text) => setCardCvn(text)}
            keyboardType={"numeric"}
          />
        </View>

        <View style={styles.checkBoxContainer}>
          <CheckBox
            value={isMultipleUse}
            onValueChange={(val) => setIsMultipleUse(val)}
          />
          <Text style={styles.defaultContent}> Multiple use token? </Text>
        </View>
        <View style={styles.checkBoxContainer}>
          <CheckBox
            value={isSkip3DS}
            onValueChange={(val) => setIsSkip3DS(val)}
          />
          <Text style={styles.defaultContent}> Skip authentication? </Text>
        </View>

        <TouchableHighlight
          style={styles.button}
          onPress={tokenize}
          disabled={isTokenizing}
        >
          <Text style={{ color: "#fff" }}>Tokenize</Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}
