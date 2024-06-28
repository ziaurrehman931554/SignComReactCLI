import React from 'react';
import {StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';

interface CallingScreensProps {
  userToken: any;
  navigation: any;
  route: any;
}

export default function CallingScreens({
  userToken,
  navigation,
  route,
}: CallingScreensProps) {
  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: 'http://10.2.0.2:3000',
        }}
        style={styles.webview}
        javaScriptEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        onReceivedSslError={(event: any) => {
          event.preventDefault();
          event.handler.proceed();
        }}
      />
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
