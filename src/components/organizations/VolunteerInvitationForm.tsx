import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import PlacesAutocomplete from "react-places-autocomplete";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { VolunteerInvitation } from "../../models/invitation";
import { VolunteerType } from "../../models/volunteers";
import { fetchVolunteerTypes } from "../../redux/volunteerTypeSlice";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";

interface VolunteerInvitationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (invitation: Omit<VolunteerInvitation, "invitationId">) => void;
  volunteerId: number;
  defaultDate?: string; 
  defaultVolunteerType?: number;
}

const VolunteerInvitationForm: React.FC<VolunteerInvitationFormProps> = ({
  open,
  onClose,
  onSubmit,
  volunteerId,
  defaultDate = "", // ערך ברירת מחדל ריק
  defaultVolunteerType = 0, // ערך ברירת מחדל ריק
}) => {
  const [formData, setFormData] = useState({
    activityDetails: "",
    requirements: "",
    volunteerType: String(defaultVolunteerType), // ברירת מחדל לסוג התנדבות
    date: defaultDate, // ברירת מחדל לתאריך
  });
  const { volunteerTypes, status } = useSelector((state: RootState) => state.volunteerTypes);
  const orgId = useSelector((state: RootState) => state.organization.selectedOrganization?.organizationId);
  const dispatch = useDispatch<AppDispatch>();
  const [userAddress, setUserAddress] = useState("");
  const [addressValid, setAddressValid] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleAddressChange = (address: string) => {
    setUserAddress(address);
    setAddressValid(false);
    setFormError("");
  };

  const handleSelect = async (address: string) => {
    setUserAddress(address);
    try {
      const API_KEY = "AIzaSyANfIskDROp9Q9UCONXmTuWiT9RX9WbRdA";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=?${encodeURIComponent(
        address
      )}&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      // if (data.status === "OK") {
      setAddressValid(true);
      setFormError("");
      // } else {
      //   setFormError("הכתובת אינה תקפה.");
      // }
    } catch (error) {
      setFormError("שגיאה באימות הכתובת.");
    }
  };

  // const handleSelect = async (address: string) => {
  //   setUserAddress(address);
  //   try {
  //     const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
  //     const data = await response.json();
  //     setAddressValid(data.valid);
  //     setFormError(data.valid ? "" : "הכתובת אינה תקפה.");
  //   } catch (error) {
  //     setFormError("שגיאה באימות הכתובת.");
  //   }
  // };
  
  const validateForm = () => {
    // if (!userAddress || !addressValid) {
    //   setFormError("אנא ודא שהכתובת תקפה.");
    //   return false;
    // }
    if (!formData.activityDetails || !formData.date || !formData.volunteerType) {
      setFormError("אנא מלא את כל השדות הדרושים.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (open) {
      setFormData({
        activityDetails: "",
        requirements: "",
        volunteerType: String(defaultVolunteerType),
        date: defaultDate,
        
      });
    }
  }, [open, defaultDate, defaultVolunteerType]);

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newInvitation: Omit<VolunteerInvitation, "invitationId"> = {
      volunteer: { volunteerId },
      organization: { organizationId: orgId },
      invitationDate: formData.date,
      requestTime: new Date(),
      address: userAddress,
      activityDetails: formData.activityDetails,
      requirements: formData.requirements,
      volunteerType: { volunteerTypeId: Number(formData.volunteerType) },
      status: "PENDING",
      reviewInd: false,
      volunteerRequest: { requestId: 0 },
    };

    onSubmit(newInvitation);
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchVolunteerTypes());
    }
  }, [dispatch, status]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>הזמן מתנדב</DialogTitle>
      <DialogContent>
        <h2>חפש כתובת</h2>
        <PlacesAutocomplete
          value={userAddress}
          onChange={handleAddressChange}
          onSelect={handleSelect}
          searchOptions={{ componentRestrictions: { country: "il" } }}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => (
            <div>
              <input
                {...getInputProps({ placeholder: "הקלד כתובת..." })}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              {suggestions.map((suggestion) => {
                const { key, ...rest } = getSuggestionItemProps(suggestion, {
                  style: {
                    backgroundColor: suggestion.active ? "#d3d3d3" : "#fff",
                    cursor: "pointer",
                  },
                });
                return (
                  <div key={key} {...rest}>
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          )}
        </PlacesAutocomplete>

        {formError && <p style={{ color: "red" }}>{formError}</p>}
        <TextField
          fullWidth
          label="פרטי פעילות"
          name="activityDetails"
          value={formData.activityDetails}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="דרישות"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="זמן התנדבות"
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          margin="normal"
        />
        
        <TextField
          select
          fullWidth
          label="סוג התנדבות"
          name="volunteerType"
          value={formData.volunteerType}
          onChange={handleChange}
          margin="normal"
        >
          {volunteerTypes.map((type: VolunteerType) => (
            <MenuItem key={type.volunteerTypeId} value={type.volunteerTypeId}>
              {type.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>בטל</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          הזמן
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VolunteerInvitationForm;
