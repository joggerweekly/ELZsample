using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ELZmain.Startup))]
namespace ELZmain
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
