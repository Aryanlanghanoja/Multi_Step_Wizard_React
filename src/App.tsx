import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Wizard from './components/Wizard';
import DataList from './components/DataList';
import ViewSubmission from './components/ViewSubmission';
import EditSubmission from './components/EditSubmission';
import './App.module.css';

const theme = createTheme({
  palette: {
    primary: {
       main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
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
        <Routes>
          <Route path="/" element={<Wizard />} />
          <Route path="/data" element={<DataList />} />
          <Route path="/view/:id" element={<ViewSubmission />} />
          <Route path="/edit/:id" element={<EditSubmission />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
