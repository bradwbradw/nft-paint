
var p;

const JsPaintIntegration = {

  setupHooks: (jspaint) => {

    // Wait for systemHooks object to exist (the iframe needs to load)
    if (!p) {

      p = waitUntil(() => jspaint.systemHooks, 500, () => {
        console.log('setting up hooks for js paint', jspaint.systemHooks);
        // Hook in
        jspaint.systemHooks.showSaveFileDialog = async (
          { formats,
            defaultFileName,
            defaultPath,
            defaultFileFormatID,
            getBlob,
            savedCallbackUnreliable,
            dialogTitle }) => {
          getBlob().then(b => {
            console.log("showSaveFileDialog", b);

          })
        };
        jspaint.systemHooks.showOpenFileDialog = async ({ formats }) => {
          console.log("showOpenFileDialog");
        };
        jspaint.systemHooks.writeBlobToHandle = async (save_file_handle, blob) => {
          console.log("writeBlobToHandle");
        };
        jspaint.systemHooks.readBlobFromHandle = async (file_handle) => {
          console.log("readBlobFromHandle");
        };
        p = null;
      });
      // General function to wait for a condition to be met, checking at regular intervals
      function waitUntil(test, interval, callback) {
        return new Promise((resolve, reject) => {
          if (test()) {
            callback();
            resolve();
          } else {
            setTimeout(waitUntil, interval, test, interval, callback);
          }
        });
      }
    }
    return p;
  }

}

export default JsPaintIntegration;