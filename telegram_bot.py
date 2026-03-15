import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes
import requests
from io import BytesIO
import time
import fitz  # PyMuPDF
from PIL import Image

# Configurar logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Configuración desde variables de entorno
TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN')
GOOGLE_SHEETS_ID = os.getenv('GOOGLE_SHEETS_ID')
SHEET_NAME = os.getenv('SHEET_NAME', 'ANALISIS TABLAS')
SHEET_GID = os.getenv('SHEET_GID', '1498677826')

if not TELEGRAM_TOKEN or not GOOGLE_SHEETS_ID:
    raise ValueError("❌ Error: TELEGRAM_TOKEN y GOOGLE_SHEETS_ID son requeridos en variables de entorno")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /start"""
    await update.message.reply_text(
        'Hola! Soy tu bot de reportes.\n\n'
        '📋 Comandos disponibles:\n'
        '• /reporte - Descargar dashboard como PDF\n'
        '• /imagen - Descargar dashboard como imagen PNG\n'
        '• /debug - Verificar conectividad'
    )

async def descargar_google_sheets_como_pdf(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /reporte - Descargar Google Sheets como PDF"""
    try:
        # Mostrar mensaje de procesamiento
        mensaje = await update.message.reply_text('⏳ Generando el PDF del dashboard...')
        
        # Configurar headers para simular navegador real
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Intentar con diferentes formatos de URL
        urls_a_intentar = [
            # Formato 1: con GID específico
            f'https://docs.google.com/spreadsheets/d/{GOOGLE_SHEETS_ID}/export?format=pdf&gid={SHEET_GID}',
            # Formato 2: sin GID (descarga todas las hojas)
            f'https://docs.google.com/spreadsheets/d/{GOOGLE_SHEETS_ID}/export?format=pdf',
            # Formato 3: con porkit=1 para más compatibilidad
            f'https://docs.google.com/spreadsheets/d/{GOOGLE_SHEETS_ID}/export?format=pdf&gid={SHEET_GID}&porkit=1',
        ]
        
        response = None
        url_exitosa = None
        
        for url in urls_a_intentar:
            try:
                logger.info(f"Intentando descargar desde: {url}")
                response = requests.get(url, headers=headers, timeout=90, allow_redirects=True)
                logger.info(f"Status code: {response.status_code}, Tamaño: {len(response.content)} bytes")
                
                if response.status_code == 200 and len(response.content) > 5000:
                    url_exitosa = url
                    break
            except Exception as e:
                logger.warning(f"Error con URL {url}: {e}")
                continue
        
        if response is None:
            await update.message.reply_text(
                '❌ No se pudo conectar con Google Sheets.\n'
                'Por favor intenta más tarde.'
            )
            return
        
        if response.status_code == 200 and len(response.content) > 5000:
            # Enviar el PDF
            pdf_file = BytesIO(response.content)
            pdf_file.name = 'Dashboard.pdf'
            
            await update.message.reply_document(
                document=pdf_file,
                caption='📊 Aquí está tu Dashboard en PDF',
                filename='Dashboard.pdf'
            )
            
            # Eliminar mensaje de procesamiento
            try:
                await context.bot.delete_message(
                    chat_id=update.message.chat_id,
                    message_id=mensaje.message_id
                )
            except:
                pass
            logger.info(f"PDF enviado exitosamente a {update.message.from_user.id}")
            
        elif response.status_code == 400:
            await update.message.reply_text(
                '❌ Error 400 - El GID de la pestaña es incorrecto.\n\n'
                '⚠️ Intenta estos pasos:\n\n'
                '1. Abre tu Google Sheet\n'
                '2. Abre la URL en el navegador (copia-pega esto):\n\n'
                f'`https://docs.google.com/spreadsheets/d/{GOOGLE_SHEETS_ID}/export?format=pdf`\n\n'
                '3. Si se descarga, responde con /reporte\n'
                '4. Si no, avísame'
            )
        elif response.status_code == 403:
            await update.message.reply_text(
                '❌ Error 403: El archivo NO es público.\n\n'
                'Por favor asegúrate de:\n'
                '1. Haber hecho clic en "Compartir"\n'
                '2. Cambiar de "Restringido" a "Cualquier persona con el enlace"\n'
                '3. Seleccionar "Visualizador"'
            )
        elif response.status_code == 404:
            await update.message.reply_text(
                f'❌ Error 404: No encontrado.\n\n'
                f'ID: `{GOOGLE_SHEETS_ID}`\n\n'
                'Verifica que sea el ID correcto.'
            )
        else:
            contenido = response.text[:300] if response.text else "Sin detalles"
            await update.message.reply_text(
                f'❌ Error {response.status_code}: {contenido}'
            )
            
    except Exception as e:
        logger.error(f"Error en /reporte: {e}", exc_info=True)
        await update.message.reply_text(
            f'❌ Error: {str(e)}'
        )

