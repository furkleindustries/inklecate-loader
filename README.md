# inklecate-loader

## Introduction

A tiny loader for webpack which asynchronously calls the [inklecate](/inklecate) package, compiling Ink source into JavaScript.

## Installation

`npm i -D inklecate-loader`

## Usage

```javascript
{
  test: /\.ink$/,
  use: require.resolve('inklecate-loader'),
}
```

## Output

```javascript
/* The story object, to be passed to inkjs or etc. */
export const storyContent = { ... };

/* The original source code. */
export const text = '...';

/* Any warnings output by the compiler. */
export const compilerOutput = [
  'WARNING: Foo bar baz!',
  ...
];
```
