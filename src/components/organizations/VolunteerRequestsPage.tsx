import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchVolunteers } from "../../redux/volunteerSlice";
import { RootState } from "../../store/store";
import VolunteerRequestCard from "./VolunteerRequestCard";
import { AppDispatch } from "../../store/store";
import { Volunteer } from "../../models/volunteers";
import { fetchVolunteerTypes } from "../../redux/volunteerTypeSlice";
import { TextField, Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Paper } from "@mui/material";

const VolunteerRequestsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { volunteers, status: volunteersStatus } = useSelector((state: RootState) => state.volunteers);
  const { volunteerTypes, status: volunteerTypesStatus } = useSelector((state: RootState) => state.volunteerTypes);
  const [city, setCity] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([]);
  const [filters, setFilters] = useState({
    minAmount: 0,
    maxAmount: Infinity,
    minAge: 0,
    maxAge: Infinity,
    experience: false,
    city: "",
    gender: "",
    time: "",
    volunteerTypeId: null as number | null,
    dayOfWeek: ""
  });

  useEffect(() => {
    if (volunteerTypesStatus === 'idle') {
      dispatch(fetchVolunteers());
    }
  }, [dispatch, volunteersStatus]);

  useEffect(() => {
    if (volunteerTypesStatus === 'idle') {
      dispatch(fetchVolunteerTypes());
    }
  }, [dispatch, volunteerTypesStatus]);

  const calculateAge = (birth: string): number => {
    const birthDate = new Date(birth);
    const diffMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  useEffect(() => {
    if (Array.isArray(volunteers)) {
      const filtered = volunteers
        .map((volunteer) => {
          const filteredRequests = volunteer.volunteerRequests.filter((request) => {
            const requestDate = new Date(request.availableDate);
            const requestDay = getDayOfWeek(requestDate);

            const matchesDayOfWeek =
              filters.dayOfWeek === "" || filters.dayOfWeek === requestDay;

            const hasVolunteerType =
              filters.volunteerTypeId === null ||
              request.volunteerTypes?.some((type) => type.volunteerTypeId === filters.volunteerTypeId);

            const hasThisTime =
              filters.time === "" ||
              request.availableTime === filters.time ||
              request.availableTime === "ALL";

            const invitationCheck = request.invitationInd === false;

            const invitationCheckDate = new Date(request.availableDate) >= new Date();

            return matchesDayOfWeek && hasVolunteerType && hasThisTime && invitationCheck && invitationCheckDate;
          });

          return {
            ...volunteer,
            volunteerRequests: filteredRequests,
          };
        })
        .filter((volunteer) => volunteer.volunteerRequests.length > 0)
        .filter((volunteer) => {
          const age = calculateAge(volunteer.birth);

          return (
            volunteer.amountVolunteers >= filters.minAmount &&
            volunteer.amountVolunteers <= filters.maxAmount &&
            age >= filters.minAge &&
            age <= filters.maxAge &&
            (filters.experience ? volunteer.experience : true) &&
            (filters.city ? (volunteer.city?.toLowerCase() || "").includes(filters.city.toLowerCase()) : true) &&
            (filters.gender ? volunteer.gender === filters.gender : true)
          );
        });

      setFilteredVolunteers(filtered);
    }
  }, [volunteers, filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getDayOfWeek = (date: Date): string => {
    const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    return days[date.getDay()];
  };

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        await loadScript('https://maps.googleapis.com/maps/api/js?key=?&libraries=places');
        if (inputRef.current && window.google) {
          autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ['(cities)'],
            componentRestrictions: { country: 'IL' }
          });
          autocompleteRef.current?.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace();
            if (place?.address_components) {
              const cityComponent = place.address_components.find((component) =>
                component.types.includes('locality')
              );
              if (cityComponent) {
                const selectedCity = cityComponent.long_name;
                setCity(selectedCity);
                console.log(`City selected: ${selectedCity}`);
              }
            }
          });
        }
      } catch (err) {
        console.error('Google Maps API loading error', err);
      }
    };

    loadGoogleMaps();
  }, []);
  
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);
    handleFilterChange("city", value);

  };
  
  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        בקשות
      </Typography>

      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="כמות מתנדבים מינימלית"
              type="number"
              fullWidth
              value={filters.minAmount}
              onChange={(e) => handleFilterChange("minAmount", Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="כמות מתנדבים מקסימלית"
              type="number"
              fullWidth
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange("maxAmount", Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="גיל מינימלי"
              type="number"
              fullWidth
              value={filters.minAge}
              onChange={(e) => handleFilterChange("minAge", Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="גיל מקסימלי"
              type="number"
              fullWidth
              value={filters.maxAge}
              onChange={(e) => handleFilterChange("maxAge", Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.experience}
                  onChange={(e) => handleFilterChange("experience", e.target.checked)}
                />
              }
              label="ניסיון"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              inputRef={inputRef}
              fullWidth
              label="עיר"
              placeholder="Start typing city..."
              value={city}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>מגדר</InputLabel>
              <Select
                value={filters.gender}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
              >
                <MenuItem value="">כולם</MenuItem>
                <MenuItem value="Male">זכר</MenuItem>
                <MenuItem value="Female">נקבה</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>סוג התנדבות</InputLabel>
              <Select
                value={filters.volunteerTypeId || ""}
                onChange={(e) => handleFilterChange("volunteerTypeId", e.target.value ? Number(e.target.value) : null)}
              >
                <MenuItem value="">בחר סוג</MenuItem>
                {volunteerTypes.map((type) => (
                  <MenuItem key={type.volunteerTypeId} value={type.volunteerTypeId}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>זמן התנדבות</InputLabel>
              <Select
                value={filters.time || ""}
                onChange={(e) => handleFilterChange("time", e.target.value)}
              >
                <MenuItem value="">בחר זמן</MenuItem>
                <MenuItem value="MORNING">בוקר</MenuItem>
                <MenuItem value="AFTERNOON">צהריים</MenuItem>
                <MenuItem value="EVENING">ערב</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>יום בשבוע</InputLabel>
              <Select
                value={filters.dayOfWeek}
                onChange={(e) => handleFilterChange("dayOfWeek", e.target.value)}
              >
                <MenuItem value="">בחר יום</MenuItem>
                <MenuItem value="ראשון">ראשון</MenuItem>
                <MenuItem value="שני">שני</MenuItem>
                <MenuItem value="שלישי">שלישי</MenuItem>
                <MenuItem value="רביעי">רביעי</MenuItem>
                <MenuItem value="חמישי">חמישי</MenuItem>
                <MenuItem value="שישי">שישי</MenuItem>
                <MenuItem value="שבת">שבת</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        {Array.isArray(filteredVolunteers) && filteredVolunteers.map((volunteer) => (
          <Grid item xs={12} sm={6} md={4} key={volunteer.volunteerId}>
            {Array.isArray(volunteer.volunteerRequests) && volunteer.volunteerRequests.map((request) => (
              <Link
                to={`/organization/request/${request.requestId}`}
                key={request.requestId}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <VolunteerRequestCard volunteer={volunteer} request={request} />
              </Link>
            ))}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VolunteerRequestsPage;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
}