async def descargar_google_sheets_como_imagen(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /imagen - Descargar Google Sheets como imagen PNG (convertida desde PDF)"""
    try:
        # Mostrar mensaje de procesamiento
        mensaje = await update.message.reply_text('⏳ Generando imagen del dashboard...\n(Esto puede tomar 10-20 segundos)')
        
        # Configurar headers para simular navegador real
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Usar la misma URL que para PDF
        url = f'https://docs.google.com/spreadsheets/d/{GOOGLE_SHEETS_ID}/export?format=pdf&gid={SHEET_GID}'
        
        try:
            logger.info("Descargando PDF para convertir a imagen...")
            response = requests.get(url, headers=headers, timeout=90, allow_redirects=True)
            
            if response.status_code == 200 and len(response.content) > 5000:
                # Convertir PDF a imagen usando PyMuPDF
                logger.info("Convirtiendo PDF a imagen...")
                await update.message.reply_text('⏳ Convirtiendo PDF a imagen...')
                
                try:
                    # Abrir PDF desde bytes
                    pdf_document = fitz.open(stream=response.content, filetype="pdf")
                    num_pages = pdf_document.page_count
                    
                    logger.info(f"PDF tiene {num_pages} páginas")
                    
                    # Convertir solo la primera página
                    page = pdf_document[0]
                    
                    # Renderizar página a imagen
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)  # 2x zoom
                    img_data = pix.tobytes("png")
                    
                    # Crear archivo de imagen
                    image_bytes = BytesIO(img_data)
                    image_bytes.name = 'Dashboard.png'
                    
                    # Enviar imagen
                    caption = '📊 Dashboard'
                    await update.message.reply_photo(
                        photo=image_bytes,
                        caption=caption
                    )
                    
                    # Eliminar mensaje de procesamiento
                    try:
                        await context.bot.delete_message(
                            chat_id=update.message.chat_id,
                            message_id=mensaje.message_id
                        )
                    except:
                        pass
                    
                    logger.info(f"Imagen enviada exitosamente a {update.message.from_user.id}")
                        
                except Exception as e:
                    logger.error(f"Error en conversión PDF a imagen: {e}", exc_info=True)
                    await update.message.reply_text(
                        f'❌ Error al convertir a imagen: {str(e)}\n\n'
                        'Intenta con /reporte (PDF) en su lugar.'
                    )
                    
            elif response.status_code == 400:
                await update.message.reply_text(
                    '❌ Error 400 - El GID puede estar mal.\n\n'
                    'Intenta con /reporte (PDF) en su lugar.'
                )
            elif response.status_code == 403:
                await update.message.reply_text(
                    '❌ Error 403: El archivo NO es público.\n\n'
                    'Asegúrate de compartir el Google Sheet públicamente.'
                )
            else:
                await update.message.reply_text(
                    f'❌ Error {response.status_code}\n\n'
                    'No se pudo generar la imagen.\n'
                    'Intenta con /reporte (PDF) en su lugar.'
                )
        except requests.exceptions.Timeout:
            await update.message.reply_text(
                '❌ Timeout - Google tardó demasiado\n\n'
                'Intenta con /reporte (PDF) que es más rápido.'
            )
        except Exception as e:
            logger.error(f"Error descargando: {e}")
            await update.message.reply_text(
                f'❌ Error: {str(e)}\n\n'
                'Intenta con /reporte (PDF) en su lugar.'
            )
            
    except Exception as e:
        logger.error(f"Error en /imagen: {e}", exc_info=True)
        await update.message.reply_text(
            f'❌ Error: {str(e)}'
        )

async def debug(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /debug - Verificar conectividad"""
    try:
        msg = await update.message.reply_text('🔍 Probando conectividad...')
        
        # Probar URL con el GID correcto
        url = f'https://docs.google.com/spreadsheets/d/{GOOGLE_SHEETS_ID}/export?format=pdf&gid={SHEET_GID}'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0'
        }
        
        try:
            # Aumentar timeout a 60 segundos
            response = requests.get(url, headers=headers, timeout=60, allow_redirects=True)
            
            debug_info = f'📊 Debug Info:\n\n'
            debug_info += f'ID: `{GOOGLE_SHEETS_ID}`\n'
            debug_info += f'GID: {SHEET_GID}\n'
            debug_info += f'Status: {response.status_code}\n'
            debug_info += f'Tamaño: {len(response.content)} bytes\n'
            debug_info += f'Content-Type: {response.headers.get("content-type", "No especificado")}\n\n'
            
            if response.status_code == 200:
                if len(response.content) > 5000:
                    debug_info += '✅ La conexión funciona!\n'
                    debug_info += 'Intenta /reporte para descargar el PDF'
                else:
                    debug_info += '⚠️ Se descargó pero el archivo es muy pequeño.\n'
                    debug_info += 'Posibles causas:\n'
                    debug_info += '• Google está limitando las descargas\n'
                    debug_info += '• El Sheet está vacío\n'
                    debug_info += '• Hay un error en la exportación'
            elif response.status_code == 400:
                debug_info += '❌ Error 400 - Solicitud inválida\n'
                debug_info += 'El GID puede estar mal.'
            elif response.status_code == 403:
                debug_info += '❌ Error 403 - Acceso denegado\n'
                debug_info += '⚠️ El Sheet NO está compartido públicamente.\n\n'
                debug_info += 'Solución:\n'
                debug_info += '1. Abre el Google Sheet\n'
                debug_info += '2. Botón "Compartir" (arriba derecha)\n'
                debug_info += '3. Cambiar: "Restringido" → "Cualquier persona"\n'
                debug_info += '4. Selecciona "Visualizador"\n'
                debug_info += '5. Intenta /debug de nuevo'
            elif response.status_code == 404:
                debug_info += '❌ Error 404 - No encontrado\n'
                debug_info += '⚠️ El ID del Sheet es incorrecto o fue eliminado.'
            else:
                debug_info += f'❌ Error {response.status_code}\n'
                debug_info += f'Respuesta: {response.text[:150]}'
            
            await msg.edit_text(debug_info)
            
        except requests.exceptions.Timeout:
            await msg.edit_text('❌ Timeout - Google tardó demasiado en responder\n\nIntentando de nuevo en 5 segundos...')
            # Reintentar una vez más
            import time
            time.sleep(5)
            try:
                response = requests.get(url, headers=headers, timeout=90, allow_redirects=True)
                if response.status_code == 200 and len(response.content) > 5000:
                    await msg.edit_text('✅ Segundo intento exitoso!\nIntenta /reporte ahora')
                else:
                    await msg.edit_text(f'❌ Segundo intento falló con código {response.status_code}')
            except:
                await msg.edit_text('❌ Sigue habiendo timeout. Google está sobrecargado.\nIntenta en unos minutos.')
        except requests.exceptions.ConnectionError:
            await msg.edit_text('❌ Error de conexión\nVerifica tu conexión a internet')
        except Exception as e:
            await msg.edit_text(f'❌ Error en la solicitud: {str(e)}')
        
    except Exception as e:
        logger.error(f"Error en /debug: {e}", exc_info=True)
        await update.message.reply_text(f'❌ Error en debug: {str(e)}')

async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Manejo de errores"""
    logger.error(msg="Error:", exc_info=context.error)

def main() -> None:
    """Iniciar el bot"""
    # Crear la aplicación
    application = Application.builder().token(TELEGRAM_TOKEN).build()
    
    # Agregar handlers de comandos
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("reporte", descargar_google_sheets_como_pdf))
    application.add_handler(CommandHandler("imagen", descargar_google_sheets_como_imagen))
    application.add_handler(CommandHandler("debug", debug))
    
    # Agregar handler de errores
    application.add_error_handler(error_handler)
    
    # Iniciar el bot
    print("🤖 Bot iniciado. Presiona Ctrl+C para detener.")
    application.run_polling()

if __name__ == '__main__':
    main()
