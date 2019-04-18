pixc-api-node
==============

[![travis ci](https://travis-ci.org/s-kalaus/pixc-api-node.svg?branch=master)](https://travis-ci.org/s-kalaus/pixc-api-node)

Node.js Pixc API bindings. API docs available here: https://pixc.com/api

### Installation

    npm install --save pixc-api-node
    
## API

### `PixcApiNode(options)`

Creates a new `PixcApiNode` instance.

#### Arguments

- `options` - Optional - A plain JavaScript object that contains the configuration options.

#### Options

- `token` - Required (String) - Access token obtained from https://pixc.com/dashboard/account/api page.
- `test` - Optional (Boolean) - Enables or disables test mode. In this mode no real changes will be made. Only returns mock data.

#### Return value

A `PixcApiNode` instance.

### Example of GET request

```js
const PixcApiNode = require('pixc-api-node');

const pixcApiNode = new PixcApiNode({
  token: 'YOUR_TOKEN',
  test: true
});

pixcApiNode.get('order', { limit: 5 }).then(
  orders => console.log(orders),
  err => console.log(err)
);
```

#### Result

```json
[
  {
    "orderId": 1,
    "status": 0,
    "payment": "paid",
    "templateId": 1
  }
]
```

### Example of PUT request

```js
pixcApiNode.put('template/1', { active: false }).then(
  template => console.log(template),
  err => console.log(err)
);
```

#### Result

```json
[
  {
    "templateId": 1,
    "active": false
  }
]
```

### Example of POST request

```js
pixcApiNode.post('order', { files: [
  {
    url: 'https://via.placeholder.com/600',
    name: 'Placeholder.jpg'
  }
] }).then(
  order => console.log(order),
  err => console.log(err)
);
```

#### Result

```json
[
  {
    "orderId": 1,
    "status": 0,
    "payment": "paid",
    "templateId": 1
  }
]
```

### Example of DELETE request

```js
pixcApiNode.remove('tempalte/1').then(
  () => console.log('SUCCESS'),
  err => console.log(err)
);
```
