# dotnet/code-analysis

![Code Analysis windows-latest](https://github.com/dotnet/code-analysis/workflows/.NET%20Code%20Analysis%20windows-latest/badge.svg)

# Overview

This action runs the [.NET code quality ("CAxxxx") and code style analyzers("IDExxxx")](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/overview) that ship with the .NET SDK.

## Inputs

### Mandatory Inputs

|Name|Description
|----|----|
`build-breaking`|Boolean value `true` or `false` indicating if code analysis violations should break the build.

### Optional Inputs

#### Analysis Target(s)

Inputs to select the set of projects and/or solutions to analyze. By default, the solution at the root of the repo would be analyzed.

|Name|Description
|----|----|
`solution`|Path to the solution to analyze.
`solutions`|One or more `;` separated paths to the solutions to analyze.
`project`|Path to the project to analyze.
`projects`|One or more `;` separated paths to the projects to analyze.

#### Analysis Rules

Inputs to customize the buckets of analyzers that are executed, either based on category or for all categories. By default, we execute all the latest, minimum recommended analyzers for all categories.

|Name|Applicable To|Default|Description
|----|----|----|----|
`all-categories`|[All 'CAxxxx' and 'IDExxxx' rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/categories)|`latest-minimum`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables [below](#analysislevel-values).
`style`|['IDExxxx' code-style rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/style-rules)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables below.
`design`|['CAxxxx' design rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/design-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables [below](#analysislevel-values).
`documentation`|['CAxxxx' documentation rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/documentation-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables [below](#analysislevel-values).
`globalization`|['CAxxxx' globalization rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/globalization-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables [below](#analysislevel-values).
`interoperability`|['CAxxxx' interoperability and portability rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/interoperability-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables [below](#analysislevel-values).
`maintainability`|['CAxxxx' maintainability rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/maintainability-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables [below](#analysislevel-values).
`naming`|['CAxxxx' naming rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/naming-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables [below](#analysislevel-values).
`performance`|['CAxxxx' performance rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/performance-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables [below](#analysislevel-values).
`reliability`|['CAxxxx' reliability rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/reliability-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables [below](#analysislevel-values).
`security`|['CAxxxx' security rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/security-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables [below](#analysislevel-values).
`usage`|['CAxxxx' usage rules](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/usage-warnings)|Value for `all-categories`|Valid `AnalysisLevel` or `AnalysisMode` values or `AnalysisLevel-AnalysisMode` combinations from tables [below](#analysislevel-values).

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

1. Enable all `CAxxxx` and `IDExxxx` rules for a single solution at repo root, such that code analysis violations break the build.

    ```yaml
    - name: Run .NET Code Analysis
      uses: dotnet/code-analysis@main
      id: code-analysis
      with:
        solution: MySolution.sln
        build-breaking: true
        all-categories: all
    ```

2. Enable all 5.0 release `CAxxxx` security and performance rules, but only the recommended set for other rule categories for `MyProject1.csproj` and `MyProject2.csproj`, such that code analysis violations do not break the build.

    ```yaml
    - name: Run .NET Code Analysis
      uses: dotnet/code-analysis@main
      id: code-analysis
      with:
        projects: src\MyProject1.csproj;src\MyProject2.csproj
        build-breaking: false
        security: 5.0-all
        performance: 5.0-all
        all-categories: 5.0-recommended
    ```

3. Enable highly-recommended `IDExxxx` code-style rules, and disable all the remaining rules for a single project, such that code analysis violations break the build.

    ```yaml
    - name: Run .NET Code Analysis
      uses: dotnet/code-analysis@main
      id: code-analysis
      with:
        project: src\MyProject1.csproj
        build-breaking: true
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

# Run code analysis for all projects/solutions, such that code analysis violations break the build.
- name: Run .NET Code Analysis
  uses: dotnet/code-analysis@main
  id: code-analysis
  with:
    build-breaking: true
```

**Note:** The [Microsoft Code Analysis CLI](https://aka.ms/mscadocs) is built with dotnet v3.1.201. A version greater than or equal to v3.1.201 of dotnet must be installed on the runner in order to run this action. GitHub hosted runners already have a compatible version of dotnet installed. To ensure a compatible version of dotnet is installed on a self-hosted runner, please configure the [actions/setup-dotnet](https://github.com/actions/setup-dotnet) action.

```yaml
- uses: actions/setup-dotnet@main
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
