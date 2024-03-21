import React, { useEffect, useRef } from "react";
import { Button } from "@mui/material";
import * as faceapi from "face-api.js";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { addImage, clearImages } from "../state/webcamSlice";
import Gallery from "./Gallery";

const ImageUpload = () => {
  const dispatch = useAppDispatch();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const uploadedImages = useAppSelector((state) => state.webcam.capturedImages); // Select the uploaded images from the state

  useEffect(() => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      faceapi.nets.ageGenderNet.loadFromUri("/models"),
    ]);
  }, [dispatch]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const image = await faceapi.bufferToImage(file);
      imageRef.current = image;

      const detections = await faceapi
        .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

      const canvas = faceapi.createCanvasFromMedia(image);
      faceapi.draw.drawDetections(canvas, detections);
      faceapi.draw.drawFaceLandmarks(canvas, detections);

      detections.forEach((detection) => {
        const age = Math.round(detection.age);
        const gender = detection.gender;
        const box = detection.detection.box;

        const emotion = Object.keys(detection.expressions).reduce((a, b) =>
          (detection.expressions as any)[a] > (detection.expressions as any)[b]
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
  };

  const imageStyle: React.CSSProperties = {
    display: "flex",
    maxWidth: "100%",
    height: "auto",
    margin: "10px auto",
    border: "2px solid #000",
    borderRadius: "5px",
  };

  const handleClick = () => {
    inputRef.current?.click(); 
  };

  const clearUploadedImages = () => {
    dispatch(clearImages());
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "15px",
      }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={inputRef}
        style={{ display: "none" }}
      />
      <Button variant="contained" color="primary" onClick={handleClick}>
        Upload Image
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={clearUploadedImages}
        style={{ marginTop: "15px", marginBottom: "5px" }}
      >
        Clear Images
      </Button>
      <img ref={imageRef} alt="" style={{ display: "none" }} />
      <Gallery images={uploadedImages} imageStyle={imageStyle} />
    </div>
  );
};

export default ImageUpload;
