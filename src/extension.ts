'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';
import * as AdmZip from 'adm-zip';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let commandOutput = vscode.window.createOutputChannel('Shell');
    context.subscriptions.push(commandOutput);

    let disposable = vscode.commands.registerCommand('extension.runRadTool', (uri: vscode.Uri) => {
        commandOutput.show();
        commandOutput.appendLine('-> code generation is begining...');

        // unzip AspNetZeroRadTool.zip to folder
        let zip = new AdmZip(path.join(__dirname, '..','resources/AspNetZeroRadTool.zip'));
        zip.extractAllTo(/*target path*/path.join(path.dirname(uri.fsPath), '..'), /*overwrite*/true);

        // run rad tool
        let process = spawn('dotnet.exe', ['AspNetZeroRadTool.dll', path.basename(uri.fsPath)], {cwd: path.dirname(uri.fsPath), shell: true});
        function printOutput(data:any) { 
            commandOutput.append(data.toString()); 
            process.stdin.write('\x0D');
        }
        process.stdout.on('data', printOutput);
        process.stderr.on('data', printOutput);
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}