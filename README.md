# biomedical-id-resolver-sri.js
js library for converting biological ids in batch using the [SRI node normalizer](https://nodenormalization-sri-dev.renci.org/1.1/docs#/).

# Install
```
$ npm i biomedical-id-resolver-sri
```
# Usage
```js
const resolve = require('biomedical-id-resolver-sri');

// input can be an object, with semantic type as the key, and array of CURIEs as value
let input = {
    "Gene": ["NCBIGene:1017", "NCBIGene:1018", "HGNC:1177"],
    "SmallMolecule": ["CHEBI:15377"],
    "Disease": ["MONDO:0004976"],
    "Cell": ["CL:0002372"]
};

//input can also be an array of curies
input = ["NCBIGene:1017", "MONDO:0004976"];

(async () => {
  let res = await resolve(input);
  console.log(res);
})();
```

# Example Output
```json
{
    "NCBIGene:1017": [
        {
            "id": {
                "identifier": "NCBIGene:1017",
                "label": "CDK2"
            },
            "equivalent_identifiers": [
                {
                    "identifier": "NCBIGene:1017",
                    "label": "CDK2"
                },
                {
                    "identifier": "ENSEMBL:ENSG00000123374"
                },
                {
                    "identifier": "HGNC:1771",
                    "label": "CDK2"
                },
                {
                    "identifier": "OMIM:116953"
                },
                {
                    "identifier": "UMLS:C1332733",
                    "label": "CDK2 gene"
                }
            ],
            "type": [
                "biolink:Gene",
                "biolink:GeneOrGeneProduct",
                "biolink:BiologicalEntity",
                "biolink:NamedThing",
                "biolink:Entity",
                "biolink:MacromolecularMachineMixin"
            ],
            "primaryID": "NCBIGene:1017",
            "label": "CDK2",
            "attributes": {},
            "semanticType": "Gene",
            "semanticTypes": [
                "biolink:Gene",
                "biolink:GeneOrGeneProduct",
                "biolink:BiologicalEntity",
                "biolink:NamedThing",
                "biolink:Entity",
                "biolink:MacromolecularMachineMixin"
            ],
            "dbIDs": {
                "NCBIGene": [
                    "1017"
                ],
                "ENSEMBL": [
                    "ENSG00000123374"
                ],
                "HGNC": [
                    "1771"
                ],
                "OMIM": [
                    "116953"
                ],
                "UMLS": [
                    "C1332733"
                ],
                "name": [
                    "CDK2",
                    "CDK2 gene"
                ]
            },
            "curies": [
                "NCBIGene:1017",
                "ENSEMBL:ENSG00000123374",
                "HGNC:1771",
                "OMIM:116953",
                "UMLS:C1332733"
            ]
        }
    ]
}
```