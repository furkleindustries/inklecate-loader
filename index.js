const {
  inklecate,
} = require('inklecate');

module.exports = function InkWebpackLoader(content, map, meta) {
  const callback = this.async();
  inklecate({ inputFilepath: this.resourcePath }).then(
    function resolved([ data ]) {
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

    function rejected(err) { return callback(err); },
  );
};
