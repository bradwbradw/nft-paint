import _ from "lodash";

const Persistance = {
  save: (name, data) => {

    var toSave;
    try {
      toSave = JSON.stringify(data);
    } catch (err) {
      console.error('cannot serialize json', data);
    }
    if (!_.isEmpty(toSave)) {
      localStorage.setItem(name, toSave);
    }
  },
  load: (name, defaultVal) => {
    var d;
    try {
      d = JSON.parse(localStorage.getItem(name));
    } catch (err) {
      d = defaultVal;
    }
    if (_.isEmpty(d)) {
      return defaultVal;
    } else {
      return d;
    }
  },
  remove: name => {
    localStorage.removeItem(name);
  }
}

export default Persistance;