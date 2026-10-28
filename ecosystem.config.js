
module.exports = {
  apps: [
    {
      name: "colorpellet",
      cwd: "/var/www/colorpellet/thecolorpalette",
      script: "npm",
      args: "start -- --hostname 127.0.0.1 --port 3015",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3015
      }
    }
  ]
};
