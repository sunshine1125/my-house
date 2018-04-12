#!/bin/bash

cd /home/liut/vue-express/current/client && npm install && npm run build

cd /home/liut/vue-express/current/server && npm install && pm2 startOrReload ecosystem.config.js --env production