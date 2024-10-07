module.exports = {
  apps: [
    {
      name: 'bc_server',
      script: './dist/main.js',
      cwd: '.',
      max_memory_restart: '512M',
      exec_mode: 'cluster',
      instances: 2,
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
