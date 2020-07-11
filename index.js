const { inklecate } = require('inklecate');
const {
  getOptions,
} = require('loader-utils');
const validateOptions = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    countAllVisits: {
      type: 'boolean',
    },

    inputFilepath: {
      type: 'string',
    },

    verbose: {
      type: 'boolean',
    },

    DEBUG: {
      type: 'boolean',
    },
  }
};

module.exports = function InkWebpackLoader(content, map, meta) {
  const options = getOptions(this) || {};

  validateOptions(schema, options, 'Example Loader');

  const callback = this.async();

  const inklecateOpts = {
    countAllVisits: Boolean(options.countAllVisits),
    inputFilepath: this.resourcePath,
    verbose: Boolean(options.verbose),
    DEBUG: Boolean(options.DEBUG),
  };

  inklecate(inklecateOpts).then(
    function resolved(data) {
      callback(
        null,
        `module.exports = ${JSON.stringify({
          compilerOutput: data.compilerOutput,
          storyContent: data.storyContent,
          text: content.trim(),
        })};\n`,
        map,
        meta,
      );
    },

    function rejected(err) {
      return callback(typeof err === Error ? err : new Error(err));
    },
  );
};
