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

> Este archivo es **estado vigente** + un historial condensado al final. El nodo de memoria `project_reclamos_colectivos.md` fue **retirado el 22 jul 2026** (el Claude Memory Engine quedó exclusivo de SASINS), así que este SKILL.md + `git log` son la única fuente de verdad del proyecto. Actualizar las secciones de abajo cada vez que cambie el estado.

**Última actualización:** 22 jul 2026 — migración del nodo de memoria a este SKILL + correcciones verificadas contra el código.
**Último commit main:** `e2b4189` SKILL.md sync (verificado en `git log` el 22 jul 2026). El último cambio de código de la app es `08e2e68` "Fix: conteos de chips respetan filtros año/cobertura/buscador".
**Repo GitHub:** https://github.com/vibecode-clients-lda/Reclamos-Colectivos *(migrado desde `jhernandez-vibecode` el 11 may 2026)*
**Clon local:** `C:/Users/segur/Downloads/Reclamos-Colectivos` — ⚠️ está en **Downloads**, carpeta que barren los limpiadores de disco (CCleaner). Si desaparece, volver a clonar del repo. Por eso este SKILL.md también vive fuera de Downloads (ver "Sincronización del SKILL.md").
**Dominio público:** Netlify site `reclamos-colectivos` (transferida al team `vibecode-clients-lda`) → `reclamos-colectivos.netlify.app`
**Cliente:** Asociación Cultural y Educativa para la Policía (**ACEPO**), cédula jurídica `3-002-056545`. Las 3 pólizas son todas `0101` y conviven en la misma app con selector de tabs superior.
**Para qué existe:** JC necesita seguimiento de los reclamos de vida colectiva con estados, contador de días, estadísticas anuales y reportes de pago adjuntos.
**Proyecto hermano (no confundir):** la landing explicadora `acepo-segurosdigitales.com` es otro repo y tiene su propio skill `especialista-acepo`. Este skill cubre SOLO la app de reclamos.
**Pólizas ACEPO** (tomador `3-002-056545`):
- **VTM 805** · Muerte Colectiva Policía · montos fijos ₡2/4/6/8/10M · 34 casos seed (31 de 2025 + 3 de 2026)
- **VTM 704** · Muerte Fija ₡15M · monto único · 0 casos (sin data aún)
- **VTM 703** · Muerte Fija ₡400K · monto único · 12 casos seed (2025)

---

## ESTADO ACTUAL

- **v1.5 en producción** en el team `vibecode-clients-lda`. 🔴 Los **Netlify Blobs sobreviven el cambio de team SOLO si se usa "Transfer site"** — si alguna vez se recrea el site en lugar de transferirlo, se pierde todo el histórico.
- **Stack**: HTML/CSS/JS vanilla single-file (`app.html` ~2.470 líneas — 2.466 verificadas el 22 jul 2026) + Netlify Functions v2 ESM + Netlify Blobs (1 solo store) + Chart.js + jsPDF + pdf.js + SheetJS (xlsx).
- **Auth por PIN** simple. Token `btoa(PIN + ':reclamos')` guardado en `sessionStorage.rc-token`. **Env var `ACCESS_PIN` obligatoria** (se configura en Netlify → site `reclamos-colectivos` → Environment variables; **nunca en el repo**) — fail-closed si no está (auth devuelve 503, reclamos devuelve 401). **NO usar fallback hardcoded**: el viejo `Netlify.env.get('ACCESS_PIN') || '<valor quemado>'` era un leak en repo público y se eliminó en `d760883`.
- **Demo local** (`hostname === 'localhost' || '127.0.0.1'`) usa `SEED_LOCAL` con los 46 casos (34 VTM 805 — 31 de 2025 + 3 de 2026 — y 12 VTM 703) y localStorage como fallback.
- **Diseño:** Modern SaaS Light Dashboard — sidebar navy `#0f172a`, main `#f8fafc`, acento cyan `#06b6d4`, cards blancas con sombra sutil. Tipografía **Outfit** (títulos) + **DM Sans** (cuerpo). Logo SDI SVG en header (`sdi-logo.svg` copiado de `sdi-portal/assets/brand/logo-compacto.svg`).
- **Sin Firebase** — todo setUser/firebase auth eliminado. Sólo PIN + Netlify Blobs. Queda `firebase-config.js` en el repo como residuo sin uso (0 referencias en `app.html` / `index.html`, verificado 22 jul 2026); no reintroducirlo.

### Estructura del repo

