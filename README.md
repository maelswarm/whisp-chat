# whisp-chat
<p align-center>Encrypted Messaging CLI</p>

## Prerequesites

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
```node app.js --src=127.0.0.1:4321 --dest=127.0.0.1:1234 --secret=breadandjam:butterybutter```

## Usage

![Screen Shot 2022-08-24 at 11 00 06 AM](https://user-images.githubusercontent.com/6314185/186452780-ff7b337b-653c-4d32-9db6-d2915adcc5a2.png)


Text may be typed and sent.

For sending a file use ```!file:<filepath>```.
