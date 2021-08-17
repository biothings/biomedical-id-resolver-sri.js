const axios = require('axios');
const config = require('./config');

// api_input = [curies]
const query = async (api_input) => {
  let url = new URL('https://nodenormalization-sri-dev.renci.org/1.1/get_normalized_nodes'); // TODO: change to non-dev version when ready
  url.search = new URLSearchParams(api_input.map(curie => ["curie", curie]));
  let res = await axios.get(url.toString());
  return res.data;
}

//convert the response of nodenormalization api to same shape as before
const transformResults = (results) => {
  Object.keys(results).forEach((key) => {
    let entry = results[key];
    let id_type = key.split(":")[0];
    if (entry === null) { //handle unresolvable entities
      entry = {
        id: {
          identifier: key,
          label: key
        },
        primaryID: key,
        label: key,
        curies: [key],
        attributes: {},
        semanticType: '',
        semanticTypes: [''],
        dbIDs: {
          [id_type]: config.CURIE_ALWAYS_PREFIXED.includes(id_type) ? key : key.split(":")[1]
        }
      };
      console.log(entry);
    } else {
      //add fields included in biomedical-id-resolver
      entry.primaryID = entry.id.identifier;
      entry.label = entry.id.label || entry.id.identifier;
      entry.attributes = {};
      entry.semanticType = entry.type[0].split(":")[1]; // get first semantic type without biolink prefix
      entry.semanticTypes = entry.type;
      entry.curies = Array.from(new Set(entry.equivalent_identifiers.map(id_obj => id_obj.identifier))).filter((x) => (x != null))

      //assemble dbIDs
      entry.dbIDs = {}
      entry.equivalent_identifiers.forEach((id_obj) => {
        let id_type = id_obj.identifier.split(":")[0];
        if (config.CURIE_ALWAYS_PREFIXED.includes(id_type)) {
          if (Array.isArray(entry.dbIDs[id_type])) {
            entry.dbIDs[id_type].push(id_obj.identifier);
          } else {
            entry.dbIDs[id_type] = [id_obj.identifier];
          }
        } else {
          let curie_without_prefix = id_obj.identifier.split(":")[1];
          if (Array.isArray(entry.dbIDs[id_type])) {
            entry.dbIDs[id_type].push(curie_without_prefix);
          } else {
            entry.dbIDs[id_type] = [curie_without_prefix];
          }
        }
      })
      entry.dbIDs.name = Array.from(new Set(entry.equivalent_identifiers.map(id_obj => id_obj.label))).filter((x) => (x != null));
    }
    
    results[key] = [entry];
  });
  return results;
}

//input = [curies] or {semanticType: [curies]}
const resolve = async (input) => {
  //convert object of curies into simple list of curies
  let api_input;
  try {
    if (Array.isArray(input)) {
      api_input = input;
    } else {
      api_input = Object.values(input).flat();
    }
  } catch (error) {
    console.warn("Input is not in the right shape. Expected an array of curies or an object of arrays of curies.");
    return {};
  }

  let query_results = await query(api_input);
  return transformResults(query_results);
};

module.exports = resolve;