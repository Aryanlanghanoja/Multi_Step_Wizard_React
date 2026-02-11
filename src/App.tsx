import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Wizard from "./components/Wizard/Wizard";
import DataList from "./components/DataList/DataList";
import ViewSubmission from "./components/ViewSubmission/ViewSubmission";
import EditSubmission from "./components/EditSubmission/EditSubmission";
import Layout from "./components/Layout/Layout";
import "./App.module.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<DataList />} />
            <Route path="/form" element={<Wizard />} />
            <Route path="/view/:id" element={<ViewSubmission />} />
            <Route path="/edit/:id" element={<EditSubmission />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
