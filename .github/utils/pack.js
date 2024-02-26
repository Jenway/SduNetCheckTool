import { existsSync, statSync } from 'fs';
import { execFile } from 'child_process';
import generateEvb from 'generate-evb';

// Function to parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        evbCliPath: 'enigmavbconsole.exe',
        projectName: 'SDUNetCheckTool.evb',
        inputExe: 'SduNetCheckTool.GUI/bin/x64/Release/SduNetCheckTool.GUI.exe',
        outputExe: 'build/SduNetCheckTool.GUI_boxed.exe',
        path2Pack: 'SduNetCheckTool.GUI/bin/x64/Release'
    };

    args.forEach((arg, index) => {
        switch (arg) {
            case '-evbCliPath':
                options.evbCliPath = args[index + 1];
                break;
            case '-projectName':
                options.projectName = args[index + 1];
                break;
            case '-inputExe':
                options.inputExe = args[index + 1];
                break;
            case '-outputExe':
                options.outputExe = args[index + 1];
                break;
            case '-path2Pack':
                options.path2Pack = args[index + 1];
                break;
            default:
                break;
        }
    });

    return options;
}

// Parse command line arguments
const options = parseArgs();

// Generate EVB
generateEvb(options.projectName, options.inputExe, options.outputExe, options.path2Pack);

// Execute EVB CLI
execFile(options.evbCliPath, [options.projectName], function (err, stdout, stderr) {
    let success = false;
    if (!err) {
        // Sanity check: Check if the output file exists and if it's bigger than the input file
        if (existsSync(options.outputExe)) {
            success = statSync(options.outputExe).size > statSync(options.inputExe).size;
        }

        if (!success) {
            err = new Error(`Failed to pack EVB project!\nEVB stdout:\n${stdout}\nEVB stderr:\n${stderr}`);
        }
    }
    if (err) {
        throw err;
    }
});
