module.exports = {
  apps: [
    {
      name: 'bc-meeting_server',
      script: './dist/main.js',
      cwd: '.',
      max_memory_restart: '512M',
      exec_mode: 'cluster',
      instances: 'max',
      instance_var: 'BC-MEETING_SERVER_ID',
      watch: ['./dist/*.js'],
      ignore_watch: ['node_modules'],
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
};
