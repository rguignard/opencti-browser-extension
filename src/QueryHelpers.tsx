import { v5 as uuidv5 } from "uuid";

export const globalSearch = async (search: string, storage: any) => {
    let query = {
        query: `query {
            stixCoreObjects(
                search : "` + search + `",
                filters: {
                    mode :and,
                    filters:[
                        {
                        key: "entity_type",
                        values: ["Stix-Core-Object"],
                        operator: eq,
                        mode: or
                    }],
                    filterGroups:[]
                }
            )
            {
                edges {
                    node {
                        id
                        entity_type
                        created_at
                        updated_at
                        objectLabel {
                            id
                            value
                            color
                        }
                ... on AttackPattern {
                    name
                    description
                    aliases
                }
                ... on Campaign {
                    name
                    description
                    aliases
                }
                ... on Note {
                  attribute_abstract
                  content
                }
                ... on ObservedData {
                  name
                  first_observed
                  last_observed
                }
                ... on Opinion {
                  opinion
                  explanation
                }
                ... on Report {
                  name
                  description
                }
                ... on Grouping {
                  name
                  description
                }
                ... on CourseOfAction {
                  name
                  description
                  x_opencti_aliases
                }
                ... on Individual {
                  name
                  description
                  x_opencti_aliases
                }
                ... on Organization {
                  name
                  description
                  x_opencti_aliases
                }
                ... on Sector {
                  name
                  description
                  x_opencti_aliases
                }
                ... on System {
                  name
                  description
                  x_opencti_aliases
                }
                ... on Indicator {
                  name
                  description
                }
                ... on Infrastructure {
                  name
                  description
                }
                ... on IntrusionSet {
                  name
                  aliases
                  description
                }
                ... on Position {
                  name
                  description
                  x_opencti_aliases
                }
                ... on City {
                  name
                  description
                  x_opencti_aliases
                }
                ... on AdministrativeArea {
                  name
                  description
                  x_opencti_aliases
                }
                ... on Country {
                  name
                  description
                  x_opencti_aliases
                }
                ... on Region {
                  name
                  description
                  x_opencti_aliases
                }
                ... on Malware {
                  name
                  aliases
                  description
                }
                ... on ThreatActor {
                  name
                  aliases
                  description
                }
                ... on Tool {
                  name
                  aliases
                  description
                }
                ... on Vulnerability {
                  name
                  description
                }
                ... on Incident {
                  name
                  aliases
                  description
                }
                ... on Event {
                  name
                  aliases
                  description
                }
                ... on Channel {
                  name
                  aliases
                  description
                }
                ... on Narrative {
                  name
                  aliases
                  description
                }
                ... on Language {
                  name
                  aliases
                }
                ... on DataComponent {
                  name
                }
                ... on DataSource {
                  name
                }
                ... on Case {
                  name
                }
                ... on StixCyberObservable {
                  observable_value
                }
                ... on StixFile {
                  x_opencti_additional_names
                }
              }
            }
        }
      }`
    };
    let resp = await sendGraphQLRequest(storage['opencti_url'], storage['opencti_token'], query);
    if (resp && resp.hasOwnProperty("errors")) {
        console.log(resp['errors']);
        throw Error(resp['errors']['message']);
    }
    return resp
}

export const searchIndicator = async (observable: any, storage: any) => {
    let query = {
        query: `query  {
          indicators(filters: { 
                mode :and,
                filters:[
                  {
                    key: "name",
                    values: ["` + observable.value + `"],
                    operator: eq,
                    mode: or
                  }
                ],
                filterGroups:[]
              }
           ) {
          edges {
            node {
              name
              id
              x_opencti_score
              indicator_types
              objectLabel {
                    id
                    value
                    color
              } 
              stixCoreRelationships{
                edges{
                  node{
                    to{
                      ... on Campaign {
                          id
                          name
                          entity_type
                      }
                      ... on Indicator {
                          id
                          name
                          entity_type
                      }
                      ... on Infrastructure {
                          id
                          name
                          entity_type
                      }
                      ... on IntrusionSet {
                          id
                          name
                          entity_type
                      }
                      ... on Malware {
                          id
                          name
                          entity_type
                      }
                      ... on ThreatActorGroup {
                          id
                          name
                          entity_type
                      }
                      ... on ThreatActorIndividual {
                          id
                          name
                          entity_type
                      }
                      ... on ThreatActor {
                          id
                          name
                          entity_type
                      }
                      ... on Tool {
                          id
                          name
                          entity_type
                      }
                      ... on Vulnerability {
                          id
                          name
                          entity_type
                      }
                      ... on Incident {
                          id
                          name
                          entity_type
                      }
                      ... on Event {
                          id
                          name
                          entity_type
                      }
                      ... on Case {
                          id
                          name
                          entity_type
                      }
                    }
                  }
                }
              }
              reports{
                edges{
                  node{
                    id
                    name
                  }
                }
              }
            }
          }
         }
        }`
    };
    let resp = await sendGraphQLRequest(storage['opencti_url'], storage['opencti_token'], query);
    if (resp && resp.hasOwnProperty("errors")) {
        console.log(resp['errors']);
        throw Error(resp['errors']['message']);
    }
    return resp
}

