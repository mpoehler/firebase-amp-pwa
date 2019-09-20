const pug = require('pug');
const fs = require('fs');
const shell = require('shelljs');
const pagedata = require('./data/data.json');

async function renderPage(page, config) {

    console.log('render page ' + page.url);

    // get template
    const template = pug.compileFile('pug/' + page.template + '.pug');

    // get resultfile
    let resultfile = page.url;
    if (page.resultfile) {
        resultfile = page.resultfile;
    }
    
    // render template
    page.config = config; // add common block as config to page
    const resultpage = template(page);

    // create needed directories
    const resultpath = resultfile.substring(0, resultfile.lastIndexOf('/')+1);
    shell.mkdir('-p', "./public" + resultpath);

    // write file
    fs.writeFile("./public" + resultfile, resultpage, (err) => {
        if (err) {
            return console.log(err);
        }
    });
};

(async () => {
    for (var i = 0; i < pagedata.pages.length; i++) {
        await renderPage(pagedata.pages[i], pagedata.common);
    };
})();