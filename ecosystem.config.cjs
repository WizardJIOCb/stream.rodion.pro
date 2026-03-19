module.exports = {
  apps: [
    {
      name: 'stream-rodion',
      script: 'dist/server/server/index.js',
      cwd: '/var/www/stream.rodion.pro',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3012,
      },
      max_memory_restart: '256M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/stream.rodion.pro/error.log',
      out_file: '/var/log/stream.rodion.pro/out.log',
      merge_logs: true,
    },
  ],
};
