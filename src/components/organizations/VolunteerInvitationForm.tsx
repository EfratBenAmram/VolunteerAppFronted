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
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { VolunteerInvitation } from "../../models/invitation";
import { VolunteerType } from "../../models/volunteers";
import { fetchVolunteerTypes } from "../../redux/volunteerTypeSlice";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

interface VolunteerInvitationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (invitation: Omit<VolunteerInvitation, "invitationId">) => void;
  volunteerId: number;
}

const GOOGLE_API_KEY = "AIzaSyDm0YRkpIrMI0bHOmw76qF-YyjqtjhPLeA";
const libraries = ["places"];

const VolunteerInvitationForm: React.FC<VolunteerInvitationFormProps> = ({
  open,
  onClose,
  onSubmit,
  volunteerId,
}) => {
  const { volunteerTypes, status } = useSelector(
    (state: RootState) => state.volunteerTypes
  );
  const orgId = useSelector(
    (state: RootState) => state.organization.selectedOrganization?.organizationId
  );
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    volunteer: "",
    address: "",
    activityDetails: "",
    requirements: "",
    volunteerType: "",
    date: "",
  });
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      console.log(place);
      setFormData({
        ...formData,
        address: place.formatted_address || "",
      });
    }
  };
  
  const handleSubmit = () => {
    const newInvitation: Omit<VolunteerInvitation, "invitationId"> = {
      invitationId: 0,
      volunteer: { volunteerId: volunteerId },
      organization: { organizationId: orgId },
      invitationDate: formData.date,
      requestTime: new Date(),
      address: formData.address,
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
    <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={libraries}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>הזמן מתנדב</DialogTitle>
        <DialogContent>
          <Autocomplete
            onLoad={(autocompleteInstance) => setAutocomplete(autocompleteInstance)}
            onPlaceChanged={handlePlaceChanged}
          >
            <TextField
              fullWidth
              label="כתובת"
              name="address"
              value={formData.address}
              onChange={handleChange}
              margin="normal"
            />
          </Autocomplete>
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
            placeholder="התנדבות"
            name="date"
            value={formData.date}
            onChange={handleChange}
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
    </LoadScript>
  );
};

export default VolunteerInvitationForm;
