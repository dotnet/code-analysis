# dotnet/code-analysis

![Code Analysis windows-latest](https://github.com/dotnet/code-analysis/workflows/.NET%20Code%20Analysis%20windows-latest/badge.svg)  
![Code Analysis ubuntu-latest](https://github.com/dotnet/code-analysis/workflows/.NET%20Code%20Analysis%20ubuntu-latest/badge.svg)

Run [.NET code quality and code style analysis](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/overview) that ship with the .NET SDK.

# Limitations

The .NET code analysis action is currently in beta and runs on the `windows-latest` queue, as well as Windows self hosted agents. `ubuntu-latest` support coming soon.

# Overview

This action runs the [Code Analysis CLI](https://aka.ms/mscadocs) for .NET code quality and code style analysis by:

* Installing the Code Analysis CLI
* Execution of [.NET code quality and code style analysis](https://docs.microsoft.com/dotnet/fundamentals/code-analysis/overview) that ship with the .NET SDK
* Normalized processing of results into the SARIF format
* Exports a single SARIF file which can be uploaded via the `github/codeql-action/upload-sarif` action

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

# Run code analysis for all projects/solutions
- name: Run .NET Code Analysis
  uses: dotnet/code-analysis@v1
  id: code-analysis
  with:
    projects: <%semi_colon_separated_paths_to_projects_or_solutions%>
    analysis-level: <%analysis_level%>
```

**Note:** The [Microsoft Code Analysis CLI](https://aka.ms/mscadocs) is built with dotnet v3.1.201. A version greater than or equal to v3.1.201 of dotnet must be installed on the runner in order to run this action. GitHub hosted runners already have a compatible version of dotnet installed. To ensure a compatible version of dotnet is installed on a self-hosted runner, please configure the [actions/setup-dotnet](https://github.com/actions/setup-dotnet) action.

```yaml
- uses: actions/setup-dotnet@v1
  with:
    dotnet-version: '3.1.x'
```

# More Information

Please see the [wiki tab](https://github.com/dotnet/code-analysis/wiki) for more information and the [Frequently Asked Questions (FAQ)](https://github.com/dotnet/code-analysis/wiki/FAQ) page.

# Report Issues

Please [file a GitHub issue](https://github.com/dotnet/code-analysis/issues/new) in this repo. To help us investigate the issue, please include a description of the problem, a link to your workflow run (if public), and/or logs from the .NET code analysis action output.

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributing

Contributions are welcome! See the [Contributor's Guide](CONTRIBUTING.md).

This project has adopted the [.NET Foundation Code of Conduct](https://dotnetfoundation.org/code-of-conduct).
