const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const inquiryHandler = require("./api/inquiries");

const rootDir = __dirname;
const publicFiles = new Set(["/index.html", "/styles.css", "/script.js"]);

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"]
]);

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(rootDir, ".env"));

const port = Number(process.env.PORT || 4174);

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(message);
}

function resolveStaticPath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath === "/" ? "/index.html" : urlPath);
  if (!publicFiles.has(decodedPath)) return null;

  const filePath = path.resolve(rootDir, `.${decodedPath}`);
  const normalizedRoot = `${path.resolve(rootDir)}${path.sep}`.toLowerCase();
  const normalizedFile = filePath.toLowerCase();

  if (!normalizedFile.startsWith(normalizedRoot)) return null;
  return filePath;
}

function serveStatic(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  const filePath = resolveStaticPath(requestUrl.pathname);

  if (!filePath) {
    sendText(response, 403, "Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      sendText(response, filePath ? 404 : 403, "Not found");
      return;
    }

    const contentType = contentTypes.get(path.extname(filePath).toLowerCase()) || "application/octet-stream";
    response.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }

    fs.createReadStream(filePath).pipe(response);
  });
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (requestUrl.pathname === "/api/inquiries") {
    inquiryHandler(request, response);
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    sendText(response, 405, "Method not allowed");
    return;
  }

  serveStatic(request, response);
});

server.listen(port, () => {
  console.log(`VibeSec Review local server: http://127.0.0.1:${port}`);
});
