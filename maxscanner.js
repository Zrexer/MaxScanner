const net = require('net');
const switchs = process.argv;
//const clc = require('../../__python__/cClass/colors');
const clc = require('./colors')
const dns = require('dns');
const time = new Date();

function getHostByName(domain, callback) {
    dns.lookup(domain, (err, addr, fam) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, addr);
        }
    });
}

const pos = (_) => {
    console.log(clc.white('[') + clc.green(' + ') + clc.white(']') + clc.white(' [') + clc.green(`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`) + clc.white(']') + ` ${_}`);
}

const neg = (_) => {
    console.log(clc.white('[') + clc.red(' - ') + clc.white(']') + clc.white(' [') + clc.green(`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`) + clc.white(']') + ` ${_}`);
}

const action = (_) => {
    console.log(clc.white('[') + clc.blue(' * ') + clc.white(']') + clc.white(' [') + clc.green(`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`) + clc.white(']') + ` ${_}`);
}


function scanPort(host, port) {
  const socket = new net.Socket();

  socket.setTimeout(2000);
  socket.on('connect', () => {
    pos(`${clc.yellow(host)}${clc.red(':')}${clc.yellow(port)} ${clc.red('open')}`)
    socket.destroy();
  });

  socket.on('timeout', () => {
    neg(`${clc.blue(host)}${clc.red(':')}${clc.blue(port)} ${clc.bgBlue('closed')}`)
    socket.destroy();
  });

  socket.on('error', (error) => {
    console.log(`Error occurred while scanning port ${port} on ${host}: ${error.message}`);
    socket.destroy();
  });

  socket.connect(port, host);
}

function scanPortHider(host, port) {
    const socket = new net.Socket();
  
    socket.setTimeout(2000);
    socket.on('connect', () => {
      pos(`${clc.yellow(host)}${clc.red(':')}${clc.yellow(port)} ${clc.red('open')}`)
      socket.destroy();
    });
  
    socket.on('timeout', () => {
      //neg(`${clc.blue(host)}${clc.red(':')}${clc.blue(port)} ${clc.bgBlue('closed')}`)
      socket.destroy();
    });
  
    socket.on('error', (error) => {
      console.log(`Error occurred while scanning port ${port} on ${host}: ${error.message}`);
      socket.destroy();
    });
  
    socket.connect(port, host);
  }

function scanPorts(host, startPort, endPort) {
  for (let port = startPort; port <= endPort; port++) {
    scanPort(host, port);
  }
}

function scanPortsHider(host, startPort, endPort) {
    for (let port = startPort; port <= endPort; port++) {
      scanPortHider(host, port);
    }
  }

const host = '127.0.0.1';
const startPort = 1;
const endPort = 1000;

if (switchs.includes('--host') && !switchs.includes('--hide')){
    const hostx = switchs[switchs.indexOf('--host')+1];

    if (hostx === undefined){
        neg(`Please set a ${clc.red('host ip')} after " --host "`);
    }else{
        if (switchs.includes('--sp')){
            pos(`Searching for starter port ${clc.red("=>")} --sp`);
            const sp = switchs[switchs.indexOf('--sp')+1];
            if (sp === undefined){
                neg(`${clc.red('Cannot')} find starter port`);
                pos(`${clc.bgGreen("Continue")} With Default: ${clc.red(startPort)}`);
                if (switchs.includes('--ep')){
                    pos(`Searching for end port ${clc.red("=>")} --ep`);
                    const ep = switchs[switchs.indexOf('--ep')+1];
                    if (ep === undefined){
                        neg(`${clc.red('Cannot')} find end port`);
                        pos(`${clc.bgGreen("Continue")} With Default: ${clc.red(endPort)}`);
                        action('Start scan');
                        console.log();
                        scanPorts(hostx, startPort, endPort);
                    }else{
                        pos(`End port: ${clc.red(ep)}`);
                        action('Start scan');
                        console.log();
                        scanPorts(hostx, startPort, ep);
                    }   
                }else{
                    action('Start scan with Default Values');
                    console.log();
                    scanPorts(hostx, startPort, endPort);
                }  
            }else{
                pos(`Starter port: ${clc.red(sp)}`);
                if (switchs.includes('--ep')){
                    pos(`Searching for end port ${clc.red("=>")} --ep`);
                    const ep2 = switchs[switchs.indexOf('--ep')+1];
                    if (ep2 === undefined){
                        neg(`${clc.red('Cannot')} find end port`);
                        pos(`${clc.bgGreen("Continue")} With Default: ${clc.red(endPort)}`);
                        action('Start scan');
                        console.log();
                        scanPorts(hostx, startPort, endPort);
                    }else{
                        pos(`End port: ${clc.red(ep2)}`);
                        action('Start scan');
                        console.log();
                        scanPorts(hostx, startPort, ep2);
                    }   
                }else{
                    action('Start scan with Default Values');
                    console.log();
                    scanPorts(hostx, startPort, endPort);
                }  
            }
        }else{
            if (switchs.includes('--ep')){
                pos(`Searching for end port ${clc.red("=>")} --ep`);
                const ep3 = switchs[switchs.indexOf('--ep')+1];
                if (ep3 === undefined){
                    neg(`${clc.red('Cannot')} find end port`);
                    pos(`${clc.bgGreen("Continue")} With Default: ${clc.red(endPort)}`);
                    action('Start scan');
                    console.log();
                    scanPorts(hostx, startPort, endPort);
                }else{
                    pos(`End port: ${clc.red(ep3)}`);
                    action('Start scan');
                    console.log();
                    scanPorts(hostx, startPort, ep3);
                }   
            }else{
                action('Start scan with Default Values');
                console.log();
                scanPorts(hostx, startPort, endPort);
            }  
        }
    }
}

