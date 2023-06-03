"""Simple HTTPS server.

Loads the certificate from the path given by the CERTIFICATE_FILE variable.
Run with `python3 server.py` in the root folder of the project.
"""
from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl
# import socketserver

CERTIFICATE_FILE = 'cert.pem'

httpd = HTTPServer(('localhost', 8080), SimpleHTTPRequestHandler)
# context = ssl.create_default_context(cafile=CERTIFICATE_FILE)
# context.check_hostname = False
# httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
httpd.socket = ssl.wrap_socket(httpd.socket, server_side=True, certfile=CERTIFICATE_FILE, ssl_version=ssl.PROTOCOL_TLS)

httpd.serve_forever()
