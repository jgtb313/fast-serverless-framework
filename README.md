# Fast Serverless Framework

> AWS - Node.js

## Features

-   [**AWS SDK**](https://babeljs.io/) - Write next generation JavaScript today.
-   [**Serverless**](https://babeljs.io/) - Write next generation JavaScript today.
-   [**Serverless Offline**](https://babeljs.io/) - Write next generation JavaScript today.
-   [**Serverless Offline SQS**](https://babeljs.io/) - Write next generation JavaScript today.
-   [**Serverless Offline Scheduler**](https://babeljs.io/) - Write next generation JavaScript today.

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
├── env.js
```

| Directory / File                | Description                                                                                                                    |
| ----------------------------    | ------------------------------------------------------------------------------------------------------------------------------ |
| `src`                           | Description                                                                                                                    |
| `src/index.ts`                  | Description                                                                                                                    |
| `src/config.ts`                 | Description                                                                                                                    |
| `src/modules/users/consumers`   | Description                                                                                                                    |
| `src/modules/users/endpoints/v1`| Description                                                                                                                    |
| `src/modules/users/schedules`   | Description                                                                                                                    |
| `env.js`                        | Description                                                                                                                    |

## Usage

### Initialization

```js
FastServerlessFramework.init({
  boostrap: () => {} // executed before any Consumers, Endpoints or Schedules,
  endpoints: {
    beforeEach: [], // executed before any Endpoint
    afterEach: [] // executed after any Endpoint
  },
  aws: {
    id: '', // AWS ID Account (required)
    region: '' // AWS Region (required)
  },
  stage: '' // dev or prod (required)
})
```

### Consumers

```js
FastServerlessFramework.Consumers.register({
  topic: '',
  concurrency: 1,
  timeout: 900,
  fifo: false,
  handler () {}
})
```

### Endpoints

```js
FastServerlessFramework.Endpoints.register({
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

```js
FastServerlessFramework.Schedules.register({
  rate: '5 minutes',
  timeout: 900,
  handler () {}
})
```
