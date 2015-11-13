/** Create data components per response **/

var dataSrc = require('./data-massage');

module.exports = (function() {

    function getNREData(req) {
        return [
            dataSrc.getPartnerList(req),
            dataSrc.getPartner(req),
            dataSrc.getWeeklyStat(req),
            dataSrc.getActDrilldn(req),
            dataSrc.getActuDrilldn(req)
        ];
    }

    function getNREUserData(req) {
        return [
            dataSrc.getUserRecoIds(req),
            dataSrc.getUserRecoMeta(req)
        ];
    }

    function generateNREData(result, req) {
        try {
            return {
                partners: result[0].response.docs,
                partnerData: result[1].response.docs[0],
                weeklyStats: result[2].stats.stats_fields,
                perfStats: result[2].response.docs,
                actDrilldn: result[3].response.docs,
                actuDrilldn: result[4].response.docs
            };
        } catch(ex) {
            console.log(ex);
        }
    }

    function generateNREUserData(result, req) {
        try {
            var docs = result[0].response.docs,
                offerMeta = result[1].grouped.offerid.groups,
                offerids = [],
                recos = [],
                idx,
                partnerid;
            for(var i=0; i < docs.length; i++) {
                partnerid = docs[i]['partnerid'];
                offerids.push(docs[i]['offerid']);
            }
            for(var j=0; j < offerMeta.length; j++) {
                idx = offerids.indexOf(offerMeta[j]['groupValue']);
                if(idx >= 0 && offerMeta[j]['doclist']['docs'].length) {
                    recos[idx]= offerMeta[j]['doclist']['docs'][0];
                }
            }
            return {
                'partnerid' : partnerid,
                'userid' : dataSrc.getUserId(req),
                'recos': recos
            };
        } catch(ex) {
            console.log(ex);
        }
    }

    return {
        getNREData: getNREData,
        generateNREData: generateNREData,
        getNREUserData: getNREUserData,
        generateNREUserData: generateNREUserData
    };
}());