// hide close ports
if (switchs.includes('--host') && switchs.includes('--hide')){
    const hostx = switchs[switchs.indexOf('--host')+1];

    if (hostx === undefined){
        neg(`Please set a ${clc.red('host ip')} after " --host "`);
    }else{
        if (switchs.includes('--sp')){
            pos(`Searching for starter port ${clc.red("=>")} --sp`);
            const sp = switchs[switchs.indexOf('--sp')+1];
            if (sp === undefined){
                neg(`${clc.red('Cannot')} find starter port`);
                pos(`${clc.bgGreen("Continue")} With Default: ${clc.red(startPort)}`);
                if (switchs.includes('--ep')){
                    pos(`Searching for end port ${clc.red("=>")} --ep`);
                    const ep = switchs[switchs.indexOf('--ep')+1];
                    if (ep === undefined){
                        neg(`${clc.red('Cannot')} find end port`);
                        pos(`${clc.bgGreen("Continue")} With Default: ${clc.red(endPort)}`);
                        action('Start scan');
                        console.log();
                        scanPortsHider(hostx, startPort, endPort);
                    }else{
                        pos(`End port: ${clc.red(ep)}`);
                        action('Start scan');
                        console.log();
                        scanPortsHider(hostx, startPort, ep);
                    }   
                }else{
                    action('Start scan with Default Values');
                    console.log();
                    scanPortsHider(hostx, startPort, endPort);
                }  
            }else{
                pos(`Starter port: ${clc.red(sp)}`);
                if (switchs.includes('--ep')){
                    pos(`Searching for end port ${clc.red("=>")} --ep`);
                    const ep2 = switchs[switchs.indexOf('--ep')+1];
                    if (ep2 === undefined){
                        neg(`${clc.red('Cannot')} find end port`);
                        pos(`${clc.bgGreen("Continue")} With Default: ${clc.red(endPort)}`);
                        action('Start scan');
                        console.log();
                        scanPortsHider(hostx, startPort, endPort);
                    }else{
                        pos(`End port: ${clc.red(ep2)}`);
                        action('Start scan');
                        console.log();
                        scanPortsHider(hostx, startPort, ep2);
                    }   
                }else{
                    action('Start scan with Default Values');
                    console.log();
                    scanPortsHider(hostx, startPort, endPort);
                }  
            }
        }else{
            if (switchs.includes('--ep')){
                pos(`Searching for end port ${clc.red("=>")} --ep`);
                const ep3 = switchs[switchs.indexOf('--ep')+1];
                if (ep3 === undefined){
                    neg(`${clc.red('Cannot')} find end port`);
                    pos(`${clc.bgGreen("Continue")} With Default: ${clc.red(endPort)}`);
                    action('Start scan');
                    console.log();
                    scanPortsHider(hostx, startPort, endPort);
                }else{
                    pos(`End port: ${clc.red(ep3)}`);
                    action('Start scan');
                    console.log();
                    scanPortsHider(hostx, startPort, ep3);
                }   
            }else{
                action('Start scan with Default Values');
                console.log();
                scanPortsHider(hostx, startPort, endPort);
            }  
        }
    }
}

