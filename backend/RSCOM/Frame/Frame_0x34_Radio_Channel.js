// Radio Channel SETTINGS

const { StringDecoder } = require('string_decoder');
const Encode = require('../Utils/Encode');
const Tools = require('../Utils/Frame_Tools/Frame_Tools_index');
const nBytesToNumber = require('../Utils/nBytesToNumber');
/*
    * 0x34 : Radio Channel Settings
 */

module.exports =  class Frame_0x34 {
    static build(_message) {
    
        return {
            insertType: 'DirectConsoleData',
            Channel: nBytesToNumber(_message[4])
        };
    }
}