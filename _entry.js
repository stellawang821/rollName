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

var is_embedded = false;
if(process.argv.length == 3 && process.argv[2] == 'embedded')
{
    is_embedded = true;
}

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
                if(is_embedded)
                    unit.form._entry.ShowEmbedded();
		else if(process.argv.length >= 3)
		    unit.form[process.argv[2]].Show();
		else
		    unit.form._entry.Show();
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
        if(is_embedded)
            unit.form._entry.ShowEmbedded();
	else if(process.argv.length >= 3)
	    unit.form[process.argv[2]].Show();
	else
	    unit.form._entry.Show();
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
 * papend some env variables to PATH
 * @param {string} newPath - new path that will be appended
 * @param {boolean} [prepend=true] - append to the begin of PATH£¨default value is true£©
 * @returns {void}
 */
function addPathToEnv(newPath, prepend = true) {
    if (!newPath || typeof newPath !== 'string') {
        throw new Error('Invalid path: Path must be a non-empty string.');
    }

    // get current PATH
    const currentPath = process.env.PATH || '';

    // check path exists or not
    if (currentPath.includes(newPath)) {
        console.warn(`Path "${newPath}" is already in PATH.`);
        return;
    }

    // get separator char by os type
    const separator = process.platform === 'win32' ? ';' : ':';

    // append to PATH
    process.env.PATH = prepend
        ? `${newPath}${separator}${currentPath}` // append to begin
        : `${currentPath}${separator}${newPath}`; // append to end

    //console.log(`Updated PATH: ${process.env.PATH}`);
}


/**
 * get pkg-config PATH
 * @param {string} pkgName - pkg-config's package name£¨such as "occt-7.5.0"£©
 * @returns {string} - PATH 
 */
function extractLibraryPath(pkgName) {
    try {
        const command = `pkg-config --libs-only-L ${pkgName} | sed -n 's/^-L//p'`;
        const path = execSync(command, { encoding: 'utf-8' }).trim();
        return path;
    } catch (error) {
        console.error(`Error extracting path for ${pkgName}:`, error.message);
        return null;
    }
}

/**
 * append to LD_LIBRARY_PATH
 * @param {string} path - target path
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
 * config LD_LIBRARY_PATH
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

