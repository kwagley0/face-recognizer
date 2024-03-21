import { Button } from "@mui/material";
import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { useAppDispatch, useAppSelector } from "../state/hooks"; 
import {
  addImage,
  setModelsLoaded,
  toggleWebcam,
  clearImages,
} from "../state/webcamSlice"; 
import { RootState } from "../state/store";
import Gallery from "./Gallery";

const WebcamFeed = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isActive = useAppSelector((state: RootState) => state.webcam.isActive);
  const capturedImages = useAppSelector(
    (state: RootState) => state.webcam.capturedImages
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      faceapi.nets.ageGenderNet.loadFromUri("/models"),
    ]).then(() => dispatch(setModelsLoaded(true)));

    let stream: MediaStream | null = null;

    if (
      isActive &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          let video = videoRef.current;
          if (video) {
            video.srcObject = mediaStream;
            stream = mediaStream;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, [isActive, dispatch]);

  const captureImage = async () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;

    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");

        const img = await faceapi.fetchImage(dataUrl);
        const detections = await faceapi
          .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();

        const resizedDetections = faceapi.resizeResults(detections, {
          width: canvas.width,
          height: canvas.height,
        });
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        detections.forEach((detection) => {
          const age = Math.round(detection.age);
          const gender = detection.gender;
          const box = detection.detection.box;

          const emotion = Object.keys(detection.expressions).reduce((a, b) =>
            (detection.expressions as any)[a] >
            (detection.expressions as any)[b]
              ? a
              : b
          );

          const drawBox = new faceapi.draw.DrawBox(box, {
            label: `${emotion}, ${gender}, ${age} years`,
          });
          drawBox.draw(canvas);
        });
        const updatedDataUrl = canvas.toDataURL("image/png");

        dispatch(addImage(updatedDataUrl));
      }
    }
  };

  const clearCapturedImages = () => {
    dispatch(clearImages());
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
  };

  const imageStyle: React.CSSProperties = {
    display: "flex",
    maxWidth: "100%",
    height: "auto",
    margin: "10px auto",
    border: "2px solid #000",
    borderRadius: "5px",
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  };

  return (
    <div style={containerStyle}>
      {isActive && (
        <div>
          <video
            ref={videoRef}
            autoPlay={true}
            style={{ borderRadius: "15px" }}
          />
        </div>
      )}
      <div style={buttonContainerStyle}>
        <Button
          variant="contained"
          onClick={() => dispatch(toggleWebcam())}
          style={{ marginTop: "15px", marginBottom: "5px" }}
        >
          {isActive ? "Stop Webcam" : "Start Webcam"}
        </Button>
        {isActive && (
          <Button variant="contained" onClick={captureImage}>
            Capture Image
          </Button>
        )}
        {isActive && (
          <Button
            variant="contained"
            color="secondary"
            onClick={clearCapturedImages}
            style={{ margin: "5px" }}
          >
            Clear Images
          </Button>
        )}
      </div>
      <Gallery images={capturedImages} imageStyle={imageStyle} />
    </div>
  );
};

export default WebcamFeed;
