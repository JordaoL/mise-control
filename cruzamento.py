import json
from pathlib import Path


def cargar_datos():
    ruta = Path(__file__).parent / "data" / "mpma_muestra.json"
    with open(ruta, "r", encoding="utf-8") as f:
        return json.load(f)


def calcular_ventas_por_plato(datos):
    ventas = {}
    for ticket in datos["agora"]["tickets"]:
        for linea in ticket["lineas"]:
            if linea["familia"] == "PASTA":
                plato = linea["producto"]
                ventas[plato] = ventas.get(plato, 0) + linea["cantidad"]
    return ventas


def calcular_consumo_teorico(ventas, recetas):
    consumo = {}
    for receta in recetas:
        nombre_plato = receta["nombre"]
        qty_vendida = ventas.get(nombre_plato, 0)
        if qty_vendida == 0:
            continue
        for ing in receta["ingredientes"]:
            if ing["unidad"] == "g":
                nombre_ing = ing["nombre"]
                qty_teorica_kg = (ing["cantidad"] * qty_vendida) / 1000
                consumo[nombre_ing] = consumo.get(nombre_ing, 0) + qty_teorica_kg
    return consumo


def calcular_desvios(datos):
    ventas = calcular_ventas_por_plato(datos)
    recetas = datos["gstock"]["recetas"]
    consumo_teorico = calcular_consumo_teorico(ventas, recetas)

    inventario_real = {}
    for item in datos["gstock"]["items_inventario"]:
        if item["unidad_medida"] == "kg":
            inventario_real[item["nombre"]] = item["measureQuantity"]

    resultados = []
    for ingrediente, teorico in consumo_teorico.items():
        real = inventario_real.get(ingrediente)
        if real is None:
            continue
        desvio_pct = round(((real - teorico) / teorico) * 100, 2) if teorico > 0 else 0
        resultados.append({
            "ingrediente": ingrediente,
            "teorico_kg": round(teorico, 3),
            "real_kg": round(real, 3),
            "desvio_pct": desvio_pct,
            "alerta": abs(desvio_pct) > 5
        })

    return resultados


def calcular_alertas_stock(datos):
    mapa_inventario = {
        item["producto_asociado"]: item["measureQuantity"]
        for item in datos["gstock"]["items_inventario"]
    }

    alertas = []
    for regla in datos["gstock"]["reglas_stock"]:
        producto_id = regla["producto"]
        actual = mapa_inventario.get(producto_id)
        if actual is None:
            continue

        estado = "ok"
        if actual <= regla["stock_minimo"]:
            estado = "critico"
        elif actual < regla["stock_idoneo"]:
            estado = "atencao"

        nombre = next(
            (item["nombre"] for item in datos["gstock"]["items_inventario"]
             if item["producto_asociado"] == producto_id),
            producto_id
        )

        alertas.append({
            "producto": producto_id,
            "nombre": nombre,
            "actual_kg": round(actual, 2),
            "minimo_kg": regla["stock_minimo"],
            "ideal_kg": regla["stock_idoneo"],
            "unidad": regla["unidad"],
            "estado": estado
        })

    return alertas


def calcular_resumen_dia(datos):
    resumen = datos["agora"]["resumen_dia"]
    tickets = datos["agora"]["tickets"]

    camareros = {}
    for ticket in tickets:
        nombre_cam = ticket["camarero"]
        if nombre_cam not in camareros:
            camareros[nombre_cam] = {"total": 0, "flujo_ideal": 0, "segunda_bebida": 0}
        camareros[nombre_cam]["total"] += 1
        if ticket["flujo_ideal"]:
            camareros[nombre_cam]["flujo_ideal"] += 1
        if ticket["segunda_bebida_pago_real"]:
            camareros[nombre_cam]["segunda_bebida"] += 1

    rendimiento = []
    for nombre, metricas in camareros.items():
        total = metricas["total"]
        rendimiento.append({
            "camarero": nombre,
            "tickets": total,
            "flujo_ideal_pct": round((metricas["flujo_ideal"] / total) * 100),
            "segunda_bebida_pct": round((metricas["segunda_bebida"] / total) * 100)
        })

    tiempos_cocina = [t["tiempos_reconstruidos"]["cocina_real_min"] for t in tickets]
    tiempo_medio_cocina = round(sum(tiempos_cocina) / len(tiempos_cocina), 1) if tiempos_cocina else 0

    return {
        "n_tickets": resumen["n_tickets"],
        "comensales": resumen["comensales_estimados"],
        "facturacion": resumen["facturacion_total"],
        "ticket_medio": resumen["ticket_medio"],
        "flujo_ideal_pct": resumen["pct_flujo_ideal"],
        "tiempo_medio_cocina": tiempo_medio_cocina,
        "rendimiento_camareros": sorted(rendimiento, key=lambda x: x["flujo_ideal_pct"], reverse=True)
    }
