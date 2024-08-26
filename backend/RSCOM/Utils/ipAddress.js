const os = require('os');

// Function to get the IP address of a specific interface
function getIPAddress(interfaceName) {
  console.log("getIPAddress called with interfaceName:", interfaceName);
  const networkInterfaces = os.networkInterfaces();
  const iface = networkInterfaces[interfaceName];

  if (!iface) {
    return `Interface ${interfaceName} not found`;
  }

  for (let i = 0; i < iface.length; i++) {
    const alias = iface[i];
    if (alias.family === 'IPv4' && !alias.internal) {
      return alias.address;
    }
  }

  return `No IPv4 address found for interface ${interfaceName}`;
}

module.exports = getIPAddress;
