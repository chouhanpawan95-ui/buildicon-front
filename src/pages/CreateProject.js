// src/pages/CreateProject.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Radio, RadioGroup, FormControlLabel, FormLabel, FormHelperText } from '@mui/material';
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
  const [step, setStep] = useState(1); // Step 1 to 4 for form sections
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
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(String(phone));
  };

  const validatePincode = (pincode) => {
    const re = /^[0-9]{6}$/;
    return re.test(String(pincode));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!projectData.name) newErrors.name = 'Project Name is required';
    if (!projectData.owner) newErrors.owner = 'Owner Name is required';
    if (!projectData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(projectData.email)) newErrors.email = 'Invalid email format';
    if (!projectData.Phone) newErrors.Phone = 'Phone is required';
    else if (!validatePhone(projectData.Phone)) newErrors.Phone = 'Invalid phone number';
    if (!projectData.budget) newErrors.budget = 'Budget is required';
    if (!projectData.constCostsqft) newErrors.constCostsqft = 'Construction cost is required';
    if (!projectData.evc) newErrors.evc = 'Engineer Visit Charge is required';
    if (!projectData.approxStartDate) newErrors.approxStartDate = 'Start Date is required';
    if (!projectData.approxCompleteDate) newErrors.approxCompleteDate = 'Complete Date is required';
    if (!projectData.projectType) newErrors.projectType = 'Project Type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!projectData.country) newErrors.country = 'Country is required';
    if (!projectData.state) newErrors.state = 'State is required';
    if (!projectData.city) newErrors.city = 'City is required';
    if (!projectData.address) newErrors.address = 'Address is required';
    if (!projectData.pincode) newErrors.pincode = 'Pincode is required';
    else if (!validatePincode(projectData.pincode)) newErrors.pincode = 'Invalid pincode';
    if (!projectData.ploatArea) newErrors.ploatArea = 'Plot Area is required';
    if (!projectData.ploatdimensions) newErrors.ploatdimensions = 'Plot dimensions are required';
    if (!projectData.ploatfacing) newErrors.ploatfacing = 'Plot Facing is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!projectData.imageupload) newErrors.imageupload = 'Image upload is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
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

    // Validate all steps before submitting
    const isStep1Valid = validateStep1();
    const isStep2Valid = validateStep2();
    const isStep3Valid = validateStep3();

    if (!isStep1Valid) {
      setStep(1);
      return;
    }
    if (!isStep2Valid) {
      setStep(2);
      return;
    }
    if (!isStep3Valid) {
      setStep(3);
      return;
    }

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
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 600, mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Create Project</Typography>
      </Box>
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
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField 
              fullWidth 
              label="Owner Name" 
              name="owner" 
              value={projectData.owner} 
              onChange={handleChange} 
              margin="normal" 
              required
              error={!!errors.owner}
              helperText={errors.owner}
            />
            <TextField 
              fullWidth 
              label="Email" 
              name="email" 
              value={projectData.email} 
              onChange={handleChange} 
              margin="normal" 
              required
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField fullWidth label="Phone" name="Phone" value={projectData.Phone} onChange={handleChange} margin="normal" required error={!!errors.Phone} helperText={errors.Phone} />
            <TextField fullWidth label="Budget" name="budget" value={projectData.budget} onChange={handleChange} margin="normal" required error={!!errors.budget} helperText={errors.budget} />
            <TextField fullWidth label="Construction cost" name="constCostsqft" value={projectData.constCostsqft} onChange={handleChange} margin="normal" required error={!!errors.constCostsqft} helperText={errors.constCostsqft} />
            <TextField fullWidth label="Engineer Visit Charge" name="evc" value={projectData.evc} onChange={handleChange} margin="normal" required error={!!errors.evc} helperText={errors.evc} />
            <TextField fullWidth label="Approx Start Date" name="approxStartDate" type="date" value={projectData.approxStartDate} onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} required error={!!errors.approxStartDate} helperText={errors.approxStartDate} />
            <TextField fullWidth label="Approx Complete Date" name="approxCompleteDate" type="date" value={projectData.approxCompleteDate} onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} required error={!!errors.approxCompleteDate} helperText={errors.approxCompleteDate} />
            <FormControl sx={{ minWidth: 200, mt: 2, width: '100%' }} error={!!errors.projectType}>
              <InputLabel>Project Type</InputLabel>
              <Select name="projectType" value={projectData.projectType} onChange={handleChange} label="Project Type">
                <MenuItem value="With Material">With Material</MenuItem>
                <MenuItem value="Without Material">Without Material</MenuItem>
              </Select>
              {errors.projectType && <FormHelperText>{errors.projectType}</FormHelperText>}
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" onClick={() => {
                if (validateStep1()) {
                  setStep(2);
                }
              }}>
                Next
              </Button>
            </Box>
          </>
        )}

        {step === 2 && (
          <>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 1 }}>
              <FormControl sx={{ minWidth: 180, flex: '1 1 220px' }} error={!!errors.country}>
                <InputLabel>Country</InputLabel>
                <Select value={country} onChange={handleCountryChange} label="Country">
                  {countries.map((c) => (
                    <MenuItem key={c.isoCode} value={c.isoCode}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.country && <FormHelperText>{errors.country}</FormHelperText>}
              </FormControl>

              <FormControl sx={{ minWidth: 160, flex: '1 1 200px' }} disabled={!country} error={!!errors.state}>
                <InputLabel>State</InputLabel>
                <Select value={state} onChange={handleStateChange} label="State">
                  {states.map((s) => (
                    <MenuItem key={s.isoCode} value={s.isoCode}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.state && <FormHelperText>{errors.state}</FormHelperText>}
              </FormControl>

              <FormControl sx={{ minWidth: 160, flex: '1 1 200px' }} disabled={!state} error={!!errors.city}>
                <InputLabel>City</InputLabel>
                <Select value={city} onChange={handleCityChange} label="City">
                  {cities.map((c) => (
                    <MenuItem key={c.name} value={c.name}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.city && <FormHelperText>{errors.city}</FormHelperText>}
              </FormControl>
            </Box>
            <TextField fullWidth label="Address" name="address" value={projectData.address} onChange={handleChange} margin="normal" required multiline rows={2} error={!!errors.address} helperText={errors.address} />
            <TextField fullWidth label="Pincode" name="pincode" value={projectData.pincode} onChange={handleChange} margin="normal" required error={!!errors.pincode} helperText={errors.pincode} />
            <TextField fullWidth label="Ploat Area" name="ploatArea" value={projectData.ploatArea} onChange={handleChange} margin="normal" required error={!!errors.ploatArea} helperText={errors.ploatArea} />
            <TextField fullWidth label="Ploat dimensions" name="ploatdimensions" value={projectData.ploatdimensions} onChange={handleChange} margin="normal" required error={!!errors.ploatdimensions} helperText={errors.ploatdimensions} />
            <TextField fullWidth label="Ploat Facing" name="ploatfacing" value={projectData.ploatfacing} onChange={handleChange} margin="normal" required error={!!errors.ploatfacing} helperText={errors.ploatfacing} />
            <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
              <FormLabel component="legend">Is Started</FormLabel>
              <RadioGroup row name="isstarted" value={projectData.isstarted ? 'true' : 'false'} onChange={handleIsStartedChange}>
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="outlined" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="contained" onClick={() => {
                if (validateStep2()) {
                  setStep(3);
                }
              }}>
                Next
              </Button>
            </Box>
          </>
        )}
        {step === 3 && (
          <>
            <Button variant="contained" component="label" sx={{ width: '100%', mb: 1 }}>
              Upload Image
              <input type="file" name="imageupload" hidden accept="image/*" onChange={handleChange} />
            </Button>
            {errors.imageupload && <Typography color="error" variant="body2" sx={{ mb: 1 }}>{errors.imageupload}</Typography>}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button variant="outlined" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button 
                variant="contained" 
                type="submit"
                disabled={isLoading}
                sx={{ minWidth: 150 }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    <span>Saving...</span>
                  </Box>
                ) : (
                  'Create Project'
                )}
              </Button>
            </Box>
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
