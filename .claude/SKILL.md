---
name: especialista-en-reclamos-colectivos
description: >
  Especialista en Reclamos-Colectivos ACEPO — web app single-file para
  seguimiento de reclamos de vida colectiva INS (3 pólizas: VTM 805 colectiva
  variable 2-10M, VTM 704 fija 15M, VTM 703 fija 400K). Usar cuando Juan
  Carlos pida cualquier cambio, mejora o corrección en el sistema. Leer
  COMPLETO antes de escribir código. Entregar cambios ya pusheados a main
  (auto-deploy Netlify) o código completo en conversación si JC lo pide
  para copiar/pegar.
---

# Reclamos-Colectivos ACEPO — SKILL estructurado (estado vigente)

> Este archivo es **estado vigente**, no un log histórico. Los checkpoints cronológicos viven en `git log` y en la memoria (`~/.claude/projects/.../memory/project_reclamos_colectivos.md`). Actualizar las secciones de abajo cada vez que cambie el estado — no añadir log de commits aquí.

**Última actualización:** 25 abril 2026 — datos del afectado + reportes con logo INS
**Último commit main:** `eb57b95` PDF: detalle completo en landscape con columnas Afectado y Vinculo
**Repo GitHub:** https://github.com/jhernandez-vibecode/Reclamos-Colectivos
**Dominio público:** Netlify auto-deploy desde `main` (URL por confirmar)
**Pólizas ACEPO (tomador 3002056545):**
- **VTM 805** · Muerte Colectiva Policía · montos fijos ₡2/4/6/8/10M · 34 casos seed (31 de 2025 + 3 de 2026)
- **VTM 704** · Muerte Fija ₡15M · monto único · 0 casos (sin data aún)
- **VTM 703** · Muerte Fija ₡400K · monto único · 12 casos seed (2025)

---

## ESTADO ACTUAL

- **v1.0 en producción** — migrado de Firebase a Netlify Blobs + PIN auth (commit `b17e740`).
- **Stack**: HTML/CSS/JS vanilla single-file (`app.html` ~1500 líneas) + Netlify Functions v2 ESM + Netlify Blobs (1 store: `reclamos-colectivos`) + Chart.js + jsPDF + pdf.js + SheetJS (xlsx).
- **Auth por PIN** simple (sin Google OAuth). Token `btoa(PIN + ':reclamos')` guardado en `sessionStorage.rc-token`. Env var `ACCESS_PIN` en Netlify.
- **Demo local** (`hostname === 'localhost' || '127.0.0.1'`) usa `SEED_LOCAL` con 34 casos (31 de 2025 + 3 de 2026) y localStorage como fallback.
- **Diseño:** Modern SaaS Light Dashboard — sidebar navy `#0f172a`, main `#f8fafc`, acento cyan `#06b6d4`, cards blancas con sombra sutil. Tipografía **Outfit** (títulos) + **DM Sans** (cuerpo). Logo SDI SVG en header (`sdi-logo.svg` copiado de `sdi-portal/assets/brand/logo-compacto.svg`).
- **Sin Firebase** — todo setUser/firebase auth eliminado. Sólo PIN + Netlify Blobs.

---

## MÓDULOS (Frontend — todo en `app.html`)

### Secciones principales

| Sección | Estado | Función |
|---|---|---|
| `#section-reclamos` | ✅ estable | Grid de tarjetas + chips filtro estado + buscador + filtros año/cobertura. Tarjeta muestra: caso, mes/año, estado badge, nombre, cobertura, cédula, fecha presentación, contador de días, monto. Indicador 📄 si tiene `reportePago` adjunto. |
| `#section-estadisticas` | ✅ estable | Tabs año 2025/2026/2027, 4 stat-cards, 2 doughnut charts (por cobertura + por monto asegurado), tabla top-5 montos. Botones "Descargar Excel" y "Descargar PDF". |
| `#claim-modal` | ✅ estable | Alta/edición: zona carga PDF auto-fill + form completo (asegurado + **afectado** opcional con vínculo editable) + "Reporte de Pago (Control)" PDF (base64, max 25 MB con compresión automática a <3.5 MB). |
| `#pdf-modal` | ✅ estable | Visor iframe del reporte de pago adjunto + botón descargar + título dinámico. |

