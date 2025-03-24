using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Community.UmbracoEditorGuides.Models;

namespace Umbraco.Community.UmbracoEditorGuides.Migrations
{
    public class AddEditorGuidesMigration : MigrationBase
    {
        public AddEditorGuidesMigration(IMigrationContext context)
            : base(context)
        {
        }
        protected override void Migrate()
        {
            if (TableExists("EditorGuides") == false)
            {
                Create.Table<GuideSchema>().Do();
            }
            else
            {
                Logger.LogDebug("The database table {DbTable} already exists, skipping", "EditorGuides");
            }
        }
    }
}
