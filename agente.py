import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
from cruzamento import cargar_datos, calcular_desvios, calcular_alertas_stock

load_dotenv()

LIMITE_DESVIO = float(os.getenv("LIMITE_DESVIO", 5))


def verificar_y_alertar():
    datos = cargar_datos()
    desvios = calcular_desvios(datos)
    alertas_stock = calcular_alertas_stock(datos)

    desvios_criticos = [d for d in desvios if abs(d["desvio_pct"]) > LIMITE_DESVIO]
    stock_critico = [a for a in alertas_stock if a["estado"] == "critico"]

    if not desvios_criticos and not stock_critico:
        print("✓ Todos los ingredientes y stocks dentro del estándar.")
        return

    if desvios_criticos:
        print(f"⚠ {len(desvios_criticos)} desvío(s) encontrado(s):")
        for d in desvios_criticos:
            signo = "+" if d["desvio_pct"] > 0 else ""
            print(f"  - {d['ingrediente']}: {signo}{d['desvio_pct']}%")

    if stock_critico:
        print(f"🚨 {len(stock_critico)} producto(s) en stock crítico:")
        for a in stock_critico:
            print(f"  - {a['nombre']}: {a['actual_kg']} {a['unidad']} (mín {a['minimo_kg']})")

    _enviar_email(desvios_criticos, stock_critico)


def _enviar_email(desvios_criticos, stock_critico):
    email = os.getenv("ALERT_EMAIL")
    contrasena = os.getenv("EMAIL_CONTRASENA")

    if not email or not contrasena:
        print("Email no configurado — omitiendo envío.")
        return

    lineas_desvio = "\n".join(
        f"- {d['ingrediente']}: {'+' if d['desvio_pct'] > 0 else ''}{d['desvio_pct']}%"
        for d in desvios_criticos
    )
    lineas_stock = "\n".join(
        f"- {a['nombre']}: {a['actual_kg']} {a['unidad']} (mín {a['minimo_kg']})"
        for a in stock_critico
    )

    cuerpo = "Alertas MiseControl — MPMA\n\n"
    if desvios_criticos:
        cuerpo += f"Desvíos de mise en place (>{LIMITE_DESVIO}%):\n{lineas_desvio}\n\n"
    if stock_critico:
        cuerpo += f"Stock crítico:\n{lineas_stock}\n"

    msg = MIMEText(cuerpo)
    msg["Subject"] = "⚠ MiseControl — Alertas operacionales"
    msg["From"] = email
    msg["To"] = email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as servidor:
            servidor.login(email, contrasena)
            servidor.send_message(msg)
        print("Email de alerta enviado.")
    except Exception as e:
        print(f"Error al enviar email: {e}")


if __name__ == "__main__":
    verificar_y_alertar()
