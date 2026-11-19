using DocumentApi.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace DocumentApi.Tests;

public sealed class SemVerControllerTests
{
    [Fact]
    public void Validate_ReturnsParsedParts_ForStrictSemanticVersion()
    {
        var controller = new SemVerController();

        var result = controller.Validate("1.2.3-beta.1+build.7");

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<SemVerValidationResponse>(okResult.Value);
        Assert.True(response.IsValid);
        Assert.Equal("1.2.3-beta.1+build.7", response.Normalized);
        Assert.Equal(1, response.Major);
        Assert.Equal(2, response.Minor);
        Assert.Equal(3, response.Patch);
        Assert.Equal("beta.1", response.Prerelease);
        Assert.Equal("build.7", response.Build);
    }

    [Fact]
    public void Validate_ReturnsBadRequest_ForInvalidSemanticVersion()
    {
        var controller = new SemVerController();

        var result = controller.Validate("1.2");

        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        var response = Assert.IsType<SemVerValidationResponse>(badRequest.Value);
        Assert.False(response.IsValid);
        Assert.Contains("not a valid semantic version", response.Error);
    }
}
