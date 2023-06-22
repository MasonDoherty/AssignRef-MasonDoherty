import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import { Card, Table, Tab } from "react-bootstrap";
import TitleHeader from "components/general/TitleHeader";
import debug from "sabio-debug";
import venueSearhSchema from "schemas/venuesSearchSchema";
import venueService from "../../services/venuesService";
import Pagination from "rc-pagination";
import SingleVenueRow from "./SingleVenueRow";
import "rc-pagination/assets/index.css";
import toastr from "toastr";
import { Formik, Form, Field, ErrorMessage } from "formik";
import PropTypes from "prop-types";

const _logger = debug.extend("Venue");
function Venue(props) {
  const [currentPage, setCurrentPage] = useState({
    venueComponents: [],
    current: 1,
    pageIndex: 0,
    pageSize: 5,
    totalCount: 0,
    search: "",
    searchPageSize: 5,
    totalPages: 0,
  });
  _logger(props.currentUser, "props are here");

  useEffect(() => {
    getTableData();
  }, [currentPage.current]);

  const getTableData = () => {
    venueService
      .getAll(currentPage.current - 1, currentPage.pageSize)
      .then(onGetAllSuccess)
      .catch(onGetAllError);
  };
  const onGetAllSuccess = (response) => {
    _logger("get all is successfull", response);
    setCurrentPage((prevState) => {
      const pd = { ...prevState };
      pd.data = response.item.pagedItems;
      pd.venueComponents = response.item.pagedItems.map(mapVenue);
      pd.totalCount = response.item.totalCount;
      return pd;
    });
  };
  const onGetAllError = (err) => {
    _logger(err, "you have an error when getting all");
    toastr.error("Could not find any venues.");
  };

  const mapVenue = (aVenue) => {
    return (
      <SingleVenueRow
        venue={aVenue}
        key={"VenueRow" + aVenue.id}
        deleteVenue={deleteVenue}
        currentUser={props.currentUser}
      />
    );
  };
  const deleteVenue = (venue) => {
    _logger("recieved props on main page", venue.id);
    venueService
      .deleteVenue(venue.id)
      .then(onDeleteVenueSuccess)
      .catch(onDeleteVenueError);
  };
  const onDeleteVenueError = (error) => {
    _logger("there was an error executing delete", error);
    toastr.error("Could not delete venue");
  };
  const onDeleteVenueSuccess = (id) => {
    _logger("successfully deleted row", id);
    toastr.success("Succesfully deleted venue");
    venueService
      .getAll(currentPage.pageIndex, currentPage.pageSize)
      .then(onSearchVenueSuccess)
      .catch(onSearchVenueError);
  };
  const onChange = (page) => {
    setCurrentPage({ ...currentPage, current: page });
  };
  const searchPage = (values) => {
    _logger("here are the values", values);
    if (values === "") {
      venueService
        .getAll(currentPage.pageIndex, currentPage.pageSize)
        .then(onSearchVenueSuccess)
        .catch(onSearchVenueError);
    } else {
      _logger("Searching...", currentPage);
      venueService
        .searchVenue(values, currentPage.pageIndex, currentPage.searchPageSize)
        .then(onSearchVenueSuccess)
        .catch(onSearchVenueError);
    }
  };
  const onSearchVenueSuccess = (response) => {
    let currentPage = response.item.pagedItems;
    setCurrentPage((prevState) => {
      const pd = { ...prevState };
      pd.data = currentPage;
      pd.data.totalPages = response.item.totalPages;
      pd.totalCount = response.item.totalCount;
      _logger("results...", currentPage);
      pd.venueComponents = currentPage.map(mapVenue);
      return pd;
    });
  };
  const onSearchVenueError = (response) => {
    _logger("error occurred", response);
    toastr.error("No search results found");
  };
  const resetBar = () => {
    _logger("resetting bar");

    setCurrentPage((prevState) => {
      const pd = { ...prevState };
      pd.search = "";
      return pd;
    });
    getTableData();
  };

  return (
    <>
      {props.currentUser.roles.includes("Admin") ? (
        <TitleHeader
          title="Venues"
          buttonText="Add New Venue"
          buttonLink="/venues/new"
        />
      ) : (
        <TitleHeader title="Venues" />
      )}
      <div className=" ">
        <Tab.Container defaultActiveKey="Venues">
          <Card>
            <Card.Body className="p-0">
              <Tab.Content>
                <Tab.Pane eventKey="Venues" className="pb-4 p-4">
                  <Formik
                    enableReinitialize={true}
                    initialValues={currentPage}
                    onSubmit={searchPage}
                    className="card"
                    validationSchema={venueSearhSchema}
                  >
                    <Form>
                      <div className="p-5 d-flex">
                        <Field
                          type="text"
                          name="search"
                          className="form-control"
                          placeholder="Search Venues"
                        />
                        <ErrorMessage
                          name="search"
                          component="div"
                          className="text-danger"
                        />
                        <button
                          type="submit"
                          className="btn btn-outline-info ms-1"
                        >
                          Search
                        </button>
                        <button
                          type="reset"
                          className="btn btn-outline-warning ms-1"
                          onClick={resetBar}
                        >
                          Clear
                        </button>
                      </div>
                    </Form>
                  </Formik>

                  <Table responsive>
                    <thead>
                      <tr style={{ backgroundColor: "whitesmoke" }}>
                        <th className="fw-bolder text-left">Name</th>
                        <th className="fw-bolder text-left">Description</th>
                        <th className="fw-bolder text-left">Location</th>
                        <th className="fw-bolder text-left">Venue URL</th>
                        <th className="fw-bolder text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="hover">
                      {currentPage.venueComponents}
                    </tbody>
                  </Table>
                  <Pagination
                    className="ant-pagination text-center mt-3"
                    onChange={onChange}
                    current={currentPage.current}
                    total={currentPage.totalCount}
                    pageSize={currentPage.pageSize}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Tab.Container>
      </div>
    </>
  );
}
Venue.propTypes = {
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
    description: PropTypes.string.isRequired,
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
    url: PropTypes.string.isRequired,
    primaryImageUrl: PropTypes.string.isRequired,
  }),
  deleteVenue: PropTypes.func,
};

export default React.memo(Venue);