export const searchVulnerability = async (observable: any, storage: any) => {
    let query = {
        query: `query  {
          vulnerabilities(filters: { 
                mode :and,
                filters:[
                  {
                    key: "name",
                    values: ["` + observable.value + `"],
                    operator: eq,
                    mode: or
                  }
                ],
                filterGroups:[]
              }
           ) {
          edges {
            node {
              name
              id
              objectLabel {
                    id
                    value
                    color
              } 
              stixCoreRelationships{
                edges{
                  node{
                    to{
                      ... on Campaign {
                          id
                          name
                          entity_type
                      }
                      ... on Indicator {
                          id
                          name
                          entity_type
                      }
                      ... on Infrastructure {
                          id
                          name
                          entity_type
                      }
                      ... on IntrusionSet {
                          id
                          name
                          entity_type
                      }
                      ... on Malware {
                          id
                          name
                          entity_type
                      }
                      ... on ThreatActorGroup {
                          id
                          name
                          entity_type
                      }
                      ... on ThreatActorIndividual {
                          id
                          name
                          entity_type
                      }
                      ... on ThreatActor {
                          id
                          name
                          entity_type
                      }
                      ... on Tool {
                          id
                          name
                          entity_type
                      }
                      ... on Vulnerability {
                          id
                          name
                          entity_type
                      }
                      ... on Incident {
                          id
                          name
                          entity_type
                      }
                      ... on Event {
                          id
                          name
                          entity_type
                      }
                      ... on Case {
                          id
                          name
                          entity_type
                      }
                    }
                  }
                }
              }
              reports{
                edges{
                  node{
                    id
                    name
                  }
                }
              }
            }
          }
         }
        }`
    };
    let resp = await sendGraphQLRequest(storage['opencti_url'], storage['opencti_token'], query);
    if (resp && resp.hasOwnProperty("errors")) {
        console.log(resp['errors']);
        throw Error(resp['errors']['message']);
    }
    return resp
}

export const healthCheck = async (url: string, token: string) => {
    let query = {
        query: `query  {
        intrusionSets(filters: { 
        mode :and,
        filters:[],
        filterGroups:[]
      }, first: 1)
          {
          edges{
            node{
              id
              description
            }
          }
         }
      }`
    };
    let resp = await sendGraphQLRequest(url, token, query);
    if (resp && resp.hasOwnProperty("errors")) {
        console.log(resp['errors']);
        throw Error(resp['errors']['message']);
    }
}


