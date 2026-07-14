# Incident: transienter exklusiver Restic-Lock

Status: gelöst  
Datum: 2026-07-13  
Schweregrad: SEV-3

Ein geplanter BCC-Lauf erzeugte 15 von 16 vorgesehenen Snapshots. `at-core/hetzner` scheiterte an einem kurzzeitig exklusiv gesperrten Restic-Repository. Repository-Checks und beide Mini-Restore-Tests blieben erfolgreich; es gab keinen Datenverlust und keine festgestellte Repository-Beschädigung.

## Ursache und beitragende Fehler

- Ein konkurrierender Restic-Prozess hielt vorübergehend einen exklusiven Lock.
- `restic backup` wartete nicht auf die Freigabe des Locks.
- Der SSH-Retry konnte ein per stdin/Heredoc übertragenes Skript nur beim ersten Versuch ausführen.
- Der erwartete Abschlusscode des aggregierten Laufs löste zusätzlich einen irreführenden `ERR`-Trap mit „Fehler in Zeile 1“ aus.

## Korrektur

- `restic backup --retry-lock 5m` toleriert vorübergehende Locks.
- SSH stdin wird gepuffert und bei jedem Retry vollständig erneut übertragen.
- Vor erwarteten aggregierten Fehlercodes wird der generische `ERR`-Trap deaktiviert.

## Verifikation

Ein vollständiger Kontrolllauf erzeugte anschließend alle 16 Snapshots. Restic-Checks und Mini-Restore-Tests für beide Provider waren erfolgreich; der systemd-Service endete mit Exit-Code 0.

## Restrisiko

Ein exklusiver Lock, der länger als fünf Minuten besteht, kann weiterhin zu einem kontrollierten Fehlschlag führen. In diesem Fall wird nun die tatsächliche Ursache protokolliert.
