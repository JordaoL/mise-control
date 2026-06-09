from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse, HTMLResponse
from cruzamento import cargar_datos, calcular_desvios, calcular_alertas_stock, calcular_resumen_dia

app = FastAPI(title="MiseControl")
plantillas = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    datos = cargar_datos()
    resumen = calcular_resumen_dia(datos)
    desvios = calcular_desvios(datos)
    alertas_stock = calcular_alertas_stock(datos)
    fecha = datos["meta"]["fecha"]

    return plantillas.TemplateResponse(
        request=request,
        name="dashboard.html",
        context={
            "resumen": resumen,
            "desvios": desvios,
            "alertas_stock": alertas_stock,
            "fecha": fecha
        }
    )


@app.get("/api/resumen")
async def api_resumen():
    datos = cargar_datos()
    return JSONResponse(calcular_resumen_dia(datos))


@app.get("/api/desvios")
async def api_desvios():
    datos = cargar_datos()
    return JSONResponse(calcular_desvios(datos))


@app.get("/api/stock")
async def api_stock():
    datos = cargar_datos()
    return JSONResponse(calcular_alertas_stock(datos))
