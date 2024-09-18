export const Activity_List_Response = {
  success: true,
  status: 200,
  data: {
    content: [
      {
        activityDefnKey: '2433ffb3-7941-403b-a2e1-315ed4a708a9',
        name: 'Activity 3',
        description: '',
        application: 'PEM',
        activityVersionLink: 'http://10.15.106.209:9080/sponsors/cashbank/v2/activityDefinitions/2433ffb3-7941-403b-a2e1-315ed4a708a9',
        isDeleted: false,
        defaultVersion: {
          activityDefnVersionKey: 'ba9aa22c-762e-46e5-b3aa-9577f915474d',
          isEncrypted: false,
          version: 1,
          status: 'FINAL'
        }
      },
      {
        activityDefnKey: 'c5b74775-7e75-4218-a776-00c3b5e4a2ff',
        name: 'Activity 2',
        description: '',
        application: 'PEM',
        activityVersionLink: 'http://10.15.106.209:9080/sponsors/cashbank/v2/activityDefinitions/c5b74775-7e75-4218-a776-00c3b5e4a2ff',
        isDeleted: false,
        defaultVersion: {
          activityDefnVersionKey: '4434eac3-bb8a-48eb-98e2-bd53d03667e2',
          isEncrypted: false,
          version: 1,
          status: 'DRAFT'
        }
      },
      {
        activityDefnKey: '85b979e8-8c3a-4d2b-b2ab-2e737764aa9d',
        name: 'Activity 1',
        description: '',
        application: 'PEM',
        activityVersionLink: 'http://10.15.106.209:9080/sponsors/cashbank/v2/activityDefinitions/85b979e8-8c3a-4d2b-b2ab-2e737764aa9d',
        isDeleted: false,
        defaultVersion: {
          activityDefnVersionKey: '1d7b7685-cc31-452c-ae1e-a1db2a5eff2b',
          isEncrypted: false,
          version: 1,
          status: 'DRAFT'
        }
      },
      {
        activityDefnKey: '43ebdb4e-b9b3-4466-b142-7883360a2fd7',
        name: '54573320240806-121705',
        description: 'Sampler',
        application: 'PEM',
        activityVersionLink: 'http://10.15.106.209:9080/sponsors/cashbank/v2/activityDefinitions/43ebdb4e-b9b3-4466-b142-7883360a2fd7',
        isDeleted: true,
        defaultVersion: {
          activityDefnVersionKey: '243e389d-fc7b-4a9b-aedc-971b01f16542',
          isEncrypted: true,
          version: 2,
          status: 'DELETE'
        }
      },
      {
        activityDefnKey: 'cd796c12-14b4-4023-bae4-c64561df2ece',
        name: '35564420240806-121659',
        description: 'Sampler',
        application: 'PEM',
        activityVersionLink: 'http://10.15.106.209:9080/sponsors/cashbank/v2/activityDefinitions/cd796c12-14b4-4023-bae4-c64561df2ece',
        isDeleted: true,
        defaultVersion: {
          activityDefnVersionKey: 'a74a90fb-da94-47a6-97f0-adf210e55e76',
          isEncrypted: true,
          version: 2,
          status: 'DELETE'
        }
      }
    ],
    pageContent: {
      number: 0,
      size: 10,
      totalElements: 25,
      totalPages: 3
    }
  }
};

export const Activity_Versions_Response = {
  success: true,
  status: 200,
  data: {
    content: [
     
      {
        activityDefnVersionKey: 'version2',
        isEncrypted: false,
        isDefault: true,
        version: 1,
        status: 'FINAL',
        description: ''
      },
      {
        activityDefnVersionKey: 'version1',
        isEncrypted: false,
        isDefault: false,
        version: 2,
        status: 'DRAFT',
        description: ''
      },
      {
        activityDefnVersionKey: 'version3',
        isEncrypted: false,
        isDefault: false,
        version: 3,
        status: 'DELETE',
        description: ''
      }
    ],
    page: {
      number: 1,
      size: 10,
      totalElements: 25,
      totalPages: 3
    }
  }
};

export const Activity_Versions_Details_Response = {
    success: true,
    status: 200,
    data: {
     
          activityDefnVersionKey: '1d7b7685-cc31-452c-ae1e-a1db2a5eff2b',
          isEncrypted: false,
          isDefault: true,
          version: 1,
          status: 'DRAFT',
          description: ''
    }
  };

