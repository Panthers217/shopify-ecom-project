---
title: Cart API reference
description: >-
  Learn about the calls that the Cart API can make and the responses it will
  return.
api_name: ajax
source_url:
  html: 'https://shopify.dev/docs/api/ajax/reference/cart'
  md: 'https://shopify.dev/docs/api/ajax/reference/cart.md'
---

# Cart API reference

The Cart API is used to interact with a cart during a customer's session. This guide shows how to use the Cart API to update cart line items, add cart attributes and notes, and generate shipping rates.

All Ajax API requests should use [locale-aware URLs](https://shopify.dev/docs/api/ajax#locale-aware-urls) to give visitors a consistent experience.

**Note:**

For simplicity, the code examples in this guide don't always use a callback.

***

## POST /{locale}/cart/add.​js

Use the `POST /{locale}/cart/add.js` endpoint to add one or multiple variants to the cart.

In the following example, `quantity` is the amount of the variant that you want to add and `id` is the variant ID of that variant. You can add multiple variants to the cart by appending more objects in the `items` array.

Below is a simplified `POST` request using the `fetch` API. The `formData` object is built in JavaScript, so the `Content-Type` should be set to `application/json` in the `headers` object. The response is the JSON of the line items associated with the added variants. If an item is already in the cart, then `quantity` is equal to the new quantity for that item.

## Example request

```js
let formData = {
 'items': [{
  'id': 36110175633573,
  'quantity': 2
  }]
};


fetch(window.Shopify.routes.root + 'cart/add.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(formData)
})
.then(response => {
  return response.json();
})
.catch((error) => {
  console.error('Error:', error);
});
```

## Response

```json
{
  "items": [
    {
      "id": 36110175633573,
      "title": "Red Rain Coat - Small",
      "key": "794864229:03af7a8cb59a4c3c45595c76fa8cb53c",
      "price": 12900,
      "line_price": 12900,
      "quantity": 2,
      "sku": null,
      "grams": 0,
      "vendor": "Shopify",
      "properties": {},
      "variant_id": 794864229,
      "gift_card": false,
      "url": "/products/red-rain-coat?variant=794864229",
      "featured_image": {
        "url": "http://cdn.shopify.com/s/files/1/0040/7092/products/red-rain-coat.jpeg?v=1402604893",
        "aspect_ratio": 1.0,
        "alt": "Red rain coat with a hood"
      },
      "image": "http://cdn.shopify.com/s/files/1/0040/7092/products/red-rain-coat.jpeg?v=1402604893",
      "handle": "red-rain-coat",
      "requires_shipping": true,
      "product_title": "Red Rain Coat",
      "product_description": "A bright red rain coat for rainy days!",
      "product_type": "Coat",
      "properties" : null,
      "variant_title": "Red",
      "variant_options": ["Red"],
      "options_with_values": [
        {
          "name": "Color",
          "value": "Red"
        }
      ]
    }
  ]
}
```

Alternatively, you can use the [`FormData` constructor](https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData) and target the desired add-to-cart form:

```js
let addToCartForm = document.querySelector('form[action$="/cart/add"]');
let formData = new FormData(addToCartForm);


fetch(window.Shopify.routes.root + 'cart/add.js', {
  method: 'POST',
  body: formData
})
.then(response => {
  return response.json();
})
.catch((error) => {
  console.error('Error:', error);
});
```

### Response

The response for a successful `POST` request is a JSON object of the line items associated with the added items.

If an added item was already in the cart, then the `quantity` is equal to the new quantity for that cart line item. However, if the same items have differing prices, properties, or selling plans, then they'll be split into their own line items.

**Tip:**

Changes in price are typically the result of [automatic discounts](https://help.shopify.com/en/manual/discounts/automatic-discounts) or [Shopify Scripts](https://help.shopify.com/manual/checkout-settings/script-editor).

## Example data

```js
items: [
  {
    id: 36323170943141,
    quantity: 1
  },
  {
    id: 36323170943141,
    selling_plan: 6717605,
    quantity: 1
  },
  {
    id: 36323170943141,
    parent_id: 4534355122,
    quantity: 1
  }
]
```

## Response

```json
{
  "items":[
    {
      "id":36323170943141,
      "properties":null,
      "quantity":1,
      "variant_id":36323170943141,
      "key":"36323170943141:b15f59bb6d406f2f45dc383a5493bdb8",
      "title":"Great Granola Bar",
      "price":2000,
      "original_price":2000,
      "discounted_price":2000,
      "line_price":2000,
      "original_line_price":2000,
      "total_discount":0,
      "discounts":[],
      "sku":"",
      "grams":0,
      "vendor":"shopify",
      "taxable":true,
      "product_id":5680114172069,
      "product_has_only_default_variant":true,
      "gift_card":false,
      "final_price":2000,
      "final_line_price":2000,
      "url":"/products/great-granola-bar?variant=36323170943141",
      "featured_image":{
        "aspect_ratio":1.504,
        "alt":"Great Granola Bar",
        "height":1277,
        "url":"https://cdn.shopify.com/s/files/1/0401/3218/2181/products/fallon-michael-h2UH2674Bg4-unsplash.jpg?v=1600796940",
        "width":1920
      },
      "image":"https://cdn.shopify.com/s/files/1/0401/3218/2181/products/fallon-michael-h2UH2674Bg4-unsplash.jpg?v=1600796940",
      "handle":"great-granola-bar",
      "requires_shipping":true,
```

### Error responses

If the specified quantity for an item exceeds the available stock (e.g., attempting to add 20 items when only 10 are available), the cart will instead add the maximum available quantity. The error returned in JSON format is as follows:

```json
{
  "status": 422,
  "message": "Cart Error",
  "description": "You can't add more #{item.name} to the cart."
}
```

If the product is entirely sold out, then the following error is returned:

```json
{
  "status": 422,
  "message": "Cart Error",
  "description": "The product '#{item.name}' is already sold out."
}
```

If the product is not sold out, but all of its stock is in the cart, then the following error is returned:

```json
{
  "status": 422,
  "message": "Cart Error",
  "description": "You can't add more #{item.name} to the cart."
}
```

### Add line item properties

You can add a variant to the cart with [line item properties](https://shopify.dev/docs/api/liquid/objects/line_item#line_item-properties) using the `properties` property. Its value must be an object of key-value pairs.

## Request data

```js
items: [
  {
    quantity: 1,
    id: 794864229,
    properties: {
      'First name': 'Caroline'
    }
  }
]
```

## Response

```json
{
  "items": [
    {
      "id": 794864229,
      "quantity": 1,
      // ...
      "properties" : {
        "First name": "Caroline"
      }
    }
  ]
}
```

### Add a selling plan

You can add a variant with a [selling plan](https://shopify.dev/docs/api/liquid/objects/selling_plan) to the cart using the `selling_plan` parameter. Its value must be the [selling plan ID](https://shopify.dev/docs/api/liquid/objects/selling_plan#selling_plan-id).

## Request data

```js
items: [
  {
    quantity: 1,
    id: 794864229,
    selling_plan: 183638
  }
]
```

## Response

```json
{
  "items": [
    {
      "id": 794864229,
      // ...
      "selling_plan_allocation": {
        "price": 3120,
        "compare_at_price": 3900,
        "per_delivery_price": 3120,
        "selling_plan": {
          "id": 183638,
          "name": "Pay every month, delivery every month | save 20%",
          "description": "No commitment · Auto-renews · Skip or cancel anytime",
          "options": [{
            "name": "Delivery Frequency",
            "position": 1,
            "value": "Month"
          }, {
            "name": "Billing Frequency",
            "position": 2,
            "value": "Month"
          }],
          "recurring_deliveries": true
        }
      }
    }
  ]
}
```

***

## GET /{locale}/cart.​js

Use the `GET /{locale}/cart.js` endpoint to get the cart as JSON.

All monetary properties are returned in the customer's presentment currency. To check the customer's presentment currency, you can use the `currency` field in the response. To learn more about selling in multiple currencies, refer to [Migrate your app to support multi-currency](https://shopify.dev/docs/api/admin-rest/latest/resources/transaction).

### Responses

#### JSON of a cart

```json
{
  "token": "Z2NwLXVzLXdlc3QxOjAxSjBQTVk1Sjc5NVFKTjNOVlhLWENXQUI1?key=0d9909213054e22d092152de385763f0",
  "note": "Hello!",
  "attributes": {
    "Gift wrap": "Yes"
  },
  "original_total_price": 3399,
  "total_price": 2925,
  "total_discount": 474,
  "total_weight": 500,
  "item_count": 2,
  "items": [
    {
      "id": 39897499729985,
      "properties": {},
      "quantity": 1,
      "variant_id": 39897499729985,
      "key": "39897499729985:b1fca88d0e8bf5290f306f808785f744",
      "title": "Health potion - S / Low",
      "price": 900,
      "original_price": 900,
      "discounted_price": 900,
      "line_price": 900,
      "original_line_price": 900,
      "total_discount": 0,
      "discounts": [],
      "sku": "",
      "grams": 500,
      "vendor": "Polina's Potent Potions",
      "taxable": true,
      "product_id": 6786188247105,
      "product_has_only_default_variant": false,
      "gift_card": false,
      "final_price": 900,
      "final_line_price": 900,
      "url": "/products/health-potion?selling_plan=610435137&variant=39897499729985",
```

#### JSON of an empty cart

```json
{
  "token": "Z2NwLXVzLXdlc3QxOjAxSjBQTVk1Sjc5NVFKTjNOVlhLWENXQUI1?key=0d9909213054e22d092152de385763f0",
  "note": null,
  "attributes": {},
  "original_total_price": 0,
  "total_price": 0,
  "total_discount": 0,
  "total_weight": 0,
  "item_count": 0,
  "items": [],
  "requires_shipping": false,
  "currency": "CAD",
  "items_subtotal_price": 0,
  "cart_level_discount_applications": []
}
```

**Tip:**

If you want to empty an existing cart, then use the `/{locale}/cart/clear` endpoint.

#### JSON of a cart with remote products

```json
{
  "token": "Z2NwLXVzLXdlc3QxOjAxSjBQTVk1Sjc5NVFKTjNOVlhLWENXQUI1?key=0d9909213054e22d092152de385763f0",
  "note": null,
  "attributes": {},
  "original_total_price": 4925,
  "total_price": 4925,
  "total_discount": 0,
  "total_weight": 500,
  "item_count": 3,
  "items": [
    {
      "id": 36323170943141,
      "quantity": 1,
      "title": "Blue Mug - Sold by Sam's Shop",
      "remote": true,
      ...
    },
    {
      "id": 36323170943142,
      "quantity": 1,
      "title": "Salad bowl - Sold by Home Experts",
      "remote": true,
      ...
    },
    {
      "id": 36323170943143,
      "quantity": 1,
      "title": "Silverware set",
      ...
    }
  ],
  "requires_shipping": false,
  "currency": "CAD",
  "items_subtotal_price": 3149,
  "cart_level_discount_applications": []
}
```

***

## POST /{locale}/cart/update.​js

Use the `POST /{locale}/cart/update.js` endpoint to update the cart's line item quantities, note, or attributes. You can submit a serialized cart form, or submit separate updates to a cart's line items, note, or attributes.

### Update line item quantities

To update line item quantities, you can make a `POST` request with an `updates` object. The `updates` object must contain key-value pairs where the value is the desired quantity, and the key is one of the following:

* The line item's [`variant_id`](https://shopify.dev/docs/api/liquid/objects/line_item#line_item-variant_id)
* The line item's [`key`](https://shopify.dev/docs/api/liquid/objects/line_item#line_item-key)

```js
let updates = {
  794864053: 2,
  794864233: 3
};


fetch(window.Shopify.routes.root + 'cart/update.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ updates })
})
.then(response => {
  return response.json();
})
.catch((error) => {
  console.error('Error:', error);
});
```

A cart can have multiple line items that share the same `variant_id`. For example, when variants have different [line item properties](https://shopify.dev/docs/api/liquid/objects/line_item#line_item-properties), or [automatic discounts](https://help.shopify.com/en/manual/discounts/automatic-discounts) create variants at different prices. Because of this, it's recommended to use the line item key to ensure that you're only changing the intended line item.

The line item key is not persistent for the lifetime of a line item, it changes as characteristics of the line item change. This includes, but is not limited to, properties and discount applications.

**Note:**

If you use the variant ID, then the key can be either an integer or a string. However, if you use the line item key, then the key needs to be a string.

The following `POST` request yields the same result:

```js
var formData = new FormData();
formData.append("updates[794864053]", 2);
formData.append("updates[794864233]", 3);


fetch(window.Shopify.routes.root + 'cart/update.js', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

The `/{locale}/cart/update.js` endpoint adds new line items to the cart if the `variant_id` provided doesn't match any line item already in the cart. However, if the `variant_id` matches multiple line items, then the first matching line item is updated.

**Tip:**

Use the `change.js` endpoint when changing line items that are already in the cart, and the `add.js` endpoint when adding new line items.

You can remove items from the cart by setting the quantity to 0:

```js
let updates = {
  794864053: 0,
  794864233: 0
};


fetch(window.Shopify.routes.root + 'cart/update.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ updates })
})
.then(response => {
  return response.json();
})
.catch((error) => {
  console.error('Error:', error);
});
```

You can also submit an array of numbers to `/{locale}/cart/update.js`, provided the size of the array matches the number of line items in the cart. Each number in the array sets the quantity for the corresponding line item in the cart. For example, if you have 3 line items in the cart with quantities 1, 2, and 3, and you want to change those quantities to 3, 2, and 1, then you can use the following:

```js
fetch(window.Shopify.routes.root + 'cart/update.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ updates: [3, 2, 1] })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Update the cart note

To update the cart note, you can make a `POST` request with a `note` character string:

```js
{
  note: 'This is a note about my order'
}
```

### Update cart attributes

To update cart attributes, you can make a `POST` request with an `attributes` object. The `attributes` object must contain key-value pairs where the `key` is the name of the attribute you want to update, and the value is the attribute value:

```js
{
  attributes: {
    'Gift wrap': 'Yes'
  }
}
```

The following `POST` request yields the same result:

```js
var formData = new FormData();
formData.append("attributes[Gift wrap]", "Yes");


fetch(window.Shopify.routes.root + 'cart/update.js', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### Update discounts in the cart

You can apply a discount to the cart, as shown in the following example:

```js
{
  discount: 'discount_code'
}
```

You can also apply multiple discounts to the cart using a comma `,` separator:

```js
{
  discount: 'discount_code,discount_code2'
}
```

To remove all discounts from the cart, use an empty string:

```js
{
  discount: ''
}
```

### Response

The JSON of the cart.

### Error responses

If a variant ID is provided that either doesn't exist or isn't available in the online store channel, then the endpoint returns the following error:

```js
{
  "status": 404,
  "message": "Cart Error"
  "description": "Cannot find variant"
}
```

**Caution:**

The `update.js` endpoint doesn't validate the quantity on variants that are already in the cart. This means that it's possible to add more inventory than is available.

***

## POST /{locale}/cart/change.​js

Use the `/{locale}/cart/change.js` endpoint to change the `quantity`, `properties`, and `selling_plan` properties of a cart line item. Only items already in your cart can be changed, and you can change only one line item at a time.

### Identify the line item to change

The `POST` data requires either an `id` or `line` property to identify the line item to be changed.

#### The `id` property

The value of the `id` property can be one of the following:

* The line item's [`variant_id`](https://shopify.dev/docs/api/liquid/objects/line_item#line_item-variant_id)
* The line item's [`key`](https://shopify.dev/docs/api/liquid/objects/line_item#line_item-key)

##### Variant ID

```js
{
  'id': 794864053,
  'quantity': 3
}
```

##### Line item key

```js
{
  'id': '794864053:83503fd282b94a4737d2c95bd95db0b8',
  'quantity': 3
}
```

A cart can have multiple line items that share the same `variant_id`. For example, when variants have different [line item properties](https://shopify.dev/docs/api/liquid/objects/line_item#line_item-properties), or [automatic discounts](https://help.shopify.com/en/manual/discounts/automatic-discounts) create variants at different prices. Because of this, it's recommended to use the line item key to ensure that you're only changing the intended line item.

**Note:**

If you use the variant ID, then the `id` value can be either an integer or a string. However, if you use the line item key, then the `id` value needs to be a string.

#### The `line` property

A cart can have multiple line items that share the same `variant_id`. For example, when variants have different [line item properties](https://shopify.dev/docs/api/liquid/objects/line_item#line_item-properties), or [automatic discounts](https://help.shopify.com/en/manual/discounts/automatic-discounts) create variants at different prices. To account for this, you can use the `line` property when updating the cart.

The value of `line` is the 1-based index position of the item in the cart.

```js
{
  'line': 1,
  'quantity': 3
}
```

### Update quantities

The value of the`quantity` property represents the new quantity you want for the line item. It must be an integer.

```js
{
  'line': 2,
  'quantity': 1
}
```

You can remove a line item by setting the `quantity` to `0`:

```js
{
  'line': 2,
  'quantity': 0
}
```

### Update properties

The `properties` property sets the [line item properties](https://shopify.dev/docs/api/liquid/objects/line_item#line_item-properties). Its value must be an object of key-value pairs.

```js
{
  'line': 2,
  'properties': { 'gift_wrap': true }
}
```

Whenever a `POST` request includes `properties`, it overwrites the entire `properties` object. Any key-value pairs that were already in the `properties` object are erased.

It's not possible to set a line item's `properties` property to an empty object once a value is set. If you need to remove all line item properties, then you need to remove the entire line item.

**Tip:**

You can visually hide line item properties at checkout by creating [private properties](#private-properties-and-attributes). This technique might be an alternative to removing a line item when managing `properties`.

### Update selling plans

The `selling_plan` property sets the [line item selling plan](https://shopify.dev/docs/api/liquid/objects/line_item#line_item-selling_plan_allocation). Its value must be one of the following:

* The [selling plan ID](https://shopify.dev/docs/api/liquid/objects/selling_plan#selling_plan-id): To set a specific selling plan for the line item.
* `null` or an empty string: To remove any selling plan from the line item.

##### Add selling plan

```js
{
  'line': 2,
  'quantity': 2,
  'selling_plan': 183638
}
```

##### Remove selling plan

```js
{
  'line': 2,
  'quantity': 2,
  'selling_plan': null
}
```

**Note:**

When specifying the `selling_plan` property, consider the following:

* You can use only the [`line` property](#the-line-property) for identifying the line item.
* You should always specify the `quantity` property. If the `quantity` isn't specified, then it's assumed to be 1.

### Response

The JSON of the cart.

### Error responses

If the item that you're attempting to change isn't already in the cart, then `/{locale}/cart/change.js` doesn't add it. Instead, it returns a `400` error:

```json
{
  "status": "bad_request",
  "message": "no valid id or line parameter",
  "description": "no valid id or line parameter"
}
```

***

## POST /{locale}/cart/clear.​js

Use the `POST /{locale}/cart/clear.js` endpoint to set all quantities of all line items in the cart to zero.

### Response

The JSON of an empty cart. This does not remove cart attributes or the cart note.

```json
{
  "token": "Z2NwLXVzLXdlc3QxOjAxSjBQTVk1Sjc5NVFKTjNOVlhLWENXQUI1?key=0d9909213054e22d092152de385763f0",
  "note": null,
  "attributes": {},
  "total_price": 0,
  "total_weight": 0,
  "item_count": 0,
  "items": [],
  "requires_shipping": false
}
```

***

## Generate shipping rates

Use the `POST /{locale}/cart/prepare_shipping_rates.json` and `GET /{locale}/cart/async_shipping_rates.json` endpoints to generate shipping rates:

* The `POST /{locale}/cart/prepare_shipping_rates.json` endpoint initiates the process of calculating shipping rates for the cart given a destination.
* The `GET /{locale}/cart/async_shipping_rates.json` endpoint returns the shipping rates results if the calculations have finished.

### Example `prepare_shipping_rates` call

```text
/{locale}/cart/prepare_shipping_rates.json?shipping_address%5Bzip%5D=K1N+5T2&shipping_address%5Bcountry%5D=Canada&shipping_address%5Bprovince%5D=Ontario
```

#### Response

`null`

### Example `async_shipping_rates` call

```text
/{locale}/cart/async_shipping_rates.json?shipping_address%5Bzip%5D=K1N+5T2&shipping_address%5Bcountry%5D=Canada&shipping_address%5Bprovince%5D=Ontario
```

If you call `async_shipping_rates` with the same parameters as `prepare_shipping_rates`, then it checks whether Shopify has finished calculating the rates. If the shipping rates aren't ready, then the response is `null`.

If the shipping rates are ready, the rates are returned:

```json
{
  "shipping_rates": [
    {
      "name": "Generic Rate",
      "presentment_name": "Generic Rate",
      "code": "Generic Rate",
      "price": "6.00",
      "markup": null,
      "source": "shopify",
      "delivery_date": null,
      "delivery_range": null,
      "delivery_days": [],
      "compare_price": null,
      "phone_required": false,
      "currency": null,
      "carrier_identifier": null,
      "delivery_category": null,
      "using_merchant_account": null,
      "carrier_service_id": null,
      "description": null,
      "api_client_id": null,
      "requested_fulfillment_service_id": null,
      "shipment_options": null,
      "charge_items": null,
      "has_restrictions": null,
      "rating_classification": null,
      "accepts_instructions": false
    },
    {
      "name": "Carrier Service Mail",
      "presentment_name": "Carrier Service Mail",
      "code": "CarrierServiceMail",
      "price": "12.46",
      "markup": "0.00",
      "source": "usps",
      "delivery_date": "2020-10-09",
      "delivery_range": [
          "2020-10-06",
          "2020-10-09"
      ],
      "delivery_days": [
          0,
          3
      ],
      "compare_price": null,
      "phone_required": true,
      "currency": null,
      "carrier_identifier": null,
      "delivery_category": null,
      "using_merchant_account": null,
      "carrier_service_id": 2,
      "description": null,
      "api_client_id": null,
      "requested_fulfillment_service_id": null,
      "shipment_options": null,
      "charge_items": null,
      "has_restrictions": null,
      "rating_classification": null,
      "accepts_instructions": false
      }
   ]
}
```

### GET /{locale}/cart/shipping\_​rates.​json

Use the `GET /{locale}/cart/shipping_rates.json` to get estimated shipping rates.

**Note:**

The recommended method to generate shipping rates is to use the `POST /{locale}/cart/prepare_shipping_rates.json` and `GET /{locale}/cart/async_shipping_rates.json` endpoints because it might take a while for shipping rates to be returned. The `GET /{locale}/cart/shipping_rates.json` endpoint is subject to throttling.

```text
/{locale}/cart/shipping_rates.json?shipping_address%5Bzip%5D=K1N+5T2&shipping_address%5Bcountry%5D=Canada&shipping_address%5Bprovince%5D=Ontario
```

```json
{
  "shipping_rates": [
    {
      "name": "Ground Shipping",
      "price": "8.00",
      "delivery_date": null,
      "source": "shopify"
    },
    {
      "name": "Expedited Shipping",
      "price": "15.00",
      "delivery_date": null,
      "source": "shopify"
    },
    {
      "name": "Express Shipping",
      "price": "30.00",
      "delivery_date": null,
      "source": "shopify"
    }
  ]
}
```

***

## Private properties and attributes

Private line item properties and private cart attributes are used when you need to attach information to either cart line items or the entire cart, and you don't want the properties and attributes to be visible to the online store's visitors.

Both private properties and private cart attributes are visually hidden at checkout, but are visible on the **Order details** page in the Shopify admin.

**Caution:**

If you hide private line item properties on the storefront, then you must [modify your theme's codebase](#hide-properties-in-a-theme).

### Private line item properties

To make a line item property private, prepend an underscore (`_`) to the key. For example, to add a variant to cart with a private `_foo` property using the `/{locale}/cart/add.js` endpoint:

```js
items: [
  {
    'quantity': 2,
    'id': 794864229,
    'properties': {
      '_foo': 'bar'
    }
  }
]
```

The `properties` property can have a mix of private and public line item properties:

```js
items: [
  {
    quantity: 2,
    id: 794864229,
    properties: {
      '_foo': 'bar',
      'gift_wrap': true
    }
  }
]
```

#### Hide properties in a theme

Private line item properties are available in the Liquid [`line_item.properties`](https://shopify.dev/docs/api/liquid/objects/line_item#line_item-properties) object and Ajax API. To hide private properties on the storefront, you must modify the theme's codebase.

In the following example, all `properties` items that begin with `_` in Liquid are filtered out:

## Liquid

```liquid
{% for property in line_item.properties %}
  {% assign first_character_in_key = property.first | slice: 0 %}
  {% unless first_character_in_key == '_' %}
    {{ property.first }}: {{ property.last }}
  {% endunless %}
{% endfor %}
```

### Private cart attributes

To make a cart attribute private, append a double underscore (`__`) to an attribute name.

Private cart attributes are not available in the Liquid [`cart.attributes`](https://shopify.dev/docs/api/liquid/objects/cart#cart-attributes) object or the Ajax API. This means there is no code modification required to hide them in theme files. Private cart attributes also do not affect the page rendering, which allows for more effective page caching.

***

## Bundled section rendering

Bundled section rendering allows you to request the HTML markup for up to five sections you might want to update based on an initial call to the Cart API, within that same call.

Bundled section rendering is available for the following Cart API endpoints:

* `/{locale}/cart/add`
* `/{locale}/cart/change`
* `/{locale}/cart/clear`
* `/{locale}/cart/update`

### Request sections

To request sections, you can include a `sections` parameter in your API call data:

## Example

```json
items: [
  {
   id: 36110175633573,
   quantity: 2
  }
],
sections: "cart-items,cart-icon-bubble,cart-live-region-text,cart-footer"
```

**Note:**

The `sections` parameter can be a comma-separated list or an array, similar to when using the [Section Rendering API](https://shopify.dev/docs/api/ajax/section-rendering) directly.

By default, sections are rendered in the context of the current page, based on the [HTTP Referer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) header. However, you can specify any other page using the `sections_url` parameter. The `sections_url` must begin with a `/` and can include query parameters like `q` and `page`.

## Example

```json
sections: "cart-items,cart-icon-bubble,cart-live-region-text,cart-footer",
sections_url: "/cart?some_param=foo"
```

The HTML for the requested sections is included under the `sections` key of the returned JSON. Each section can be identified by the same ID that was passed in the request.

## Example

```json
{
  attributes: {},
  cart_level_discount_applications: [],
  currency: "CAD",
  item_count: 1,
  items: [{…}],
  items_subtotal_price: 100100,
  note: null,
  original_total_price: 100100,
  requires_shipping: true,
  sections: {
    cart-items: "<div id=\"shopify-section-template--14199693705272_…9930913703934\" defer=\"defer\"></script>\n\n\n\n\n</div>",
    cart-icon-bubble: "<div id=\"shopify-section-cart-icon-bubble\" className=\"…ss=\"visually-hidden\">1 item</span>\n  </div></div>",
    cart-live-region-text: "<div id=\"shopify-section-cart-live-region-text\" cl…opify-section\">New subtotal: $1,001.00 CAD\n</div>",
    cart-footer: "<div id=\"shopify-section-template--14199693705272_…   </div>\n    </div>\n  </div>\n</div>\n\n\n\n\n\n\n</div>"
  },
  token: "Z2NwLXVzLXdlc3QxOjAxSjBQTVk1Sjc5NVFKTjNOVlhLWENXQUI1?key=0d9909213054e22d092152de385763f0",
  total_discount: 0,
  total_price: 100100,
  total_weight: 1000,
}
```

### Error response

Sections are rendered after the data modifications from the request are completed. Because of this, rendering errors don't affect the response status of the API call. Sections that fail to render are returned as `null`, so you should account for this possibility.

Passing invalid values for the `sections` or `sections_url` parameters, such as a `sections_url` that doesn't begin with `/`, causes the entire request to return an **HTTP 400 Bad Request** status. However, this doesn't mean that the rest of the request didn't succeed.

***
