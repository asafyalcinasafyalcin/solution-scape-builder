"""
noon NIS (New Item Set-up) Excel/CSV toplu yükleme — API yedek yöntemi.

API onboarding takılırsa bu yöntemle ürün yükle:
  1. Seller Lab > Catalog > Partner Catalog > Create Multiple Products
  2. NIS şablonunu indir (EN veya EN+AR)
  3. Bu modülle şablonu doldur
  4. Seller Lab > Catalog > Imports'tan yükle
  5. QC sonrası ~2-3 iş günü yayınlanır

Referans: noon Seller Lab Help Center
"""

import io
from typing import Optional
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment


def generate_nis_excel(products: list[dict]) -> bytes:
    """
    NIS Excel dosyası oluştur.

    products: [{
        "sku": "MY-SKU-001",
        "title_en": "Cotton Towel 50x100cm White",
        "title_ar": "منشفة قطنية 50x100 سم بيضاء",
        "brand": "MyBrand",
        "category": "Bath Towels",
        "color": "White",
        "size": "50x100",
        "material": "100% Cotton",
        "price_aed": 29.99,
        "stock": 100,
        "image_main_url": "https://...",
        "origin": "Turkey",
        "barcode": "",  # boş bırak GTIN muafiyeti için
        "description_en": "...",
        "description_ar": "...",
    }, ...]

    Döner: Excel dosyası (bytes) — Seller Lab'a yüklenecek
    """
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "NIS Template"

    headers = [
        "Seller SKU *",
        "Product Title (EN) *",
        "Product Title (AR)",
        "Brand *",
        "Category *",
        "Color",
        "Size",
        "Material",
        "Price (AED) *",
        "Stock Quantity *",
        "Main Image URL *",
        "Image 2 URL",
        "Image 3 URL",
        "Country of Origin",
        "Barcode (EAN/UPC)",
        "Description (EN)",
        "Description (AR)",
    ]

    header_fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
    header_font = Font(color="FFFFFF", bold=True)

    for col_num, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_num, value=header)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center")
        ws.column_dimensions[cell.column_letter].width = 20

    for row_num, product in enumerate(products, 2):
        row = [
            product.get("sku", ""),
            product.get("title_en", ""),
            product.get("title_ar", ""),
            product.get("brand", ""),
            product.get("category", ""),
            product.get("color", ""),
            product.get("size", ""),
            product.get("material", ""),
            product.get("price_aed", ""),
            product.get("stock", ""),
            product.get("image_main_url", ""),
            product.get("image_2_url", ""),
            product.get("image_3_url", ""),
            product.get("origin", "Turkey"),
            product.get("barcode", ""),
            product.get("description_en", ""),
            product.get("description_ar", ""),
        ]
        for col_num, value in enumerate(row, 1):
            ws.cell(row=row_num, column=col_num, value=value)

    buffer = io.BytesIO()
    wb.save(buffer)
    return buffer.getvalue()


def generate_nis_csv(products: list[dict]) -> str:
    """NIS CSV formatında ürün verisi oluştur."""
    headers = [
        "Seller SKU", "Title EN", "Title AR", "Brand", "Category",
        "Color", "Size", "Material", "Price AED", "Stock",
        "Image Main", "Origin", "Barcode", "Description EN", "Description AR"
    ]

    rows = [",".join(headers)]
    for p in products:
        row = [
            p.get("sku", ""),
            f'"{p.get("title_en", "")}"',
            f'"{p.get("title_ar", "")}"',
            p.get("brand", ""),
            p.get("category", ""),
            p.get("color", ""),
            p.get("size", ""),
            p.get("material", ""),
            str(p.get("price_aed", "")),
            str(p.get("stock", "")),
            p.get("image_main_url", ""),
            p.get("origin", "Turkey"),
            p.get("barcode", ""),
            f'"{p.get("description_en", "")}"',
            f'"{p.get("description_ar", "")}"',
        ]
        rows.append(",".join(row))

    return "\n".join(rows)
