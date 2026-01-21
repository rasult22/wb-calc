#!/usr/bin/env python3
"""
Конвертирует комиссии из Excel CSV в формат проекта.
Excel формат: ,Категория,Предмет,"27,5",31,3
Проект формат: category,subject,wb_rate,seller_to_wb_rate,seller_direct_rate
"""

import csv
import re

INPUT_FILE = "Копия Калькулятор маржи СР7.0 - 📄 Комиссии.csv"
OUTPUT_FILE = "public/data/wb_commissions.csv"

def parse_russian_number(value: str) -> float:
    """Парсит число с русской запятой: '27,5' -> 27.5"""
    if not value:
        return 0.0
    # Убираем кавычки и заменяем запятую на точку
    value = value.strip().strip('"')
    value = value.replace(',', '.')
    try:
        return float(value)
    except ValueError:
        return 0.0

def main():
    rows = []

    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            # Пропускаем пустые строки и заголовки
            if len(row) < 6:
                continue

            # Данные начинаются со 2-го столбца
            category = row[1].strip() if len(row) > 1 else ""
            subject = row[2].strip() if len(row) > 2 else ""
            wb_rate = row[3].strip() if len(row) > 3 else ""
            seller_to_wb = row[4].strip() if len(row) > 4 else ""
            seller_direct = row[5].strip() if len(row) > 5 else ""

            # Пропускаем заголовки и пустые
            if not category or not subject:
                continue
            if category == "Категория" or "📌" in category or "📄" in category:
                continue
            if "🗓️" in category or "Последнее" in subject:
                continue

            # Парсим числа
            wb_rate_num = parse_russian_number(wb_rate)
            seller_to_wb_num = parse_russian_number(seller_to_wb)
            seller_direct_num = parse_russian_number(seller_direct)

            # Пропускаем если все нули
            if wb_rate_num == 0 and seller_to_wb_num == 0:
                continue

            rows.append({
                'category': category,
                'subject': subject,
                'wb_rate': wb_rate_num,
                'seller_to_wb_rate': seller_to_wb_num,
                'seller_direct_rate': seller_direct_num,
            })

    # Сортируем по категории и предмету
    rows.sort(key=lambda x: (x['category'], x['subject']))

    # Записываем результат
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['category', 'subject', 'wb_rate', 'seller_to_wb_rate', 'seller_direct_rate'])
        for row in rows:
            writer.writerow([
                row['category'],
                row['subject'],
                row['wb_rate'],
                row['seller_to_wb_rate'],
                row['seller_direct_rate'],
            ])

    print(f"Converted {len(rows)} categories to {OUTPUT_FILE}")

    # Check specific category
    nakladnye = [r for r in rows if 'Накладные ресницы' in r['subject']]
    if nakladnye:
        print(f"  Nakladnye resnitsy: FBO={nakladnye[0]['wb_rate']}%")

if __name__ == "__main__":
    main()