### Estados del reclamo

```
Presentado (azul) · En Ajuste (naranja) · Pagada (verde) · Declinado (rojo) · Apelación (morado)
```

Badges con fondo pastel + texto saturado. Contador de días ⏱ solo activo en estados abiertos (Presentado/En Ajuste/Apelación).

### Funciones clave

| Función | Línea aprox | Propósito |
|---|---|---|
| `api(method, body)` | ~790 | Wrapper fetch `/api/reclamos`. Modo local usa SEED_LOCAL + localStorage. Modo prod envía Bearer `rc-token`. |
| `initApp()` | ~797 | Simplemente llama `loadClaims()`. Antes había `setUser()` que rompía el flujo tras quitar elementos del DOM (bug fix `b1c5ad5`). |
| `loadClaims()` | ~805 | GET `/api/reclamos` → `claims` array → `renderAll()`. |
| `cardHTML(c)` | ~860 | Markup de tarjeta. Indicador 📄 solo si `c.reportePago` existe. |
| `openModal(id)` | ~925 | Abre modal edición. Carga campos + restaura `_pendingReportePago`. |
| `saveClaim()` | ~990 | POST/PUT con todos los campos + `reportePago` (base64) + `reportePagoNombre`. |
| `parsePdf(input)` | ~1011 | Parser dual: `isLiquidacion` (INS Reporte) vs `isReclamo` (ACEPO carta). Extrae numero, cedula, nombre, fechaPres, referencia (Oficio), anno, IBAN, monto, cobertura. |
| `setMontoAseg(val)` | ~965 | Setter del select monto asegurado. Si el valor no está en las opciones fijas (2/4/6/8/10M), crea una opción "otro" dinámica. |
| `attachReportePago(input)` | ~1168 | Validación tipo/tamaño + compresión automática si >3.5 MB. |
| `compressPdf(file, target)` | ~1210 | pdf.js renderiza cada página a canvas → JPEG → jsPDF reconstruye PDF. 4 intentos progresivos (quality 0.72→0.4, scale 1.5x→0.9x). Prueba real: 8.9 MB → 0.25 MB. |
| `viewPdf(id)` | ~1190 | Abre pdf-modal con iframe del `reportePago` almacenado. |
| `renderStats(year)` | ~1134 | Summary cards + 2 charts + top-5. Chart 2 agrupa por monto asegurado exacto (2M/4M/6M/8M/10M/Otro), oculta categorías vacías. |
| `exportExcel()` / `exportPDF()` | ~1247 / ~1295 | Descarga reportes. PDF usa `c/` prefix en lugar de `₡` (jsPDF Helvetica no soporta U+20A1). Números en `en-US` locale. Incluye pie charts como PNG. |

### Montos asegurados (dinámicos por póliza activa)

El select se reconstruye al cambiar de tab (`rebuildMontoSelect()`):

- **VTM 805**: ₡2M / ₡4M / ₡6M / ₡8M / ₡10M (colectiva variable)
- **VTM 704**: ₡15 000 000 (fijo, auto-selecciona)
- **VTM 703**: ₡400 000 (fijo, auto-selecciona)

Fallback "otro" si un PDF importa un valor distinto — `setMontoAseg(val)` crea la opción dinámica.

### Selector de póliza (tabs superiores)

Estado global `polizaActiva` (default `'VTM 805'`). Al cambiar: `setPolizaActiva(p, el)` actualiza tabs, sidebar (`#sidebar-poliza-info`), header badge (`#header-poliza-badge`), reconstruye monto select, llama `renderAll()`. Todos los renders (`claimsDePoliza()`, `updateCounts()`, `renderCards()`, `renderStats()`) filtran por `polizaActiva`. Records sin `poliza` se asumen `'VTM 805'` (retrocompat).

