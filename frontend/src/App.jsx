import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Landing from "./Landing";
// import Output from "./Output";

const Landing = React.lazy(() => import("./Landing"));
const Output = React.lazy(() => import("./Output"));
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing page (default route) */}
        <Route path="/" element={<Landing />} />
        
        {/* Output page */}
        <Route path="/output" element={<Output />} />
      </Routes>
    </Router>
  );
};

export default App;