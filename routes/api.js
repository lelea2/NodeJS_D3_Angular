/*
 * Serve JSON to our AngularJS client
 */

var dataComponents = require('./model/data-components'),
    httpUtil = require('couponscom-http-util'),
    HTTPStatus = httpUtil.HTTPStatus,
    Q = require('q');

exports.activationData = function (req, res) {
    Q.all(dataComponents.getNREData(req)).then(function(result) {
        res.status(HTTPStatus.OK).json(dataComponents.generateNREData(result));
    }, function(err) {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).end();
    });
};
