from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
from cruzamento import cargar_datos, calcular_desvios, calcular_alertas_stock, calcular_resumen_dia, calcular_recetas

app = FastAPI(title="MiseControl API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
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


@app.get("/api/todo")
async def api_todo():
    datos = cargar_datos()
    return JSONResponse({
        "resumen": calcular_resumen_dia(datos),
        "desvios": calcular_desvios(datos),
        "alertas_stock": calcular_alertas_stock(datos),
        "recetas": calcular_recetas(datos),
        "fecha": datos["meta"]["fecha"]
    })


# Serve React frontend in production (built files in /app/static)
_static_dir = Path(__file__).parent / "static"
if _static_dir.exists():
    app.mount("/assets", StaticFiles(directory=str(_static_dir / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        return FileResponse(str(_static_dir / "index.html"))
