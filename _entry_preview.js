global.__comx_global_exception_function = function(e, promise){
    if(promise) {
        console.log('unhandledRejection:', e, promise);
    }
    else {
//        if(e && e.message) {
//            console.log('uncaughtException:', e.message);
//        }
//        else {
            console.log('uncaughtException:', e);
//        }
    }
};

process.on('uncaughtException', (e)=>{
    __comx_global_exception_function(e);
});

process.on('unhandledRejection',function(err,promise){
    __comx_global_exception_function(err, promise);
});

var fs = require('fs');
var vm = require('vm');
const { execSync } = require('child_process');

initRuntimeEnv();

var dirHome = process.env['COMX_SDK'];
var dirUnit = __dirname + '/';

if(process.platform == 'win32')
{
    require('bindings')('js_ext_comx_qtshell-native-win.node');
    require('bindings')('js_ext_comx_resource-native-win.node');
    require('bindings')('js_ext_comx_mutex-native-win.node');
}

if(process.platform == 'linux')
{
    require('bindings')('js_ext_comx_qt-native-linux.node');
    require('bindings')('js_ext_comx_resource-native-linux.node');
    require('bindings')('js_ext_comx_mutex-native-linux.node');
}

if(process.platform == 'darwin')
{
    require('bindings')('js_ext_comx_qt-native-darwin.node');
    require('bindings')('js_ext_comx_resource-native-darwin.node');
    require('bindings')('js_ext_comx_mutex-native-darwin.node');
}

var require_ = require('require-from-string');
var __ = (_)=>{
    (new vm.Script(_, {filename : 'remote'})).runInNewContext({
	'require' : require,
	'process' : process,
	'comx' : comx,
	'exports' :exports,
	'comx_startup' : ()=>{
	    comx.resource.qt.loadUnit(dirUnit, exports, function(){
		if(process.argv.length >= 4)
                {
                    var is_hide = !process.argv[3];
                    if(is_hide)
                    {
                        unit.form[process.argv[2]].ShowEmbedded();
                    }
                    else
		        unit.form[process.argv[2]].ShowPreview();
                }
		else
                {
                    var is_hide = !process.argv[2];
                    if(is_hide)
                    {
                        unit.form._entry.ShowEmbedded();
                    }
                    else
		        unit.form._entry.ShowPreview();
                }
	    }, (form)=>{
		//readyForm
	    });
	}
    });
};

var tmpl = fs.readFileSync(dirHome+'template/4e7b90182d3b4e11a7ca74d8fc8c545f');
comx.resource.Initialize(require_, __, tmpl);

if(!comx.resource.hasResource)
{
    if(process.argv.length == 4)
    {
	var tmpl = fs.readFileSync(dirHome+'template/008f111453704f82b9616e9bf92655f0');
	comx.resource.LoadKernelRemote(parseInt(process.argv[3]), false, tmpl);
    }
    else
    {
	var tmpl = fs.readFileSync(dirHome+'template/ad72fee60eea4a89844aa934b9bc099b');
	comx.resource.LoadKernelRemote(getWSAddress(), false, tmpl);
    }
}
else
{
    comx.resource.qt.loadUnit(dirUnit, exports, function(){
	if(process.argv.length >= 4)
        {
            var is_hide = !process.argv[3];
            if(is_hide)
            {
                unit.form[process.argv[2]].ShowEmbedded();
            }
            else
	        unit.form[process.argv[2]].ShowPreview();
        }
	else
        {
            var is_hide = !process.argv[2];
            if(is_hide)
            {
                unit.form._entry.ShowEmbedded();
            }
            else
	        unit.form._entry.ShowPreview();
        }
    }, (form)=>{
	//readyForm
    });
}

/////////////////////////////////////////////////////////////////////////////
// Init Runtime Env

function initRuntimeEnv()
{
    process.env.COMX_SDK = getHomeDir().replace(/\\/g, '/');

    if(process.platform == 'win32')
    {
	addPathToEnv(getHomeDir() + 'dependences\\windows\\occt\\7.5\\win64\\vc14\\bin');
	addPathToEnv(getHomeDir() + 'dependences\\windows\\vtk\\8.1\\bin');
	addPathToEnv(getHomeDir() + 'dependences\\windows\\vtk\\9.3\\bin');
    }
    
    var depsDir = getDepsDir();

    if(depsDir)
    {
	process.chdir(depsDir);
    }

    if(process.platform == 'linux')
    {
	const packages = ['occt-7.5.0', 'vtk-8.1', 'vtk-9.3'];
	const hardcodedPaths = ['/usr/lib/x86_64-linux-gnu/'];
	
	configureLdLibraryPath(packages, hardcodedPaths);
    }
}

