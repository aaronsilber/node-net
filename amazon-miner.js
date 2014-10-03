/**
 * Intial commit by aaronsilber on 10/2/14.
 *
 * example usage:
 * var miner = require('./amazon-miner.js');
 * miner('B004TSK9TG', function(arr){ console.log(arr); });
 *
 * returns null if page has no available "frequently bought together" links
 * returns an array with 2-3 other ID's corresponding to the "fbt" items
 */

var http = require('http');
var matches = []; //internal storage for matched itemId's

module.exports = function(itemId, callback) {
    function chunkReceived(chunk) {
        //regex to match "frequently bought together" links, and store ID in a backreference
        var regex = /(?:fbt_[yz]_img\">\s*<a href=\").+dp\/([A-Z0-9]+)\/[a-z0-9\/=_-]+\"/g;

        //execute the regex
        var match = regex.exec(chunk);

        //iterate through matches
        while (match != null) {
            //append matched ID to storage array
            matches.push(match[1]);

            //next match
            match = regex.exec(chunk);
        }
    }
    function ended() {
        //execute the callback provided for us when module was called
        callback(matches);
    }


    // perform an HTTP GET request on the itemId, sets options, and wires event listeners
    // for data chunks and connection endings.
    http.get({ host: 'www.amazon.com', path: '/dp/'+itemId+'/?ref=xyz' }, function(res) {
        res.setEncoding('utf8');
        res.on('data', chunkReceived);
        res.on('end',ended); });
};