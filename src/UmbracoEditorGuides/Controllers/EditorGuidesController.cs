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
    public class EditorGuidesController : UmbracoAuthorizedApiController
    {
        private readonly IScopeProvider _scopeProvider;
        private readonly ILogger<Guide> _logger;

        public EditorGuidesController(IScopeProvider scopeProvider, ILogger<Guide> logger)
        {
            _scopeProvider = scopeProvider;
            _logger = logger;
        }

        [HttpPost]
        public IActionResult CreateGuide(Guide guide)
        {
            try
            {
                using var scope = _scopeProvider.CreateScope();
                scope.Database.Insert<Guide>(guide);
                scope.Complete();

                return Ok(new { message = "Guide created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating guide");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
