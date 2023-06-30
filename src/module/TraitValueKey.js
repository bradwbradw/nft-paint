
function TraitValueKey(trait, value) {
  if (trait) {
    return encodeURI(trait + '-' + value);
  } else {
    return null;
  }
}

export default TraitValueKey;