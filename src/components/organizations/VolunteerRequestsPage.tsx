import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchVolunteers } from "../../features/volunteerSlice";
import { RootState } from "../../store/store";
import VolunteerRequestCard from "./VolunteerRequestCard";
import { AppDispatch } from "../../store/store";
import { Volunteer, VolunteerType } from "../../models/volunteers";
import { fetchVolunteerTypes } from "../../features/volunteerTypeSlice";

const VolunteerRequestsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const volunteers = useSelector((state: RootState) => state.volunteers.volunteers);
  const volunteerTypes = useSelector((state: RootState) => state.volunteerTypes.volunteerTypes);

  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([]);
  const [filters, setFilters] = useState({
    minAmount: 0,
    maxAmount: Infinity,
    minAge: 0,
    maxAge: Infinity,
    experience: false,
    region: "",
    gender: "",
    volunteerTypeId: null as number | null, // סינון לפי סוג התנדבות
  });

  useEffect(() => {
    dispatch(fetchVolunteers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchVolunteerTypes());
  }, [dispatch]);
  
  // Calculate age based on birthdate
  const calculateAge = (birth: string): number => {
    const birthDate = new Date(birth);
    const diffMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  useEffect(() => {
    if (Array.isArray(volunteers)) {
      const filtered = volunteers.filter((volunteer) => {
        const age = calculateAge(volunteer.birth);
        const hasVolunteerType =
          filters.volunteerTypeId === null ||
          volunteer.volunteerRequests.some((request) =>
            request.volunteerTypes?.some((type) => type.volunteerTypeId === filters.volunteerTypeId)
          );

        return (
          volunteer.amountVolunteers >= filters.minAmount &&
          volunteer.amountVolunteers <= filters.maxAmount &&
          age >= filters.minAge &&
          age <= filters.maxAge &&
          (filters.experience ? volunteer.experience : true) &&
          (filters.region && volunteer.region === "ALL"
            ? true
            : filters.region
            ? volunteer.region === filters.region
            : true) &&
          (filters.gender ? volunteer.gender === filters.gender : true) &&
          hasVolunteerType // בדיקה לפי סוגי התנדבות
        );
      });
      setFilteredVolunteers(filtered);
    }
  }, [volunteers, filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <h2>בקשות</h2>

      <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "10px" }}>
        {/* סינון לפי כמות, גיל, ניסיון, אזור, מגדר */}
        <label>
          כמות מתנדבים מינימלית:
          <input
            type="number"
            value={filters.minAmount}
            onChange={(e) => handleFilterChange("minAmount", Number(e.target.value))}
          />
        </label>
        <label>
          כמות מתנדבים מקסימלית:
          <input
            type="number"
            value={filters.maxAmount}
            onChange={(e) => handleFilterChange("maxAmount", Number(e.target.value))}
          />
        </label>
        <label>
          גיל מינימלי:
          <input
            type="number"
            value={filters.minAge}
            onChange={(e) => handleFilterChange("minAge", Number(e.target.value))}
          />
        </label>
        <label>
          גיל מקסימלי:
          <input
            type="number"
            value={filters.maxAge}
            onChange={(e) => handleFilterChange("maxAge", Number(e.target.value))}
          />
        </label>
        <label>
          ניסיון:
          <input
            type="checkbox"
            checked={filters.experience}
            onChange={(e) => handleFilterChange("experience", e.target.checked)}
          />
        </label>
        <label>
          אזור:
          <select
            value={filters.region}
            onChange={(e) => handleFilterChange("region", e.target.value)}
          >
            <option value="">בחר אזור</option>
            <option value="NORTH">צפון</option>
            <option value="CENTER">מרכז</option>
            <option value="SOUTH">דרום</option>
          </select>
        </label>
        <label>
          מגדר:
          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange("gender", e.target.value)}
          >
            <option value="">כולם</option>
            <option value="Male">זכר</option>
            <option value="Female">נקבה</option>
          </select>
        </label>

        <label>
          סוג התנדבות:
          <select
            value={filters.volunteerTypeId || ""}
            onChange={(e) => handleFilterChange("volunteerTypeId", e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">בחר סוג</option>
            {volunteerTypes.map((type) => (
              <option key={type.volunteerTypeId} value={type.volunteerTypeId}>
                {type.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Volunteers Display */}
      {Array.isArray(filteredVolunteers) && filteredVolunteers.map((volunteer) => (
        <div key={volunteer.volunteerId}>
          {volunteer.volunteerRequests.map((request) => (
            <Link
              to={`/request/${request.requestId}`}
              key={request.requestId}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <VolunteerRequestCard volunteer={volunteer} request={request} />
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VolunteerRequestsPage;
