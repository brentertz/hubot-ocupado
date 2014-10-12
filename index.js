// Description:
//   Ocupado bathroom occupancy detector for hubot.
//
// Dependencies:
//   None
//
// Configuration:
//   SPARK_DEVICE_ID
//   SPARK_API_TOKEN
//   <SPARK_API_BASE_URL>
//
// Commands:
//   hubot bano - Returns the bathroom occupancy state (ocupado | desocupado)
//
// Notes:
//   See https://github.com/brentertz/ocupado for more information on ocupado.
//
// Author:
//   brentertz

'use strict';

var SPARK_DEVICE_ID = process.env.SPARK_DEVICE_ID;
var SPARK_API_TOKEN = process.env.SPARK_API_TOKEN;
var SPARK_API_BASE_URL = process.env.SPARK_API_BASE_URL || 'https://api.spark.io';

if (!SPARK_DEVICE_ID || !SPARK_API_TOKEN || !SPARK_API_BASE_URL) {
  console.log('Missing ENV vars for "hubot-ocupado" script.');
  process.exit(1);
}

module.exports = function(robot) {
  robot.respond(/ba(n|ñ)o/i, function(msg) {
    var data;
    var apiStateUrl = SPARK_API_BASE_URL + '/v1/devices/' + SPARK_DEVICE_ID + '/state?access_token=' + SPARK_API_TOKEN;

    robot
      .http(apiStateUrl)
      .header('Accept', 'application/json')
      .get()(function(err, res, body) {
        if (err) {
          return msg.reply('Encountered an error :(' + err);
        }

        if (res.statusCode !== 200) {
          return msg.reply('Request was unsuccessful :(, got ' + res.statusCode);
        }

        if (!(/application\/json/).test(res.headers['content-type'])) {
          return msg.reply('Expected JSON :(, got ' + res.headers['content-type']);
        }

        try {
          data = JSON.parse(body);
        } catch(e) {
          return msg.reply('Unable to parse JSON :(');
        }

        return msg.reply(data.result);
    });
  });
};

