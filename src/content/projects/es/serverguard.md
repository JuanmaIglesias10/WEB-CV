---
title: ServerGuard
kind: Seguridad · Control de accesos
summary: Herramienta en Python que detecta en tiempo real accesos no autorizados a servidores Windows y dispara alertas automáticas.
period: Mayo 2026
date: 2026-05-01
status: active
stack: [Python, IMAP IDLE, Logs de autenticación, Alertas automáticas]
skills: [python, accesos, logs-auth, whitelisting, alertas, scripting]
highlights:
  - Procesa en tiempo real los eventos de inicio de sesión de servidores Windows (vía IMAP IDLE) para detectar accesos no autorizados.
  - Valida cada acceso contra una whitelist corporativa de usuarios e IPs y dispara alertas automáticas ante desvíos, permitiendo una respuesta temprana ante incidentes.
---

## El problema

Los inicios de sesión en servidores quedan registrados, pero revisarlos a mano es lento y reactivo: un acceso indebido
puede pasar inadvertido hasta que alguien lo busca.

## La solución

ServerGuard procesa los eventos de inicio de sesión de servidores Windows **a medida que ocurren** y valida cada acceso
contra una whitelist corporativa de usuarios e IPs. Ante cualquier desvío dispara una alerta automática, lo que permite
responder temprano ante un posible incidente.

## Cómo funciona

1. **Ingesta en tiempo real:** recibe los eventos de login mediante **IMAP IDLE**, que notifica cada evento nuevo apenas
   llega, sin consultas periódicas.
2. **Procesamiento:** extrae de cada evento de autenticación los datos relevantes del acceso (usuario e IP de origen).
3. **Validación:** compara el acceso contra la whitelist corporativa.
4. **Alerta:** si el usuario o la IP no están autorizados, dispara una alerta automática.

## Próximos pasos

ServerGuard se integra como fuente de eventos de seguridad en mi [home lab de infraestructura y observabilidad](/proyectos/homelab/).
