var moment = require('moment-timezone');

function is(value, type) {
  return typeof value === type;
}

function getIntOrString(value) {
  return isNaN(parseInt(value)) ? value : parseInt(value);
}

function getOutputTimezoneOrOffset(msg, config) {
  if ((is(msg.outTimezone, 'string') && msg.outTimezone.length > 0) ||
      (is(msg.outTimezone, 'number') && !isNaN(msg.outTimezone))) {

    return getIntOrString(msg.outTimezone);
  }

  if (is(config.outTimezone, 'string') && config.outTimezone.length > 0 ||
     (is(config.outTimezone, 'number') && !isNaN(config.outTimezone))) {

    return getIntOrString(config.outTimezone);
  }

  return 0;
}

module.exports = function(RED) {
  function FormatDateTimeNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.on('input', function(msg) {
      var usedTzOrOffset = getOutputTimezoneOrOffset(msg, config);
      var shouldOffset = is(usedTzOrOffset, 'number');
      var usedFormat = config.format || ''; 

      var output;
      if (shouldOffset) {
        output = moment(msg.payload).utcOffset(usedTzOrOffset).format(usedFormat);
      } else {
        output = moment(msg.payload).tz(usedTzOrOffset).format(usedFormat);
      }

      msg.payload = output;

      node.send(msg);
    });
  }

  RED.nodes.registerType('format-datetime', FormatDateTimeNode);
}