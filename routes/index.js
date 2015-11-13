/**
 * Handle routing for apps
 */

var dataSrc = require('./model/data-massage'),
    dataComponents = require('./model/data-components'),
    Q = require('q'),
    minify = require('html-minifier').minify;

//Helper function minify html response
function minifyHTML(html) {
    return minify(html, {
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true
    });
}

exports.index = function(req, res) {
    Q.all(dataComponents.getNREData(req)).then(function(result) {
        var data = dataComponents.generateNREData(result, req);
        //console.log(data);
        //Reference from https://github.com/ericf/express-handlebars/issues/55
        res.render('index', data, function (err, html) {
            if (err) { return next(err); }
            res.send(minifyHTML(html));
        });
    });
};

exports.user = function(req, res) {
    Q.all(dataComponents.getNREUserData(req)).then(function(result) {
        var data = dataComponents.generateNREUserData(result, req);
        //console.log(data);
        res.render('user', data, function (err, html) {
            if (err) { return next(err); }
            res.send(minifyHTML(html));
        });
    });
};

