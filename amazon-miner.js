/**
 * Created by silbernetic on 10/2/14.
 */

var http = require('http');
var matches = [];

module.exports = function(itemId, callback) {
    function chunkReceived(chunk) {
        // /fbt_[yz]_img\">\s*<a href=\".+dp\/([A-Z0-9]+)\/ref=[a-z0-9_]+\"/
        var regex = /(?:fbt_[yz]_img\">\s*<a href=\").+dp\/([A-Z0-9]+)\/[a-z0-9\/=_-]+\"/g;
        var match = regex.exec(chunk);
        while (match != null) {
            matches.push(match[1]);
            //console.log(match[1] + " added to matches list");
            match = regex.exec(chunk);
        }
        //console.log(body);
    }
    function ended() {
        console.log("time to call the callback");
        callback(matches);
    }


    //schedule a network request to pull the page
    http.get({ host: 'www.amazon.com', path: '/dp/'+itemId+'/?ref=research' }, function(res) {
        res.setEncoding('utf8');
        res.on('data', chunkReceived);
        res.on('end',ended); });
};