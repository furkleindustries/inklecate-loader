const {
  inklecate,
} = require('inklecate');

module.exports = function InkWebpackLoader(content, map, meta) {
  const callback = this.async();
  const options = this.getOptions();

  inklecate({
    countAllVisits: options.countAllVisits,
    inputFilepath: this.resourcePath,
    wasm: Boolean(options.wasm),
  }).then(
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
