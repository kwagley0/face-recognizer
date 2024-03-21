import React from "react";
import { Tabs, Tab, Card, CardContent, Typography } from "@mui/material";
import WebcamFeed from "./WebcamFeed";
import ImageUpload from "./ImageUpload";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { setCurrentTab } from "../state/webcamSlice";

const Homepage = () => {
  const dispatch = useAppDispatch();
  const currentTab = useAppSelector((state) => state.webcam.currentTab);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(setCurrentTab(newValue));
  };

  const homepageStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
  };

  return (
    <div style={homepageStyle}>
      <style>
        {`
          body {
            background-color: #f5f5f5;
          }
          .MuiTabs-indicator {
            transition: all 0s !important;
          }
        `}
      </style>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        style={{ color: "#3f51b5", fontWeight: "bold" }}
      >
        Face Recognizer
      </Typography>
      <Tabs value={currentTab} onChange={handleTabChange}>
        <Tab label="Webcam Feed" />
        <Tab label="Upload Image" />
      </Tabs>
      <Card
        style={{
          width: "100%",
          marginTop: "20px",
          border: "1px solid #3f51b5",
        }}
      >
        <CardContent>
          {currentTab === 0 && <WebcamFeed />}
          {currentTab === 1 && <ImageUpload />}
        </CardContent>
      </Card>
    </div>
  );
};

export default Homepage;
