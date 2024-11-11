# @dtty/simpldi

A simple dependency injection library for typescript projects.

## Installation

This library requires the `reflect-metadata` package to function properly.
Add the line `import 'reflect-metadata';` to the top of you entry file (e.g. index.js).

```sh
npm i @dtty/simpldi reflect-metadata
```

## Usage

Unlike many other dependency injection libraries for Typescript projects, `@dtty/simpldi` requires developers to manage the container lifecycle themselvs.
While some may consider this a burden, it ultimately allows for far more flexible configurations and a simpler API to engage with.

```ts
// Basic usage

const rootContainer = new Container();

// Add a simple provider
rootContainer.addProvider(simpleToken, SimpleProviderClass);

// Add a transient provider
rootContainer.addProvider(transientToken, TransientProviderClass, {
  mode: ProviderMode.TRANSIENT,
});

// Fetch a provider
const instance = await rootContainer.resolveProvider(simpleToken);
```

### Tokens

Tokens in `@dtty/simpldi`
