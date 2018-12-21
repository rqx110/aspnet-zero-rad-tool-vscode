'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "aspnet-zero-power-tool-vscode" is now active!');

    let commandOutput = vscode.window.createOutputChannel('Shell');
    context.subscriptions.push(commandOutput);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.runRadTool', (uri) => {
        commandOutput.show();
        commandOutput.appendLine('-> code generation is begining...');
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