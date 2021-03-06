
var fs = require('fs');
var outputHome = './live-demo/'
var demoHome = getDemoHome();
var template = getTemplate();

if (fs.existsSync(outputHome)) {
    console.error("ERROR: remove output dir and try again: " + outputHome);
    process.exit(1);
}

if (process.argv.length > 2) {
    var dir = demoHome + process.argv[2];
    if (!dir.match(/[\\/]$/)) {
        dir += '/';
    }
    makePlunker(dir);
} else {
    makeAllPlunkers(demoHome);
}

function makeAllPlunkers(demoHome) {
    var demoSetFolders = fs.readdirSync(demoHome);
    demoSetFolders.forEach(demoFolder => {
        var pathname = demoHome + demoFolder;
        var stat = fs.lstatSync(pathname);
        if (stat.isDirectory()) {
            processDemoSet(pathname + '/');
        }
    });
}

function processDemoSet(demoSetFolder) {
    var demoFolders = fs.readdirSync(demoSetFolder);
    demoFolders.forEach(demoFolder => {
        var pathname = demoSetFolder + demoFolder;
        var stat = fs.lstatSync(pathname);
        if (stat.isDirectory()) {
            makePlunker(pathname + '/');
        }
    });
}

function makePlunker(demoFolder) {
    console.log('make plunker for ' + demoFolder);
    var content = [];
    var mockDatas = [];
    readDemoContent(content, demoFolder);
    var compContentIndex = -1;
    var moduleContentIndex = -1;
    content.forEach((item, idx) => {
        item.path = 'app/' + item.path.substring(demoFolder.length);
        if (item.path.match(/.+\.ts$/i)) {
            item.code = fixImport(item.code);
            item.code = fixTemplateUrl(item.code);
            item.code = fixStyleUrls(item.code);
            item.code = fixCodeForDemoOnly(item.code);
            findMockDatas(item.code).forEach(mockData => mockDatas.push(mockData));
        }
        if (item.path == 'app/app.component.ts') {
            compContentIndex = idx;
        } else if (item.path == 'app/app.module.ts') {
            moduleContentIndex = idx;
        }
    });
    if (compContentIndex == -1) {
        console.error('ERROR: need this file: ' + demoFolder + 'app.module.ts');
        process.exit(100);
    }
    if (moduleContentIndex == -1) {
        console.error('ERROR: need this file: ' + demoFolder + 'app.component.ts');
        process.exit(100);
    }

    var moduleItem = content[moduleContentIndex];
    moduleItem.code = fixAppModuleTs(moduleItem.code);
    var compItem = content[compContentIndex];
    compItem.code = fixAppComponentTs(compItem.code, moduleItem.code);

    mockDatas.forEach(mockData => content.push(mockData));

    content.push(getIndexHtml());
    content.push(getMainTs());
    content.push(getSystemJsConfig());
    content.push(getSystemJsAngularLoader());

    var html = '';
    content.forEach(item => {
        var path = item.path;
        item.code = escapeCode(item.code);
        html += `<input type="hidden" name="entries[${path}][encoding]" value="utf8" />\n`;
        html += `<input type="hidden" name="entries[${path}][content]" value="${item.code}" />\n`;
    });

    var plunker = template
        .replace('<!-- replace-by-content -->', html)
        .replace('<!-- replace-by-title -->', demoFolder.substring(demoHome.length, demoFolder.length-1));

    var saveTo = outputHome + demoFolder.substring(demoHome.length);
    makeDirs(saveTo);
    saveTo += 'plunker.embed.html';
    fs.writeFileSync(saveTo, plunker);
}

function readDemoContent(content, demoFolder) {
    var demoFiles = fs.readdirSync(demoFolder);
    demoFiles.forEach(demoFile => {
        var pathname = demoFolder + demoFile;
        var stat = fs.lstatSync(pathname);
        if (stat.isDirectory()) {
            readDemoContent(content, pathname + '/');
        } else {
            content.push({path: pathname, code: readCode(pathname)});
        }
    });
}

function fixTemplateUrl(code) {
    return code.replace(/\btemplateUrl\s*:\s*['"]\s*(.*?)\s*['"]/g, (found, templateUrl) => {
        if (templateUrl.substring(0, 2) !== './') {
            templateUrl = './' + templateUrl;
        }
        return 'templateUrl: "' + templateUrl + '"';
    });
}

function fixStyleUrls(code) {
    return code.replace(/\bstyleUrls\s*:\s*(\[[\s\S]*?\])/g, (found, urlString) => {
        var urls = eval(urlString);
        urls = urls.map(url => {
            if (url.substring(0, 2) !== './') {
                url = './' + url;
            }
            return url;
        });
        return 'styleUrls: ["' + urls.join('", "') + '"]';
    });
}