if (switchs.includes('--domain') && !switchs.includes('--hide')){
    const domainx = switchs[switchs.indexOf('--domain')+1];

    if (domainx === undefined){
        neg(`Please set a ${clc.red('Domain')} after " --domain "`);
    }else{
        if (switchs.includes('--sp')){
            pos(`Searching for starter port ${clc.red("=>")} --sp`);
            const sp = switchs[switchs.indexOf('--sp')+1];
            if (sp === undefined){
                neg(`${clc.red('Cannot')} find starter port`);
                pos(`${clc.bgGreen("Continue")} With Default: ${clc.red(startPort)}`);
                if (switchs.includes('--ep')){
                    pos(`Searching for end port ${clc.red("=>")} --ep`);
                    const ep = switchs[switchs.indexOf('--ep')+1];
                    if (ep === undefined){
                        neg(`${clc.red('Cannot')} find end port`);
                        pos(`${clc.bgGreen("Continue")} With Default: ${clc.red(endPort)}`);
                        action('Start scan');
                        console.log();
                        getHostByName(domainx, (err, addr) => {
                            if (err){
                                neg(`Error: ${err}`)
                            }
                            
                            scanPorts(addr, startPort, endPort);
                        })
                    }else{
                        pos(`End port: ${clc.red(ep)}`);
                        action('Start scan');
                        console.log();
                        getHostByName(domainx, (err, addr) => {
                            if (err){
                                neg(`Error: ${err}`)
                            }
                            
                            scanPorts(addr, startPort, ep);
                        })
                    }   
                }else{
                    action('Start scan with Default Values');
                    console.log();
                    getHostByName(domainx, (err, addr) => {
                        if (err){
                            neg(`Error: ${err}`)
                        }
                        
                        scanPorts(addr, startPort, endPort);
                    })
                }  
            }else{
                pos(`Starter port: ${clc.red(sp)}`);
                if (switchs.includes('--ep')){
                    pos(`Searching for end port ${clc.red("=>")} --ep`);
                    const ep2 = switchs[switchs.indexOf('--ep')+1];
                    if (ep2 === undefined){
                        neg(`${clc.red('Cannot')} find end port`);
                        pos(`${clc.bgGreen("Continue")} With Default: ${clc.red(endPort)}`);
                        action('Start scan');
                        console.log();
                        getHostByName(domainx, (err, addr) => {
                            if (err){
                                neg(`Error: ${err}`)
                            }
                            
                            scanPorts(addr, startPort, endPort);
                        })
                    }else{
                        pos(`End port: ${clc.red(ep2)}`);
                        action('Start scan');
                        console.log();
                        getHostByName(domainx, (err, addr) => {
                            if (err){
                                neg(`Error: ${err}`)
                            }
                            
                            scanPorts(addr, startPort, ep2);
                        })
                    }   
                }else{
                    action('Start scan with Default Values');
                    console.log();
                    getHostByName(domainx, (err, addr) => {
                        if (err){
                            neg(`Error: ${err}`)
                        }
                        
                        scanPorts(addr, startPort, endPort);
                    })
                }  
            }
        }else{
            if (switchs.includes('--ep')){
                pos(`Searching for end port ${clc.red("=>")} --ep`);
                const ep3 = switchs[switchs.indexOf('--ep')+1];
                if (ep3 === undefined){
                    neg(`${clc.red('Cannot')} find end port`);
                    pos(`${clc.bgGreen("Continue")} With Default: ${clc.red(endPort)}`);
                    action('Start scan');
                    console.log();
                    getHostByName(domainx, (err, addr) => {
                        if (err){
                            neg(`Error: ${err}`)
                        }
                        
                        scanPorts(addr, startPort, endPort);
                    })
                }else{
                    pos(`End port: ${clc.red(ep3)}`);
                    action('Start scan');
                    console.log();
                    getHostByName(domainx, (err, addr) => {
                        if (err){
                            neg(`Error: ${err}`)
                        }
                        
                        scanPorts(addr, startPort, ep3);
                    })
                }   
            }else{
                action('Start scan with Default Values');
                console.log();
                getHostByName(domainx, (err, addr) => {
                    if (err){
                        neg(`Error: ${err}`)
                    }
                    
                    scanPorts(addr, startPort, endPort);
                })
            }  
        }
    }
}