Config en `POLIZAS` object (línea ~772 `app.html`):

```js
const POLIZAS = {
  'VTM 805': { nombre:'Muerte Colectiva Policía', montos:[2000000,4000000,6000000,8000000,10000000], tomador:'3002056545', moneda:'CRC' },
  'VTM 704': { nombre:'Muerte Fija ₡15M', montos:[15000000], tomador:'3002056545', moneda:'CRC' },
  'VTM 703': { nombre:'Muerte Fija ₡400K', montos:[400000], tomador:'3002056545', moneda:'CRC' },
};
```

### Coberturas

- `Pago Adelantado BITP`
- `Cob. Muerte`
- `Muerte Acc. Y Desm (DID)`

---

## BACKEND (`netlify/functions/`)

| Función | Estado | Propósito |
|---|---|---|
| `auth.mjs` | ✅ estable | POST `/api/auth` con `{pin}` → verifica contra `process.env.ACCESS_PIN` → devuelve `{ok, token: btoa(PIN + ':reclamos')}`. |
| `reclamos.mjs` | ✅ estable | CRUD Netlify Blobs store `reclamos-colectivos` (key `data` array). Acciones: GET (lista), POST (agrega con id `r-{timestamp}-{rand}`), PUT (actualiza por id), DELETE. Auth: Bearer header validado con `btoa(VALID + ':reclamos')`. Seed automático de 34 casos en primer arranque si blob vacío. |

**netlify.toml**: `publish = "."`, functions `netlify/functions`, redirect `/api/*` → `/.netlify/functions/:splat`, `/` → `/index.html`. Cache headers `no-cache` para `*.html`.

---

## ESTRUCTURA DE DATOS

```js
claim = {
  id: 'r-1735000000000-abc',
  numero: '58222024000649',           // # de caso INS
  referencia: 'CAS-0000000-XXXXX',    // Oficio INS (opcional)
  nombre: 'APELLIDOS NOMBRE',
  cedula: '204590955',
  anno: 2025,                          // editable free-form
  cobertura: 'Pago Adelantado BITP',
  poliza: 'VTM 805',                   // 'VTM 805' | 'VTM 704' | 'VTM 703' (default 805 si falta)
  // Afectado opcional (beneficio familiar — no siempre coincide con asegurado)
  afectadoNombre: 'PEREZ MORA MARIA',
  afectadoCedula: '101010101',
  afectadoVinculo: 'Cónyuge',          // editable, datalist: Titular/Cónyuge/Hijo-a/Padre/Madre/Hermano-a/Otro
  montoAseg: 10000000,                 // montos fijos segun poliza (805: 2/4/6/8/10M, 704: 15M, 703: 400K)
  montoInd: 9946334,                   // monto real pagado
  mes: 'ENERO',                        // mes de indemnización
  estado: 'Pagada',                    // Presentado|En Ajuste|Pagada|Declinado|Apelación
  fechaPres: '2024-12-10',             // YYYY-MM-DD
  fechaEv: '2024-11-01',
  fechaPago: '2025-01-15',
  iban: 'CR00 0000 0000',
  notas: '',
  reportePago: 'data:application/pdf;base64,...',   // opcional, cap ~4MB post-compresión
  reportePagoNombre: 'reporte-58222024000649.pdf'
}
```

---

## REGLAS DE DESARROLLO

