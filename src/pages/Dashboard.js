// src/pages/Dashboard.js
import React, { useState } from 'react';
import { Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, CircularProgress } from '@mui/material';
import Sidebar from './Sidebar';
import DashboardCard from './DashboardCard';
import { useGetRegistrationsQuery } from '../features/api/registrationApi';

const Dashboard = () => {  
  const { data: Project, error, isLoading, isFetching } = useGetRegistrationsQuery();
  const [selectedProject, setselectedProject] = useState(null);
  console.log('Products data:', Project, 'Loading:', isLoading, 'Error:', error);
  if (isLoading || isFetching) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading products</Typography>;

  const handleViewDetails = (Project) => setselectedProject(Project);
  const handleClose = () => setselectedProject(null);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" mb={3}>Live Project</Typography>
        <Grid container spacing={3}>
          {Project?.map((Project) => (
            <Grid item xs={12} sm={6} md={3} key={Project.id}>
              <DashboardCard Project={Project} onViewDetails={handleViewDetails} />
            </Grid>
          ))}
        </Grid>

        {/* Product Details Dialog */}
        <Dialog open={!!selectedProject} onClose={handleClose}>
          <DialogTitle>Project Details</DialogTitle>
          <DialogContent>
            {selectedProject && (
              <>
                <Typography variant="h6">{selectedProject.name}</Typography>
                 <Typography variant="body2" color="text.secondary">
                  City: {selectedProject.city}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PloatArea: {selectedProject.ploatArea}
                </Typography>
                   <Typography variant="body2" color="text.secondary">
                  Project Type: {selectedProject.projectType}
                </Typography>
                  <Typography variant="body2" color="text.secondary">
                  Project Type: {selectedProject.ploatfacing}
                </Typography>
                 <Typography variant="body2" color="text.secondary">
                  Project Type: {selectedProject.evc}
                </Typography>                
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained">Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Dashboard;
