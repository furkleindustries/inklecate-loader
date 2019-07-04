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
          const storyContent = compile(content);
          return {
            storyContent,
            compilerOutput: '',
          }
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
        `export const storyContent = ${JSON.stringify(data.storyContent)};\n` +
          `export const text = ${JSON.stringify(content.trim())};\n` +
          `export const compilerOutput = ${
            JSON.stringify(data.compilerOutput)
          };\n`,
        map,
        meta,
      );
    },

    function rejected(err) {
      return callback(typeof err === Error ? err : new Error(err));
    },
  );
};
