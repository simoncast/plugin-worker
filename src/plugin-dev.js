exports.fetch = function(load) {
  // create code string to be used in the worker
  // code loads the worker in load.address
  // when it is fineshed loading the worker post @@@LOADED@@@
  // note: the system.src.js and jspm.config.js can be located differently, not sure how to handle this
  var codeStr = [
    'importScripts("' + System.baseURL + 'jspm_packages/system.src.js");',
    'System.config({ baseURL: "' + System.baseURL + '" });',
    'importScripts("' + System.baseURL + 'jspm.config.js");',

    // Because this is async we need a worker shim to catch all messages, isn't there any way to do this sync?
    'System.import("' + load.address + '").then(function() {',
    '  self.postMessage("@@@LOADED@@@")',
    '}).catch(function(error) {',
    '  console.warn(error);',
    '});'
  ].join('\n');
  // convert string to url
  var blob = new Blob([codeStr]);
  var blobURL = self.URL.createObjectURL(blob);

  load.metadata.blobURL = blobURL;

  return '';
}

exports.instantiate = function(load) {
  return load.metadata.blobURL;
};
