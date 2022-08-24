const crypto = require('node:crypto');
let password = ''
let iv = '';
const generateVector = (pwd) => {
    return crypto.scryptSync(pwd, 'salt', 16);
}
const encryptMessage = (message) => {
    return new Promise(resolve => {
        const algorithm = "aes-256-cfb";
        crypto.scrypt(password, 'salt', 32, (err, derivedKey) => {
            if (err) throw err;
            const cipher = crypto.createCipheriv(algorithm, derivedKey, generateVector(iv));
            let encryptedData = cipher.update(message, "utf-8", "hex");
            encryptedData += cipher.final("hex");
            resolve(encryptedData);
        });
    });
}

const decryptMessage = (message) => {
    return new Promise(resolve => {
        const algorithm = "aes-256-cfb";
        crypto.scrypt(password, 'salt', 32, (err, derivedKey) => {
            if (err) throw err;
            const cipher = crypto.createDecipheriv(algorithm, derivedKey, generateVector(iv));
            let decryptedData = cipher.update(message, "hex", "utf-8");
            decryptedData += cipher.final("utf-8");
            resolve(decryptedData);
        });
    });
}

let input = '', selfHost = '', remoteHost = '';
const net = require('node:net');
const fs = require('node:fs');

for (arg of process.argv) {
    if (arg.startsWith('--src')) {
        selfHost = arg.substring(6).split(':')
    } else if (arg.startsWith('--dest')) {
        remoteHost = arg.substring(7).split(':')
    } else if (arg.startsWith('--secret')) {
        const passwords = arg.substring(9).split(':');
        password = passwords[0];
        iv = passwords[1];
    }
}

if (!selfHost || !remoteHost || !iv) {
    console.log("Example : node app.js --src=<host:port> --dest=<host:port> --secret=<password1:password2>")
    return process.exit(0);
}

class Server {
    constructor() {
        this.init();
    }
    init() {
        const server = net.createServer((c) => {
            c.on('end', () => {
            });
            c.on('data', async (buff) => {
                const mess = (await decryptMessage(buff.toString())).toString();
                if (mess.startsWith('IV::')) {
                    iv = mess.split('::')[1];
                } else if (mess.startsWith('!file:')) {
                    const file = JSON.parse(mess.substring(mess.indexOf('!file:') + 6));
                    fs.writeFileSync(`${require('os').homedir()}/Downloads/${(new Date()).getTime()}-${file.name}`, file.data);
                    process.stdout.moveCursor(0, -1);
                    process.stdout.cursorTo(0)
                    process.stdout.write('\n');
                    process.stdout.write('Downloaded: ' + file.name + '\n');
                    process.stdout.moveCursor(0, 1);
                    process.stdout.write(input);
                } else {
                    process.stdout.moveCursor(0, -1);
                    process.stdout.cursorTo(0)
                    process.stdout.write('\n');
                    process.stdout.write(mess + '\n');
                    process.stdout.moveCursor(0, 1);
                    process.stdout.write(input);
                }
            })
        });
        server.on('error', (err) => {
            throw err;
        });
        server.listen(selfHost[1], selfHost[0], () => {});
    }
}

class Client {
    constructor() {
        this.cursorX = 0;
        this.init();
    }
    init() {
        const client = net.createConnection({ port: remoteHost[1], host: remoteHost[0] }, () => {
            console.log("Connected\n");
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.setEncoding('utf8');
            if (parseInt(remoteHost[1]) < parseInt(selfHost[1]) || parseInt(remoteHost[1]) < 1 + parseInt(selfHost[1])) {
                const refreshIV = async () => {
                    const newIV = [...Array(32)].map(() => Math.random().toString(36)[2]).join('');
                    const message = await encryptMessage("IV::" + newIV);
                    client.write(message);
                    iv = newIV;
                    setTimeout(refreshIV, Math.random() * 10000 + 10000);
                }
                refreshIV();
            }
            process.stdin.on('data', async (key) => {
                if (key === '\u0003') {
                    process.exit();
                } else if (key === '\u000d') {
                    if (input.startsWith('!file:')) {
                        const path = input.substring(input.indexOf('!file:') + 6);
                        try {
                            const file = { name: path.substring(path.lastIndexOf('/') + 1), data: fs.readFileSync(path).toString() };
                            client.write(await encryptMessage('!file:' + JSON.stringify(file)));
                        } catch {
                            process.stdout.write('\ninvalid file path\n');
                        }
                    } else {
                        client.write(await encryptMessage(input.toString()));
                    }
                    process.stdout.write('\n');
                    input = '';
                    this.cursorX = 0;
                } else if (key.charCodeAt(0) === 127) {
                    process.stdout.clearLine();
                    process.stdout.cursorTo(0);
                    let tmp = input.substring(0, this.cursorX - 1);
                    input = tmp + input.substring(this.cursorX, input.length);
                    process.stdout.write(input);
                    process.stdout.cursorTo(--this.cursorX);
                } else if (key.charCodeAt(2) === 67) {
                    ++this.cursorX;
                    process.stdout.moveCursor(1);
                } else if (key.charCodeAt(2) === 68) {
                    --this.cursorX;
                    process.stdout.moveCursor(-1);
                } else {
                    process.stdout.clearLine();
                    process.stdout.cursorTo(0);
                    let tmp = input.substring(0, this.cursorX);
                    input = tmp + key.toString() + input.substring(this.cursorX, input.length);
                    process.stdout.write(input);
                    process.stdout.cursorTo(++this.cursorX);
                }
            });
        });
        const retry = () => {
            console.log("retrying connection in 2.5 seconds\n")
            setTimeout(() => {
                this.init();
            }, 2500);
        }
        client.on('end', () => {
            console.log('Disconnected\n');
            process.exit(0);
        });
        client.on('error', (err) => {
            retry();
        });
    }
}

new Server();
new Client();