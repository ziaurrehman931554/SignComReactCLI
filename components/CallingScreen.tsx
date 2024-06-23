// CallingScreen.tsx
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
  ImageBackground,
  ToastAndroid,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import AgoraUIKit from 'agora-rn-uikit';
import {
  ChannelProfileType,
  IRtcEngine,
  RenderModeType,
  createAgoraRtcEngine,
} from 'react-native-agora';
import {
  PropsInterface,
  StylePropInterface,
  PropsProvider,
} from 'agora-rn-uikit/src/Contexts/PropsContext';
import ViewShot from 'react-native-view-shot';
import HandGestureDetection from './HandGestureDetection';

interface CallingScreenProps {
  navigation: any;
  userToken: any;
  route: any;
}

const appId = '5d4f500c39834c95ae5a04635a3f0ab8';
const uid = 0;

const CallingScreen = ({userToken, navigation, route}: CallingScreenProps) => {
  const {height} = Dimensions.get('window');
  const [channelName, setChannelName] = useState('test-channel');
  const [isJoined, setIsJoined] = useState(true);
  const [caption, setCaption] = useState(
    'This is where sign data will be displayed',
  );
  const {joinID, generateID} = route.params || {};
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const viewShotRef = useRef<ViewShot | null>(null);

  useEffect(() => {
    if (joinID) {
      setChannelName(joinID);
    } else if (generateID) {
      setChannelName(generateID);
    }
  }, [joinID, generateID]);

  const takeScreenshot = () => {
    if (viewShotRef.current) {
      viewShotRef.current
        .capture()
        .then((uri: any) => {
          setScreenshot(uri);
          console.log('Screenshot captured:', uri);
        })
        .catch((error: any) => {
          console.error('Failed to take screenshot:', error);
        });
    }
  };

  const initiateScreenshot = () => {
    setInterval(() => {
      takeScreenshot();
    }, 10000);
    return <></>;
  };

  const handleResults = (results: any) => {
    if (results.length > 0) {
      // Process hand landmarks
      console.log('Hand landmarks:', results);
      // You can set caption based on hand gesture recognition here
      setCaption(results);
    } else {
      setCaption('No hand detected');
    }
  };

  const props: PropsInterface = {
    rtcProps: {appId: appId, channel: channelName},
    callbacks: {
      EndCall: () => {
        setIsJoined(false);
        navigation.goBack();
      },
      LocalMuteAudio: mute => ToastAndroid.show('mute', mute),
    },
  };

  const style: StylePropInterface = {
    UIKitContainer: {
      backgroundColor: 'transparent',
      marginHorizontal: 30,
      marginTop: 5,
    },
    videoMode: {
      max: RenderModeType.RenderModeHidden,
      min: RenderModeType.RenderModeHidden,
    },
    maxViewStyles: {
      height: '75%',
      zIndex: 10,
      borderRadius: 150,
    },
    minViewStyles: {
      position: 'absolute',
      right: -300,
      top: height - 350,
      width: 80,
    },
    localBtnContainer: {
      borderRadius: 5,
      flexDirection: 'row', // Ensure buttons are in a row
      justifyContent: 'center', // Ensure buttons are centered
      height: 50,
      padding: 5,
      gap: 8,
      marginTop: -100,
    },
    localBtnStyles: {
      muteLocalVideo: {
        backgroundColor: 'gray',
      },
      switchCamera: {
        backgroundColor: 'gray',
      },
      endCall: {
        backgroundColor: 'red',
        height: 60,
        width: 60,
      },
      muteLocalAudio: {
        backgroundColor: 'gray',
      },
    },
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.container}>
      <View style={styles.container}>
        <ViewShot
          ref={viewShotRef}
          options={{format: 'jpg', quality: 0.9}}
          style={styles.viewShotContainer}>
          <AgoraUIKit
            connectionData={props.rtcProps}
            rtcCallbacks={props.callbacks}
            styleProps={style}
          />
        </ViewShot>
        {initiateScreenshot()}
        {/* <HandGestureDetection onResults={handleResults} /> */}
        <View style={styles.captionContainer}>
          <Text style={styles.caption}>{caption}</Text>
        </View>
        {screenshot && (
          <Image source={{uri: screenshot}} style={styles.screenshot} />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewShotContainer: {
    flex: 1,
    position: 'relative',
  },
  captionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    height: 80,
    width: 180,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caption: {
    height: '100%',
    width: '100%',
    color: 'white',
    fontSize: 15,
    padding: 3,
    overflow: 'scroll',
  },
  screenshot: {
    position: 'absolute',
    bottom: 200,
    left: 20,
    width: 300,
    height: 300,
    borderRadius: 10,
  },
});

export default CallingScreen;

// import React, {useState, useEffect, useRef} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ImageBackground,
//   StyleSheet,
//   Platform,
//   Dimensions,
//   PermissionsAndroid,
//   Image,
//   Alert,
// } from 'react-native';
// import {RNCamera} from 'react-native-camera';
// import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
// import {useStyle} from '../AppContext';
// import {
//   ClientRoleType,
//   createAgoraRtcEngine,
//   IRtcEngine,
//   RtcSurfaceView,
//   ChannelProfileType,
//   AudienceLatencyLevelType,
// } from 'react-native-agora';

// interface CallingScreenProps {
//   navigation: any;
//   userToken: any;
// }

// const appId = 'afc0fd5ffd9743699ce3073a77dcf0c4';
// const token = '7481389ea03c4177a0035f8965cf19e2';
// const channelName = 'test-channel';
// const uid = 0;

// export default function CallingScreen({
//   navigation,
//   userToken,
// }: CallingScreenProps) {
//   const {appStyles, theme} = useStyle();
//   const {height} = Dimensions.get('screen');

//   const [hasPermission, setHasPermission] = useState<any>(null);
//   const [joined, setJoined] = useState(false);
//   const [peerIds, setPeerIds] = useState<number[]>([]);
//   const cameraRef = useRef<RNCamera | null>(null);
//   const [text, setText] = useState(
//     'This is container where the text of the signs are displayed.',
//   );
//   const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.front);
//   const [isMicMuted, setIsMicMuted] = useState(false);
//   const [isCallOngoing, setIsCallOngoing] = useState<boolean>(true);
//   const [isCameraReady, setIsCameraReady] = useState<boolean>(false);

//   let engine: IRtcEngine | null = null;

//   useEffect(() => {
//     (async () => {
//       let cameraPermissionStatus;
//       let microphonePermissionStatus;

//       if (Platform.OS === 'android') {
//         cameraPermissionStatus = await request(PERMISSIONS.ANDROID.CAMERA);
//         microphonePermissionStatus = await request(
//           PERMISSIONS.ANDROID.RECORD_AUDIO,
//         );
//       } else if (Platform.OS === 'ios') {
//         cameraPermissionStatus = await request(PERMISSIONS.IOS.CAMERA);
//         microphonePermissionStatus = await request(PERMISSIONS.IOS.MICROPHONE);
//       }

//       if (
//         cameraPermissionStatus === RESULTS.GRANTED &&
//         microphonePermissionStatus === RESULTS.GRANTED
//       ) {
//         setHasPermission(true);
//         initAgora();
//       } else {
//         setHasPermission(false);
//       }
//     })();
//   }, []);

//   const initAgora = async () => {
//     engine = createAgoraRtcEngine();
//     engine.initialize({
//       appId: appId,
//       channelProfile: ChannelProfileType.ChannelProfileCommunication1v1,
//     });

//     engine.enableVideo();
//     engine.addListener('onJoinChannelSuccess', (connection, elapsed) => {
//       console.log('Join channel success', connection, elapsed);
//       setJoined(true);
//     });

//     engine.addListener('onUserJoined', (uid, elapsed) => {
//       console.log('Remote user joined', uid, elapsed);
//       setPeerIds((prev: any) => {
//         if (prev.length < 1) {
//           return [...prev, uid];
//         } else {
//           Alert.alert(
//             'Max Users',
//             'Only two users are allowed in the channel.',
//           );
//           return prev;
//         }
//       });
//     });

//     engine.addListener('onUserOffline', (uid, reason) => {
//       console.log('Remote user offline', uid, reason);
//       setPeerIds(prev => prev.filter(id => id !== uid));
//     });

//     engine.joinChannel(token, channelName, uid, 0);
//   };

//   const handleEndCall = () => {
//     setJoined(false);
//     setIsCallOngoing(false);
//     if (engine) {
//       engine.leaveChannel();
//       engine = null;
//     }
//     navigation.goBack();
//   };

//   const takePicture = async () => {
//     if (cameraRef.current && isCameraReady) {
//       const options = {quality: 0.5, base64: true, skipProcessing: true};
//       const data = await cameraRef.current.takePictureAsync(options);
//       console.log('Captured photo URI: ', data.uri); // Debugging line
//       // Handle captured photo data if necessary
//     }
//   };

//   useEffect(() => {
//     let isCancelled = false;
//     if (isCameraReady) {
//       const intervalId = setInterval(() => {
//         if (!isCancelled) {
//           takePicture();
//         }
//       }, 1000);
//       return () => {
//         isCancelled = true;
//         clearInterval(intervalId);
//       };
//     }
//   }, [isCameraReady]);

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   const toggleCameraType = () => {
//     setCameraType(
//       cameraType === RNCamera.Constants.Type.front
//         ? RNCamera.Constants.Type.back
//         : RNCamera.Constants.Type.front,
//     );
//   };

//   const toggleMic = () => {
//     setIsMicMuted(!isMicMuted);
//   };

//   const handleWebViewError = (syntheticEvent: any) => {
//     const {nativeEvent} = syntheticEvent;
//     console.warn('WebView error: ', nativeEvent);
//     Alert.alert('WebView Error', nativeEvent.description);
//   };

//   const handleWebViewLoadProgress = (event: any) => {
//     console.log('WebView load progress: ', event.nativeEvent.progress);
//   };

//   return (
//     <ImageBackground
//       style={[appStyles.container, appStyles.top]}
//       source={require('../assets/background.png')}>
//       <View
//         style={{
//           bottom: 10,
//           position: 'absolute',
//           width: '100%',
//           alignSelf: 'center',
//           zIndex: 2,
//         }}>
//         <View style={styles.capNCamContainer}>
//           <View style={[styles.captionContainer, appStyles.containerBack]}>
//             <Text style={[styles.caption, appStyles.text]}>{text}</Text>
//           </View>
//           <View style={styles.myCamContainer}>
//             {joined && (
//               <RtcSurfaceView style={{flex: 1, borderRadius: 11, zIndex: -1}} />
//             )}
//             {/* {isCallOngoing && (
//               <RNCamera
//                 style={{flex: 1, borderRadius: 11, zIndex: -1}}
//                 type={cameraType}
//                 ref={cameraRef}
//                 autoFocus="on"
//                 useCamera2Api
//                 onCameraReady={() => setIsCameraReady(true)}
//               />
//             )} */}
//           </View>
//         </View>
//         <View style={styles.controlContainer}>
//           <TouchableOpacity
//             style={styles.controlOptionContainer}
//             onPress={toggleCameraType}
//             disabled={!isCallOngoing}>
//             <Text style={styles.controlOption}>🔄</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.controlOptionContainer,
//               {backgroundColor: '#FF0000'},
//             ]}
//             onPress={handleEndCall}
//             disabled={!isCallOngoing}>
//             <Text style={styles.controlOption}>📞</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.controlOptionContainer}
//             onPress={toggleMic}
//             disabled={!isCallOngoing}>
//             <Text style={styles.controlOption}>{isMicMuted ? '🔇' : '🎤'}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       <View
//         style={[
//           styles.otherCamContainer,
//           appStyles.colorBackground,
//           {height: height - appStyles.top.paddingTop - 192},
//         ]}>
//         {peerIds.map(peerId => (
//           <RtcSurfaceView key={peerId} style={styles.remote} uid={peerId} />
//         ))}
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   capNCamContainer: {
//     bottom: 0,
//     display: 'flex',
//     width: '100%',
//     alignItems: 'flex-end',
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   captionContainer: {
//     height: 76,
//     width: 198,
//     borderRadius: 11,
//     margin: 6,
//   },
//   caption: {
//     padding: 5,
//     fontSize: 17,
//   },
//   myCamContainer: {
//     overflow: 'hidden',
//     height: 191,
//     borderWidth: 1,
//     width: 115,
//     borderRadius: 11,
//     margin: 3,
//     backgroundColor: 'black',
//     borderColor: '#74ACD9',
//   },
//   controlContainer: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   controlOptionContainer: {
//     height: 80,
//     width: 80,
//     borderRadius: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   controlOption: {
//     fontSize: 40,
//   },
//   otherCamContainer: {
//     overflow: 'hidden',
//     zIndex: 1,
//     width: '95%',
//     alignSelf: 'center',
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#74ACD9',
//   },
// });

// import {WebView} from 'react-native-webview';
{
  /* <WebView
          style={{flex: 1}}
          source={{
            uri: 'https://tomasgonzalez.github.io/hand-gesture-recognition-using-mediapipe-in-react/',
          }}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onError={handleWebViewError}
          onHttpError={handleWebViewError}
          onLoadProgress={handleWebViewLoadProgress}
          onLoadStart={() => console.log('WebView load start')}
          onLoadEnd={() => console.log('WebView load end')}
          userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
          onMessage={event => {
            const {data} = event.nativeEvent;
            console.log('WebView message received: ', data);
            if (data === 'requestCameraPermission') {
              // Handle camera permission request from web page
              requestWebviewCameraPermission();
            }
          }}
          onPermissionRequest={(event: any) => {
            const {resources} = event.nativeEvent;
            if (resources.includes('camera')) {
              event.grant();
            }
          }}
        /> */
}
// async function requestWebviewCameraPermission() {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.CAMERA,
//       {
//         title: 'Camera Permission',
//         message: 'The app needs access to your camera to capture images.',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       },
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('Camera permission granted');
//       // Handle camera permission granted
//     } else {
//       console.log('Camera permission denied');
//       // Handle camera permission denied
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// }

// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Platform, Dimensions } from "react-native";
// import { Camera } from "expo-camera";

// import { useStyle, useUser } from "../AppContext";

// interface CallingScreenProps {
//   navigation: any;
//   userToken: any;
// }
// export default function CallingScreen({ navigation, userToken }: CallingScreenProps) {
//   const { appStyles, theme } = useStyle()
//   const { height } = Dimensions.get('screen');

//   const [hasPermission, setHasPermission] = useState<any>(null);
//   const [cameraRef, setCameraRef] = useState(null);
//   const [text, setText] = useState("This is container where the text of the signs are displayed.");
//   const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
//   const [isMicMuted, setIsMicMuted] = useState(false);
//   const [isCallOngoing, setIsCallOngoing] = useState(true);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, []);

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   const handleEndCall = () => {
//     setIsCallOngoing(false);
//     navigation.goBack();
//   };

//   const toggleCameraType = () => {
//     setCameraType(
//       cameraType === Camera.Constants.Type.front
//         ? Camera.Constants.Type.back
//         : Camera.Constants.Type.front
//     );
//   };

//   const toggleMic = () => {
//     setIsMicMuted(!isMicMuted);
//   };

//   return (
//     <ImageBackground style={[appStyles.container, appStyles.top]} source={require('../assets/background.png')}>
//       <View style={{ bottom: 10, position: "absolute", width: '100%', alignSelf: 'center', zIndex: 2 }}>
//         <View style={styles.capNCamContainer}>
//           <View style={[styles.captionContainer, appStyles.containerBack]}>
//             <Text style={[styles.caption, appStyles.text]}>{text}</Text>
//           </View>
//           <View style={styles.myCamContainer}>
//             {isCallOngoing && (<></>
//               // <Camera
//               //   style={{ flex: 1, borderRadius: 11, zIndex: -1 }}
//               //   type={cameraType}
//               //   ref={(ref) => setCameraRef(ref)}
//               // />
//             )}
//           </View>
//         </View>
//         <View style={styles.controlContainer}>
//           <TouchableOpacity
//             style={styles.controlOptionContainer}
//             onPress={toggleCameraType}
//             disabled={!isCallOngoing}
//           >
//             <Text style={styles.controlOption}>🔄</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.controlOptionContainer, { backgroundColor: '#FF0000' }]}
//             onPress={handleEndCall}
//             disabled={!isCallOngoing}
//           >
//             <Text style={styles.controlOption}>📞</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.controlOptionContainer}
//             onPress={toggleMic}
//             disabled={!isCallOngoing}
//           >
//             <Text style={styles.controlOption}>{isMicMuted ? '🔇' : '🎤'}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       <View style={[styles.otherCamContainer, appStyles.colorBackground, {height: height - appStyles.top.paddingTop - 192}]}>
//         {isCallOngoing && (<></>
//           // <Camera
//           //   style={{ flex: 1, borderRadius: 11, zIndex: -1  }}
//           //   type={Camera.Constants.Type.back}
//           //   ref={(ref) => setCameraRef(ref)}
//           // />
//         )}
//       </View>
//       <StatusBar style="dark" />
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//     capNCamContainer: {
//         bottom: 0,
//         display: 'flex',
//         width: '100%',
//         alignItems: 'flex-end',
//         flexDirection: 'row',
//         justifyContent: 'center',
//     },
//     captionContainer: {
//         height: 76,
//         width: 198,
//         borderRadius: 11,
//         margin: 6,
//     },
//     caption: {
//         padding: 5,
//         fontSize: 17,
//     },
//     myCamContainer: {
//         overflow: "hidden",
//         height: 191,
//         borderWidth: 1,
//         width: 115,
//         borderRadius: 11,
//         margin: 3,
//         backgroundColor: 'black',
//         borderColor: '#74ACD9',
//     },
//     controlContainer: {
//         width: '100%',
//         flexDirection: "row",
//         justifyContent: "center",
//         marginBottom: 10,
//     },
//     controlOptionContainer: {
//         height: 80,
//         width: 80,
//         borderRadius: 50,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     controlOption: {
//         fontSize: 40,
//     },
//     otherCamContainer: {
//         overflow: "hidden",
//         zIndex: 1,
//         width: '95%',
//         alignSelf: 'center',
//         borderRadius: 20,
//         borderWidth: 1,
//         borderColor: '#74ACD9',
//     },
// })
