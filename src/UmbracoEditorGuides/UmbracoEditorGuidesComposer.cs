using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace Umbraco.Community.UmbracoEditorGuides
{
    internal class UmbracoEditorGuidesComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.ManifestFilters().Append<UmbracoEditorGuidesManifestFilter>();
        }
    }
}
