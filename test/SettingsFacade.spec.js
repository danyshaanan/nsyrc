'use strict';
var rek = require( 'rekuire' )
var fs = rek( 'fs' )
var SettingsFacade = rek( 'SettingsFacade' )

describe( 'SettingsFacade', function () {
    var settingsFacade
    var settingsFileLocation  = __dirname + '/test.json'

    beforeEach( function () {
        settingsFacade = new SettingsFacade( settingsFileLocation )
    } )

    afterEach( function () {
        try{
            fs.unlinkSync( settingsFileLocation )
        }catch(e){}
    } )

    it( 'should read values', function () {
        var settings = {'mykey': 'myval'}
        fs.writeFileSync( settingsFileLocation , JSON.stringify( settings ) )
        expect( settingsFacade.read( 'mykey' ) ).toEqual( 'myval' )
    } )

    it( 'should write values', function () {
        settingsFacade.write( 'mykey', 'writeval' )
        var settingsContent = fs.readFileSync( settingsFileLocation )
        expect( JSON.parse( settingsContent ).mykey ).toEqual( 'writeval' )
    } )

    it( 'should return "undefined" values if a settings file does not exists', function () {
        expect ( settingsFacade.read( 'mykey' ) ).toBe(undefined)
    } )
} )