function getParentDir(dirName)
{
    var idx = dirName.lastIndexOf('/');
    if(idx == -1)
    {
	idx = dirName.lastIndexOf('\\');
    }

    return dirName.substr(0, idx);
}

function getHomeDir()
{
    if(fs.existsSync(__dirname + '/07D976FB68304742A31191AA0503DE79'))
    {
	return __dirname + '/';
    }
    else
    {
    return getParentDir(getParentDir(__dirname)) + '/';
    }
}

function getDepsDir()
{
    if(process.platform == 'win32')
    {
        return getHomeDir() + 'dependences\\windows\\qt\\5.15.2\\msvc2019_64\\bin\\';
    }

    if(process.platform == 'linux' || process.platform == 'darwin')
    {
	return getHomeDir() + 'addon';
    }
    
    return false;
}

function getWSAddress()
{
    var fpath = getHomeDir() + '/cache/ws.cache';

    if(!fs.existsSync(fpath))
    {
	return "ws://localhost:3000";
    }
    else
    {
	return '' + fs.readFileSync(fpath);
    }
}



/**
 * Adds the specified PATH to the environment variable path.
 * @param {string} newPath - New path to add
 * @param {boolean} [prepend=true] - Whether to add the PATH to the beginning of the path (default true)
 * @returns {void}
 */
function addPathToEnv(newPath, prepend = true) {
    if (!newPath || typeof newPath !== 'string') {
        throw new Error('Invalid path: Path must be a non-empty string.');
    }

    // Get the current PATH
    const currentPath = process.env.PATH || '';

    // Check whether the path already exists.
    if (currentPath.includes(newPath)) {
        console.warn(`Path "${newPath}" is already in PATH.`);
        return;
    }

    // Determine the path separator according to the operating system
    const separator = process.platform === 'win32' ? ';' : ':';

    // Add a new path
    process.env.PATH = prepend
        ? `${newPath}${separator}${currentPath}` // Add to the beginning
        : `${currentPath}${separator}${newPath}`; // Add to end

    //console.log(`Updated PATH: ${process.env.PATH}`);
}


/**
 * Extract the library path of pkg-config.
 * @param {string} pkgName - Package name of pkg-config (such as "occt-7.5.0")
 * @returns {string} - The extracted path
 */
function extractLibraryPath(pkgName) {
    try {
        // Call pkg-config to extract the path.
        const command = `pkg-config --libs-only-L ${pkgName} | sed -n 's/^-L//p'`;
        const path = execSync(command, { encoding: 'utf-8' }).trim();
        return path;
    } catch (error) {
        console.error(`Error extracting path for ${pkgName}:`, error.message);
        return null;
    }
}

/**
 * Add path to LD_LIBRARY_PATH
 * @param {string} path - Path to add
 */
function addPathToLdLibraryPath(path) {
    if (path && !process.env.LD_LIBRARY_PATH?.includes(path)) {
        process.env.LD_LIBRARY_PATH = `${path}:${process.env.LD_LIBRARY_PATH || ''}`;
        //console.log(`Added to LD_LIBRARY_PATH: ${path}`);
    } else {
        //console.log(`Path already in LD_LIBRARY_PATH or invalid: ${path}`);
    }
}

/**
 * Configure LD_LIBRARY_PATH
 * @param {string[]} packages - An array of package names that need to extract paths.
 * @param {string[]} hardcodedPaths - Hard-coded path array
 */
function configureLdLibraryPath(packages, hardcodedPaths) {
    // Add a hard-coded path
    hardcodedPaths.forEach(path => {
        addPathToLdLibraryPath(path);
    });

    // Extract and add the package path
    packages.forEach(pkg => {
        const path = extractLibraryPath(pkg);
        if (path) {
            addPathToLdLibraryPath(path);
        }
    });

    //console.log('Updated LD_LIBRARY_PATH:', process.env.LD_LIBRARY_PATH);
}

