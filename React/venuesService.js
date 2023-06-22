import axios from "axios";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const endpoint = { venueUrl: `${API_HOST_PREFIX}/api/venues/` };
const getAll = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint.venueUrl}paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const searchVenue = (values, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint.venueUrl}search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${values.search}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const createVenue = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.venueUrl}`,
    withCredentials: true,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const deleteVenue = (id) => {
  const config = {
    method: "Delete",
    url: `${endpoint.venueUrl}${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const venueService = { getAll, searchVenue, deleteVenue, createVenue };

export default venueService;
