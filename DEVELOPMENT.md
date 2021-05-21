# Development

## Development environment

> Novo Design Tokens are in a separate repository that can be symlinked into any dependant project for easy development and testing. You can use `npm link` to create the link and `npm link novo-design-tokens` to install your local version.

### Setting up local development environment

1. Clone the novo-design-tokens repository.

```bash
git clone https://github.com/bullhorn/novo-design-tokens.git
```

2. Go to the root of the project and install dependencies with `npm install`.

```bash
cd novo-design-tokens
npm install
```

3. Build the design tokens.

```bash
npm run build
```

## Adding and updating tokens

### Adding new tokens

To add new tokens, you first need to create a `.js` file in the `tokens` directory. Once you’ve created the `.js` file you add the tokens to it. You can read about how to define new tokens [here](https://amzn.github.io/style-dictionary/#/properties?id=properties). The token files follow the [Category / Type / Item structure](https://amzn.github.io/style-dictionary/#/properties?id=category-type-item). You can use any of the existing token files as reference.

After the `.js` file with the tokens is done, you'll need to include it in the build process for the tokens to be built. To do that you need to add a new property to the `index.js` file.

**NOTE**: we are using v3 of the `style-dictionary` project.

#### Example:

Let’s say that we wanted to add a `bar.js` file at the location `tokens/foo` to the build process. In the `

### Updating existing tokens

Find the token you want to update and replace the value in the `value` field with the new one.
