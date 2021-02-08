import * as core from '@actions/core';
import { MscaAction } from './msca-toolkit/msca-toolkit';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { stringify } from 'querystring';

function getAnalysisLevelArgumentFromInput(analysisLevelName: string): string {
    let analysisLevelInput = core.getInput(analysisLevelName.toLowerCase());
    if (action.isNullOrWhiteSpace(analysisLevelInput)) {
        return;
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
    if (analysisLevelName == 'analysis-level') {
        newArg = `/p:AnalysisLevel=${analysisLevel} /p:AnalysisMode=${analysisMode}`;
    }
    else {
        newArg = `/p:AnalysisLevel${analysisLevelName}=${analysisLevel} /p:AnalysisMode${analysisLevelName}=${analysisMode}`;
    }

    return analysisArgs + newArg;
}

let action = new MscaAction();

// Process core analysis-level
let analysisArgs = getAnalysisLevelArgumentFromInput('analysis-level');

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

let projects = core.getInput('projects');
if (action.isNullOrWhiteSpace(projects)) {
    core.setFailed("'projects' must be non-empty");
}

var buildCommandLines:string = "";
var first = true;
projects.split(";").forEach(function (project) {
    if (!first)
    {
        buildCommandLines += " ; ";
        first = false;
    }

    buildCommandLines +=`msbuild.exe ${analysisArgs}${project}`;
});

var configContent = {
    "fileVersion": "1.7.0.3",
    "tools": [
     {
      "fileVersion": "1.7.0.3",
      "tool": {
       "name": "RoslynAnalyzers",
       "version": "1.7.0.3"
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
       "LoggerLevel": "Standard"
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

// Use the local policy file
const policyFilePath = path.resolve(path.join(actionDirectory, '../', 'policy', 'github.gdnpolicy'));
core.debug(`policyFilePath = ${policyFilePath}`);

args.push('--policy-file-path');
args.push(policyFilePath);

action.run(args);
