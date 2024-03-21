import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WebcamState {
  isActive: boolean;
  capturedImages: string[];
  modelsLoaded: boolean;
  modalOpen: boolean;
  selectedImage: string; 
  currentTab: number;
}

const initialState: WebcamState = {
  isActive: false,
  capturedImages: [],
  modelsLoaded: false,
  modalOpen: false, 
  selectedImage: "", 
  currentTab: 0,
};

export const webcamSlice = createSlice({
  name: "webcam",
  initialState,
  reducers: {
    toggleWebcam: (state: WebcamState) => {
      state.isActive = !state.isActive;
    },
    addImage: (state: WebcamState, action: PayloadAction<string>) => {
      state.capturedImages.push(action.payload);
    },
    setCapturedImages: (
      state: WebcamState,
      action: PayloadAction<string[]>
    ) => {
      state.capturedImages = action.payload;
    },
    clearImages: (state: WebcamState) => {
      state.capturedImages = [];
    },
    setModelsLoaded: (state: WebcamState, action: PayloadAction<boolean>) => {
      state.modelsLoaded = action.payload;
    },
    openModal: (state: WebcamState, action: PayloadAction<string>) => {
      // Add this reducer
      state.modalOpen = true;
      state.selectedImage = action.payload;
    },
    closeModal: (state: WebcamState) => {
      // Add this reducer
      state.modalOpen = false;
      state.selectedImage = "";
    },
    setCurrentTab: (state: WebcamState, action: PayloadAction<number>) => {
      state.currentTab = action.payload;
    },
  },
});

export const {
  toggleWebcam,
  addImage,
  setCapturedImages,
  clearImages,
  setModelsLoaded,
  openModal,
  closeModal,
  setCurrentTab,
} = webcamSlice.actions;

export default webcamSlice.reducer;
