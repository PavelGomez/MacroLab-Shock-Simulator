# Revisar, ejecutar y crear commits

Usa el repositorio que se modificó, no las copias históricas ni el directorio superior. Se verificaron Node v24.14.1, npm y Python 3; no hay script `npm test` configurado.

## 1. Revisar la rama y los cambios

```sh
cd /Users/pgomez/Documents/GPT/Macro1_GPT/repo_macrolab_auditoria
git branch --show-current
git status --short --branch
git diff --check
git diff --stat
git diff -- macro1/index.html
git diff -- macro1/test_enunciados_glosario.js macro1/test_formulas_selladas.js macro1/test_lab_is.js macro1/test_lab_islm.js macro1/test_lab_lm.js macro1/test_loop_clase3.js
```

La rama esperada es `redesign/laboratorios-experimentacion`. Los archivos nuevos no aparecen en `git diff` hasta prepararlos; puedes leerlos con:

```sh
cat macro1/test_experimentacion.js
cat scripts/test-macro1-experimentacion.js
cat docs/laboratorios-experimentacion-2026-10-08/README.md
```

## 2. Instalar dependencias existentes y ejecutar las verificaciones

```sh
cd /Users/pgomez/Documents/GPT/Macro1_GPT/repo_macrolab_auditoria
npm ci --ignore-scripts
node scripts/test-macro1-experimentacion.js
```

El ejecutor corre las 13 pruebas de `macro1/test_*.js`, `test_pautas_biblioteca.js` y `scripts/check-manifest.js`, usando el mismo Node. Falla si cualquier suite falla. Para la nueva prueba aislada:

```sh
node macro1/test_experimentacion.js
```

Para regenerar el informe solo cuando quieras reemplazar la evidencia de esta ejecución:

```sh
node scripts/test-macro1-experimentacion.js --report docs/laboratorios-experimentacion-2026-10-08/pruebas-finales.json
```

## 3. Abrir una vista local desde tu Terminal

La revisión utilizó el puerto 8766. Para tu propia sesión usa el 8767; deja este comando ejecutándose en una Terminal:

```sh
cd /Users/pgomez/Documents/GPT/Macro1_GPT/repo_macrolab_auditoria
python3 -m http.server 8767 --bind 127.0.0.1
```

En una segunda Terminal de macOS:

```sh
open 'http://127.0.0.1:8767/macro1/#bonos'
open 'http://127.0.0.1:8767/macro1/#din'
```

Verifica los casos de la matriz, las actividades finales y el regreso a Clase 3. Para detener tu servidor, pulsa Ctrl+C en su Terminal.

## 4. Crear dos commits después de revisar

No se ejecutó ninguno de estos comandos de commit. Preparan únicamente las rutas de este trabajo. Antes de cada commit vuelve a comprobar que no hay cambios nuevos ajenos en esas rutas.

Primer commit: comportamiento económico, recorrido de experimentación y pruebas correspondientes.

```sh
cd /Users/pgomez/Documents/GPT/Macro1_GPT/repo_macrolab_auditoria
sh scripts/install-hooks.sh
node scripts/test-macro1-experimentacion.js
git add -- macro1/index.html macro1/test_experimentacion.js macro1/test_enunciados_glosario.js macro1/test_formulas_selladas.js macro1/test_lab_is.js macro1/test_lab_islm.js macro1/test_lab_lm.js macro1/test_loop_clase3.js
git diff --cached --check
git diff --cached --stat
git diff --cached -- macro1/index.html
git commit -m "Rediseña laboratorios para experimentar y separa bonos del mercado de dinero"
```

Segundo commit: ejecutor reproducible y evaluación con evidencia.

```sh
git add -- scripts/test-macro1-experimentacion.js docs/laboratorios-experimentacion-2026-10-08/README.md docs/laboratorios-experimentacion-2026-10-08/TERMINAL.md docs/laboratorios-experimentacion-2026-10-08/pruebas-iniciales.json docs/laboratorios-experimentacion-2026-10-08/pruebas-finales.json docs/laboratorios-experimentacion-2026-10-08/dinero-escritorio.jpg docs/laboratorios-experimentacion-2026-10-08/dinero-movil.jpg docs/laboratorios-experimentacion-2026-10-08/bonos-escritorio.jpg
git diff --cached --check
git diff --cached --stat
git commit -m "Documenta evaluación, verificación visual y ejecución de pruebas de Macro I"
git status --short --branch
git log -2 --oneline
```

No se incluye un push, una fusión a main ni publicación automática. Esas decisiones quedan para ti después de revisar los commits.
