using Umbraco.Cms.Core.Manifest;

namespace Umbraco.Community.UmbracoEditorGuides
{
    internal class UmbracoEditorGuidesManifestFilter : IManifestFilter
    {
        public void Filter(List<PackageManifest> manifests)
        {
            var assembly = typeof(UmbracoEditorGuidesManifestFilter).Assembly;

            manifests.Add(new PackageManifest
            {
                PackageName = "Umbraco Editor Guides ",
                Version = assembly.GetName()?.Version?.ToString(3) ?? "0.1.0",
                AllowPackageTelemetry = true,
                Scripts = new string[] {
                    // List any Script files
                    // Urls should start '/App_Plugins/UmbracoEditorGuides/' not '/wwwroot/UmbracoEditorGuides/', e.g.
                    // "/App_Plugins/UmbracoEditorGuides/Scripts/scripts.js"
                },
                Stylesheets = new string[]
                {
                    // List any Stylesheet files
                    // Urls should start '/App_Plugins/UmbracoEditorGuides/' not '/wwwroot/UmbracoEditorGuides/', e.g.
                    // "/App_Plugins/UmbracoEditorGuides/Styles/styles.css"
                }
            });
        }
    }
}
