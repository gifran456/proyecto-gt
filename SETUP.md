# Configuración del Bot de Telegram para Google Sheets

## 1. OBTENER EL TOKEN DE TELEGRAM

1. Abre Telegram y busca a **@BotFather**
2. Envía el comando `/newbot`
3. Elige un nombre para tu bot (ej: "Mi Bot de Reportes")
4. Elige un username (debe terminar en "bot", ej: "mi_bot_reportes_bot")
5. Copia el token que te proporciona (formato: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)
6. Reemplaza `TU_TOKEN_DE_BOT_AQUI` en `telegram_bot.py`

## 2. OBTENER EL ID DE TU GOOGLE SHEETS

1. Abre tu Google Sheet
2. La URL se verá algo así: `https://docs.google.com/spreadsheets/d/1abc2def3ghi4jkl5mno6pqr7stu8vwx/edit#gid=0`
3. El ID es la parte entre `/d/` y `/edit`: `1abc2def3ghi4jkl5mno6pqr7stu8vwx`
4. Reemplaza `TU_ID_DE_GOOGLE_SHEETS` en `telegram_bot.py`

## 3. CONFIGURAR ACCESO AL GOOGLE SHEETS

Para que el bot pueda acceder al archivo, tienes dos opciones:

### Opción A: Compartir como público (más fácil)
1. Abre tu Google Sheet
2. Haz clic en "Compartir" (arriba a la derecha)
3. Cambia a "Cualquier persona que tenga el enlace"
4. Selecciona "Visualizador"
5. Copia el enlace

### Opción B: Usar autenticación de Google (más seguro)
- Requiere credenciales de Google Cloud
- Se necesitaría modificar el código para usar `google-auth`

## 4. INSTALAR DEPENDENCIAS

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
pip install python-telegram-bot requests
```

Requisitos:
- Python 3.8 o superior
- python-telegram-bot >= 20.0
- requests

## 5. EJECUTAR EL BOT

En la terminal ejecuta:

```bash
python telegram_bot.py
```

## 6. PROBAR EL BOT

1. Abre Telegram
2. Busca tu bot por el username que creaste
3. Envía el comando `/reporte`
4. ¡Deberías recibir el PDF!

## NOTAS IMPORTANTES

- El número `gid=0` en la URL corresponde a la primera pestaña
- Si tu dashboard está en otra pestaña, necesitarás obtener su ID (usa las herramientas de desarrollador)
- El bot estará activo mientras ejecutes `python telegram_bot.py`
- Para mantenerlo activo 24/7, considera usar un hosting como Heroku, PythonAnywhere o un servidor propio

## SOLUCIONAR PROBLEMAS

**El bot no responde:**
- Verifica que el TOKEN sea correcto
- Confirma que el bot está ejecutándose

**Error 404 al descargar el PDF:**
- El ID de Google Sheets es incorrecto
- El archivo no es accesible públicamente

**El PDF está vacío:**
- La pestaña no existe (verifica el número gid)
- El contenido no está cargado en Google Sheets
