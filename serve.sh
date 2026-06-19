#!/bin/bash
# Launch the study-guide site on localhost.
# Usage: ./serve.sh [port]   (default port 8000)
cd "$(dirname "$0")"
PORT="${1:-8000}"
echo "Serving Android Interview Study Guide at: http://localhost:$PORT"
echo "Press Ctrl+C to stop."
python3 -m http.server "$PORT"
