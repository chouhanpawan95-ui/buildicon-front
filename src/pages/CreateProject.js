// src/pages/CreateProject.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

// Static data (you can replace this with API data)
const data = {
  India: {
    Karnataka: ["Bangalore", "Mysore", "Mangalore"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  },
  USA: {
    California: ["Los Angeles", "San Francisco", "San Diego"],
    Texas: ["Houston", "Dallas", "Austin"],
  },
  Australia: {
    "New South Wales": ["Sydney", "Newcastle"],
    Victoria: ["Melbourne", "Geelong"],
  },
}
const CreateProject = () => {
   const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
 const handleCountryChange = (event) => {
  const selectedCountry = event.target.value;
  setCountry(selectedCountry);
  setState("");
  setCity("");
  setProjectData((prev) => ({ ...prev, country: selectedCountry, state: "", city: "" }));
};

const handleStateChange = (event) => {
  const selectedState = event.target.value;
  setState(selectedState);
  setCity("");
  setProjectData((prev) => ({ ...prev, state: selectedState, city: "" }));
};

const handleCityChange = (event) => {
  const selectedCity = event.target.value;
  setCity(selectedCity);
  setProjectData((prev) => ({ ...prev, city: selectedCity }));
};

  const [projectData, setProjectData] = useState({
    name: '',
    Phone: '',
    budget: '',
    country: '',
    state: '',
    city: '',
    location: '',
    approxStartDate: '',
    approxCompleteDate: '',
    projectType: '',
    imageupload: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setProjectData({ ...projectData, [name]: files[0] });
    } else {
      setProjectData({ ...projectData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      Object.keys(projectData).forEach((key) => {
        formData.append(key, projectData[key]);
      });

      // Replace with your API endpoint
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/registrations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Project created successfully!');
      setProjectData({
        name: '',
        Phone: '',
        budget: '',
        country: '',
        state: '',
        city: '',
        location: '',
        approxStartDate: '',
        approxCompleteDate: '',
        projectType: '',
        imageupload: null,
      });
    } catch (err) {
      console.error(err);
      setMessage('Error creating project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" mb={3}>Create Project</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Project Name"
          name="name"
          value={projectData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Phone"
          name="Phone"
          value={projectData.Phone}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Budget"
          name="budget"        
          value={projectData.budget}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Approx Start Date"
          name="approxStartDate"  
          type='Date'      
          value={projectData.approxStartDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          fullWidth
          label="Approx Complete Date"
          name="approxCompleteDate"  
          type='Date'         
          value={projectData.approxCompleteDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
         <TextField
          fullWidth
          label="Location"
          name="location"        
          value={projectData.location}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
         <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Country</InputLabel>
        <Select value={country} onChange={handleCountryChange} label="Country">
          {Object.keys(data).map((country) => (
            <MenuItem key={country} value={country}>
              {country}
             
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* State Dropdown */}
      <FormControl sx={{ minWidth: 200 }} disabled={!country}>
        <InputLabel>State</InputLabel>
        <Select value={state} onChange={handleStateChange} label="State">
          {country &&
            Object.keys(data[country]).map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      {/* City Dropdown */}
      <FormControl sx={{ minWidth: 200 }} disabled={!state}>
        <InputLabel>City</InputLabel>
        <Select value={city} onChange={handleCityChange} label="City">
          {state &&
            data[country][state].map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
        <TextField
          fullWidth
          label="ProjectType"
          name="projectType"
          value={projectData.projectType}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          required
        />
        <Button
          variant="contained"
          component="label"
          sx={{ mt: 2 }}
        >
          Upload Image
          <input
            type="file"
            name="imageupload"
            hidden
            accept="image/*"
            onChange={handleChange}
          />
        </Button>

        {loading ? (
          <CircularProgress sx={{ mt: 2 }} />
        ) : (
          <Button type="submit" variant="contained" sx={{ mt: 2, ml: 2 }}>
            Create Project
          </Button>
        )}

        {message && (
          <Typography mt={2} color={message.includes('Error') ? 'error' : 'green'}>
            {message}
          </Typography>
        )}
      </form>
    </Box>
  );
};

export default CreateProject;
