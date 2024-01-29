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
$ dualist app web # "app" and "web" are folders present in the current cwd
$ dualist app web -c 'npm dev' # -c specifies a custom command, defaults to "npm run erve"
```

## License

This software is [MIT licensed](https://github.com/minenwerver/dualist/tree/master/LICENSE).
