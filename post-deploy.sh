#!/bin/bash

cd /home/liut/blog/current/client && npm install && npm run build

cd /home/liut/blog/current/server && npm install && pm2 startOrReload ecosystem.config.js --env production