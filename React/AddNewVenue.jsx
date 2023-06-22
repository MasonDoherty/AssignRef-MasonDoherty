import React, { useState } from "react";
import debug from "sabio-debug";
import { Formik, Form, Field, ErrorMessage } from "formik";
import LocationForm from "../locations/LocationForm";
import venueService from "services/venuesService";
import venueFormSchema from "../../schemas/venueFormSchema";
import "sweetalert2/src/sweetalert2.scss";
import toastr from "toastr";
import FileUpload from "components/files/FileUpload";
import logo from "../../assets/images/brand/logo/logo_white_sm.png";
import TitleHeader from "components/general/TitleHeader";

const _logger = debug.extend("AddNewVenue");

function AddNewVenue() {
  _logger("AddNewVenue is running");

  const [venueData, setVenueData] = useState({
    locationId: "",
    name: "",
    description: "",
    url: "",
    primaryImageUrl: "" || logo,
  });
  const onSuccessLocation = (values) => {
    setVenueData((prevState) => {
      const data = { ...prevState };
      data.locationId = values;
      return data;
    });
  };
  const onSubmitClick = (values) => {
    _logger("submitted form", values);

    setVenueData((prevState) => {
      const data = { ...prevState };
      data.locationId = values.locationId;
      data.name = values.name;
      data.description = values.description;
      data.url = values.url;
      data.primaryImageUrl = values.primaryImageUrl;

      return data;
    });

    venueService
      .createVenue(values)
      .then(onCreateVenueSuccess)
      .catch(onCreateVenueError);
  };
  const onCreateVenueSuccess = () => {
    _logger("created new venue");
    toastr.success("Created A New Venue");
  };

  const onCreateVenueError = () => {
    _logger("could not create  new venue");
    toastr.error("Could Not Create A New Venue");
  };

  const onFileUploadSuccess = (response, setFieldValue) => {
    const fileObject = response.item[0].url;
    _logger(fileObject);
    setFieldValue("primaryImageUrl", fileObject);
  };
  return (
    <React.Fragment>
      <TitleHeader
        title="Create New Venue"
        buttonText="Back To Venues"
        buttonLink="/venues"
      />

      <div className="">
        <div className="card">
          <div>
            <div className="m-2">
              <h3>Venue Address:</h3>
              <LocationForm getLocationId={onSuccessLocation} />
            </div>
            <Formik
              enableReinitialize={true}
              initialValues={venueData}
              validationSchema={venueFormSchema}
              onSubmit={onSubmitClick}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="d-flex">
                    <div className="col-6">
                      {" "}
                      <div className=" m-2">
                        <div>
                          <label htmlFor="name" className="form-label">
                            Name
                          </label>
                        </div>
                        <Field
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Name of venue"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className=" m-2">
                        <div>
                          <label className="form-label">Description</label>
                        </div>
                        <Field
                          type="textarea"
                          rows="8"
                          name="description"
                          className="form-control"
                          placeholder="Description of venue"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className=" m-2">
                        <div>
                          <label className="form-label">Website</label>
                        </div>
                        <Field
                          type="text"
                          name="url"
                          className="form-control"
                          placeholder="URL of venue"
                        />
                        <ErrorMessage
                          name="url"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                    <div className="col-5 m-2">
                      <label className="form-label">Upload a Venue Image</label>
                      <div className="d-flex">
                        <div className="d-flex   border">
                          <div className="m-2">
                            <FileUpload
                              isMultiple={false}
                              handleUploadSuccess={(response) =>
                                onFileUploadSuccess(response, setFieldValue)
                              }
                            ></FileUpload>
                          </div>

                          <div className=" m-2">
                            <img
                              className="img-thumbnail"
                              src={values.primaryImageUrl}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-outline-info m-2">
                    Create Venue
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default AddNewVenue;
