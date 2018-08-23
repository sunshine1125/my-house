module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        {
            name           : 'my-house',
            script         : 'bin/www',
            env: {
                NODE_ENV: 'production',
                PORT: 3002,
            },
            env_development: {
                NODE_ENV: 'development'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ],

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {
        production: {
            user         : 'liut',
            host         : ['140.143.192.183'],
            port         : '5722',
            ref          : 'origin/master',
            repo         : 'git@github.com:sunshine1125/my-house.git',
            path         : '/home/liut/vue-express',
            // "ssh_options": ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
            'post-deploy': 'chmod u+x ./post-deploy.sh && source ./post-deploy.sh'
        }
    }
};