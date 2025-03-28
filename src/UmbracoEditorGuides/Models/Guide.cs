using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace Umbraco.Community.UmbracoEditorGuides.Models
{
    public class Guide
    {
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public int ContentTypeId { get; set; }
        public required string NodeAlias { get; set; }
        public string Title { get; set; } = "New Guide";
        public string? Content { get; set; }
    }
}