```
Reclamos-Colectivos/
├── index.html                      # Pantalla de PIN
├── app.html                        # App completa (~2.470 líneas)
├── netlify/functions/auth.mjs      # POST /api/auth  (15 líneas)
├── netlify/functions/reclamos.mjs  # CRUD /api/reclamos + SEED 46 casos (109 líneas)
├── ins-logo.png                    # Logo INS oficial jade (header izq., ficha blanca + halo)
├── sdi-logo.svg                    # Logo SDI (header der.)
├── acepo-logo.svg                  # Placeholder — NO se referencia en el código
├── netlify.toml
├── package.json
└── .claude/SKILL.md                # Este archivo
```

Residuos sin uso en el repo: `firebase-config.js`, `sdi-logo.jpg`.

---

## MÓDULOS (Frontend — todo en `app.html`)

### Secciones principales

| Sección | Estado | Función |
|---|---|---|
| `#section-reclamos` | ✅ estable | Grid de tarjetas + chips filtro estado + buscador + filtros año/cobertura. **Los chips muestran el conteo respetando los demás filtros activos** (año/cobertura/buscador) — si filtrás 2026, el chip "Pagada N" cuenta solo las pagadas de 2026. `updateCounts()` se llama desde `renderCards()` para que cualquier cambio en los selects/buscador refresque los chips. Tarjeta muestra: caso, mes/año, estado badge, nombre, cobertura, cédula, fecha presentación, contador de días, monto. Indicador 📄 si tiene `reportePago` adjunto. |
| `#section-estadisticas` | ✅ estable | Tabs año 2025/2026/2027, 4 stat-cards, 2 doughnut charts (por cobertura + por monto asegurado), tabla top-5 montos. Botones "Descargar Excel" y "Descargar PDF". |
| `#claim-modal` | ✅ estable | Alta/edición: zona carga PDF auto-fill + form completo (asegurado + **afectado** opcional con vínculo editable) + "Reporte de Pago (Control)" PDF (base64, max 25 MB con compresión automática a <3.5 MB). |
| `#section-conciliacion` | ✅ estable | Conciliación mensual por póliza. 2 dropzones (Plantilla MAX INS + LISTADO ACEPO). **Plantilla MAX trae 3 hojas: `INCLUSIONES` (altas), `VARIACIONES` (modificaciones de monto/beneficiario), `EXCLUSIONES` (bajas)** + catálogos `Cantón`/`Distrito` (ignorar). Detecta los 4 tipos de movimientos y los muestra en **6 stat-cards + 4 bloques tabulares** (los stat-cards cuentan asegurados únicos, no filas). Export Excel respaldo (`Conciliacion_VTMxxx_MES_AAAA.xlsx`) con 5 hojas (Resumen + 4 categorías), una fila por beneficiario. Botón Limpiar resetea todo. **NO persiste** — todo en memoria; el agente guarda el Excel de respaldo en su carpeta del mes. Póliza, mes y año se detectan automáticamente del nombre del archivo. |
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
| `exportExcel()` / `exportPDF()` | ~1696 / ~1742 | Descarga reportes filtrados por `claimsDePoliza()`. **Excel** sale como `Reporte_Reclamos_VTM703_2025.xlsx` (patrón `Reporte_Reclamos_VTM{póliza}_{año}.xlsx`) con columnas de afectado + multi-beneficiario. PDF usa `c/` prefix en lugar de `₡`. Números en `en-US` locale. **Header**: "INFORME RECLAMOS - Poliza 0101 VTM XXX" + subtítulo "ASOCIACION CULTURAL Y EDUCATIVA PARA LA POLICIA" + "Cedula Juridica: 3-002-056545". **Página 1 portrait** (resumen+donuts redondos con `drawChart` helper que preserva aspect ratio+top5). **Página 2 landscape** 11 cols con afectado. **Tarjeta agente Fernando Hernández al final** (stripe jade, Licencia SUGESE 08-1319, Código 110129, WhatsApp +506 8526-3532, email `fhernandez@segurosdelins.com`, logo INS proporcional 4.23:1). Sin URL web. |

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
| `reclamos.mjs` | ✅ estable | CRUD sobre Netlify Blobs. 🔴 **El store se llama `reclamos-vtm805` y la key es `claims`** (`reclamos.mjs:62` y `:65`) — nombre heredado de cuando solo existía la VTM 805. **NO renombrarlo** aunque el site se llame `reclamos-colectivos`: se perdería todo el histórico. Acciones: GET (lista), POST (agrega con `id = Date.now().toString()`), PUT (actualiza por id), DELETE. Auth: Bearer header validado contra `btoa(ACCESS_PIN + ':reclamos')`. **Autoseed:** si el blob está vacío escribe los 46 casos del SEED; si ya tiene datos, compara los IDs del SEED contra los existentes y agrega solo los que falten (backfill, `reclamos.mjs:69-76`). |

