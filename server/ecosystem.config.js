module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        {
            name           : 'blog',
            script         : 'bin/www',
            env_development: {
                NODE_ENV: 'development',
                PORT: 3002
            },
            env_production : {
                NODE_ENV: "production",
                PORT: 3002
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
            path         : '/home/liut/blog',
            // "ssh_options": ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
            'post-deploy': 'chmod u+x ./post-deploy.sh && source ./post-deploy.sh'
        }
    }
};