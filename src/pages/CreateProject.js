// src/pages/CreateProject.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useCreateProjectMutation } from '../features/api/registrationApi';
import { Country, State, City } from 'country-state-city';
const CreateProject = () => {
  const [country, setCountry] = useState(""); // country ISO code
  const [state, setState] = useState(""); // state ISO code
  const [city, setCity] = useState(""); // city name
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [step, setStep] = useState(1); // 1 = first half, 2 = second half
// Load countries on mount
useEffect(() => {
  try {
    const list = Country.getAllCountries();
    setCountries(list || []);
  } catch (err) {
    console.error('Failed to load countries', err);
    setCountries([]);
  }
}, []);

const handleCountryChange = (event) => {
  const countryCode = event.target.value;
  setCountry(countryCode);
  setState("");
  setCity("");
  const countryObj = Country.getCountryByCode(countryCode);
  setProjectData((prev) => ({ ...prev, country: countryObj?.name || '' , state: '', city: '' }));
  // load states for selected country
  const st = State.getStatesOfCountry(countryCode) || [];
  setStates(st);
  setCities([]);
};

const handleStateChange = (event) => {
  const stateCode = event.target.value;
  setState(stateCode);
  setCity("");
  const stateObj = states.find((s) => s.isoCode === stateCode);
  setProjectData((prev) => ({ ...prev, state: stateObj?.name || '', city: '' }));
  // load cities for selected state
  const ct = City.getCitiesOfState(country, stateCode) || [];
  setCities(ct);
};

const handleCityChange = (event) => {
  const cityName = event.target.value;
  setCity(cityName);
  setProjectData((prev) => ({ ...prev, city: cityName }));
};

// handle boolean radio (value comes as string 'true'|'false')
const handleIsStartedChange = (e) => {
  const val = e.target.value === 'true';
  setProjectData((prev) => ({ ...prev, isstarted: val }));
};

  const [projectData, setProjectData] = useState({
    name: '',
    owner: '',
    email: '',
    Phone: '',
    budget: '',
    country: '',
    state: '',
    city: '',
    ploatArea: '',
    ploatdimensions: '',
    ploatfacing: '',
    constCostsqft: '',
    address: '',
    pincode: '',
    evc: '',
    isstarted: false,
    approxStartDate: '',
    approxCompleteDate: '',
    projectType: '',
    imageupload: null,
  });
  const [message, setMessage] = useState('');
  const [createProject, { isLoading }] = useCreateProjectMutation();

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
    setMessage('');

    try {
      const formData = new FormData();
      Object.keys(projectData).forEach((key) => {
        formData.append(key, projectData[key]);
      });

      await createProject(formData).unwrap();
      
      setMessage('Project created successfully!');
      setProjectData({
        name: '',
        owner: '',
        email: '',
        Phone: '',
        budget: '',
        country: '',
        state: '',
        city: '',
        ploatArea: '',
        ploatdimensions: '',
        ploatfacing: '',
        constCostsqft: '',
        address: '',
        isstarted: false,
        evc: '',
        pincode: '',
        approxStartDate: '',
        approxCompleteDate: '',
        projectType: '',
        imageupload: null,
      });
    } catch (err) {
      console.error(err);
      setMessage('Error creating project');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 700, mt: 3, px: 2, position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
      <Typography variant="h4" mb={3} sx={{ textAlign: 'center', width: '100%' }}>Create Project</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 600 }}>
        {step === 1 && (
          <>
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
              label="Owner Name"
              name="owner"
              value={projectData.owner}
              onChange={handleChange}
              margin="normal"
              required
            />
             <TextField
              fullWidth
              label="Email"
              name="email"
              value={projectData.email}
              onChange={handleChange}
              margin="normal"
              required
            />          
            <TextField
              fullWidth
              label="Approx Start Date"
              name="approxStartDate"
              type="date"
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
              type="date"
              value={projectData.approxCompleteDate}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" onClick={() => setStep(2)}>
                Next
              </Button>
            </Box>
          </>
        )}

        {step === 2 && (
          <>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 1 }}>
              <FormControl sx={{ minWidth: 180, flex: '1 1 220px' }}>
                <InputLabel>Country</InputLabel>
                <Select value={country} onChange={handleCountryChange} label="Country">
                  {countries.map((c) => (
                    <MenuItem key={c.isoCode} value={c.isoCode}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 160, flex: '1 1 200px' }} disabled={!country}>
                <InputLabel>State</InputLabel>
                <Select value={state} onChange={handleStateChange} label="State">
                  {states.map((s) => (
                    <MenuItem key={s.isoCode} value={s.isoCode}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 160, flex: '1 1 200px' }} disabled={!state}>
                <InputLabel>City</InputLabel>
                <Select value={city} onChange={handleCityChange} label="City">
                  {cities.map((c) => (
                    <MenuItem key={c.name} value={c.name}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={projectData.address}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Pincode"
              name="pincode"
              value={projectData.pincode}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Ploat Area"
              name="ploatArea"
              value={projectData.ploatArea}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
             <TextField
              fullWidth
              label="Ploat dimensions"
              name="ploatdimensions"
              value={projectData.ploatdimensions}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Ploat Facing"
              name="ploatfacing"
              value={projectData.ploatfacing}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
             <TextField
              fullWidth
              label="Construction cost"
              name="constCostsqft"
              value={projectData.constCostsqft}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
             <TextField
              fullWidth
              label="Engineer Visit Charge"
              name="evc"
              value={projectData.evc}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <FormControl sx={{ minWidth: 200, mt: 2 }}>
              <InputLabel>Project Type</InputLabel>
              <Select name="projectType" value={projectData.projectType} onChange={handleChange} label="Project Type">
                <MenuItem value="With Material">With Material</MenuItem>
                <MenuItem value="Without Material">Without Material</MenuItem>
              </Select>
            </FormControl>

            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Is Started</FormLabel>
              <RadioGroup row name="isstarted" value={projectData.isstarted ? 'true' : 'false'} onChange={handleIsStartedChange}>
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
            <Button variant="contained" component="label" sx={{ mt: 2 }}>
              Upload Image
              <input type="file" name="imageupload" hidden accept="image/*" onChange={handleChange} />
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="outlined" onClick={() => setStep(1)}>
                Back
              </Button>
            </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" onClick={() => setStep(2)}>
                Next
              </Button>
            </Box>
          </>
        )}
         {step === 3 && (
          <>           
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
          </>
        )}

        {message && (
          <Typography mt={2} color={message.includes('Error') ? 'error' : 'green'}>
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CreateProject;
