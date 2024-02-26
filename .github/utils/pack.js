var fs = require('fs');
var child_process = require('child_process');
var generateEvb = require('generate-evb');

// Function to parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        evbCliPath: './.github/utils/enigmavbconsole.exe',
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
child_process.execFile(options.evbCliPath, [options.projectName], function (err, stdout, stderr) {
    var success = false;
    if (!err) {
        // Sanity check (change this to what works for you):
        // Check if the output file exists and if it's bigger than the input file
        if (fs.existsSync(options.outputExe)) {
            success = fs.statSync(options.outputExe).size > fs.statSync(options.inputExe).size;
        }

        if (!success) {
            err = new Error('Failed to pack EVB project!\nEVB stdout:\n' + stdout + '\nEVB stderr:\n' + stderr);
        }
    }
    if (err) {
        throw err;
    }
});
