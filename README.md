# dualist

## Introduction

Run multiple commands using a single job.
Ideal for developers who want to serve backend and frontend simultaneously.

## Installation

```sh
$ npm i -g dualist # or...
$ pnpm add -g dualist # or...
$ yarn global add dualist
```

## Usage

```sh
$ dualist api web # "api" and "web" are folders present in the current cwd
$ dualist api web -c 'npm run dev' # -c specifies a custom command, defaults to "npm run serve"
```

You may also want to add dualist in your package.json's scripts:

```json
{
  ...
  "scripts": {
    "dev": "dualist api web"
  }
}
```

## License

This software is [MIT licensed](https://github.com/minenwerver/dualist/tree/master/LICENSE).
