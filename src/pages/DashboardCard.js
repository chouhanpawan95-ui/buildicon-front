import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import jsPDF from 'jspdf';

const DashboardCard = ({ Project, onViewDetails }) => {
  
  const handleDownloadPDF = () => {
    const doc = new jsPDF();    
    doc.setFontSize(18);
    doc.text(Project.name, 10, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${Project.name}`, 10, 30);
    doc.text(`Phone: ${Project.phone}`, 10, 40);
    doc.text(`Start Date: ${Project.approxStartDate?.split('T')[0]}`, 10, 50);
    doc.text(`End Date: ${Project.approxCompleteDate?.split('T')[0]}`, 10, 60);
    doc.text(`Project Type: ${Project.projectType}`, 10, 70);
    doc.save(`${Project.name.replace(/\s+/g, '_')}.pdf`);
    
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
        <Typography  variant="body2" color="text.secondary">
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
          onClick={handleDownloadPDF}
          sx={{ mt: 1 }}
        >
          Download PDF
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
