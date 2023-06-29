
function TraitValueKey(trait, value) {
  if (trait) {
    return trait + '-' + value;
  } else {
    return null;
  }
}

export default TraitValueKey;