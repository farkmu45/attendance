import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

const AttendanceScreen = () => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const takePictureAutomatically = async () => {
      if (cameraRef.current) {
        try {
          const { status } = await Camera.requestPermissionsAsync();
          setHasPermission(status === 'granted');

          if (hasPermission === null) {
            return <View />;
          }
          if (hasPermission === false) {
            alert('Camera permission denied');
            return <View />;
          }

          const options = { quality: 0.5, base64: true };
          const data = await cameraRef.current.takePictureAsync(options);
          console.log('Picture taken:', data);
          // Add your logic for handling the picture data
        } catch (error) {
          console.error('Error taking picture:', error);
        }
      }
    };

    const timeoutId = setTimeout(takePictureAutomatically, 5000);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, [hasPermission]); // Include hasPermission in the dependency array

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.back}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
});

export default AttendanceScreen;
