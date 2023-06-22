using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Framework;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Venues;
using Sabio.Models.Requests.Venues;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Web;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/venues")]
    [ApiController]
    public class VenuesApiController : BaseApiController
    {
        private IVenuesService _service = null;
        private IAuthenticationService<int> _authService = null;

        public VenuesApiController(IVenuesService service
            , ILogger<VenuesApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(VenueAddRequest model)
        {
            ObjectResult result = null;
            int userId = _authService.GetCurrentUserId();
            try
            {
                int id = _service.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int> { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Venue>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Venue venue = _service.SelectById(id);
                if (venue == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found.");
                }
                else
                {
                    response = new ItemResponse<Venue> { Item = venue };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);

            }
            return StatusCode(iCode, response);

        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Venue>>> GetPage(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<Venue> page = _service.GetAll(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<Venue>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(VenueUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            int userId = _authService.GetCurrentUserId();

            try
            {
                _service.Update(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);

            }
            return StatusCode(code, response);
        }
        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Venue>>> Search(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<Venue> page = _service.Search(pageIndex, pageSize, query);
                if (page == null)
                {
                    code = 404;
                    response = new ItemResponse<Paged<Venue>> { Item = page };
                }
                else
                {
                    response = new ItemResponse<Paged<Venue>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                Logger.LogError(ex.ToString());

            }
            return StatusCode(code, response);

        }
        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

    }
}