export const Activity_Version_Get_Data = {
  success: true,
  status: 200,
  data: {
    name: 'New Activity - demo',
    description: 'Activity Description',
    schemaVersion: 1,
    process: {
      nodes: [
        {
          id: 'start_1',
          name: 'Start_0',
          type: 'START',
          diagram: {
            x: 250,
            y: 300
          },
          nodes: [],
          connectors: []
        },
        {
          id: 'end_1',
          name: 'End_1',
          type: 'END',
          diagram: {
            x: 650,
            y: 300
          },
          nodes: [],
          connectors: []
        },
        {
          id: 'Task_Name_0',
          name: 'Task_Name_0 - demo',
          type: 'PARTNER',
          diagram: {
            x: 345,
            y: 166
          },
          nodes: [
            {
              id: 'start_1',
              name: 'Start_0',
              type: 'START',
              diagram: {
                x: 350,
                y: 500
              },
              nodes: [],
              connectors: []
            },
            {
              id: 'end_1',
              name: 'End_1',
              type: 'END',
              diagram: {
                x: 950,
                y: 500
              },
              nodes: [],
              connectors: []
            },
            {
              id: 'Dialog_Name_0',
              name: 'Dialog_Name_0 - demo',
              type: 'FORM',
              diagram: {
                x: 309,
                y: 146
              },
              nodes: [],
              connectors: [],
              description: 'Dilog Task description',
              form: '{"fields":[{"id":"5b911844-c1f5-4ba5-b7bb-953b457e40b5","type":"Single line input","max":{"value":"20","message":"Text Input must be no longer than 20 characters."},"name":"form-control-5b","labelText":"Name","min":{"value":"1","message":"Minimum 1 characters required"},"isRequired":{"value":true,"message":"This is a required field"},"placeHolder":"Please Enter Your Name"},{"id":"b84608aa-f915-4c90-830e-af436ebcf6f9","type":"Single line input","max":{"value":"20","message":"Text Input must be no longer than 20 characters."},"name":"form-control-b8","labelText":"Email","min":{"value":"1","message":"Minimum 1 characters required"},"isRequired":{"value":true,"message":"This is a required field"},"placeHolder":"Please Enter Your Email"}]}',
              loop: {
                loopDataInput: '',
                dataItem: '',
                completionCondition: ''
              }
            },
            {
              id: 'Dialog_Name_1',
              name: 'Dialog_Name_1 - demo',
              type: 'API',
              diagram: {
                x: 580,
                y: 169
              },
              nodes: [],
              connectors: [],
              description: 'API Task Description',
              loop: {
                loopCardinality: ''
              },
              api: {
                apiConfiguration: 'apiConfiguration',
                url: 'https://jira.com/browse/PEM-273476',
                method: 'GET',
                requestContentType: 'JSON',
                responseContentType: 'JSON',
                file: 'file object',
                requestHeaders: '[{"key:"value"}]',
                request: '{"name:"test_name"}',
                sampleResponse: '{"name:"test_name"}',
                response: '{"name:"test_name"}'
              }
            },
            {
              id: 'Dialog_Name_2',
              name: 'Dialog_Name_2 - demo',
              type: 'XSLT',
              diagram: {
                x: 993,
                y: 157
              },
              nodes: [],
              connectors: [],
              description: 'XSLT Description',
              xslt: {
                xslt: '',
                input: '',
                sampleOutput: '',
                output: '',
                escapeInput: false
              },
              loop: {
                loopCardinality: '',
                completionCondition: ''
              }
            }
          ],
          connectors: [
            {
              id: 'Dialog_Name_0_to_Dialog_Name_1',
              source: 'Dialog_Name_0',
              target: 'Dialog_Name_1',
              condition: '',
              diagram: []
            },
            {
              id: 'Dialog_Name_1_to_Dialog_Name_2',
              source: 'Dialog_Name_1',
              target: 'Dialog_Name_2',
              condition: '',
              diagram: []
            },
            {
              id: 'start_1_to_Dialog_Name_0',
              source: 'start_1',
              target: 'Dialog_Name_0',
              condition: '',
              diagram: []
            },
            {
              id: 'Dialog_Name_2_to_end_1',
              source: 'Dialog_Name_2',
              target: 'end_1',
              condition: '',
              diagram: []
            }
          ],
          description: 'Task Description',
          estimateDays: 32,
          userKeys: '',
          roleKeys: 'AssignRole_Auto_Sponsor'
        }
      ],
      connectors: [
        {
          id: 'start_1_to_Task_Name_0',
          source: 'start_1',
          target: 'Task_Name_0',
          condition: '',
          diagram: []
        },
        {
          id: 'Task_Name_0_to_end_1',
          source: 'Task_Name_0',
          target: 'end_1',
          "condition": "{\"condition\":{\"combinator\":\"and\",\"rules\":[{\"rule\":{\"id\":\"6d57b115-decc-49cb-b606-f9fae4b56f85\",\"datatype\":\"string\",\"lhs\":\"Disabled-1\",\"operator\":\"=\",\"rhs\":\"Disabled-2\"}},{\"rule\":{\"id\":\"4c17a55b-a8aa-4318-8b5b-47cb13e05ea0\",\"datatype\":\"numeric\",\"lhs\":\"Disabled-1\",\"operator\":\"=\",\"rhs\":\"Disabled-2\"}}]},\"errorMessage\":\"error\"}",
          diagram: []
        }
      ],
      contextData:
        '{"applications":{"QA_B2BISFG":{"__text":"SAMPLE_QA_B2BISFG","_type":"APIConfig"},"SSP":{"Policy":{"FTP_Policy":"","HTTPS_Policy":"","FTPS_Policy":"","HTTP_Policy":"","CD_Policy":"","SFTP_Policy":""},"SystemCert":"","FTP_Netmap":"TEST_FTP_NETMAP","TrustStore":"","KeyStore":"","SecuritySetting":"","SFTP_Netmap":"SFTP_TEST","CD_Netmap":"CMCD_Netmap","FTPS_Netmap":"FTPS_NETMAP","ciphers":{"cipher":[{"name":""},{"name":""}]},"Enable":false,"HTTP_Netmap":"TEST_HTTP_NETMAP","HTTPS_Netmap":"HTTPS_NETMAP","ClientAuthentication":""},"PR":{"__text":"SAMPLE_PR","_type":"Harsh"},"Prod_CM":{"__text":"SAMPLE_PROD_CM","_type":"APIConfig"},"Scripts":{"FileDrop":"","password":"","User":"","Server":"","localFile":false,"Port":22,"pemKey":false,"PGP":"","Prod_Server":""},"Prod_B2BISFG":{"__text":"SAMPLE_PROD_B2BISFG","_type":"APIConfig"},"Prod_B2BISFGHTTP":{"__text":"SAMPLE_PROD_B2BISFGHTTP","_type":"APIConfig"},"PEM":{"__text":"SAMPLE_PEM","_type":"APIConfig"},"QA_CM":{"__text":"SAMPLE_QA_CM","_type":"APIConfig"},"SponsorConfigurations":{"AS2":"","S3":"","prod_codelistVersion_pcm":"|||1","RCT":"","FTP":"","codelist":"SFG_FileType","CustomProtocols":{"protocol":[{"_name":"http-protocol","_value":"HTTPS","_bp":"AFTRouteViaHTTP"},{"_name":"","_value":"HTTPS"}]},"prod_codelist":"SFG_FileType","Inbound_Envelope_EDIFACT":{"_type":"activityfiles"},"FileRoute":false,"codelistVersion":"%7C%7C%7C1","codelistVersion_pcm":"|||1","Prod_Customer_IPs":{"Outbound":"","Inbound":""},"CD":"","ImplementationGuides":{"_type":"activityfiles"},"prod_codelistVersion":"%7C%7C%7C1","SFTP":"","SFG_Community":"CM_PEMCommunity","Outbound_Envelope_EDIFACT":{"_type":"activityfiles"},"Inbound_Envelope_X12":{"_type":"activityfiles"},"NonProd_Customer_IPs":{"Outbound":"10.0.0.20-10.0.0.30","Inbound":"10.0.0.1-10.0.0.10"},"FTPS":"","Filegateway":"","PGP":"","Outbound_Envelope_X12":{"_type":"activityfiles"},"NativePGP":false,"UserAccount":{"AuthenticationHost":"","AuthenticationType":"Local","LDAPProvisioningEnabled":false}},"QA_B2BISFGHTTP":{"__text":"SAMPLE_QA_B2BISFGHTTP","_type":"APIConfig"}}}\n'
    }
  }
};
