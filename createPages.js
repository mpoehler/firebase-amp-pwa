const pug = require('pug');
const fs = require('fs');
const shell = require('shelljs');
const pagedata = require('./data/data.json');
const chokidar = require('chokidar');

async function renderPage(page, config) {

    console.log('render page ' + page.url);

    // get template
    var options = {
        filters: {
            'removeXmlDocType': function(text, options) {
                // removes xml and doctype, typically used to import SVGs
                return text.replace(/<\?.*\?>/g,"").replace(/<!DOCTYPE[^>]*>/g, "");
            }
        }
    };
    const template = pug.compileFile('pug/' + page.template + '.pug', options);

    // get resultfile
    let resultfile = page.url;
    if (page.resultfile) {
        resultfile = page.resultfile;
    }

    // render template
    page.config = config; // add common block as config to page
    const resultpage = template(page);

    // create needed directories
    const resultpath = resultfile.substring(0, resultfile.lastIndexOf('/') + 1);
    shell.mkdir('-p', "./public" + resultpath);

    // write file
    fs.writeFile("./public" + resultfile, resultpage, (err) => {
        if (err) {
            return console.log(err);
        }
    });
};


// decide mode here
var args = process.argv.slice(2);
if (args.length > 0 && args[0] === '--watch') {
    console.log('entering watch mode');
    chokidar.watch('./pug').on('all', (event, path) => {
        console.log(event, path);
    });
} else {
    (async () => {
        for (var i = 0; i < pagedata.pages.length; i++) {
            await renderPage(pagedata.pages[i], pagedata.common);
        };
    })();
}
