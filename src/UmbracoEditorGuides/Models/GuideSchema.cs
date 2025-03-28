using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPoco;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace Umbraco.Community.UmbracoEditorGuides.Models
{
    [TableName("umbracoEditorGuides")]
    [PrimaryKey("Id", AutoIncrement = true)]
    [ExplicitColumns]
    public class GuideSchema
    {
        [PrimaryKeyColumn]
        [Column("Id")]
        public int Id { get; set; }

        [Column("Guid")]
        public Guid Guid { get; set; }

        [Column("ContentTypeId")]
        public int ContentTypeId { get; set; }

        [Column("NodeAlias")]
        public required string NodeAlias { get; set; }

        [Column("Title")]
        public string Title { get; set; } = "New Guide";

        [Column("Content")]
        public string? Content { get; set; }
    }
}
