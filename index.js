const {
  readFile,
} = require('fs-extra');
const {
  getOptions,
} = require('loader-utils');
const validateOptions = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    wasm: {
      type: 'boolean'
    },
  }
};

module.exports = function InkWebpackLoader(content, map, meta) {
  const options = getOptions(this) || {};

  validateOptions(schema, options, 'Example Loader');

  const callback = this.async();

  let prom;
  if (options.wasm === false) {
    prom = require('inklecate').inklecate({ inputFilepath: this.resourcePath });  
  } else {
    prom = new Promise(async (resolve, reject) => {
      try {
        require('inklecate-wasm').initializeMonoEnvironment().then((compile) => {
          const compiled = compile(content);
          return resolve(compiled);
        });
      } catch (err) {
        return reject(err);
      }
    });
  }

  prom.then(
    function resolved(data) {
      callback(
        null,
        `module.exports = ${JSON.stringify({
          compilerOutput: data.compilerOutput,
          storyContent: data.storyContent,
          text: content.trim(),
        }, null, 2)};\n`,
        map,
        meta,
      );
    },

    function rejected(err) {
      return callback(typeof err === Error ? err : new Error(err));
    },
  );
};
