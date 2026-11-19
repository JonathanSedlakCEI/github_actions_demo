using Microsoft.AspNetCore.Mvc;
using Semver;

namespace DocumentApi.Controllers;

[ApiController]
[Route("api/semver")]
public sealed class SemVerController : ControllerBase
{
    [HttpGet("validate")]
    [ProducesResponseType<SemVerValidationResponse>(StatusCodes.Status200OK)]
    public ActionResult<SemVerValidationResponse> Validate([FromQuery] string? version)
    {
        if (string.IsNullOrWhiteSpace(version))
        {
            return BadRequest(new SemVerValidationResponse(
                IsValid: false,
                Input: version ?? string.Empty,
                Normalized: null,
                Major: null,
                Minor: null,
                Patch: null,
                Prerelease: null,
                Build: null,
                Error: "A semantic version is required."));
        }

        if (!SemVersion.TryParse(
                version,
                SemVersionStyles.Strict,
                out SemVersion? parsed))
        {
            return BadRequest(new SemVerValidationResponse(
                IsValid: false,
                Input: version,
                Normalized: null,
                Major: null,
                Minor: null,
                Patch: null,
                Prerelease: null,
                Build: null,
                Error: "The value is not a valid semantic version."));
        }

        return Ok(new SemVerValidationResponse(
            IsValid: true,
            Input: version,
            Normalized: parsed.ToString(),
            Major: (int)parsed.Major,
            Minor: (int)parsed.Minor,
            Patch: (int)parsed.Patch,
            Prerelease: parsed.Prerelease,
            Build: parsed.Metadata,
            Error: null));
    }
}

public sealed record SemVerValidationResponse(
    bool IsValid,
    string Input,
    string? Normalized,
    int? Major,
    int? Minor,
    int? Patch,
    string? Prerelease,
    string? Build,
    string? Error);