function convertToStixBundle(workbenchData: any) {
    let NAMESPACE = "b639ff3b-00eb-42ed-aa36-a8dd6f8fb4cf"
    let bundleId = uuidv5(workbenchData.name, NAMESPACE);
    let externalRef = {
        "source_name": "Threat Crawler",
        "url": workbenchData.from_url
    }
    let stixReport = {
        "name": workbenchData.name,
        "published": new Date().toISOString(),
        "id": "report--"+bundleId,
        "type": "report",
        "report_types": [
            "threat-report"
        ],
        "object_refs": [],
        "external_references": [externalRef],
        "labels": workbenchData.labels
    }
    let stixEntities: any[] = [];
    let object_refs_id : string[] = [];

    let observablesTypes;
    for (const item of workbenchData.entities) {
        let itemId = uuidv5(item.value, NAMESPACE);
        observablesTypes = ["domain", "ipv4", "md5", "sha1", "sha256"]
        if (observablesTypes.includes(item.type)) {
            let stixObservable: any;
            let stixIndicator: any;
            let stixRelation: any;

            if (item.type === 'domain') {
                stixObservable = {
                    "id": "domain-name--" + itemId,
                    "spec_version": "2.1",
                    "type": "domain-name",
                    "value": item.value,
                    "observable_value": item.value,
                    "external_references": [externalRef],
                    "labels": workbenchData.labels
                };
                stixIndicator = {
                    "id": "indicator--" + itemId,
                    "spec_version": "2.1",
                    "pattern_type": "stix",
                    "pattern_version": "2.1",
                    "pattern": "[domain-name:value = '" + item.value + "']",
                    "name": item.value,
                    "x_opencti_main_observable_type": "Domain-Name",
                    "x_opencti_type": "Indicator",
                    "type": "indicator",
                    "external_references": [externalRef],
                    "labels": workbenchData.labels
                }
                stixRelation = {
                    "id": "relationship--" + itemId,
                    "spec_version": "2.1",
                    "relationship_type": "based-on",
                    "type": "relationship",
                    "source_ref": stixIndicator['id'],
                    "target_ref": stixObservable['id']
                }
            }
            if (item.type === 'ipv4') {
                stixObservable = {
                    "id": "ipv4-addr--" + itemId,
                    "spec_version": "2.1",
                    "type": "ipv4-addr",
                    "value": item.value,
                    "observable_value": item.value,
                    "external_references": [externalRef],
                    "labels": workbenchData.labels
                };
                stixIndicator = {
                    "id": "indicator--" + itemId,
                    "spec_version": "2.1",
                    "pattern_type": "stix",
                    "pattern_version": "2.1",
                    "pattern": "[ipv4-addr:value = '" + item.value + "']",
                    "name": item.value,
                    "x_opencti_main_observable_type": "IPv4-Addr",
                    "x_opencti_type": "Indicator",
                    "type": "indicator",
                    "external_references": [externalRef],
                    "labels": workbenchData.labels
                }
                stixRelation = {
                    "id": "relationship--" + itemId,
                    "spec_version": "2.1",
                    "relationship_type": "based-on",
                    "type": "relationship",
                    "source_ref": stixIndicator['id'],
                    "target_ref": stixObservable['id']
                }
            }
            if (item.type === 'md5') {
                stixObservable = {
                    "id": "file--" + itemId,
                    "spec_version": "2.1",
                    "type": "file",
                    "hashes": {"MD5": item.value},
                    "observable_value": item.value,
                    "external_references": [externalRef],
                    "labels": workbenchData.labels
                }
                stixIndicator = {
                    "id": "indicator--" + itemId,
                    "spec_version": "2.1",
                    "pattern_type": "stix",
                    "pattern_version": "2.1",
                    "pattern": "[file:hashes.'MD5' = '"+item.value+"']",
                    "name": item.value,
                    "x_opencti_main_observable_type": "StixFile",
                    "x_opencti_type": "Indicator",
                    "type": "indicator",
                    "external_references": [externalRef],
                    "labels": workbenchData.labels
                }
                stixRelation = {
                    "id": "relationship--" + itemId,
                    "spec_version": "2.1",
                    "relationship_type": "based-on",
                    "type": "relationship",
                    "source_ref": stixIndicator['id'],
                    "target_ref": stixObservable['id']
                }
            }
            if (item.type === 'sha1') {
                stixObservable = {
                    "id": "file--" + itemId,
                    "spec_version": "2.1",
                    "type": "file",
                    "hashes": {"SHA-1": item.value},
                    "observable_value": item.value,
                    "external_references": [externalRef],
                    "labels": workbenchData.labels
                }
                stixIndicator = {
                    "id": "indicator--" + itemId,
                    "spec_version": "2.1",
                    "pattern_type": "stix",
                    "pattern_version": "2.1",
                    "pattern": "[file:hashes.'SHA-1' = '"+item.value+"']",
                    "name": item.value,
                    "x_opencti_main_observable_type": "StixFile",
                    "x_opencti_type": "Indicator",
                    "type": "indicator",
                    "external_references": [externalRef],
                    "labels": workbenchData.labels
                }
                stixRelation = {
                    "id": "relationship--" + itemId,
                    "spec_version": "2.1",
                    "relationship_type": "based-on",
                    "type": "relationship",
                    "source_ref": stixIndicator['id'],
                    "target_ref": stixObservable['id']
                }
            }
            if (item.type === 'sha256') {
                stixObservable = {
                    "id": "file--" + itemId,
                    "spec_version": "2.1",
                    "type": "file",
                    "hashes": {"SHA-256": item.value},
                    "observable_value": item.value,
                    "external_references": [externalRef],
                    "labels": workbenchData.labels
                }
                stixIndicator = {
                    "id": "indicator--" + itemId,
                    "spec_version": "2.1",
                    "pattern_type": "stix",
                    "pattern_version": "2.1",
                    "pattern": "[file:hashes.'SHA-256' = '"+item.value+"']",
                    "name": item.value,
                    "x_opencti_main_observable_type": "StixFile",
                    "x_opencti_type": "Indicator",
                    "type": "indicator",
                    "external_references": [externalRef],
                    "labels": workbenchData.labels
                }
                stixRelation = {
                    "id": "relationship--" + itemId,
                    "spec_version": "2.1",
                    "relationship_type": "based-on",
                    "type": "relationship",
                    "source_ref": stixIndicator['id'],
                    "target_ref": stixObservable['id']
                }
            }

            stixEntities.push(stixObservable)
            stixEntities.push(stixIndicator)
            stixEntities.push(stixRelation)
            object_refs_id.push(stixObservable['id'])
            object_refs_id.push(stixIndicator.id)
            object_refs_id.push(stixRelation.id)
        }
        if (item.type === "vulnerability") {
            let stixVulnerability = {
                "id": "vulnerability--"+itemId,
                "spec_version": "2.1",
                "name": item.value,
                "external_references": [externalRef],
                "x_opencti_type": "Vulnerability",
                "type": "vulnerability",
                "labels": workbenchData.labels
            }
            stixEntities.push(stixVulnerability)
            object_refs_id.push(stixVulnerability.id)
        }
        // @ts-ignore
        stixReport['object_refs'] = object_refs_id;
    }
    stixEntities.push(stixReport)
    return {"id": "bundle--"+bundleId, "type": "bundle", "objects": stixEntities};
}

