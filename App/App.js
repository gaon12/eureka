import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResultModal = ({ isVisible, data, onClose }) => (
  <Modal isVisible={isVisible}>
    <View style={styles.modalContent}>
      {data?.status === 200 ? (
        <Text>{data.message}</Text>
      ) : (
        <Text>{data?.error?.message || '알 수 없는 에러'}</Text>
      )}
      <Button title="닫기" onPress={onClose} />
    </View>
  </Modal>
);

const ManualSearchModal = ({ isVisible, onSearch, onClose, setCarNumber, isLoading }) => (
  <Modal isVisible={isVisible}>
    <View style={styles.manualModalContent}>
      <TextInput
        placeholder="차량번호 입력"
        onChangeText={text => setCarNumber(text)}
        style={styles.manualInput}
      />
      <View style={styles.manualButtonContainer}>
        {isLoading ? <ActivityIndicator /> : null}
        <Button title="찾기" onPress={onSearch} disabled={isLoading} />
        <View style={{ width: 20 }} />
        <Button title="닫기" onPress={onClose} />
      </View>
    </View>
  </Modal>
);

const LoginModal = ({ isVisible, onLogin, onClose, isLoading }) => (
  <Modal isVisible={isVisible}>
    <View style={styles.loginModalContent}>
      <TextInput
        placeholder="동"
        keyboardType="numeric"
        style={styles.loginInput}
        onChangeText={text => onLogin(text, 'dong')}
      />
      <TextInput
        placeholder="호"
        keyboardType="numeric"
        style={styles.loginInput}
        onChangeText={text => onLogin(text, 'ho')}
      />
      <TextInput
        placeholder="비밀번호"
        secureTextEntry
        style={styles.loginInput}
        onChangeText={text => onLogin(text, 'pw1')}
      />
      {isLoading ? <ActivityIndicator /> : null}
      <Button title="로그인" onPress={() => onLogin(null, 'submit')} />
      <View style={{ width: 20 }} />
      <Button title="닫기" onPress={onClose} />
    </View>
  </Modal>
);

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isManualSearchVisible, setManualSearchVisible] = useState(false);
  const [carNumber, setCarNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({});
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 추적
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
	  const session = await AsyncStorage.getItem('session');
      if (session) {
        setIsLoggedIn(true);  // 세션 있으면 로그인 상태를 true로 설정
      }
    })();
  }, []);
  
  const handleLogout = async () => {
    try {
      await axios.get('http://example.com/user/signout');
      await AsyncStorage.removeItem('session');
      setIsLoggedIn(false);
    } catch (error) {
      Alert.alert('로그아웃 오류', error.response?.data?.error?.message || '알 수 없는 에러');
    }
  };
  
  const handleLoginInput = (value, key) => {
    if (key !== 'submit') {
      setLoginData(prevData => ({ ...prevData, [key]: value }));
    } else {
      // 로그인 API 호출
      axios.post('http://example.com/user/signin', loginData)
        .then(response => {
          AsyncStorage.setItem('session', JSON.stringify(response.data));
          setLoginVisible(false);
          // 로그인 성공 처리
        })
        .catch(error => {
          // 로그인 실패 처리
          Alert.alert('로그인 오류', error.response?.data?.error?.message || '알 수 없는 에러');
        });
    }
  };

  const showModal = (data) => {
    setModalData(data);
    setModalVisible(true);
  };

  const handleManualSearchPopup = () => {
    setManualSearchVisible(true);
  };

  const performManualSearch = async () => {
	  
	// 로그인 확인
    const session = await AsyncStorage.getItem('session');
    if (!session) {
      Alert.alert('로그인 필요', '로그인 후에 검색할 수 있습니다.');
      return;
    }
	
    setIsLoading(true);
    const source = axios.CancelToken.source();
    const timer = setTimeout(() => {
      source.cancel('Timeout');
    }, 10000);

    try {
      const response = await axios.post('http://example.com/car/info', { car_number: carNumber }, {
        cancelToken: source.token,
      });
      setModalData(response.data);
      setModalVisible(true);
    } catch (error) {
      if (axios.isCancel(error)) {
        setModalData({ status: 408, message: '타임아웃' });
        setModalVisible(true);
      } else {
        setModalData(error.response?.data || { status: 500, message: '알 수 없는 에러' });
        setModalVisible(true);
      }
    } finally {
      clearTimeout(timer);  // 타이머 해제
      setIsLoading(false);
      setManualSearchVisible(false);
    }
  };

  const sendImage = async (imageUri) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'image.jpg',
      type: 'image/jpg',
    });

    try {
      const response = await axios.post('https://test.com/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showModal(response.data);
    } catch (error) {
      showModal(error.response?.data || { status: 500, message: '알 수 없는 에러' });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.cancelled) {
      sendImage(result.uri);
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const { uri } = await cameraRef.current.takePictureAsync();
      sendImage(uri);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>카메라 접근 권한이 없습니다.</Text>;
  }

  if (!isLoggedIn) {
    return (
      <LoginModal
        isVisible={!isLoggedIn}
        onLogin={handleLoginInput}
        onClose={() => null}  // 로그인하지 않으면 닫지 못하게 설정
        isLoading={false}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} />
      <View style={styles.buttonContainer}>
		  <Button title="사진 업로드" onPress={pickImage} />
		  <Button title="사진 찍기" onPress={takePhoto} />
		  <Button title="수동 검색" onPress={handleManualSearchPopup} />
		  <Button title="로그아웃" onPress={handleLogout} />
		</View>
      <ResultModal
        isVisible={isModalVisible}
        data={modalData}
        onClose={() => setModalVisible(false)}
      />
      <ManualSearchModal
        isVisible={isManualSearchVisible}
        onSearch={performManualSearch}
        onClose={() => setManualSearchVisible(false)}
        setCarNumber={setCarNumber}
        isLoading={isLoading}
      />
      <LoginModal
        isVisible={isLoginVisible}
        onLogin={handleLoginInput}
        onClose={() => setLoginVisible(false)}
        isLoading={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
  },
  manualModalContent: {
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'space-between',
    minHeight: 200, // 모달 창의 최소 높이 설정
  },
  manualInput: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20, // 여백 설정
  },
  manualButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  loginModalContent: {
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'space-between',
    minHeight: 200,
  },
  loginInput: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
});
