import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Modal from "react-native-modal";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";
const PREDICT_API_URL = process.env.EXPO_PUBLIC_PREDICT_API_URL || `${API_BASE_URL}/predict`;
const REQUEST_TIMEOUT_MS = 10_000;

type LoginField = "dong" | "ho" | "pw";

interface LoginData {
  dong: string;
  ho: string;
  pw: string;
}

interface ApiErrorDetail {
  message?: string;
}

interface ApiEnvelope<TMessage = string> {
  status: number;
  message?: TMessage;
  error?: ApiErrorDetail;
}

interface PlateLookupResult extends ApiEnvelope {
  carNumber?: string;
  username?: string;
  dong?: string | number;
  ho?: string | number;
}

interface ResultModalProps {
  isVisible: boolean;
  data: PlateLookupResult | null;
  onClose: () => void;
}

interface ManualSearchModalProps {
  isVisible: boolean;
  onSearch: () => void;
  onClose: () => void;
  setCarNumber: (value: string) => void;
  isLoading: boolean;
}

interface LoginModalProps {
  isVisible: boolean;
  onFieldChange: (value: string, key: LoginField) => void;
  onSubmit: () => void;
  onClose: () => void;
  isLoading: boolean;
}

const getAxiosErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiEnvelope>(error)) {
    return error.response?.data?.error?.message ?? error.response?.data?.message ?? "알 수 없는 에러";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "알 수 없는 에러";
};

const ResultModal = ({ isVisible, data, onClose }: ResultModalProps) => (
  <Modal isVisible={isVisible}>
    <View style={styles.modalContent}>
      {data?.status === 200 ? (
        <Text>{data.message}</Text>
      ) : (
        <Text>{data?.error?.message || data?.message || "알 수 없는 에러"}</Text>
      )}
      <Button title="닫기" onPress={onClose} />
    </View>
  </Modal>
);

const ManualSearchModal = ({
  isVisible,
  onSearch,
  onClose,
  setCarNumber,
  isLoading,
}: ManualSearchModalProps) => (
  <Modal isVisible={isVisible}>
    <View style={styles.manualModalContent}>
      <TextInput
        placeholder="차량번호 입력"
        onChangeText={setCarNumber}
        style={styles.manualInput}
      />
      <View style={styles.manualButtonContainer}>
        {isLoading ? <ActivityIndicator /> : null}
        <Button title="찾기" onPress={onSearch} disabled={isLoading} />
        <View style={styles.buttonSpacer} />
        <Button title="닫기" onPress={onClose} />
      </View>
    </View>
  </Modal>
);

const LoginModal = ({
  isVisible,
  onFieldChange,
  onSubmit,
  onClose,
  isLoading,
}: LoginModalProps) => (
  <Modal isVisible={isVisible}>
    <View style={styles.loginModalContent}>
      <TextInput
        placeholder="동"
        keyboardType="numeric"
        style={styles.loginInput}
        onChangeText={(text) => onFieldChange(text, "dong")}
      />
      <TextInput
        placeholder="호"
        keyboardType="numeric"
        style={styles.loginInput}
        onChangeText={(text) => onFieldChange(text, "ho")}
      />
      <TextInput
        placeholder="비밀번호"
        secureTextEntry
        style={styles.loginInput}
        onChangeText={(text) => onFieldChange(text, "pw")}
      />
      {isLoading ? <ActivityIndicator /> : null}
      <Button title="로그인" onPress={onSubmit} disabled={isLoading} />
      <View style={styles.buttonSpacer} />
      <Button title="닫기" onPress={onClose} />
    </View>
  </Modal>
);

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [modalData, setModalData] = useState<PlateLookupResult | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isManualSearchVisible, setManualSearchVisible] = useState(false);
  const [carNumber, setCarNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>({ dong: "", ho: "", pw: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  const showModal = (data: PlateLookupResult) => {
    setModalData(data);
    setModalVisible(true);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/user/signout`, null, {
        withCredentials: true,
        timeout: REQUEST_TIMEOUT_MS,
      });
      setIsLoggedIn(false);
    } catch (error) {
      Alert.alert("로그아웃 오류", getAxiosErrorMessage(error));
    }
  };

  const handleLoginInput = (value: string, key: LoginField) => {
    setLoginData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleLoginSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post<ApiEnvelope>(`${API_BASE_URL}/user/signin`, loginData, {
        withCredentials: true,
        timeout: REQUEST_TIMEOUT_MS,
      });
      setIsLoggedIn(response.data.status === 200);
    } catch (error) {
      Alert.alert("로그인 오류", getAxiosErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const performManualSearch = async () => {
    if (!isLoggedIn) {
      Alert.alert("로그인 필요", "로그인 후에 검색할 수 있습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post<PlateLookupResult>(
        `${API_BASE_URL}/car/info`,
        { car_number: carNumber },
        {
          timeout: REQUEST_TIMEOUT_MS,
          withCredentials: true,
        },
      );
      showModal(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        showModal({ status: 408, message: "타임아웃" });
      } else {
        showModal({ status: 500, message: getAxiosErrorMessage(error) });
      }
    } finally {
      setIsLoading(false);
      setManualSearchVisible(false);
    }
  };

  const sendImage = async (imageUri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: "image.jpg",
      type: "image/jpeg",
    } as unknown as Blob);

    try {
      const response = await axios.post<PlateLookupResult>(PREDICT_API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: REQUEST_TIMEOUT_MS,
      });
      showModal(response.data);
    } catch (error) {
      showModal({ status: 500, message: getAxiosErrorMessage(error) });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
    });
    const asset = result.assets?.[0];
    if (!result.canceled && asset?.uri) {
      await sendImage(asset.uri);
    }
  };

  const takePhoto = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    if (photo?.uri) {
      await sendImage(photo.uri);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text>카메라 접근 권한이 필요합니다.</Text>
        <Button title="권한 요청" onPress={requestPermission} />
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <LoginModal
        isVisible={!isLoggedIn}
        onFieldChange={handleLoginInput}
        onSubmit={handleLoginSubmit}
        onClose={() => undefined}
        isLoading={isLoading}
      />
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back" />
      <View style={styles.buttonContainer}>
        <Button title="사진 업로드" onPress={pickImage} />
        <Button title="사진 찍기" onPress={takePhoto} />
        <Button title="수동 검색" onPress={() => setManualSearchVisible(true)} />
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
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  buttonSpacer: {
    width: 20,
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
  },
  manualModalContent: {
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-between",
    minHeight: 200,
  },
  manualInput: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  manualButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  loginModalContent: {
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-between",
    minHeight: 200,
  },
  loginInput: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
});
