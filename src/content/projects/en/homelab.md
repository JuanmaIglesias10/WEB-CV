---
title: Infrastructure & Observability Home Lab
short: Home Lab
kind: Personal lab · IaC · Observability
summary: Personal lab built in phases with infrastructure as code, metrics and alerting, and security event integration.
period: 2026 · in progress
date: 2026-01-01
status: wip
stack: [Terraform, Ansible, Prometheus, Grafana, ServerGuard]
skills: [terraform, ansible, prometheus, grafana, alertas, linux, accesos]
highlights:
  - 'Personal lab built in phases: infrastructure as code with Terraform and Ansible, metrics and alerting with Prometheus and Grafana, and ServerGuard integrated as a security event source.'
---

## Goal

A personal environment to practice, end to end, how modern infrastructure is built and operated: provisioned as code,
observable and with security events built in.

## Phases

1. **Infrastructure as code:** provisioning with **Terraform** and configuration with **Ansible**, so the lab can be torn
   down and rebuilt reproducibly.
2. **Metrics and alerting:** collection with **Prometheus**, dashboards and alerts with **Grafana**.
3. **Security events:** [ServerGuard](/en/projects/serverguard/) integrated as a security event source within the same
   observability stack.

This project is in progress: this page is updated as each phase moves forward.
