//Define set of URL for data endpoints


module.exports = {
    PARTNERS_LIST: 'http://{host}/search/partnermeta/select?q=*:*&rows=100&fl=partnerid,+partnername&wt=json',
    PARTNER: 'http://{host}/search/partnermeta/select?q=partnerid:{partnerId}&rows=1&wt=json&indent=true',
    WEEKLY_STATS: 'http://{host}/search/partnerperf_daily/select?q=created:[NOW-{daycount}DAY%20TO%20NOW-1DAY]&fq=partnerid:{partnerId}&rows=100&wt=json&indent=true&stats=true&stats.field=activeusers&stats.field=riqredemptions&stats.field=riqactivations&sort=created%20asc&fl=riqactivations,riqredemptions,activeusers,created,partnerid',
    WEEKLY_DATA: 'http://{host}/search/partnerperf_daily/select?q=created:[NOW-{daycount}DAY TO *]&fq=partnerid:{partnerId}&rows=100&wt=json&indent=true&stats=true&stats.field=activeusers&stats.field=riqredemptions&stats.field=riqactivations&sort=created asc',
    WEEKLY_BUCKET_PERF : 'http://{host}/search/nreperf_daily/select?q=created:[NOW-{daycount}DAY%20TO%20NOW]&fq=partnerid:{partnerid}&rows=100&wt=json&indent=true&sort=created%20asc&fl=partnerid,%20created,nre:div(nreactivations,nreactivators),cre:div(creactivations,creactivators),mre:div(mreactivations,mreactivators),def:div(defactivations,defactivators)',
    WEEKLY_ACT_DRILLDN : 'http://{host}/search/nreperf_daily/select?q=created:[NOW-{daycount}DAY%20TO%20NOW]&fq=partnerid:{partnerId}&rows=100&wt=json&indent=true&sort=created%20asc&fl=partnerid,%20created,%20nreactivations,creactivations,%20mreactivations,%20defactivations',
    WEEKLY_ACTU_DRILLDN : 'http://{host}/search/nreperf_daily/select?q=created:[NOW-{daycount}DAY%20TO%20NOW]&fq=partnerid:{partnerId}&rows=100&wt=json&indent=true&sort=created%20asc&fl=partnerid,%20created,%20nreactivators,%20creactivators,%20mreactivators,%20defactivators',
    USER_RECO_OFFERIDS: 'http://{host}/search/userrecoms/select?q=*%3A*&fq=userid%3A+{userId}&fq=bucketid%3A%22{algo}%22&sort=rank+asc&rows=1000&fl=offerid,partnerid&wt=json&indent=true',
    USER_RECO_OFFERMETA: 'http://{host}/search/offersmeta/select?q=*:*&fq=%7B!join%20from=offerid%20to=offerid%20fromIndex=userrecoms%7Duserid:{userId}&wt=json&fl=offerimage1,offerid,offerdescription,offersummary,offervalue&group=true&group.field=offerid&rows=1000'
};