1. **Single-file architecture:** toda la app vive en `app.html`. No dividir en módulos JS salvo que sea imprescindible — mantiene deploy simple y el usuario puede abrir local sin build.
2. **Modo local vs prod:** siempre verificar `IS_LOCAL` antes de hacer fetch. En local, leer/escribir `localStorage.rc-claims-local`. No requerir backend para demo.
3. **jsPDF Helvetica no soporta U+20A1 (₡)** ni emojis — usar `c/` prefix y quitar emojis en exports PDF. Para montos en Excel sí se puede usar ₡ normal.
4. **PDF parser dual:** hay dos tipos de PDF: Reporte de Liquidación (INS) y Carta Apertura (ACEPO). Usar `isLiquidacion` y `isReclamo` regex. Si ninguno matchea, mostrar "No se pudieron extraer datos" pero **no abortar** el modal — usuario puede completar manualmente.
5. **Compresión PDF:** límite real es 4 MB por payload Netlify Function (base64 infla +33%, 6 MB duro). Target 3.5 MB para tener margen. No subir el límite sin cambiar arquitectura a upload directo a Blobs.
6. **Sin Firebase:** no agregar dependencias Firebase ni librerías pesadas. Stack actual es sólido y rápido.
7. **Cache headers:** `netlify.toml` ya fuerza `no-cache` en `*.html`. Tras push, instruir al usuario "Ctrl+Shift+R" si no ve cambios — suele ser caché del browser.
8. **Sesión persiste entre dispositivos:** cualquier persona con el PIN ve los mismos datos (Netlify Blobs compartidos). Si JC comparte el PIN, todos ven/editan lo mismo.

---

## FLUJO DE TRABAJO ESTÁNDAR

1. Leer `app.html` completo (o al menos las secciones relevantes) antes de editar.
2. Editar con `Edit` tool, no `Write` (mantiene cambios focalizados).
3. Verificar en preview `reclamos-colectivos` puerto 8798 con `mcp__Claude_Preview__preview_eval` antes de pushear.
4. Commit con mensaje descriptivo (formato: acción + qué cambió + por qué breve).
5. Push a `main` → Netlify auto-deploy ~1-2 min.
6. Confirmar a JC con link clickeable al commit o URL del deploy.

---

## PUNTOS DE ATENCIÓN

- **`setUser()` eliminada** (commit `b1c5ad5`) — ese bug bloqueaba `loadClaims()`. No reintroducir lógica de user/avatar en header.
- **Logo INS oficial** (`ins-logo.png`, JADE/teal del zip oficial INS) en esquina superior izquierda en ficha blanca con halo jade. `acepo-logo.svg` queda en repo como respaldo pero no se referencia. `sdi-logo.svg` sigue en header derecho.
- **Reportes Excel/PDF filtran por `polizaActiva`**. Excel agrega columnas Afectado/Céd. Afectado/Vínculo. PDF tiene página detalle en **landscape** (11 columnas). Pies triviales se ocultan: si la póliza tiene 1 monto fijo o 1 sola cobertura.
- **Seed de 46 casos** (34 VTM 805 + 12 VTM 703) coexiste en 3 lugares: (a) `SEED_LOCAL` en `app.html` para modo local, (b) array inicializador en `reclamos.mjs` para primera carga de Blobs, (c) Netlify Blobs en producción. Si hay que actualizar, actualizar los tres. Records VTM 805 legacy no tienen campo `poliza` — el filtro lo asume por default.
- **Al agregar una nueva póliza:** (1) añadir entry a `POLIZAS` object, (2) añadir tab en HTML `.poliza-tabs`, (3) si tiene seed data, agregarla a `SEED_LOCAL` y `reclamos.mjs` con `poliza:'VTM XXX'`, (4) actualizar SKILL.md y memoria.
- **Año editable:** `f-anno` es `<input type="number">` libre (no select). Tabs stats muestran 2025/2026/2027 pero la data puede tener cualquier año.
- **Preview server** (puerto 8798) sirve desde `C:/Users/segur/Downloads/Reclamos-Colectivos` con `npx serve`. Launch config en `.claude/launch.json`.

---

## PENDIENTES / IDEAS FUTURAS

- Upload directo a Netlify Blobs para soportar PDFs > 6 MB sin compresión agresiva.
- Soporte multi-PDF por reclamo (carta apertura + reporte pago + traspaso) con lista de adjuntos.
- Dashboard comparativo año vs año (barras superpuestas).
- Alerta automática por email cuando un caso en "En Ajuste" lleva más de 60 días.
- Export Excel con columnas personalizables.
