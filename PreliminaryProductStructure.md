 Product Structure Template

	{
  "id": "[number] (product id)",
  "title": "[string] (product title)",
  "handle": "[string] (url-safe handle/slug)",
  "description": "[string] (HTML string)",
  "published_at": "[string] (ISO 8601 datetime with timezone, e.g. 2026-01-29T11:23:27-05:00) or null",
  "created_at": "[string] (ISO 8601 datetime with timezone)",
  "vendor": "[string] (brand/vendor name)",
  "type": "[string] (product type/category)",
  "tags": [
    "[string]"
  ],

  "price": "[number] (integer cents, e.g. 6800 = $68.00)",
  "price_min": "[number] (integer cents)",
  "price_max": "[number] (integer cents)",
  "available": "[boolean]",
  "price_varies": "[boolean]",

  "compare_at_price": "[number] (integer cents, 0 if none)",
  "compare_at_price_min": "[number] (integer cents)",
  "compare_at_price_max": "[number] (integer cents)",
  "compare_at_price_varies": "[boolean]",

  "variants": [
    {
      "id": "[number] (variant id)",
      "title": "[string] (variant title, usually derived from options)",
      "option1": "[string] or null",
      "option2": "[string] or null",
      "option3": "[string] or null",
      "sku": "[string] or null",
      "requires_shipping": "[boolean]",
      "taxable": "[boolean]",
      "featured_image": "[object] (image object) or null",
      "available": "[boolean]",
      "name": "[string] (product title + variant options)",
      "public_title": "[string] or null",
      "options": [
        "[string]"
      ],
      "price": "[number] (integer cents)",
      "weight": "[number] (integer grams) or null",
      "compare_at_price": "[number] (integer cents, 0 if none)",
      "inventory_management": "[string] (e.g. \"shopify\") or null",
      "barcode": "[string] or null",
      "quantity_rule": {
        "min": "[number] (integer)",
        "max": "[number] (integer) or null",
        "increment": "[number] (integer)"
      },
      "quantity_price_breaks": [
        "[object]"
      ],
      "requires_selling_plan": "[boolean]",
      "selling_plan_allocations": [
        "[object]"
      ]
    }
  ],

  "images": [
    "[string] (image URL string; can be //cdn... or https://...)"
  ],
  "featured_image": "[string] (image URL string; can be //cdn... or https://...)",

  "options": [
    {
      "name": "[string] (option name, e.g. Size)",
      "position": "[number] (integer, 1-based)",
      "values": [
        "[string]"
      ]
    }
  ],

  "url": "[string] (relative product URL path, e.g. /products/handle)",

  "media": [
    {
      "alt": "[string] or null",
      "id": "[number] (media id)",
      "position": "[number] (integer, 1-based)",
      "preview_image": {
        "aspect_ratio": "[number]",
        "height": "[number] (integer pixels)",
        "width": "[number] (integer pixels)",
        "src": "[string] (absolute image URL)"
      },
      "aspect_ratio": "[number]",
      "height": "[number] (integer pixels)",
      "media_type": "[string] (e.g. \"image\")",
      "src": "[string] (absolute image URL)",
      "width": "[number] (integer pixels)"
    }
  ],

  "requires_selling_plan": "[boolean]",
  "selling_plan_groups": [
    "[object]"
  ]
}


