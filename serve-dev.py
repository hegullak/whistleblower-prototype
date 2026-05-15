"""Lokal statisk server uten cache (for utvikling)."""
from __future__ import annotations

import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse


class DevHandler(SimpleHTTPRequestHandler):
    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"
        if path == "/index.html":
            location = "/" + (f"?{parsed.query}" if parsed.query else "")
            self.send_response(301)
            self.send_header("Location", location)
            self.end_headers()
            return
        super().do_GET()

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()


def main() -> None:
    port = int(sys.argv[1])
    bind = sys.argv[2]
    server = ThreadingHTTPServer((bind, port), DevHandler)
    print(f"Serving on http://{bind}:{port}/ (no-cache)")
    server.serve_forever()


if __name__ == "__main__":
    main()
