---
title: ServerGuard
kind: Security · Access control
summary: Python tool that detects unauthorized access to Windows servers in real time and fires automatic alerts.
period: May 2026
date: 2026-05-01
status: active
stack: [Python, IMAP IDLE, Authentication logs, Automatic alerts]
skills: [python, accesos, logs-auth, whitelisting, alertas, scripting]
highlights:
  - Processes Windows server sign-in events in real time (via IMAP IDLE) to detect unauthorized access.
  - Checks every access against a corporate allowlist of users and IPs and fires automatic alerts on deviations, enabling an early response to incidents.
---

## The problem

Server sign-ins are logged, but reviewing them by hand is slow and reactive: unauthorized access can go unnoticed until
someone goes looking for it.

## The solution

ServerGuard processes Windows server sign-in events **as they happen** and checks every access against a corporate
allowlist of users and IPs. Any deviation triggers an automatic alert, enabling an early response to a potential
incident.

## How it works

1. **Real-time ingestion:** receives sign-in events through **IMAP IDLE**, which pushes each new event as soon as it
   arrives, with no polling.
2. **Processing:** extracts the relevant access data from each authentication event (user and source IP).
3. **Validation:** checks the access against the corporate allowlist.
4. **Alerting:** if the user or IP is not authorized, it fires an automatic alert.

## Next steps

ServerGuard plugs in as a security event source for my [infrastructure and observability home lab](/en/projects/homelab/).
