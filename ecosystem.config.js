module.exports = {
  apps: [
    {
      name: 'meet-video',
      script: 'server/index.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Performance
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      
      // Restart policy
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Health check
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // Environment variables
      env_file: '.env',
      
      // Kill timeout
      kill_timeout: 5000,
      
      // Listen timeout
      listen_timeout: 8000,
      
      // PM2 specific
      pmx: true,
      source_map_support: true,
      
      // Socket.IO specific
      instances: 1, // Socket.IO doesn't work well with multiple instances
      exec_mode: 'fork'
    }
  ],
  
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-vps-ip',
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/meet-video.git',
      path: '/home/ubuntu/meet-video',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
