import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";

interface MapComponentProps {
  address: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ address }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "", 
  });

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          {
            params: {
              address: address,
              key: "AIzaSyANfIskDROp9Q9UCONXmTuWiT9RX9WbRdA",
            },
          }
        );
        const results = response.data.results;
        if (results && results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          setLocation({ lat, lng });
        } else {
          console.error("No results found for the address.");
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    if (address) {
      fetchCoordinates();
    }
  }, [address]);

  // useEffect(() => {
  //   const fetchCoordinates = async () => {
  //     try {
  //       const response = await fetch(`/api/coordinates?address=${encodeURIComponent(address)}`);
  //       const data = await response.json();
  //       setLocation({ lat: data.lat, lng: data.lng });
  //     } catch (error) {
  //       console.error("Error fetching coordinates:", error);
  //     }
  //   };

  //   if (address) {
  //     fetchCoordinates();
  //   }
  // }, [address]);

  if (!isLoaded) {
    return <p>Loading map...</p>;
  }

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;

  return (
    <a
      href={googleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
    >
      <div style={{ height: "210px", width: "100%" }}>
        {location ? (
          <GoogleMap
            center={location}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            <Marker position={location} />
          </GoogleMap>
        ) : (
          <p>Loading location...</p>
        )}
      </div>
    </a>
  );
};

export default MapComponent;
