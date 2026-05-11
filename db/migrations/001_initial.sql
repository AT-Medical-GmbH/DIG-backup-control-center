PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS backup_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at TEXT NOT NULL,
    finished_at TEXT,
    status TEXT NOT NULL,
    trigger TEXT NOT NULL,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    backup_run_id INTEGER REFERENCES backup_runs(id) ON DELETE SET NULL,
    endpoint_name TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    snapshot_id TEXT,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE(endpoint_name, provider_name, created_at)
);

CREATE TABLE IF NOT EXISTS repository_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider_name TEXT NOT NULL,
    status TEXT NOT NULL,
    checked_at TEXT NOT NULL,
    details TEXT
);

CREATE TABLE IF NOT EXISTS restore_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint_name TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    status TEXT NOT NULL,
    tested_at TEXT NOT NULL,
    details TEXT
);

CREATE TABLE IF NOT EXISTS audit_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    generated_at TEXT NOT NULL,
    status TEXT NOT NULL,
    format TEXT NOT NULL,
    details TEXT NOT NULL
);