// hide close ports
if (switchs.includes('--domain') && switchs.includes('--hide')){
    const domainx = switchs[switchs.indexOf('--domain')+1];

    if (domainx === undefined){
        neg(`Please set a ${clc.red('Domain')} after " --domain "`);
    }else{
        if (switchs.includes('--sp')){
            pos(`Searching for starter port ${clc.red("=>")} --sp`);
            const sp = switchs[switchs.indexOf('--sp')+1];
            if (sp === undefined){
                neg(`${clc.red('Cannot')} find starter port`);
                pos(`${clc.bgGreen("Continue")} With Default: ${clc.red(startPort)}`);
                if (switchs.includes('--ep')){
                    pos(`Searching for end port ${clc.red("=>")} --ep`);
                    const ep = switchs[switchs.indexOf('--ep')+1];
                    if (ep === undefined){
                        neg(`${clc.red('Cannot')} find end port`);
                        pos(`${clc.bgGreen("Continue")} With Default: ${clc.red(endPort)}`);
                        action('Start scan');
                        console.log();
                        getHostByName(domainx, (err, addr) => {
                            if (err){
                                neg(`Error: ${err}`)
                            }
                            
                            scanPortsHider(addr, startPort, endPort);
                        })
                    }else{
                        pos(`End port: ${clc.red(ep)}`);
                        action('Start scan');
                        console.log();
                        getHostByName(domainx, (err, addr) => {
                            if (err){
                                neg(`Error: ${err}`)
                            }
                            
                            scanPortsHider(addr, startPort, ep);
                        })
                    }   
                }else{
                    action('Start scan with Default Values');
                    console.log();
                    getHostByName(domainx, (err, addr) => {
                        if (err){
                            neg(`Error: ${err}`)
                        }
                        
                        scanPortsHider(addr, startPort, endPort);
                    })
                }  
            }else{
                pos(`Starter port: ${clc.red(sp)}`);
                if (switchs.includes('--ep')){
                    pos(`Searching for end port ${clc.red("=>")} --ep`);
                    const ep2 = switchs[switchs.indexOf('--ep')+1];
                    if (ep2 === undefined){
                        neg(`${clc.red('Cannot')} find end port`);
                        pos(`${clc.bgGreen("Continue")} With Default: ${clc.red(endPort)}`);
                        action('Start scan');
                        console.log();
                        getHostByName(domainx, (err, addr) => {
                            if (err){
                                neg(`Error: ${err}`)
                            }
                            
                            scanPortsHider(addr, startPort, endPort);
                        })
                    }else{
                        pos(`End port: ${clc.red(ep2)}`);
                        action('Start scan');
                        console.log();
                        getHostByName(domainx, (err, addr) => {
                            if (err){
                                neg(`Error: ${err}`)
                            }
                            
                            scanPortsHider(addr, startPort, ep2);
                        })
                    }   
                }else{
                    action('Start scan with Default Values');
                    console.log();
                    getHostByName(domainx, (err, addr) => {
                        if (err){
                            neg(`Error: ${err}`)
                        }
                        
                        scanPortsHider(addr, startPort, endPort);
                    })
                }  
            }
        }else{
            if (switchs.includes('--ep')){
                pos(`Searching for end port ${clc.red("=>")} --ep`);
                const ep3 = switchs[switchs.indexOf('--ep')+1];
                if (ep3 === undefined){
                    neg(`${clc.red('Cannot')} find end port`);
                    pos(`${clc.bgGreen("Continue")} With Default: ${clc.red(endPort)}`);
                    action('Start scan');
                    console.log();
                    getHostByName(domainx, (err, addr) => {
                        if (err){
                            neg(`Error: ${err}`)
                        }
                        
                        scanPortsHider(addr, startPort, endPort);
                    })
                }else{
                    pos(`End port: ${clc.red(ep3)}`);
                    action('Start scan');
                    console.log();
                    getHostByName(domainx, (err, addr) => {
                        if (err){
                            neg(`Error: ${err}`)
                        }
                        
                        scanPortsHider(addr, startPort, ep3);
                    })
                }   
            }else{
                action('Start scan with Default Values');
                console.log();
                getHostByName(domainx, (err, addr) => {
                    if (err){
                        neg(`Error: ${err}`)
                    }
                    
                    scanPortsHider(addr, startPort, endPort);
                })
            }  
        }
    }
}