**netlify.toml**: `publish = "."`, functions `netlify/functions`, redirect `/api/*` → `/.netlify/functions/:splat`, `/` → `/index.html`. Cache headers `no-cache` para `*.html`.

---

## ESTRUCTURA DE DATOS

```js
claim = {
  id: '1735000000000',                 // nuevos: Date.now().toString(). Seed: 's1'..'s31' (805 2025), 't1'..'t3' (805 2026), 'p703-1'..'p703-12'
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
9. **🔴 NUNCA hardcodear el PIN como fallback** (`Netlify.env.get('ACCESS_PIN') || 'algo'`). Patrón correcto: leer la env var y si no está, devolver 503 (auth) / 401 (data). Repo es público en GitHub.
10. **`git push` desde sandbox bash falla** porque el credential manager interactivo no funciona. Usar **PowerShell** para commits/push (los creds cacheados sí funcionan ahí).
11. **PDF gráficos:** usar el helper `drawChart(canvas, areaX, areaY, areaW, areaH)` que preserva aspect ratio del canvas y centra dentro del área. Sin este helper los donuts salen alargados horizontalmente.

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
- **PDF sin logos en el header:** se intentó meter ACEPO + INS en el encabezado del PDF (`36d4296`) y se **descartó** (`5690513`) porque quedaba pésimo el aspecto. El header definitivo es solo texto: "INFORME RECLAMOS" + tomador + cédula jurídica (`716d399`). No reintentar sin un diseño nuevo aprobado por JC.
- **Reportes Excel/PDF filtran por `polizaActiva`**. Excel agrega columnas Afectado/Céd. Afectado/Vínculo. PDF tiene página detalle en **landscape** (11 columnas). Pies triviales se ocultan: si la póliza tiene 1 monto fijo o 1 sola cobertura.
- **Conciliación lógica:**
  - Inclusiones = TODA fila de hoja `INCLUSIONES` (no derivar de "VARIACIONES no en LISTADO" — la asunción anterior era errónea, las altas ya están en LISTADO porque el padrón ACEPO se actualiza post-cambios).
  - Cambios de monto = filas en `VARIACIONES` cuya cédula está en LISTADO con monto distinto.
  - Cambios de beneficiario = filas en `VARIACIONES` con uno o más beneficiarios asignados.
  - Exclusiones = TODA fila de hoja `EXCLUSIONES`.
  - Header en la hoja de la Plantilla MAX: fila índice 2 (3ra fila). Cédula en col índice 2 (col C). Match exacto en "IDENTIFICACIÓN" para evitar capturar "TIPO DE IDENTIFICACIÓN". *(El nombre correcto es "Plantilla MAX"; en `app.html` quedó una etiqueta escrita "MAC" por error de tipeo.)*
- **Multi-beneficiario (Plantilla MAX):**
  - Cada fila tiene **40 columnas adicionales** = 8 slots × 5 campos (Identificación, Tipo, Nombre, Parentesco, Porcentaje).
  - Headers inconsistentes:
    - Slot 1 sin sufijo numérico (ej `Identificación BENEFICIARIOS`, `Nombre completo`, `Parentesco`, `Porcentaje`).
    - Slots 2-5 con sufijo numérico pegado (`Identificación2`, ..., `Porcentaje5`).
    - Slots 6-8 con sufijo numérico **con espacio** (`Porcentaje 6`, `Porcentaje 7`, `Porcentaje 8`).
  - Parser normaliza espacios y prueba todas las variantes.
  - Tablas y export Excel emiten **1 fila por beneficiario**: datos del asegurado solo en la 1ra fila del grupo, badge `1/N, 2/N, ...` en cada fila para visualizar la agrupación.
  - Stat-cards "Inclusiones" y "Cambios beneficiario" cuentan **asegurados únicos** (`_uniqByCedula`), no filas, para no inflar el número.
  - Códigos de parentesco (referencia INS): `020`=Cónyuge, `030`=Hijo/a, `060`=Hermano/a (no se mapea a texto en el output, se muestra como código).
- **Seed de 46 casos** (34 VTM 805 + 12 VTM 703) coexiste en 3 lugares: (a) `SEED_LOCAL` en `app.html` para modo local, (b) array inicializador en `reclamos.mjs` para primera carga de Blobs, (c) Netlify Blobs en producción. Si hay que actualizar, actualizar los tres. Records VTM 805 legacy no tienen campo `poliza` — el filtro lo asume por default.
- **Al agregar una nueva póliza:** (1) añadir entry a `POLIZAS` object, (2) añadir tab en HTML `.poliza-tabs`, (3) si tiene seed data, agregarla a `SEED_LOCAL` y `reclamos.mjs` con `poliza:'VTM XXX'`, (4) actualizar este SKILL.md en sus 2 ubicaciones.
- **Año editable:** `f-anno` es `<input type="number">` libre (no select). Tabs stats muestran 2025/2026/2027 pero la data puede tener cualquier año.
- **Preview server** (puerto 8798) sirve desde `C:/Users/segur/Downloads/Reclamos-Colectivos` con `npx serve`. Launch config en `.claude/launch.json`.

---

## PENDIENTES / IDEAS FUTURAS

**Esperando al cliente:**
- **Cargar la data de la VTM 704** cuando ACEPO la provea (hoy la póliza está creada pero con 0 casos).
- **Reemplazar `acepo-logo.svg`** (placeholder) por el logo oficial en PNG si el cliente lo entrega.

**Mejoras de producto:**
- Mostrar el afectado en la tarjeta del listado (hoy solo aparece en el modal y en los exports).
- Upload directo a Netlify Blobs para soportar PDFs > 6 MB sin compresión agresiva.
- Soporte multi-PDF por reclamo (carta apertura + reporte pago + traspaso) con lista de adjuntos.
- Dashboard comparativo año vs año (barras superpuestas).
- Alerta automática por email cuando un caso en "En Ajuste" lleva más de 60 días.
- Export Excel con columnas personalizables.

---

## SINCRONIZACIÓN DEL SKILL.md (REGLA 🔴)

Este archivo vive en **2 ubicaciones** y deben quedar idénticas después de cada cambio:

1. **Repo (se ve en GitHub):** `C:/Users/segur/Downloads/Reclamos-Colectivos/.claude/SKILL.md`
2. **Skill instalado (Claude Code, nivel usuario):** `C:/Users/segur/.claude/skills/especialista-en-reclamos-colectivos/SKILL.md`

La copia **de nivel usuario es la que manda**: la del repo está en `Downloads`, carpeta que barren los limpiadores de disco. Si el clon local desaparece, se vuelve a clonar y se copia el SKILL de vuelta.

```bash
cp C:/Users/segur/.claude/skills/especialista-en-reclamos-colectivos/SKILL.md \
   C:/Users/segur/Downloads/Reclamos-Colectivos/.claude/SKILL.md
