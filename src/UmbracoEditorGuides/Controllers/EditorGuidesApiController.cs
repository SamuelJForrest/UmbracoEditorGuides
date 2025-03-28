using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Infrastructure.Scoping;
using Umbraco.Cms.Web.BackOffice.Controllers;
using Umbraco.Community.UmbracoEditorGuides.Models;

namespace Umbraco.Community.UmbracoEditorGuides.Controllers
{
    public class EditorGuidesApiController : UmbracoAuthorizedApiController
    {
        private readonly IScopeProvider _scopeProvider;
        private readonly ILogger<Guide> _logger;

        public EditorGuidesApiController(IScopeProvider scopeProvider, ILogger<Guide> logger)
        {
            _scopeProvider = scopeProvider;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult GetAllGuides()
        {
            using var scope = _scopeProvider.CreateScope();
            var guides = scope.Database.Fetch<Guide>("SELECT * FROM UmbracoEditorGuides");
            scope.Complete();

            return Ok(new { guides });
        }

        [HttpGet]
        public IActionResult GetGuidesByType(int contentTypeId)
        {
            using var scope = _scopeProvider.CreateScope();
            var guides = scope.Database.Fetch<Guide>("SELECT * FROM UmbracoEditorGuides WHERE contentTypeId = @0", contentTypeId);
            scope.Complete();
            if (guides == null)
            {
                return NotFound();
            }
            return Ok(new { guides });
        }

        [HttpGet]
        public IActionResult GetGuideByGuid(Guid guid)
        {
            using var scope = _scopeProvider.CreateScope();
            var guide = scope.Database.FirstOrDefault<Guide>("SELECT * FROM UmbracoEditorGuides WHERE guid = @0", guid);
            scope.Complete();
            if (guide == null)
            {
                return NotFound();
            }
            return Ok(new { guide });
        }

        [HttpPost]
        public IActionResult CreateGuide(GuideSchema guide)
        {
            try
            {
                using var scope = _scopeProvider.CreateScope();
                scope.Database.Insert<GuideSchema>(guide);
                scope.Complete();

                return Ok(new { message = "Guide created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating guide");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpDelete]
        public IActionResult DeleteGuide(Guid guid)
        {
            try
            {
                using var scope = _scopeProvider.CreateScope();
                var guide = scope.Database.FirstOrDefault<GuideSchema>("SELECT * FROM UmbracoEditorGuides WHERE guid = @0", guid);
                if (guide == null)
                {
                    return NotFound();
                }
                scope.Database.Delete<GuideSchema>(guide);
                scope.Complete();
                return Ok(new { message = "Guide deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting guide");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
