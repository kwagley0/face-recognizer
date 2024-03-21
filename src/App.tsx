import React, { useEffect } from "react";
import Homepage from './components/Homepage';

function App() {
  useEffect(() => {
    document.title = "Face Recognizer"; 
  }, []);

  return (
    <div>
      <Homepage/>
    </div>
  );
}

export default App;
