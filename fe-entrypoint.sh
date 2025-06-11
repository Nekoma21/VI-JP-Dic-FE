set -e

cat > /usr/share/nginx/html/env.js << EOF
window._env_ = {
  VITE_API_URL: "${VITE_API_URL}",
  VITE_FASTAPI_URL: "${VITE_FASTAPI_URL}",
  LLAMA_CLOUD_API_KEY: "${LLAMA_CLOUD_API_KEY}",
  OPENAI_API_KEY: "${OPENAI_API_KEY}",
};
EOF

exec nginx -g 'daemon off;'
