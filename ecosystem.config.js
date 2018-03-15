module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        {
            name           : 'vue-express',
            script         : 'index.js',
            env: {
              NODE_ENV: 'production',
              // PORT: 8080,
            },
            env_development: {
                NODE_ENV: 'development',
                // SERVER_PORT: 8080,
                // LOGSTASH_URL: 'http://localhost/finley/PHP/test.php'
            },
            // env_production: {
            //   NODE_ENV: 'production',
            //   LOGSTASH_URL: 'http://192.168.100.16:9700'
            // }
        }
    ],

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {
        develop: {
            user         : 'liut',
            host         : ['140.143.192.183'],
            port         : '5722',
            ref          : 'origin/develop',
            repo         : 'git@github.com:sunshine1125/vue-express.git',
            path         : '/home/liut/vue-express',
            // "ssh_options": ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
            'post-deploy': 'npm install && pm2 startOrReload ecosystem.config.js --env production'
        },
        // master : {
        //     user         : 'liut',
        //     host         : ['140.143.192.183'],
        //     ref          : 'origin/develop',
        //     repo         : 'git@github.com:sunshine1125/vue-express.git',
        //     path         : '/home/ubuntu/node-live-api',
        //     // "ssh_options": ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
        //     'post-deploy': 'npm install && pm2 startOrReload ecosystem.config.js --env production'
        // }
    }
};
