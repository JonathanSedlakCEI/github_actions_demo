[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern("^net\d+$")]
    [string]$TargetFrameworkMoniker,

    [switch]$BreakingChange,

    [switch]$Prerelease
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-PackageTags {
    $tags = git tag --list "DocumentApi-v*" 2>$null
    if ($LASTEXITCODE -ne 0) {
        return @()
    }

    return @($tags | Where-Object { $_ })
}

function Get-VersionParts {
    param([string]$Tag)

    if ($Tag -notmatch '^DocumentApi-v(\d+)\.(\d+)\.(\d+)(?:-(prerelease)-(\d+))?$') {
        return $null
    }

    [PSCustomObject]@{
        Major = [int]$Matches[1]
        Minor = [int]$Matches[2]
        Build = [int]$Matches[3]
        Prerelease = $Matches[4]
        PrereleaseNumber = if ($Matches[5]) { [int]$Matches[5] } else { $null }
    }
}

function Compare-VersionParts {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Left,
        [Parameter(Mandatory = $true)]
        [object]$Right
    )

    foreach ($property in @("Major", "Minor", "Build")) {
        $difference = $Left.$property - $Right.$property
        if ($difference -ne 0) {
            return $difference
        }
    }

    if ($null -eq $Left.PrereleaseNumber -and $null -eq $Right.PrereleaseNumber) {
        return 0
    }
    if ($null -eq $Left.PrereleaseNumber) {
        return 1
    }
    if ($null -eq $Right.PrereleaseNumber) {
        return -1
    }

    return $Left.PrereleaseNumber - $Right.PrereleaseNumber
}

$major = [int]($TargetFrameworkMoniker -replace "^net", "")
$latest = $null

foreach ($tag in Get-PackageTags) {
    $candidate = Get-VersionParts -Tag $tag
    if ($null -eq $candidate -or $candidate.Major -ne $major) {
        continue
    }
    if ($null -eq $latest -or (Compare-VersionParts -Left $candidate -Right $latest) -gt 0) {
        $latest = $candidate
    }
}

if ($BreakingChange) {
    $minor = if ($latest) { $latest.Minor + 1 } else { 1 }
    $build = 0
}
elseif ($null -eq $latest) {
    $minor = 0
    $build = 0
}
elseif ($Prerelease) {
    if ($null -ne $latest.Prerelease) {
        $minor = $latest.Minor
        $build = $latest.Build
    }
    else {
        $minor = $latest.Minor
        $build = $latest.Build + 1
    }
}
elseif ($null -ne $latest.Prerelease) {
    $minor = $latest.Minor
    $build = $latest.Build
}
else {
    $minor = $latest.Minor
    $build = $latest.Build + 1
}

$baseVersion = "$major.$minor.$build"

if ($Prerelease) {
    if ($BreakingChange) {
        $prereleaseNumber = 1
    }
    elseif ($null -ne $latest -and $null -ne $latest.Prerelease) {
        $prereleaseNumber = $latest.PrereleaseNumber + 1
    }
    else {
        $prereleaseNumber = 1
    }

    $calculatedVersion = "$baseVersion-prerelease-$($prereleaseNumber.ToString('00'))"
}
else {
    $calculatedVersion = $baseVersion
}

Write-Output $calculatedVersion
