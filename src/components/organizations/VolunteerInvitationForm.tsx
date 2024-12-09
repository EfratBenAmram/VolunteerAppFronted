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
import { fetchVolunteerTypes } from "../../features/volunteerTypeSlice";
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';

interface VolunteerInvitationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (invitation: Omit<VolunteerInvitation, "invitationId">) => void;
  volunteerId: number;
}

const VolunteerInvitationForm: React.FC<VolunteerInvitationFormProps> = ({ open, onClose, onSubmit, volunteerId }) => {
  const volunteerTypes = useSelector((state: RootState) => state.volunteerTypes.volunteerTypes);
  const orgId = useSelector((state: RootState) => state.organization.selectedOrganization?.organizationId);
  const dispatch = useDispatch<AppDispatch>();
  const [minDate, setMinDate] = useState<string>('');
  const [maxDate, setMaxDate] = useState<string>('');
  useEffect(() => {
    const today = new Date();
    const weekLater = new Date(today);

    weekLater.setDate(today.getDate() + 7);

    const formatDate = (date: Date): string =>
      date.toISOString().split('T')[0];

    setMinDate(formatDate(today));
    setMaxDate(formatDate(weekLater));
  }, []);

  const [formData, setFormData] = useState({
    volunteer: "",
    address: "",
    activityDetails: "",
    requirements: "",
    volunteerType: "",
    date: "",
  });
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSubmit = () => {
    const newInvitation: Omit<VolunteerInvitation, "invitationId"> = {
      invitationId: 0,
      volunteer: { volunteerId: volunteerId },
      organization: { organizationId: orgId },
      invitationDate: formData.date,
      // responseTime: "",
      requestTime: new Date(),
      address: formData.address,
      activityDetails: formData.activityDetails,
      requirements: formData.requirements,
      volunteerType: { volunteerTypeId: Number(formData.volunteerType) },
      status: "PENDING",
    };

    onSubmit(newInvitation);
  };
  useEffect(() => {
    dispatch(fetchVolunteerTypes());
  }, [dispatch]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>הזמן מתנדב</DialogTitle>
      <DialogContent>
        <DialogContent>
          <TextField
            fullWidth
            label="כתובת"
            name="address"
            value={formData.address}
            onChange={handleChange}
            margin="normal"
          />
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
            // inputProps={{
            //   min: minDate,
            //   max: maxDate
            // }}
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
      </DialogContent>
    </Dialog>
  );
};
export default VolunteerInvitationForm