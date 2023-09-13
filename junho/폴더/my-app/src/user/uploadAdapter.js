import Swal from "sweetalert2";

class UploadAdapter {
  constructor({ loader, url }) {
    this.loader = loader;
    this.url = url;
    this.controller = new AbortController();
  }

  async upload() {
    try {
      const file = await this.loader.file;
      const data = new FormData();
      data.append("file", file);  // 'file'이라는 키 이름을 사용

      const response = await fetch(this.url, {
        method: "POST",
        body: data,  // FormData를 그대로 전송
        signal: this.controller.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const responseData = await response.json();

      return { default: responseData.urlpath };
    } catch (error) {
      console.error("UploadAdapter upload failed", error);
      Swal.fire("Error", "이미지 업로드에 실패했습니다!", "error");
      return;
    }
  }

  abort() {
    if (this.controller) {
      this.controller.abort();
    }
  }
}

export default UploadAdapter;