function fixImport(code) {
    var jigsawImports = [];
    var rawImports = [];
    while (true) {
        var match = code.match(/\bimport\s+\{([\s\S]+?)\}\s+from\s+['"](.+?)['"]/);
        if (!match) {
            break;
        }
        if (match[2].match(/jigsaw\/.+?/)) {
            var importString = match[1];
            var imports = importString.split(/,/g).map(item => item.trim());
            imports.forEach(item => jigsawImports.push(item));
        } else {
            rawImports.push(match[0]);
        }
        code = code.substring(match.index + match[0].length);
    }
    jigsawImports = jigsawImports.sort((a, b) => a.localeCompare(b));

    var jigsawImportString = '';
    if (jigsawImports.length > 0) {
        jigsawImportString = 'import {\n';
        for(var i = 0, len = jigsawImports.length; i < len; i += 3) {
           jigsawImportString += '    ' + jigsawImports.slice(i, i+3).join(', ') + ',\n';
        }
        jigsawImportString += '} from "@rdkmaster/jigsaw";';
    }

    return jigsawImportString + '\n' + rawImports.join(';\n') + code;
}

function fixCodeForDemoOnly(code) {
    return code.replace(/\/\* #for-live-demo-only#([\s\S]*?)\*\//g, (found, codeForDemo) => codeForDemo.trim());
}

function findMockDatas(code) {
    var ret = [];
    var match = code.match(/mock-data\/.*?['"]/g);
    if (!match) {
        return ret;
    }
    var map = {};
    match.forEach(path => {
        path = path.substring(0, path.length-1);
        map[path] = readCode(`${demoHome}/../../${path}`);
    });
    for (var path in map) {
        ret.push({path: path, code: map[path]})
    }
    return ret;
}

function fixAppComponentTs(compCode, moduleCode) {
    var match = moduleCode.match(/bootstrap\s*:\s*\[\s*(\w+?)\s*\]/);
    if (!match) {
        console.error('ERROR: need bootstrap property in the app.module.ts, the code is:\n' + moduleCode);
        process.exit(200);
    }

    var mainComp = match[1];
    return compCode.replace(/@Component\s*\(\s*\{([\s\S]*?)\}\s*\)[\s\S]*?export\s+class\s+(\w+?)\b/g,
        (found, props, className) => {
            if (className != mainComp) {
                return found;
            }
            if (found.match(/selector\s*:/)) {
                console.error('ERROR: more than one "selector" appears, remove the "selector" property, ' +
                    'the code is:\n' + found);
                process.exit(201);
            }
            return found.replace(/@Component\s*\(\s*\{/, '@Component({\n    selector: "jigsaw-live-demo",');
        });
}

function fixAppModuleTs(appModuleCode) {
    appModuleCode = "import {BrowserModule} from '@angular/platform-browser';\n" +
        "import {BrowserAnimationsModule} from '@angular/platform-browser/animations';\n" +
        "import {HttpModule} from '@angular/http';\n" +
        appModuleCode.replace(/export\s+class\s+(.+?)\s*{/, 'export class AppModule {');

    var match = appModuleCode.match(/\bimports\s*:\s*\[([\s\S]*?)\]/);
    if (!match) {
        return appModuleCode;
    }

    return appModuleCode.replace(/\bimports\s*:\s*\[([\s\S]*?)\]/, (found, importString) => {
        return `

    imports: [
        BrowserModule, BrowserAnimationsModule, HttpModule,
        ${importString.trim()}
    ]`.trim();

    });
}

function escapeCode(code) {
    return code.replace(/</g, '&lt;').replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

function makeDirs(path) {
    var pathPartials = path.split(/[/\\]/g);
    for(var i = 1; i < pathPartials.length; i++) {
        var arr = pathPartials.slice(0, i);
        var p = arr.join('/');
        if (fs.existsSync(p)) {
            continue;
        }
        fs.mkdirSync(p, 755);
    }
}

function readCode(path) {
    return fs.readFileSync(path).toString();
}

function getDemoHome() {
    var pathPartials = __dirname.split(/[/\\]/g);
    pathPartials.pop();
    pathPartials.pop();
    var demoHome = pathPartials.join('/') + '/src/app/demo/';
    return demoHome;
}

function getTemplate() {
    return fs.readFileSync('./demo-independent-templates/plunker.embed.template.html').toString();
}

function getIndexHtml() {
    return {
        path: 'index.html',
        code: readCode('./demo-independent-templates/index.html')
    }
}

function getMainTs() {
    return {
        path: 'main.ts',
        code: readCode('./demo-independent-templates/main.ts')
    }
}

function getSystemJsAngularLoader() {
    return {
        path: 'systemjs-angular-loader.js',
        code: readCode('./demo-independent-templates/systemjs-angular-loader.js')
    }
}

function getSystemJsConfig() {
    return {
        path: 'systemjs.config.js',
        code: readCode('./demo-independent-templates/systemjs.config.js')
    }
}
