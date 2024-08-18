// HandGestureDetection.tsx
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  createAgoraRtcEngine,
  IRtcEngine,
  VideoSourceType,
} from 'react-native-agora';
import {RNCamera} from 'react-native-camera';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';

interface HandGestureDetectionProps {
  onResults: (results: any) => void;
}

const HandGestureDetection = ({onResults}: HandGestureDetectionProps) => {
  const cameraRef = useRef(null);
  const engineRef = useRef<IRtcEngine>(createAgoraRtcEngine());
  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const handposeModel = await handpose.load();
      setModel(handposeModel);
    };

    loadModel();
  }, []);

  const handleCameraStream = async (camera: any) => {
    if (!camera || !model) return;

    const {uri} = await camera.takePictureAsync({base64: true});
    const image = await tf.browser.fromPixelsAsync({uri});
    const predictions = await model.estimateHands(image);
    onResults(predictions);
  };

  return (
    <View style={styles.cameraContainer}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={RNCamera.Constants.Type.front}
        onCameraReady={() => handleCameraStream(cameraRef.current)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    display: 'flex',
    position: 'absolute',
    height: '10%',
    width: 50,
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default HandGestureDetection;
