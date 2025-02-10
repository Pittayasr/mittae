import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  GoogleMap,
  useLoadScript,
  Autocomplete,
  Marker,
  Libraries,
} from "@react-google-maps/api";
import { geocodeAddress, GOOGLE_MAPS_API_KEY } from "../../../googleMapsConfig";

interface MapModalProps {
  onConfirm: (coordinates: { lat: number; lng: number }) => void;
  initialAddress?: string;
}

const libraries: Libraries = ["places"];

const MapModal: React.FC<MapModalProps> = ({ onConfirm, initialAddress }) => {
  const [showMapModal, setShowMapModal] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 13.7563,
    lng: 100.5018,
  });
  const [savedCoordinates, setSavedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [autocompleteInput, setAutocompleteInput] = useState<string>(
    initialAddress || ""
  );

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || "",
    libraries,
    language: "th",
  });

  useEffect(() => {
    if (initialAddress) {
      setAutocompleteInput(initialAddress);
    }
  }, [initialAddress]);

  useEffect(() => {
    if (mapRef.current && coordinates) {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      markerRef.current = new google.maps.Marker({
        position: coordinates,
        map: mapRef.current,
        // icon: {
        //   url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png", // URL ไอคอน
        //   scaledSize: new window.google.maps.Size(40, 40), // ขนาดของไอคอน
        // },
        draggable: true,
        title: "ลาก Marker เพื่อเลือกตำแหน่ง",
      });

      markerRef.current.addListener(
        "dragend",
        (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            const newCoordinates = {
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            };
            setCoordinates(newCoordinates);
          }
        }
      );
    }
  }, [coordinates]);

  const handleOpenMap = async () => {
    if (initialAddress) {
      setAutocompleteInput(initialAddress);
      try {
        const coords = await geocodeAddress(initialAddress);
        setCoordinates(coords);
      } catch (error) {
        console.error("Error geocoding initial address:", error);
        alert("ไม่สามารถค้นหาพิกัดจากที่อยู่เริ่มต้นได้");
      }
    }
    setShowMapModal(true);
  };

  const handleCloseMap = () => setShowMapModal(false);

  const handleAutocompleteLoad = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    autocompleteRef.current = autocomplete;
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const newCoordinates = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setCoordinates(newCoordinates);
      setAutocompleteInput(place.formatted_address || "");
    } else {
      setAutocompleteInput("กรุณากรอกที่อยู่");
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newCoordinates = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setCoordinates(newCoordinates);
    }
  };

  const handleManualSearch = async () => {
    try {
      const location = await geocodeAddress(autocompleteInput);
      if (!location.lat || !location.lng) {
        throw new Error("No coordinates found");
      }
      setCoordinates(location);
    } catch (error) {
      setAutocompleteInput("ไม่พบผลลัพธ์ กรุณาลองใหม่");
      alert("ไม่สามารถค้นหาที่อยู่ได้ กรุณาลองใหม่ หรือปักหมุดบนแผนที่แทน");
    }
  };

  const handleConfirmLocation = () => {
    const isConfirmed = window.confirm(
      `คุณต้องการยืนยันตำแหน่งนี้หรือไม่?\nพิกัด: ${coordinates.lat}, ${coordinates.lng}`
    );

    if (isConfirmed) {
      setSavedCoordinates(coordinates);
      onConfirm(coordinates);
      setShowMapModal(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=${
            savedCoordinates?.lat || coordinates.lat
          },${
            savedCoordinates?.lng || coordinates.lng
          }&zoom=20&size=800x400&maptype=roadmap&markers=color:green%7C${
            savedCoordinates?.lat || coordinates.lat
          },${
            savedCoordinates?.lng || coordinates.lng
          }&key=${GOOGLE_MAPS_API_KEY}`}
          alt="Static Map"
          style={{
            width: "100%",
            maxWidth: "900px", // จำกัดความกว้างสูงสุด
            height: "auto", // ให้ปรับความสูงอัตโนมัติ
            cursor: "pointer",
            borderRadius: "10px",
            objectFit: "contain", // คงสัดส่วนของภาพไว้
          }}
          onClick={handleOpenMap}
        />
      </div>

      {/* Modal Map ขนาดเต็ม */}
      <Modal show={showMapModal} onHide={handleCloseMap} fullscreen centered>
        <Modal.Header closeButton>
          <Modal.Title>ปักหมุดตำแหน่ง</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowY: "hidden" }}>
          {isLoaded ? (
            <div>
              <div
                style={{
                  zIndex: 5,
                  background: "#fff",
                  padding: "10px",
                  borderRadius: "5px",
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  right: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
              >
                <Autocomplete
                  onLoad={handleAutocompleteLoad}
                  onPlaceChanged={handlePlaceChanged}
                >
                  <input
                    type="text"
                    placeholder="ค้นหาที่อยู่"
                    value={autocompleteInput}
                    onChange={(e) => setAutocompleteInput(e.target.value)}
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }}
                  />
                </Autocomplete>
                <div className="mt-2 d-flex justify-content-end ">
                  <Button variant="success" onClick={handleManualSearch}>
                    ค้นหา
                  </Button>
                </div>
              </div>
              <GoogleMap
                center={coordinates}
                zoom={19}
                mapContainerStyle={{
                  width: "100%",
                  height: "calc(100vh - 150px)",
                }}
                onClick={handleMapClick}
                onDragEnd={() => {
                  const center = mapRef.current?.getCenter();
                  if (center) {
                    setCoordinates({
                      lat: center.lat(),
                      lng: center.lng(),
                    });
                  }
                }}
                onLoad={(map) => {
                  mapRef.current = map;

                  return void 0;
                }}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                }}
              >
                <Marker position={coordinates} draggable />
              </GoogleMap>
            </div>
          ) : (
            <p>กำลังโหลดแผนที่...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-success" onClick={handleCloseMap}>
            ปิด
          </Button>
          <Button variant="success" onClick={handleConfirmLocation}>
            ยืนยันตำแหน่ง
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MapModal;
