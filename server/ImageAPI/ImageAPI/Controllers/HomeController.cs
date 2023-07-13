using Microsoft.AspNetCore.Mvc;

namespace ImageAPI.Controllers;

[ApiController]
[Route("api")]
public class HomeController : ControllerBase
{
    [HttpPost]
    public string Index(string encodeString)
    {
        return encodeString;
    }
}
