import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Box,
  CircularProgress
} from '@mui/material';
import { useCreateEngineerVisitMutation } from '../features/api/registrationApi';
import jsPDF from 'jspdf';

const DashboardCard = ({ Project, onViewDetails }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [visitData, setVisitData] = useState({
    engineerName: 'Pawan Chouhn',
    engineerComment: '',
    visitStartTime: '',
    visitEndTime: '',
    visitDate: new Date().toISOString().split('T')[0],
    status: 'completed',
    photos: []
  });
  
  const [createEngineerVisit, { isLoading }] = useCreateEngineerVisitMutation();

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const validateForm = () => {
    // Check required fields
    if (!visitData.visitDate) {
      setError('Please select a visit date');
      return false;
    }

    if (!visitData.visitStartTime || !visitData.visitEndTime) {
      setError('Please select both start and end time');
      return false;
    }

    // Validate date and time formats
    try {
      const startTime = new Date(`${visitData.visitDate}T${visitData.visitStartTime}`);
      const endTime = new Date(`${visitData.visitDate}T${visitData.visitEndTime}`);
      
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        setError('Invalid date or time format');
        return false;
      }

      // Check if times are in the past
      const now = new Date();
      const visitDate = new Date(visitData.visitDate);
      
      if (visitDate > now) {
        setError('Visit date cannot be in the future');
        return false;
      }
      
      if (endTime <= startTime) {
        setError('End time must be after start time');
        return false;
      }
    } catch (err) {
      setError('Invalid date or time format');
      return false;
    }

    // Validate comment
    if (!visitData.engineerComment.trim()) {
      setError('Please add visit comments');
      return false;
    }

    // Validate photos if any
    if (visitData.photos.length > 0) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      for (const photo of visitData.photos) {
        if (photo.size > maxSize) {
          setError(`Photo ${photo.name} is too large. Maximum size is 5MB`);
          return false;
        }
        if (!photo.type.startsWith('image/')) {
          setError(`File ${photo.name} is not an image`);
          return false;
        }
      }
    }

    return true;
  };

  const handleVisitSubmit = async () => {
    try {
      setError('');
      
      if (!validateForm()) {
        return;
      }

      // Debug log
      console.log('Project:', Project);

      // Check if Project ID exists
      const projectId = Project?.id || Project?._id;
      if (!projectId) {
        setError('Project ID not found');
        console.error('Project ID missing:', Project);
        return;
      }

      const formData = new FormData();
      
      try {
        // Append all text data
        formData.append('projectId', projectId);
        formData.append('engineerName', visitData.engineerName);
        formData.append('engineerComment', visitData.engineerComment);

        // Format dates properly with error handling
        const startDateTime = new Date(`${visitData.visitDate}T${visitData.visitStartTime}`);
        const endDateTime = new Date(`${visitData.visitDate}T${visitData.visitEndTime}`);
        const visitDate = new Date(visitData.visitDate);

        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime()) || isNaN(visitDate.getTime())) {
          throw new Error('Invalid date or time format');
        }

        formData.append('visitStartTime', startDateTime.toISOString());
        formData.append('visitEndTime', endDateTime.toISOString());
        formData.append('visitDate', visitDate.toISOString());
        formData.append('status', visitData.status);

        // Debug log
        console.log('FormData contents:');
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        // Handle photos
        if (visitData.photos.length > 0) {
          visitData.photos.forEach((photo, index) => {
            try {
              formData.append('photos', photo, photo.name);
              console.log(`Appending photo: ${photo.name}, size: ${photo.size}`);
            } catch (photoError) {
              console.error('Error appending photo:', photoError);
              throw new Error(`Error processing photo ${photo.name}: ${photoError.message}`);
            }
          });
        }

        console.log('Submitting engineer visit...');
        const response = await createEngineerVisit(formData).unwrap();
        console.log('Engineer visit created successfully:', response);

        // Show success message
        alert('Engineer visit recorded successfully!');
        
        handleCloseDialog();
        
        // Reset form data after successful submission
        setVisitData({
          engineerName: 'Pawan Chouhn',
          engineerComment: '',
          visitStartTime: '',
          visitEndTime: '',
          visitDate: new Date().toISOString().split('T')[0],
          status: 'completed',
          photos: []
        });

      } catch (formatError) {
        console.error('Format error:', formatError);
        setError('Error formatting data: ' + formatError.message);
        return;
      }

    } catch (err) {
      console.error('Failed to create engineer visit:', err);
      
      // Log the full error object for debugging
      console.dir(err, { depth: null });

      // Handle different types of errors
      if (err.status === 413) {
        setError('Files are too large. Maximum total size is 10MB.');
      } else if (err.status === 401) {
        setError('Session expired. Please log in again.');
        // Optionally redirect to login
        // window.location.href = '/login';
      } else if (err.status === 400) {
        setError(err.data?.message || 'Invalid data provided. Please check all fields.');
      } else if (err.data?.message) {
        setError(err.data.message);
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    }
  };

  const handlePhotoChange = (e) => {
    try {
      const files = Array.from(e.target.files);
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const maxTotalSize = 10 * 1024 * 1024; // 10MB total

      if (totalSize > maxTotalSize) {
        setError('Total file size exceeds 10MB limit');
        return;
      }

      const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
          setError(`File ${file.name} is not an image`);
          return false;
        }
        return true;
      });

      if (validFiles.length !== files.length) {
        return; // Don't update if there were invalid files
      }

      setError(''); // Clear any previous errors
      setVisitData(prev => ({
        ...prev,
        photos: validFiles
      }));

      console.log('Photos selected:', validFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));
    } catch (err) {
      console.error('Error handling photo selection:', err);
      setError('Error processing selected files');
    }
  };

  const handleOpenPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(Project.name, 10, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${Project.name}`, 10, 30);
    doc.text(`Phone: ${Project.phone}`, 10, 40);
    doc.text(`Start Date: ${Project.approxStartDate?.split('T')[0]}`, 10, 50);
    doc.text(`End Date: ${Project.approxCompleteDate?.split('T')[0]}`, 10, 60);
    doc.text(`Project Type: ${Project.projectType}`, 10, 70);

    // ✅ Convert to Blob URL
    const pdfBlobUrl = doc.output('bloburl');

    // ✅ Open in same browser tab
    window.open(pdfBlobUrl, '_self');  // '_self' replaces current tab with PDF
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{Project.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          Address: {Project.address}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start: {Project.approxStartDate?.split('T')[0]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          End: {Project.approxCompleteDate?.split('T')[0]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Mob: {Project.phone}
        </Typography>

        <Button
          variant="outlined"
          size="small"
          onClick={() => onViewDetails(Project)}
          sx={{ mt: 1, mr: 1 }}
        >
          View Details
        </Button>

        <Button
          variant="contained"
          size="small"
          onClick={handleOpenPDF}
          sx={{ mt: 1, mr: 1 }}
        >
          Download PDF
        </Button>
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={handleOpenDialog}
          sx={{ mt: 1 }}
        >
          Engineer Visit
        </Button>
      </CardContent>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Record Engineer Visit</DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mt: 2, mb: 1 }}>
              {error}
            </Typography>
          )}
          <Box component="form" sx={{ mt: 2 }} noValidate>
            <TextField
              fullWidth
              label="Engineer Name"
              value={visitData.engineerName}
              onChange={(e) => setVisitData({...visitData, engineerName: e.target.value})}
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              label="Visit Date"
              type="date"
              value={visitData.visitDate}
              onChange={(e) => setVisitData({...visitData, visitDate: e.target.value})}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={visitData.visitStartTime}
                onChange={(e) => setVisitData({...visitData, visitStartTime: e.target.value})}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={visitData.visitEndTime}
                onChange={(e) => setVisitData({...visitData, visitEndTime: e.target.value})}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <TextField
              fullWidth
              label="Comments"
              multiline
              rows={4}
              value={visitData.engineerComment}
              onChange={(e) => setVisitData({...visitData, engineerComment: e.target.value})}
              margin="normal"
            />
            <Button
              variant="contained"
              component="label"
              sx={{ mt: 2 }}
            >
              Upload Photos
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </Button>
            {visitData.photos.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {visitData.photos.length} photo(s) selected
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleVisitSubmit} 
            variant="contained" 
            disabled={isLoading}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <span>Saving...</span>
              </Box>
            ) : (
              'Save Visit'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default DashboardCard;
