import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { FormData } from '../../types';
import { getAllSubmissions, deleteSubmission } from '../../services/indexedDB';
import { printSubmission } from '../../utils/print';
import styles from './DataList.module.css';

const DataList = () => {
  const [submissions, setSubmissions] = useState<FormData[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const navigate = useNavigate();

  const loadSubmissions = async () => {
    try {
      const data = await getAllSubmissions();
      setSubmissions(data);
    } catch {
      setSnackbar({ open: true, message: 'Failed to load submissions.', severity: 'error' });
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleView = (id: string) => {
    navigate(`/view/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handlePrint = (submission: FormData) => {
    printSubmission(submission);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.id) return;

    try {
      await deleteSubmission(deleteDialog.id);
      setSubmissions(prev => prev.filter(sub => sub.id !== deleteDialog.id));
      setSnackbar({ open: true, message: 'Form deleted successfully.', severity: 'success' });
    } catch (error) {
      console.log(error)
      setSnackbar({ open: true, message: 'Failed to delete submission.', severity: 'error' });
    }
    setDeleteDialog({ open: false, id: null });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, id: null });
  };

  return (
    <Box className={styles.dataList}>
      <Paper elevation={3} className={styles.container}>
        <Box className={styles.header}>
          <Typography variant="h4" component="h1" gutterBottom>
            Form Submissions
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Create New Form
          </Button>
        </Box>

        {submissions.length === 0 ? (
          <Box className={styles.emptyState}>
            <Typography variant="h6" color="text.secondary">
              No submissions found.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first form submission.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id} hover>
                    <TableCell>{submission.id}</TableCell>
                    <TableCell>{submission.personalInfo.firstName}</TableCell>
                    <TableCell>{submission.personalInfo.lastName}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View">
                        <IconButton
                          color="primary"
                          onClick={() => handleView(submission.id!)}
                          size="small"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          color="secondary"
                          onClick={() => handleEdit(submission.id!)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Print">
                        <IconButton
                          color="default"
                          onClick={() => handlePrint(submission)}
                          size="small"
                        >
                          <PrintIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(submission.id!)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this form submission? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DataList;
