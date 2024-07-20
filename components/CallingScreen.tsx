import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';

interface CallingScreenProps {
  userToken: any;
  navigation: any;
  route: any;
  handleTime: (startTime: number, duration: number) => void;
}

export default function CallingScreen({
  userToken,
  navigation,
  route,
  handleTime,
}: CallingScreenProps) {
  const {id} = route.params || {};
  const [channelName, setChannelName] = useState('');
  const [url, setUrl] = useState('https://192.168.100.26');
  const [handleSwitch, setHandleSwitch] = useState(false);
  let startTime: number | null = null;

  useEffect(() => {
    console.log(id);
    setUrl(`${url}/via/${id}`);
    setChannelName(id);
    setHandleSwitch(true);
  }, [id]);

  const handleNavigationStateChange = (navState: any) => {
    if (handleSwitch) {
      const currentUrl = navState.url;

      if (currentUrl.startsWith('https://192.168.100.26/via/')) {
        if (startTime == null) startTime = new Date().getTime();
        console.log(startTime);
        console.log(currentUrl);
      } else {
        if (startTime !== null) {
          const endTime = new Date().getTime();
          const duration = endTime - startTime;
          handleTime(startTime, duration);
          startTime = null;
        }
        navigation.goBack();
      }
    }
  };

  const injectedJavaScript = `
    (function() {
      const originalLog = console.log;
      console.log = function(message) {
        window.ReactNativeWebView.postMessage(message);
        originalLog(message);
      };
    })();
  `;

  const handleMessage = (event: any) => {
    // console.log('WebView console log:', event.nativeEvent);
  };
  return (
    <View style={styles.container}>
      {handleSwitch && (
        <WebView
          source={{
            uri: url,
          }}
          style={styles.webview}
          javaScriptEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          injectedJavaScript={injectedJavaScript}
          onNavigationStateChange={handleNavigationStateChange}
          onMessage={handleMessage}
          onReceivedSslError={(event: any) => {
            console.warn('SSL Error: ', event.nativeEvent);
            event.preventDefault();
            event.nativeEvent.handler.proceed();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
