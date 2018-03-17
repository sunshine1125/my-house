#!/bin/bash

cd /home/liut/vue-express/client && npm install && npm run build

cd /home/liut/vue-express/server && npm install && pm2 startOrReload ecosystem.config.js --env production