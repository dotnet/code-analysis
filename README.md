# dotnet/code-analysis

![Code Analysis windows-latest](https://github.com/dotnet/code-analysis/workflows/.NET%20Code%20Analysis%20windows-latest/badge.svg)  
![Code Analysis ubuntu-latest](https://github.com/dotnet/code-analysis/workflows/.NET%20Code%20Analysis%20ubuntu-latest/badge.svg)

# Overview

This action runs the [.NET code quality ("CAxxxx") and code style analyzers("IDExxxx")](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/overview) that ship with the .NET SDK.

## Inputs

### Mandatory Inputs

|Name|Description
|--|--|
`projects`|One or more `;` separated paths to the project(s) or solution(s) to analyze.
`warn-as-error`|Boolean value `true` or `false` indicating if analysis warnings should be treated as errors and fail the build.

### Optional Inputs

|Name|Applicable To|Default|Description
|--|--|--|
`all-categories`|[All 'CAxxxx' and 'IDExxxx' rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/categories)|`latest-minimum`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables below.
`style`|['IDExxxx' code-style rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/style-rules)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables below.
`design`|['CAxxxx' design rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/design-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables below.
`documentation`|['CAxxxx' documentation rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/documentation-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables below.
`globalization`|['CAxxxx' globalization rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/globalization-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables below.
`interoperability`|['CAxxxx' interoperability and portability rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/interoperability-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables below.
`maintainability`|['CAxxxx' maintainability rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/maintainability-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables below.
`naming`|['CAxxxx' naming rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/naming-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables below.
`performance`|['CAxxxx' performance rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/performance-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables below.
`reliability`|['CAxxxx' reliability rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/reliability-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables below.
`security`|['CAxxxx' security rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/security-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables below.
`usage`|['CAxxxx' usage rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/usage-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables below.

#### AnalysisLevel values

The following table shows the available [AnalysisLevel](https://docs.microsoft.com/dotnet/core/project-sdk/msbuild-props#analysislevel) options.

| Value | Meaning |
|-|-|
| `latest` | The latest code analyzers that have been released are used. This is the default. |
| `preview` | The latest code analyzers are used, even if they are in preview. |
| `5.0` | The set of rules that was enabled for the .NET 5.0 release is used, even if newer rules are available. |
| `5` | The set of rules that was enabled for the .NET 5.0 release is used, even if newer rules are available. |

#### AnalysisMode values

The following table shows the available [AnalysisMode](https://docs.microsoft.com/dotnet/core/project-sdk/msbuild-props#analysismode) options.

| Value | Meaning |
|-|-|
| `minimum` | Minimum or highly-recommended set of code analyzers are enabled. This is the default. |
| `none` or `AllDisabledByDefault` | No code analyzers are enabled. This is the most conservative analysis mode. |
| `default` | Default set of code analyzers are enabled. |
| `recommended` | Recommended set of  code analyzers are enabled. |
| `all` or `AllEnabledByDefault` | All code analyzers are enabled. This is the most aggressive analysis mode. |

### Input Examples

1. Enable all `CAxxxx` and `IDExxxx` rules for a single solution at repo root. Warnings are treated as errors.

    ```yaml
    - name: Run .NET Code Analysis
      uses: dotnet/code-analysis@v1
      id: code-analysis
      with:
        projects: MySolution.sln
        warn-as-error: true
        all-categories: all
    ```

2. Enable all 5.0 release `CAxxxx` security and performance rules, but only the recommended set for other rule categories for `MyProject1.csproj` and `MyProject2.csproj`. Warnings are not treated as errors.

    ```yaml
    - name: Run .NET Code Analysis
      uses: dotnet/code-analysis@v1
      id: code-analysis
      with:
        projects: src\MyProject1.csproj;src\MyProject2.csproj
        warn-as-error: false
        security: 5.0-all
        performance: 5.0-all
        all-categories: 5.0-recommended
    ```

3. Enable highly-recommended `IDExxxx` code-style rules, and disable all the remaining rules for a single project. Warnings are treated as errors.

    ```yaml
    - name: Run .NET Code Analysis
      uses: dotnet/code-analysis@v1
      id: code-analysis
      with:
        projects: src\MyProject1.csproj
        warn-as-error: true
        style: minimum
        all-categories: none
    ```

## Outputs

The action produces a JSON format [error log file](https://github.com/dotnet/roslyn/blob/master/docs/compilers/Error%20Log%20Format.md) in [SARIF](https://sarifweb.azurewebsites.net/) format. This file can be uploaded via the `github/codeql-action/upload-sarif` action.

# Usage

See [action.yml](action.yml)

## Basic

Run [.NET code quality and code style analysis](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/overview) that ship with the .NET SDK.

```yaml
steps:
- uses: actions/checkout@v2

# Run NuGet restore for each project/solution to analyze
- name: Run NuGet restore
  run: dotnet restore <%path_to_project_or_solution%>

# Run code analysis for all projects/solutions, with warnings treated as errors
- name: Run .NET Code Analysis
  uses: dotnet/code-analysis@v1
  id: code-analysis
  with:
    projects: <%semi_colon_separated_paths_to_projects_or_solutions%>
    warn-as-error: true
```

**Note:** The [Microsoft Code Analysis CLI](https://aka.ms/mscadocs) is built with dotnet v3.1.201. A version greater than or equal to v3.1.201 of dotnet must be installed on the runner in order to run this action. GitHub hosted runners already have a compatible version of dotnet installed. To ensure a compatible version of dotnet is installed on a self-hosted runner, please configure the [actions/setup-dotnet](https://github.com/actions/setup-dotnet) action.

```yaml
- uses: actions/setup-dotnet@v1
  with:
    dotnet-version: '3.1.x'
```

# Limitations

The .NET code analysis action is currently in beta and runs on the `windows-latest` queue, as well as Windows self hosted agents. `ubuntu-latest` support coming soon.

# More Information

Please see the [wiki tab](https://github.com/dotnet/code-analysis/wiki) for more information and the [Frequently Asked Questions (FAQ)](https://github.com/dotnet/code-analysis/wiki/FAQ) page.

# Report Issues

Please [file a GitHub issue](https://github.com/dotnet/code-analysis/issues/new) in this repo. To help us investigate the issue, please include a description of the problem, a link to your workflow run (if public), and/or logs from the .NET code analysis action output.

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributing

Contributions are welcome! See the [Contributor's Guide](CONTRIBUTING.md).

This project has adopted the [.NET Foundation Code of Conduct](https://dotnetfoundation.org/code-of-conduct).
