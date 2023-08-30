import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Slider } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [fps, setFps] = useState(30);
  const [responseData, setResponseData] = useState('');
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    const interval = setInterval(async () => {
      if (cameraRef.current) {
        const options = { quality: 0.5, base64: true, skipProcessing: true };
        let photo = await cameraRef.current.takePictureAsync(options);
        
        const formData = new FormData();
        formData.append('file', {
          uri: photo.uri,
          type: 'image/jpeg',
          name: 'frame.jpg',
        });

        const startTime = new Date();
        
        fetch('https://api.eureka.uiharu.dev/tests.php', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => response.json())
        .then((data) => {
          const endTime = new Date();
          const formattedTime = `${endTime.getFullYear()}년 ${String(endTime.getMonth() + 1).padStart(2, '0')}월 ${String(endTime.getDate()).padStart(2, '0')}일 ${String(endTime.getHours()).padStart(2, '0')}시 ${String(endTime.getMinutes()).padStart(2, '0')}분 ${String(endTime.getSeconds()).padStart(2, '0')}초 ${String(endTime.getMilliseconds()).padStart(3, '0')}`;
          setResponseData(`[${formattedTime}] ${data.test}`);
        })
        .catch((error) => {
          console.error(error);
        });
      }
    }, Math.floor(1000 / fps));

    return () => clearInterval(interval);
  }, [fps]);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>카메라 접근 권한이 없습니다.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{responseData}</Text>
      </View>
      <View style={{ flex: 0.5 }}>
        <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ref={cameraRef} useCamera2Api={true}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Slider
              style={{ width: 200, height: 40 }}
              minimumValue={1}
              maximumValue={60}
              step={1}
              value={fps}
              onValueChange={(value) => setFps(value)}
            />
          </View>
        </Camera>
      </View>
    </View>
  );
}