```

---

## HISTORIAL CONDENSADO (24 abr → 11 may 2026)

Se conserva acá porque el nodo de memoria fue retirado. Para el detalle completo, `git log`.

| Commit | Qué hizo |
|---|---|
| `c5dffd4` | Módulo Conciliación inicial (LISTADO ACEPO vs Plantilla MAX, 4 categorías) |
| `3d994d0` | Fix conciliación: leer la hoja `INCLUSIONES` separada de `VARIACIONES` |
| `7d7bbd7` | Conciliación multi-beneficiario (hasta 8 por asegurado, 40 columnas adicionales) |
| `5dea8a1` | SKILL.md sync multi-beneficiario |
| `789ac38` | PDF: tarjeta del agente Fernando Hernández al final del reporte |
| `2aef600` | PDF: gráficos preservan aspect ratio (donuts redondos) |
| `36d4296` | PDF: intento de logos ACEPO+INS en el header — **descartado** |
| `5690513` | PDF: header limpio sin logos |
| `716d399` | PDF: título "INFORME RECLAMOS" + cédula jurídica `3-002-056545` |
| `d760883` | 🔴 **Security fix**: elimina el fallback quemado del PIN, `ACCESS_PIN` obligatoria (fail-closed) |
| `08e2e68` | Fix: los conteos de los chips respetan filtros año/cobertura/buscador |
| `e2b4189` | SKILL.md sync (último commit en `main`) |

Antes de esa cadena: migración del repo de `jhernandez-vibecode` a `vibecode-clients-lda` y transferencia del site Netlify con "Transfer site" (Blobs preservados), 11 may 2026.
