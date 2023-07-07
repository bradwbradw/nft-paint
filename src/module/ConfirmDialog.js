function ConfirmDialog(msg, callback) {
  if (window.confirm(msg)) {
    callback();
  }
}

export default ConfirmDialog;
