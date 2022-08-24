<img src="https://user-images.githubusercontent.com/6314185/186470558-9c343d9d-bb07-4c30-9d3b-1a95940fe4d0.jpg"/>
<h1 align="center">whisp-chat</h1>
<p align="center">Encrypted Messaging CLI Software</p>

## Design Principles

Simplicity in implementaation ~170 lines of code.  
Simplicity in usage.

## Why should I use this?

Overall, this is a tutorial example for those interested in a node.js/encryption/sockets.  
It's not a "serious" project (at least not yet -- feature requests and contributions are more than welcome).

## Is this software really secure?

To the best it can be.

NOTE: This tool has not been audited and is NOT for production use.

## Roadmap

* zip option for file transfer
* prettier UI  
* choice of encryption method

## Prerequisites

Install <a href="https://nodejs.org/en/download/">node.js</a>

Repo <a herf="https://github.com/maelswarm/whisp-chat.git">https://github.com/maelswarm/whisp-chat.git</a> or ```npm i whisp-chat```

## Quickstart

Have both parties decide on two mutual passwords.  
These will be used for the AES-256-cfb cipher (used to secure the given parties data transfers).

Command Schema  
```node app.js --src=<host>:<port> --dest=<destinationhost>:<destinationport> --secret=<password1>:<password2>```

For a quick test, open two terminals on your computer and enter the following commands.

Terminal 1:  
```node app.js --src=127.0.0.1:4321 --dest=127.0.0.1:1234 --secret=breadandjam:butterybutter```

Terminal 2:  
```node app.js --src=127.0.0.1:1234 --dest=127.0.0.1:4321 --secret=breadandjam:butterybutter```

## Usage

![Screen Shot 2022-08-24 at 11 00 06 AM](https://user-images.githubusercontent.com/6314185/186452780-ff7b337b-653c-4d32-9db6-d2915adcc5a2.png)

Type text and hit enter.

For sending a file type ```!file:<filepath>``` and hit enter.  

NOTE: Do not expect a chat message to be received by the destination while a file transfer is already occuring.  
It will be received by the destination after the file transfer.
