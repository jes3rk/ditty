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

Tokens in `@dtty/simpldi` are used in place of magic strings for dependency resolution.
This enables stricter type checking when manually resolving dependencies.

```ts
// Create a token
const token = new Token<SimpleProviderClass>();

// Optionall, add a name to the token
const tokenWithName = new Token<SimpleProviderClass>("My Name");
```

### Modes

By default, all providers in the container are registered as singletons.
This behavior can be optionally changed by setting `mode: ProviderMode.TRANSIENT` when registering a provider.
Transient providers will be re-initialized each time they are resolved, ensuring all downstream providers recieve a fresh instance.

### Nested Containers

Providers are always scoped to their container but can depend on providers from a parent container.
Creating a child container allows developers to scope specific providers to the lifetime of the container. for example the use of a child container for request-specific providers in a web server.

```ts
// Start with a root
const rootContainer = new Container();

// And spawn a child
const childContainer = rootContainer.createChildContainer();
```

### Lifecycle

By default, all providers a lazy loaded into the container, meaning that provider instances are only created when the are needed.
Lazy loading enables a faster application start time and ensures that only the relevant classes are created, cutting down on overhead.

Below are ways to hook into the provider lifecycle.

#### onProviderInit

By implementing the `IOnProviderInit` interface, a provider adds a lifecycle method that is called whenever the provider instance is resolved in the container.
This can be useful for bootstrapping common providers like database connections that require an asynchronous interaction after creation.
