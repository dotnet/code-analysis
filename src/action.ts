import * as core from '@actions/core';
import { MscaAction } from './msca-toolkit/msca-toolkit';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { stringify } from 'querystring';

function getAnalysisLevelArgumentFromInput(analysisLevelName: string): string {
    let analysisLevelInput = core.getInput(analysisLevelName.toLowerCase());
    if (action.isNullOrWhiteSpace(analysisLevelInput)) {
        return '';
    }

    let analysisLevel: string;
    let analysisMode: string;
    let separator = analysisLevelInput.lastIndexOf('-');
    if (separator > 0) {
        analysisLevel = analysisLevelInput.substring(0, separator);
        analysisMode = analysisLevelInput.substring(separator + 1);
    }
    else {
        switch (analysisLevelInput.toLowerCase()) {
            case 'none':
            case 'default':
            case 'minimum':
            case 'recommended':
            case 'all':
            case 'allenabledbydefault':
            case 'alldisabledbydefault':
                analysisMode = analysisLevelInput;
                analysisLevel = 'latest';
                break;

            default:
                analysisLevel = analysisLevelInput;
                analysisMode = 'minimum';
                break;
        }
    }

    let newArg: string;
    if (analysisLevelName == 'all-categories') {
        newArg = `/p:AnalysisLevel=${analysisLevel} /p:AnalysisMode=${analysisMode} `;
    }
    else {
        newArg = `/p:AnalysisLevel${analysisLevelName}=${analysisLevel} /p:AnalysisMode${analysisLevelName}=${analysisMode} `;
    }

    return newArg;
}

function appendToProjectsOrSolutions(inputVariableName: string, projectsOrSolutions: string): string {
    let input = core.getInput(inputVariableName);
    if (!action.isNullOrWhiteSpace(input)) {
        if (!action.isNullOrWhiteSpace(projectsOrSolutions)) {
            projectsOrSolutions += ';';
        }

        projectsOrSolutions += input;
    }

    return projectsOrSolutions;
}

let action = new MscaAction();

// Process core analysis-level
let analysisArgs = getAnalysisLevelArgumentFromInput('all-categories');

// Process category specific analysis levels
analysisArgs += getAnalysisLevelArgumentFromInput('Style');
analysisArgs += getAnalysisLevelArgumentFromInput('Design');
analysisArgs += getAnalysisLevelArgumentFromInput('Documentation');
analysisArgs += getAnalysisLevelArgumentFromInput('Globalization');
analysisArgs += getAnalysisLevelArgumentFromInput('Interoperability');
analysisArgs += getAnalysisLevelArgumentFromInput('Maintainability');
analysisArgs += getAnalysisLevelArgumentFromInput('Naming');
analysisArgs += getAnalysisLevelArgumentFromInput('Performance');
analysisArgs += getAnalysisLevelArgumentFromInput('Reliability');
analysisArgs += getAnalysisLevelArgumentFromInput('Security');
analysisArgs += getAnalysisLevelArgumentFromInput('Usage');

let buldBreakingArg = core.getInput('build-breaking');
let warnAsError = false;
if (action.isNullOrWhiteSpace(buldBreakingArg) || buldBreakingArg.toLowerCase() != 'false')
{
    warnAsError = true;
    analysisArgs += `/warnaserror `;
}

let projectsOrSolutions = '';
projectsOrSolutions = appendToProjectsOrSolutions('solution', projectsOrSolutions);
projectsOrSolutions = appendToProjectsOrSolutions('solutions', projectsOrSolutions);
projectsOrSolutions = appendToProjectsOrSolutions('project', projectsOrSolutions);
projectsOrSolutions = appendToProjectsOrSolutions('projects', projectsOrSolutions);

var buildCommandLines:string = "";
var first = true;
if (action.isNullOrWhiteSpace(projectsOrSolutions)) {
    buildCommandLines += `msbuild.exe ${analysisArgs}`;
}
else {
    projectsOrSolutions.split(";").forEach(function (project) {
        if (!first)
        {
            buildCommandLines += " ; ";
            first = false;
        }

        buildCommandLines += `msbuild.exe ${analysisArgs}${project}`;
    });
}

var configContent = {
    "fileVersion": "1.11.0",
    "tools": [
     {
      "fileVersion": "1.11.0",
      "tool": {
       "name": "RoslynAnalyzers",
       "version": "1.11.0"
      },
      "arguments": {
       "CopyLogsOnly": false,
       "SourcesDirectory": "$(Folders.SourceRepo)",
       "MSBuildVersion": "16.0",
       "CodeAnalysisAssemblyVersion": "3.8.0",
       "SetupCommandlines": "\\\"$(VisualStudioInstallDirectory)\\Common7\\Tools\\VsMSBuildCmd.bat\\\"",
       "BuildArchitecture": "amd64",
       "BuildCommandlines": buildCommandLines,
       "NetAnalyzersRootDirectory": "$(Packages.Microsoft.CodeAnalysis.NetAnalyzers)",
       "CSharpCodeStyleAnalyzersRootDirectory": "$(Packages.Microsoft.CodeAnalysis.CSharp.CodeStyle)",
       "FxCopAnalyzersRootDirectory": "",
       "RulesetPath": "",
       "SdlRulesetVersion": "",
       "LoggerLevel": "Standard",
       "ForceSuccess": true // Pass force success flag so MSBuild exit code 1 on analyzer errors does not lead to non-graceful failure.
      },
      "outputExtension": "sarif",
      "successfulExitCodes": [
       0
      ]
     }
    ]
};

const actionDirectory = path.resolve(__dirname);
core.debug(`actionDirectory = ${actionDirectory}`);

let data = JSON.stringify(configContent);

let gdnConfigFilePath = path.join(actionDirectory, '../', 'roslynanalyzers.gdnconfig');
core.debug(`gdnConfigFilePath = ${gdnConfigFilePath}`);

try
{
    fs.writeFileSync(gdnConfigFilePath, data);
    data = fs.readFileSync(gdnConfigFilePath, "utf8");
    core.info(data);
}
catch(err)
{
    throw Error(err);
}

let args: string[] = [];
args.push('-c');
args.push(gdnConfigFilePath);

args.push('--no-policy');

// Set logger level to only display warnings and errors
args.push('--logger-level');
args.push('Standard');

if (!warnAsError)
{
    args.push('--not-break-on-detections');
}

core.info("------------------------------------------------------------------------------");
core.info("Installing and running analyzers...");
core.info("Warnings and errors will be displayed once the analysis completes.");

action.run(args);