export const createWorkbench = async (workbenchData: any, config: any)=> new Promise<any>((resolve, reject) => {

    let bundle = convertToStixBundle(workbenchData);

    let query_var = {
        "file": {"name": workbenchData.name+".json", "data": bundle, "mime": "application/json"},
        "labels": [],
        "entityId": null
    };

    let query = `mutation WorkbenchFileCreatorMutation(
        $file: Upload!, 
        $labels: [String], 
        $entityId: String) 
        {
            uploadPending(file: $file, labels: $labels, errorOnExisting: true, entityId: $entityId) {
                id
                ...FileLine_file }}
            fragment FileLine_file on File {
                id
                name
                uploadStatus
                lastModified
                lastModifiedSinceMin
                metaData {
                    mimetype
                    list_filters
                    external_reference_id
                    messages {
                        timestamp
                        message
                    }
                    errors {
                        timestamp
                        message
                    }
                    labels
                }
                ...FileWork_file
            }
            fragment FileWork_file on File {
                id
                works {
                    id
                    connector { 
                        name 
                        id
                    }
                    user { 
                        name
                        id
                    }
                    received_time
                    tracking {
                        import_expected_number
                        import_processed_number
                    }
                    messages {
                        timestamp
                        message
                    }
                    errors {
                        timestamp
                        message
                    }
                    status
                    timestamp
                }
        }`

    let multipart_data = {"query": query, "variables": query_var};

    const headers = new Headers({
        'Authorization': 'Bearer ' + config['opencti_token'],
        'Accept': '*/*',
        'User-Agent': 'octi-browser-ext',
    });

    const formData = new FormData();
    const blob = new Blob([JSON.stringify(bundle)], {type: "application/json"});
    formData.set("operations", JSON.stringify(multipart_data));
    formData.set("map", JSON.stringify({"1":["variables.file"]}));
    formData.set("1", blob, workbenchData.name+".json");

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: formData
    };

    fetch(config['opencti_url'] + "/graphql", requestOptions)
        .then(response => response.json())
        .then(result => {
            resolve(result);
        })
        .catch((err) => reject(err));
})

const sendGraphQLRequest = (url: string, token: string, query: any) => new Promise<any>((resolve, reject) => {
    const headers = new Headers({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'User-Agent': 'octi-browser-ext',
    });
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(query)
    };

    fetch(url + "/graphql", requestOptions)
        .then(response => response.json())
        .then(result => {
            resolve(result);
        })
        .catch((err) => reject(err));
})
