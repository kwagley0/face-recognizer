import React from "react";
import { Modal } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { openModal, closeModal } from "../state/webcamSlice";

interface GalleryProps {
  images: string[];
  imageStyle: React.CSSProperties;
}

const Gallery: React.FC<GalleryProps> = ({ images, imageStyle }) => {
  const dispatch = useAppDispatch();
  const modalOpen = useAppSelector((state) => state.webcam.modalOpen);
  const selectedImage = useAppSelector((state) => state.webcam.selectedImage);

  const handleOpen = (image: string) => {
    dispatch(openModal(image));
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  const galleryStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "10px",
    backgroundColor: images.length > 0 ? "#f0f0f0" : "transparent", 
    padding: "10px", 
    borderRadius: "5px", 
    marginTop: "10px",
  };

  const modalStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    border: "2px solid #000",
    boxShadow: "10px 10px 5px 0px rgba(0,0,0,0.75)",
    padding: "20px",
  };

  const pointerImageStyle: React.CSSProperties = {
    ...imageStyle,
    cursor: "pointer",
  };

  const modalImageStyle: React.CSSProperties = {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "15px",
  };

  return (
    <>
      <div style={galleryStyle}>
        {images.map((image: string, index: number) => (
          <img
            key={index}
            src={image}
            alt={`Captured ${index}`}
            style={pointerImageStyle}
            onClick={() => handleOpen(image)}
          />
        ))}
      </div>
      <Modal open={modalOpen} onClose={handleClose}>
        <div style={modalStyle}>
          <img src={selectedImage} alt="Selected" style={modalImageStyle} />
        </div>
      </Modal>
    </>
  );
};

export default Gallery;
