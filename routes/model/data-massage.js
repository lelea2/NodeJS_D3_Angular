/**
 * Helper module handle data massaging
 */

var httpUtil = require('couponscom-http-util'),
    HTTPStatus = httpUtil.HTTPStatus,
    request = require('couponscom-request'),
    util = require('couponscom-util'),
    tokenReplacer = require('couponscom-token-replacer'),
    Q = require('q'),
    URL = require('./URL'),

    DEFAULT_USERID = '769bcf1dbf',
    DEFAULT_ALGO = 'cre',
    DEFAULT_PARTNERID = '14p592d0-c322-11e2-8b8b-0800200c9p69';
    DEFAULT_DAY_COUNT = 8;

module.exports = (function() {

    function getPartnerList(req) {
        return getData(req, 'PARTNERS_LIST');
    }

    function getPartner(req) {
        return getData(req, 'PARTNER');
    }

    function getWeeklyStat(req) {
        return getData(req, 'WEEKLY_STATS');
    }

    function getWeeklyData(req) {
        return getData(req, 'WEEKLY_DATA');
    }

    function getActDrilldn(req) {
        return getData(req, 'WEEKLY_ACT_DRILLDN');
    }

    function getActuDrilldn(req) {
        return getData(req, 'WEEKLY_ACTU_DRILLDN');
    }

    function getUserRecoIds(req) {
        return getData(req, 'USER_RECO_OFFERIDS');
    }

    function getUserRecoMeta(req) {
        return getData(req, 'USER_RECO_OFFERMETA');
    }

    function getPartnerId(req) {
        var partnerId = httpUtil.getQueryValue('p', req);
        if (partnerId === '') {
            return DEFAULT_PARTNERID;
        }
        return partnerId;
    }

    function getUserId(req) {
        var userId = httpUtil.getQueryValue('u', req);
        if (userId === '') {
            return DEFAULT_USERID;
        }
        //return uuid10 version of uuid
        var uuid10 = userId
        if(userId.length > 10 && userId != 'FFFFFFFFFFFF') {
            uuid10 = userId.substring(userId.length, 2);
            uuid10 = userId.substring(0, 8);
        }
        return uuid10;
    }

    function getAlgo(req) {
        var algo = httpUtil.getQueryValue('a', req);
        if (algo === '') {
            return DEFAULT_ALGO;
        }
        return algo;
    }

    function getFinalURL(url, req) {
        return url.replace('{partnerId}', getPartnerId(req))
                  .replace('{userId}', getUserId(req))
                  .replace('{algo}', getAlgo(req))
                  .replace('{daycount}', httpUtil.getQueryValue('daycount', req) || DEFAULT_DAY_COUNT);
    }

    //Helper function to get current partnerId (default walgreen)
    function generateReqBody(req, method) {
        return {
            url: getFinalURL(URL[method], req),
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            timeout: '10000'
        }
    }

    function getData(req, method) {
        var d = Q.defer();
        request(generateReqBody(req, method), function(error, response, body) {
            var result = getReturnObj(error, response, body);
            if (!result.errorCode) {
                d.resolve(result);
            } else {
                d.resolve({});
            }
        });
        return d.promise;
    }

    //Helper function generate default failure response (404 NOT FOUND url)
    function getFailureResp(response) {
        return {
            errorCode: (response && response.statusCode) ? (response.statusCode) : (HTTPStatus.INTERNAL_SERVER_ERROR)
        };
    }

    /**
     * Helper function checking for successful response
     * @method isSuccessfulRESTCall
     */
    function getReturnObj(error, response, body) {
        try {
            if (!error && response && (response.statusCode === HTTPStatus.OK || response.statusCode === HTTPStatus.CREATED )) {
                return JSON.parse(body);
            }
        } catch(ex) { /* istanbul ignore next */
        }
        return (util.isEmptyObj(body)) ? getFailureResp(response) : body;
    }

    return {
        getPartnerList: getPartnerList,
        getPartner: getPartner,
        getWeeklyData: getWeeklyData,
        getWeeklyStat: getWeeklyStat,
        getActDrilldn: getActDrilldn,
        getActuDrilldn: getActuDrilldn,
        getUserRecoIds: getUserRecoIds,
        getUserRecoMeta: getUserRecoMeta,
        getUserId: getUserId
    };


}());
