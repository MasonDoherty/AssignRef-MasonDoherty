import React, { useState } from "react";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import { BsTrash3 } from "react-icons/bs";
import { FaQuestionCircle } from "react-icons/fa";
import { ButtonGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import "./venuestyles.css";
import VenueModal from "./VenueModal";
const _logger = debug.extend("SingleRowVenue");
_logger("Venue Row is displayed");

function SingleVenueRow(props) {
  const aVenue = props.venue;
  const aUser = props.currentUser;
  _logger("props", aUser.roles);

  const [formData, setFormData] = useState({
    imgSrc: aVenue?.primaryImageUrl || logo,
    show: false,
  });
  const toggle = () => {
    _logger("clicked");
    setFormData((prevState) => {
      const formD = { ...prevState };
      _logger(formD);
      formD.show = !prevState.show;

      return formD;
    });
  };
  const onRowClicked = (e) => {
    _logger("passing props from single row page");
    props.deleteVenue(props.venue, e);
  };

  const onClickDelete = () => {
    _logger("showing sweet alert", aVenue.id);
    Swal.fire({
      title: `Do you want delete ${aVenue.name}?`,
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        onRowClicked();
      } else {
        Swal.fire("Changes were not saved");
      }
    });
  };

  return (
    <React.Fragment>
      <tr>
        <th>{aVenue.name}</th>
        <td>
          {aVenue.description ? (
            <>{aVenue.description.substring(0, 75)}...</>
          ) : (
            <p className="text-muted">No Description Available</p>
          )}
        </td>
        <td>
          {aVenue.location.city}, {aVenue.location.state.name}
        </td>
        <td>
          {aVenue.url ? (
            <a
              href={aVenue.url}
              target="_blank"
              rel="noreferrer"
              className="link-info"
            >
              {aVenue.url.substring(0, 28)}...
            </a>
          ) : (
            <p className="text-muted">No Url Available</p>
          )}
        </td>

        <td>
          <div>
            <ButtonGroup>
              <button className="text-info  px-1 btn btn-outline">
                <FaQuestionCircle title="View More" onClick={toggle} />
              </button>
              {aUser.roles.includes("Admin") && (
                <button className="text-danger px-1 btn btn-outline">
                  <BsTrash3 title="Delete" onClick={onClickDelete} />
                </button>
              )}
            </ButtonGroup>
          </div>
        </td>
      </tr>
      <VenueModal
        isOpen={formData.show}
        toggle={toggle}
        modal={props.venue}
      ></VenueModal>
    </React.Fragment>
  );
}
SingleVenueRow.propTypes = {
  currentUser: PropTypes.shape({
    conferenceId: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    roles: PropTypes.string.isRequired,
  }),
  venue: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    location: PropTypes.shape({
      id: PropTypes.number.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    url: PropTypes.string.isRequired,
    // modal info below
    name: PropTypes.string.isRequired,
    description: PropTypes.string, // this one
    location: PropTypes.shape({
      id: PropTypes.number.isRequired,
      lineOne: PropTypes.string.isRequired,
      lineTwo: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      zip: PropTypes.string.isRequired,
      long: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
    }).isRequired,
    url: PropTypes.string, // this one
    primaryImageUrl: PropTypes.string.isRequired,
  }),
  deleteVenue: PropTypes.func,
};

export default React.memo(SingleVenueRow);
