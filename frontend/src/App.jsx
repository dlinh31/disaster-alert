/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState(null);

  // Fetch the Google Maps API key from Flask backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/get-api-key")
      .then((response) => response.json())
      .then((data) => {
        setGoogleMapsApiKey(data.googleMapsApiKey);
        loadGoogleMapsScript(data.googleMapsApiKey);
      })
      .catch((error) => {
        console.error("Error fetching Google Maps API key:", error);
      });
  }, []);

  // Load the Google Maps JavaScript API dynamically
  const loadGoogleMapsScript = (apiKey) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      initMap();
    };
  };

  // Initialize the map
  const initMap = () => {
    const mapOptions = {
      center: { lat: 37.7749, lng: -122.4194 }, // San Francisco coordinates as an example
      zoom: 12,
    };
    new window.google.maps.Map(document.getElementById("map"), mapOptions);
  };

  return (
    <>
      <div>
        <h1>Google Map with Vite + React</h1>
        <div id="map" style={{ width: "100%", height: "500px" }}></div>
      </div>
    </>
  );
}

export default App;
