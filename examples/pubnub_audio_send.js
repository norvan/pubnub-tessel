// Generated by CoffeeScript 1.7.1
(function() {
  var audio, audiolib, channel, chunks, fs, tessel, uuid;

  fs = require('fs');

  tessel = require('tessel');

  audiolib = require('audio-vs1053b');

  audio = audiolib.use(tessel.port['B']);

  channel = process.argv[2];

  uuid = tessel.deviceId();

  console.log("channel", channel);

  console.log("uuid", uuid);

  chunks = [];

  audio.on('ready', function() {
    var PUBNUB;
    PUBNUB = require("pubnub").init({
      publish_key: "demo",
      subscribe_key: "demo",
      uuid: uuid
    });
    return audio.setInput('mic', function(err) {
      chunks = [];
      audio.on('data', function(data) {
        return chunks.push(data);
      });
      return audio.startRecording('voice', function(err) {
        console.log('start recording');
        return setTimeout(function() {
          return audio.stopRecording(function(err) {
            var chunk_str;
            console.log('stop recording');
            chunk_str = Buffer.concat(chunks).toString('hex');
            console.log('got audio data', chunk_str);
            return PUBNUB.publish({
              channel: channel,
              message: {
                audio: chunk_str
              }
            });
          });
        }, 1000);
      });
    });
  });

  audio.on('error', function(err) {
    throw err;
  });

}).call(this);
