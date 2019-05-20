const {
  getCacheFilepath,
  inklecate,
} = require('inklecate');

module.exports = function InkWebpackLoader(source) {
  const callback = this.async();
  this.addDependency(getCacheFilepath());
  inklecate([ this.resourcePath ]).then(
    function resolved(data) {
      callback(
        `export const storyContent = ${JSON.stringify(data.storyContent)};\n` +
          `export const text = ${JSON.stringify(source.trim())};\n` +
          `export const compilerOutput = ` +
            `${JSON.stringify(data.compilerOutput)};\n`
      );
    },

    function rejected(err) { throw err; },
  );
};
