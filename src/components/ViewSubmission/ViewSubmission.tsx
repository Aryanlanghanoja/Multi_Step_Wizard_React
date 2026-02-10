import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Print as PrintIcon,
  ArrowBack as ArrowBackIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import type { FormData } from '../../types';
import { getSubmissionById } from '../../services/indexedDB';
import { printSubmission } from '../../utils/print';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import styles from './ViewSubmission.module.css';

dayjs.extend(customParseFormat);

const parseDateString = (dateString: string): dayjs.Dayjs | null => {
  if (!dateString) return null;
  if (dayjs(dateString).isValid() && dateString.includes('T')) {
    return dayjs(dateString);
  }

  if (dayjs(dateString, 'DD/MM/YYYY', true).isValid()) {
    return dayjs(dateString, 'DD/MM/YYYY');
  }

  if (dayjs(dateString, 'YYYY-MM-DD', true).isValid()) {
    return dayjs(dateString, 'YYYY-MM-DD');
  }

  return dayjs(dateString);
};

const ViewSubmission = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubmission = async () => {
      if (!id) {
        setError('No submission ID provided');
        setLoading(false);
        return;
      }

      try {
        const data = await getSubmissionById(id);
        if (data) {
          setSubmission(data);
        } else {
          setError('Submission not found');
        }
      } catch {
        setError('Failed to load submission');
      } finally {
        setLoading(false);
      }
    };

    loadSubmission();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handlePrint = () => {
    if (submission) {
      printSubmission(submission);
    }
  };

  const handleBack = () => {
    navigate('/data');
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const parsed = parseDateString(dateString);
    if (!parsed) return 'Invalid Date';
    return parsed.format('DD/MM/YYYY');
  };

  if (loading) {
    return (
      <Box className={styles.viewSubmission}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error || !submission) {
    return (
      <Box className={styles.viewSubmission}>
        <Paper className={styles.container}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Submission not found'}
          </Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back to List
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className={styles.viewSubmission}>
      <Paper elevation={3} className={styles.container}>
        {/* Header */}
        <Box className={styles.header}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Form Submission Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {submission.id} | Created: {formatDate(submission.createdAt || '')}
            </Typography>
          </Box>
          <Box className={styles.actions}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Print
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box className={styles.section}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <PersonIcon color="primary" />
            <Typography variant="h6" color="primary">
              Personal Information
            </Typography>
          </Box>
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    First Name
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {submission.personalInfo.firstName}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Middle Name
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {submission.personalInfo.middleName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Last Name
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {submission.personalInfo.lastName}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Phone Number
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {submission.personalInfo.countryCode} {submission.personalInfo.phoneNumber}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Email Address
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {submission.personalInfo.email}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Date of Birth
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatDate(submission.personalInfo.dateOfBirth)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        <Box className={styles.section}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <SchoolIcon color="primary" />
            <Typography variant="h6" color="primary">
              Education Details
            </Typography>
          </Box>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                10th Standard
              </Typography>
              <Grid container spacing={3} mb={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Pass Year
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {submission.educationInfo.tenth.passYear}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Board
                  </Typography>
                  <Chip 
                    label={submission.educationInfo.tenth.board} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {submission.educationInfo.educationType === '12th' ? (
                <>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    12th Standard
                  </Typography>
                  <Grid container spacing={3} mb={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Pass Year
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {submission.educationInfo.twelfth.passYear}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Board
                      </Typography>
                      <Chip 
                        label={submission.educationInfo.twelfth.board} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Diploma
                  </Typography>
                  <Grid container spacing={3} mb={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Passing Year
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {submission.educationInfo.diploma.passYear}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Organization
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {submission.educationInfo.diploma.organization}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Major
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {submission.educationInfo.diploma.major}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Graduation
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Completion Year
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {submission.educationInfo.graduation.completionYear}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Organization/University
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {submission.educationInfo.graduation.organization}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Degree
                  </Typography>
                  <Chip 
                    label={submission.educationInfo.graduation.degree} 
                    size="small" 
                    color="secondary" 
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Major/Specialization
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {submission.educationInfo.graduation.major}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        <Box className={styles.section}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <WorkIcon color="primary" />
            <Typography variant="h6" color="primary">
              Work Experience
            </Typography>
          </Box>
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={3} mb={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Total Experience
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {submission.workExperience.totalExperience} Years
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Current CTC
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {submission.workExperience.currentCTC} LPA
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Expected CTC
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {submission.workExperience.expectedCTC} LPA
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Available From
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatDate(submission.workExperience.availableFrom)}
                  </Typography>
                </Grid>
              </Grid>

              {submission.workExperience.jobs.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Job/Internship Details
                  </Typography>
                  {submission.workExperience.jobs.map((job, index) => (
                    <Card key={job.id} variant="outlined" className={styles.jobCard}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="subtitle1" fontWeight={600} color="primary">
                            Job #{index + 1}
                          </Typography>
                          <Chip
                            label={job.type}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        </Box>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Designation
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {job.designation}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Duration
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {formatDate(job.startDate)} - {formatDate(job.endDate)}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Description
                            </Typography>
                            <Typography variant="body1">
                              {job.description}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}

              {submission.workExperience.skills.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Skills
                  </Typography>
                  <ul style={{ paddingLeft: '20px' }}>
                    {submission.workExperience.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box className={styles.actions} sx={{ mt: 4, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back to List
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit Submission
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print / Save PDF
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewSubmission;
