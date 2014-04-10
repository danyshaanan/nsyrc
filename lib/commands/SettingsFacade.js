'use strict';

var rek = require('rekuire');
var fs = rek('fs');


function SettingsFacade ( location ) {
    this._location = location;
}

SettingsFacade.prototype.read = function ( key ) {
    if (fs.existsSync(this._location)){
        var data = fs.readFileSync(this._location);
        var settings = JSON.parse(data);
        return settings[key];
    }else{
        return undefined;
    }
};

SettingsFacade.prototype.write = function ( key, val ) {
    var settings = {};
    if (fs.existsSync(this._location)){
        var data = fs.readFileSync(this._location);
        settings = JSON.parse(data);
    }
    settings[key] = val;
    fs.writeFileSync(this._location, JSON.stringify(settings, null, 2));
};

module.exports = SettingsFacade;
