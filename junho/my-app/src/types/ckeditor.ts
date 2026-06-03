export interface CkFileLoader {
  file: Promise<File>;
}

export interface UploadAdapterOptions {
  loader: CkFileLoader;
  url: string;
}

export interface UploadResponse {
  urlpath: string;
}

export interface CkUploadResult {
  default: string;
}

export interface FileRepositoryPlugin {
  createUploadAdapter?: (loader: CkFileLoader) => {
    upload: () => Promise<CkUploadResult>;
    abort: () => void;
  };
}

export interface CkEditorInstance {
  getData: () => string;
  plugins: {
    get: (name: "FileRepository") => FileRepositoryPlugin;
  };
}
