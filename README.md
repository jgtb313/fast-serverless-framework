# Fast Serverless Framework

> AWS - Node.js

## Features

-   [**AWS SDK**](https://) - Write next generation JavaScript today.
-   [**Serverless**](https://) - Write next generation JavaScript today.
-   [**Serverless Offline**](https://) - Write next generation JavaScript today.
-   [**Serverless Offline SQS**](https://) - Write next generation JavaScript today.
-   [**Serverless Offline Scheduler**](https://) - Write next generation JavaScript today.
-   [**Serverless Localstack**](https://) - Write next generation JavaScript today.

## Installation

This library is published in the NPM registry and can be installed using any compatible package manager.

```sh
npm install fast-serverless-framework --save

# For Yarn, use the command below.
yarn add fast-serverless-framework
```

### Installation from CDN

This module has an UMD bundle available through JSDelivr and Unpkg CDNs.

```html
<!-- For UNPKG use the code below. -->
<script src="https://unpkg.com/fast-serverless-framework"></script>

<!-- For JSDelivr use the code below. -->
<script src="https://cdn.jsdelivr.net/npm/fast-serverless-framework"></script>

<script>
  // UMD module is exposed through the "FastServerlessFramework" global variable.
  console.log(FastServerlessFramework);
</script>
```

## Tree structure

This project .

```terminal
.
├── src
│   ├── index.js
│   ├── config.js
│   ├── modules
│   │   ├── users
│   │   │   └── consumers
│   │   │   │   └── example.js
│   │   │   └── endpoints
│   │   │   │   └── v1
│   │   │   │   │   └── example.js
│   │   │   └── schedules
│   │   │   │   └── example.js
├── .env
```

| Directory / File                | Description                                                                                                                    |
| ----------------------------    | ------------------------------------------------------------------------------------------------------------------------------ |
| `src`                           | Description                                                                                                                    |
| `src/index.js`                  | Description                                                                                                                    |
| `src/config.js`                 | Description                                                                                                                    |
| `src/modules/users/consumers`   | Description                                                                                                                    |
| `src/modules/users/endpoints/v1`| Description                                                                                                                    |
| `src/modules/users/schedules`   | Description                                                                                                                    |
| `.env`                          | Description                                                                                                                    |

## Usage

### Initialization

> src/index.js

```js
FastServerlessFramework.init()
```

### Config

> src/config.js

```
module.exports = {
  project: '', // (required)
  boostrap: () => {} // executed before any Consumers, Endpoints or Schedules
  endpoints: {
    beforeEach: [], // executed before any Endpoint
    afterEach: [] // executed after any Endpoint
  },
  aws: {
    id: '', // AWS ID Account (required)
    region: '' // AWS Region (required)
  },
  stage: '', // (required)
  nodeVersion: '' // (required)
}
```

### Consumers

> src/modules/consumers/example.js

```js
exports.handler = FastServerlessFramework.Consumers.register({
  topic: '',
  concurrency: 1,
  timeout: 900,
  fifo: false,
  handler () {}
})
```

### Endpoints

> src/modules/endpoits/v1/example.js

```js
exports.handler = FastServerlessFramework.Endpoints.register({
  method: '',
  params: '',
  middlewares: []
  handler (req) {
    return {
      status: 200,
      message: 'OK'
    }
  }
})
```

### Schedules

> src/modules/schedules/example.js

```js
exports.handler = FastServerlessFramework.Schedules.register({
  rate: '5 minutes',
  timeout: 900,
  handler () {}
})
```
