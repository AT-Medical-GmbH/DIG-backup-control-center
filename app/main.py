#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import sqlite3
from datetime import UTC, datetime
from html import escape
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader, select_autoescape

try:
    from fastapi import FastAPI
    from fastapi.responses import HTMLResponse, JSONResponse
except ImportError:  # pragma: no cover - optional dependency in bootstrap mode
    FastAPI = None
    HTMLResponse = JSONResponse = None

BASE_DIR = Path(__file__).resolve().parent.parent
APP_DIR = BASE_DIR / "app"
DEFAULT_CONFIG_DIR = BASE_DIR / "examples"
DEFAULT_DB_PATH = BASE_DIR / "var" / "atmed-bcc.sqlite3"

environment = Environment(
    loader=FileSystemLoader(APP_DIR / "templates"),
    autoescape=select_autoescape(default=True),
)


def load_json(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def build_summary(config_dir: Path = DEFAULT_CONFIG_DIR, db_path: Path = DEFAULT_DB_PATH) -> dict[str, Any]:
    endpoints = load_json(config_dir / "endpoints.example.json")
    providers = load_json(config_dir / "providers.example.json")
    enabled_endpoints = [item for item in endpoints if item.get("enabled")]
    enabled_providers = [item for item in providers if item.get("enabled")]
    snapshot_count = 0
    latest_run: dict[str, Any] | None = None

    if db_path.exists():
        with sqlite3.connect(db_path) as connection:
            connection.row_factory = sqlite3.Row
            snapshot_count = connection.execute("SELECT COUNT(*) FROM snapshots").fetchone()[0]
            row = connection.execute(
                "SELECT started_at, finished_at, status, trigger, notes FROM backup_runs ORDER BY started_at DESC LIMIT 1"
            ).fetchone()
            if row:
                latest_run = dict(row)

    return {
        "generated_at": datetime.now(UTC).strftime("%Y-%m-%d %H:%M:%SZ"),
        "endpoint_count": len(enabled_endpoints),
        "provider_count": len(enabled_providers),
        "matrix_count": len(enabled_endpoints) * len(enabled_providers),
        "snapshot_count": snapshot_count,
        "latest_run": latest_run,
        "endpoints": enabled_endpoints,
        "providers": enabled_providers,
        "retention": {"daily": 14, "weekly": 8, "monthly": 12, "yearly": 3},
    }


def load_atmed_footer() -> dict[str, str]:
    """Load the centrally-maintained ATMED footer (vendored local copy).

    The artifacts under app/static/atmed-footer/ are produced by
    ATMED-assets/shared/atmed-footer (build + deploy-footer). They are never
    hand-edited here. If the vendor copy is missing the dashboard still
    renders - the footer is simply omitted - so the page never breaks.
    """
    footer_dir = APP_DIR / "static" / "atmed-footer"
    try:
        # Internal variant: BCC is an internal control center.
        html = (footer_dir / "footer.internal.html").read_text(encoding="utf-8")
        css = (footer_dir / "footer.css").read_text(encoding="utf-8")
        return {"html": html, "css": css}
    except OSError:
        return {"html": "", "css": ""}


def render_dashboard(summary: dict[str, Any]) -> str:
    template = environment.get_template("dashboard.html")
    css = (APP_DIR / "static" / "style.css").read_text(encoding="utf-8")
    footer = load_atmed_footer()
    return template.render(summary=summary, css=css, footer=footer)


if FastAPI is not None:
    app = FastAPI(title="ATMED-BCC Dashboard", version="0.1.0")

    @app.get("/", response_class=HTMLResponse)
    def dashboard() -> HTMLResponse:
        return HTMLResponse(render_dashboard(build_summary()))

    @app.get("/api/summary", response_class=JSONResponse)
    def summary() -> JSONResponse:
        return JSONResponse(build_summary())


class PreviewHandler(BaseHTTPRequestHandler):
    config_dir = DEFAULT_CONFIG_DIR
    db_path = DEFAULT_DB_PATH

    def do_GET(self) -> None:  # noqa: N802
        if self.path not in {"/", "/index.html"}:
            self.send_error(404, "Not found")
            return
        body = render_dashboard(build_summary(self.config_dir, self.db_path)).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt: str, *args: object) -> None:
        message = fmt % args
        print(f"[atmed-bcc-dashboard] {escape(message)}")


def run_preview_server(host: str, port: int, config_dir: Path, db_path: Path) -> None:
    PreviewHandler.config_dir = config_dir
    PreviewHandler.db_path = db_path
    server = ThreadingHTTPServer((host, port), PreviewHandler)
    print(f"ATMED-BCC preview listening on http://{host}:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="ATMED-BCC dashboard bootstrap")
    parser.add_argument("--host", default=os.environ.get("ATMED_BCC_HOST", "127.0.0.1"))
    parser.add_argument("--port", type=int, default=int(os.environ.get("ATMED_BCC_PORT", "8000")))
    parser.add_argument("--config-dir", type=Path, default=DEFAULT_CONFIG_DIR)
    parser.add_argument("--db-path", type=Path, default=DEFAULT_DB_PATH)
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    run_preview_server(args.host, args.port, args.config_dir, args.db_path)
