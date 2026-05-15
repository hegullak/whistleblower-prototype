"""Lokal statisk server uten cache (for utvikling)."""
from __future__ import annotations

import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class DevHandler(SimpleHTTPRequestHandler):
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
