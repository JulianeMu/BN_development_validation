from http.server import HTTPServer, SimpleHTTPRequestHandler

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Allow any origin
        self.send_header("Access-Control-Allow-Origin", "*")
        # Allow specific methods
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        # Allow specific headers
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.end_headers()

if __name__ == "__main__":
    port = 63342
    server = HTTPServer(("127.0.0.1", port), CORSRequestHandler)
    print(f"Serving with CORS on port {port}")
    server.serve_forever()
