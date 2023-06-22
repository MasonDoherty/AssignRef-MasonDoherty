import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./venuestyles.css";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import logo from "../../assets/images/brand/logo/logo_white_sm.png";
import PropTypes from "prop-types";
import debug from "sabio-debug";
const _logger = debug.extend("VenueModal");

function VenueModal({ isOpen, toggle, modal }) {
  // _logger("Venue Modal Props Passed", { isOpen, toggle, modal });

  const handleError = (e) => {
    e.currentTarget.onerror = null; // prevents looping
    e.currentTarget.src = logo;
  };

  const [marker, setMarker] = useState(null);
  const [center, setCenter] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  useEffect(() => {
    if (!modal) {
      return;
    }
    let geocoder = undefined;
    if (isLoaded) {
      geocoder = new window.google.maps.Geocoder();
    }
    const address = `${modal.location.lineOne}, ${modal.location.city}, ${modal.location.state.name}  ${modal.location.zip}`;

    geocoder?.geocode({ address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        const latLng = { lat: location.lat(), lng: location.lng() };
        setMarker(latLng);
        setCenter(latLng);
      } else {
        _logger(
          `Geocode was not successful for the following reason: ${status}`
        );
      }
    });
  }, [modal, isLoaded]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <React.Fragment>
      <Modal show={isOpen} toggle={toggle}>
        <div className="container largemodalwindow card ">
          <div className="text-center">
            <div>
              <h2 className="card-text text-center">{modal.name}</h2>
              <div className="d-flex  container">
                <div className="container card m-1 col-6">
                  <div>
                    {modal.description ? (
                      <>
                        <div>
                          <h4 className="m-2"> About the Venue: </h4>
                          <p>{modal.description}</p>
                        </div>
                        <div>
                          <img
                            className="img-thumbnail m-2"
                            src={modal.primaryImageUrl}
                            alt="AssignRef"
                            onError={handleError}
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <h4 className="m-2">Photo Of Venue</h4>
                        <img
                          className="img-thumbnail m-2"
                          src={modal.primaryImageUrl}
                          alt="AssignRef"
                          onError={handleError}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="container centermap  m-1 card col-6">
                  <h4 className="m-2"> Map of Venue:</h4>
                  <div className="mapholder  mb-3 ">
                    {!isLoaded ? (
                      <h1>Loading...</h1>
                    ) : (
                      <GoogleMap
                        mapContainerClassName="map-container"
                        center={center}
                        zoom={14}
                      >
                        {modal.location.lineOne && (
                          <Marker
                            position={marker}
                            icon={{
                              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                            }}
                            onClick={() => {
                              setInfoWindow(modal);
                            }}
                          />
                        )}

                        {infoWindow && (
                          <InfoWindow
                            position={marker}
                            onCloseClick={() => {
                              setInfoWindow(null);
                            }}
                          >
                            <div>
                              <h4>{infoWindow.name}</h4>
                              <p>
                                {modal.location.lineOne}, {modal.location.city},{" "}
                                {modal.location.state.name} {modal.location.zip}
                              </p>
                            </div>
                          </InfoWindow>
                        )}
                      </GoogleMap>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <p>
                  <h6 className="mt-1 mb-0">Venue Address:</h6>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="link-info"
                    href={`https://www.google.com/maps/search/?api=1&query=${modal.location.lat},${modal.location.long}`}
                  >
                    {modal.location.lineOne},
                    <p>
                      {modal.location.city}, {modal.location.state.name}{" "}
                      {modal.location.zip}
                    </p>
                  </a>
                </p>
              </div>
              <div>
                {modal.url && (
                  <>
                    <div>
                      <h6>Venue Url:</h6>

                      <a
                        href={modal.url}
                        target="_blank"
                        rel="noreferrer"
                        className="link-info"
                      >
                        {modal.url}
                      </a>
                    </div>
                  </>
                )}
              </div>
              <button className="btn btn-warning m-2" onClick={toggle}>
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
}
VenueModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  modal: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    location: PropTypes.shape({
      id: PropTypes.number.isRequired,
      locationType: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      lineOne: PropTypes.string.isRequired,
      lineTwo: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
      }).isRequired,
      zip: PropTypes.string.isRequired,
      lat: PropTypes.number.isRequired,
      long: PropTypes.number.isRequired,
    }).isRequired,
    url: PropTypes.string,
    primaryImageUrl: PropTypes.string.isRequired,
  }).isRequired,
};

export default VenueModal;
