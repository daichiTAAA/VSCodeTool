# ナレッジベース情報取得に使用できそうなDatabricksAPI

<br>

# 作成記録
---
* 作成日時 2025/9/1 
* 更新日時

# 出典
[Databricks API Reference](https://docs.databricks.com/api/azure/workspace/introduction)

# Real-Time Serving
## Serving endpoints
The Serving Endpoints API allows you to create, update, and delete model serving endpoints.
You can use a serving endpoint to serve models from the Databricks Model Registry or from Unity Catalog. Endpoints expose the underlying models as scalable REST API endpoints using serverless compute. This means the endpoints and associated compute resources are fully managed by Azure Databricks and will not appear in your cloud account. A serving endpoint can consist of one or more MLflow models from the Databricks Model Registry, called served entities. A serving endpoint can have at most ten served entities. You can configure traffic settings to define how requests should be routed to your served entities behind an endpoint. Additionally, you can configure the scale of resources that should be applied to each served entity.
### Get all serving endpoints
GET
/api/2.0/serving-endpoints
Get all serving endpoints.
API scope: 
serving.serving-endpoints
Responses
200 
Request completed successfully.
Request completed successfully.
endpoints
Array of object
The list of endpoints.
This method might return the following HTTP codes: 401, 500
Response samples
200
{
  "endpoints": [
    {
      "ai_gateway": {
        "fallback_config": {
          "enabled": true
        },
        "guardrails": {
          "input": {
            "invalid_keywords": [
              "string"
            ],
            "pii": {
              "behavior": "NONE"
            },
            "safety": true,
            "valid_topics": [
              "string"
            ]
          },
          "output": {
            "invalid_keywords": [
              "string"
            ],
            "pii": {
              "behavior": "NONE"
            },
            "safety": true,
            "valid_topics": [
              "string"
            ]
          }
        },
        "inference_table_config": {
          "catalog_name": "my-catalog",
          "enabled": true,
          "schema_name": "my-schema",
          "table_name_prefix": "my-prefix"
        },
        "rate_limits": [
          {
            "calls": 15,
            "key": "user",
            "principal": "user@test.com",
            "renewal_period": "minute",
            "tokens": 10000
          }
        ],
        "usage_tracking_config": {
          "enabled": true
        }
      },
      "budget_policy_id": "string",
      "config": {
        "served_entities": [
          {
            "entity_name": "string",
            "entity_version": "string",
            "external_model": {
              "ai21labs_config": {
                "ai21labs_api_key": "{{secrets/my_scope/my_ai21labs_api_key}}",
                "ai21labs_api_key_plaintext": "Your API Key"
              },
              "amazon_bedrock_config": {
                "aws_access_key_id": "{{secrets/my_scope/my_aws_access_key_id}}",
                "aws_access_key_id_plaintext": "Your AWS Access Key ID",
                "aws_region": "myAwsRegion",
                "aws_secret_access_key": "{{secrets/my_scope/my_aws_secret_access_key}}",
                "aws_secret_access_key_plaintext": "Your AWS Secret Access Key",
                "bedrock_provider": "anthropic",
                "instance_profile_arn": "arn:aws:iam::123456789012:instance-profile/my-instance-profile"
              },
              "anthropic_config": {
                "anthropic_api_key": "{{secrets/my_scope/my_anthropic_api_key}}",
                "anthropic_api_key_plaintext": "Your API Key"
              },
              "cohere_config": {
                "cohere_api_base": "https://api.cohere.ai/v1",
                "cohere_api_key": "{{secrets/my_scope/my_cohere_api_key}}",
                "cohere_api_key_plaintext": "Your API Key"
              },
              "custom_provider_config": {
                "api_key_auth": {
                  "key": "api-key",
                  "value": "{{secrets/my_scope/my_api_key}}",
                  "value_plaintext": "Your API Key"
                },
                "bearer_token_auth": {
                  "token": "{{secrets/my_scope/my_openai_api_key}}",
                  "token_plaintext": "Your API Key"
                },
                "custom_provider_url": "https://custom-provider.com"
              },
              "databricks_model_serving_config": {
                "databricks_api_token": "{{secrets/my_scope/my_databricks_api_token}}",
                "databricks_api_token_plaintext": "Your Databricks API Token",
                "databricks_workspace_url": "https://my-databricks-workspace.com"
              },
              "google_cloud_vertex_ai_config": {
                "private_key": "{{secrets/my_scope/my_google_cloud_vertex_ai_api_key}}",
                "private_key_plaintext": "Your API Key",
                "project_id": "your-project-id",
                "region": "us-central1"
              },
              "name": "gpt-4",
              "openai_config": {
                "microsoft_entra_client_id": "12345678-abcd-1234-5678-12345678abcd",
                "microsoft_entra_client_secret": "{{secrets/my_scope/my_microsoft_entra_client_secret}}",
                "microsoft_entra_client_secret_plaintext": "Your Microsoft Entra Client Secret",
                "microsoft_entra_tenant_id": "12345678-abcd-1234-5678-12345678abcd",
                "openai_api_base": "https://api.openai.com/v1",
                "openai_api_key": "{{secrets/my_scope/my_openai_api_key}}",
                "openai_api_key_plaintext": "Your API Key",
                "openai_api_type": "azure",
                "openai_api_version": "2023-11-01",
                "openai_deployment_name": "my_deployment_resource",
                "openai_organization": "Databricks"
              },
              "palm_config": {
                "palm_api_key": "{{secrets/my_scope/my_palm_api_key}}",
                "palm_api_key_plaintext": "Your API Key"
              },
              "provider": "ai21labs",
              "task": "llm/v1/chat"
            },
            "foundation_model": {
              "description": "string",
              "display_name": "string",
              "docs": "string",
              "name": "string"
            },
            "name": "string"
          }
        ],
        "served_models": [
          {
            "model_name": "string",
            "model_version": "string",
            "name": "string"
          }
        ]
      },
      "creation_timestamp": 0,
      "creator": "alice@company.com",
      "description": "string",
      "id": "88fd3f75a0d24b0380ddc40484d7a31b",
      "last_updated_timestamp": 0,
      "name": "feed-ads",
      "state": {
        "config_update": "NOT_UPDATING",
        "ready": "READY"
      },
      "tags": [
        {
          "key": "team",
          "value": "data science"
        }
      ],
      "task": "model-serving-task",
      "usage_policy_id": "string"
    }
  ]
}

### Get a single serving endpoint
GET
/api/2.0/serving-endpoints/{name}
Retrieves the details for a single serving endpoint.
API scope: 
serving.serving-endpoints
Path parameters
name
required
string
[ 1 .. 63 ] characters
Example "feed-ads"
The name of the serving endpoint. This field is required.
Responses
200 
Request completed successfully.
Request completed successfully.
ai_gateway
object
The AI Gateway configuration for the serving endpoint. NOTE: External model, provisioned throughput, and pay-per-token endpoints are fully supported; agent endpoints currently only support inference tables.
budget_policy_id
string
The budget policy associated with the endpoint.
config
object
The config that is currently being served by the endpoint.
creation_timestamp
int64
The timestamp when the endpoint was created in Unix time.
creator
string
Example "alice@company.com"
The email of the user who created the serving endpoint.
data_plane_info
object
Information required to query DataPlane APIs.
description
string
Description of the serving model
email_notifications
object
Email notification settings.
endpoint_url
string
Endpoint invocation url if route optimization is enabled for endpoint
id
string
Example "88fd3f75a0d24b0380ddc40484d7a31b"
System-generated ID of the endpoint. This is used to refer to the endpoint in the Permissions API
last_updated_timestamp
int64
The timestamp when the endpoint was last updated by a user in Unix time.
name
string
Example "feed-ads"
The name of the serving endpoint.
pending_config
object
The config that the endpoint is attempting to update to.
permission_level
string
Enum: CAN_MANAGE | CAN_QUERY | CAN_VIEW
Example "CAN_MANAGE"
The permission level of the principal making the request.
route_optimized
boolean
Example true
Boolean representing if route optimization has been enabled for the endpoint
state
object
Information corresponding to the state of the serving endpoint.
tags
Array of object
Tags attached to the serving endpoint.
task
string
Example "model-serving-task"
The task type of the serving endpoint.
This method might return the following HTTP codes: 401, 404, 500
Response samples
200
{
  "ai_gateway": {
    "fallback_config": {
      "enabled": true
    },
    "guardrails": {
      "input": {
        "invalid_keywords": [
          "string"
        ],
        "pii": {
          "behavior": "NONE"
        },
        "safety": true,
        "valid_topics": [
          "string"
        ]
      },
      "output": {
        "invalid_keywords": [
          "string"
        ],
        "pii": {
          "behavior": "NONE"
        },
        "safety": true,
        "valid_topics": [
          "string"
        ]
      }
    },
    "inference_table_config": {
      "catalog_name": "my-catalog",
      "enabled": true,
      "schema_name": "my-schema",
      "table_name_prefix": "my-prefix"
    },
    "rate_limits": [
      {
        "calls": 15,
        "key": "user",
        "principal": "user@test.com",
        "renewal_period": "minute",
        "tokens": 10000
      }
    ],
    "usage_tracking_config": {
      "enabled": true
    }
  },
  "budget_policy_id": "string",
  "config": {
    "auto_capture_config": {
      "catalog_name": "my-catalog",
      "enabled": true,
      "schema_name": "my-schema",
      "state": {
        "payload_table": {
          "name": "string",
          "status": "string",
          "status_message": "string"
        }
      },
      "table_name_prefix": "my-prefix-"
    },
    "config_version": 0,
    "served_entities": [
      {
        "creation_timestamp": 0,
        "creator": "string",
        "entity_name": "ads-model",
        "entity_version": "3",
        "environment_vars": {
          "property1": "string",
          "property2": "string"
        },
        "external_model": {
          "ai21labs_config": {
            "ai21labs_api_key": "{{secrets/my_scope/my_ai21labs_api_key}}",
            "ai21labs_api_key_plaintext": "Your API Key"
          },
          "amazon_bedrock_config": {
            "aws_access_key_id": "{{secrets/my_scope/my_aws_access_key_id}}",
            "aws_access_key_id_plaintext": "Your AWS Access Key ID",
            "aws_region": "myAwsRegion",
            "aws_secret_access_key": "{{secrets/my_scope/my_aws_secret_access_key}}",
            "aws_secret_access_key_plaintext": "Your AWS Secret Access Key",
            "bedrock_provider": "anthropic",
            "instance_profile_arn": "arn:aws:iam::123456789012:instance-profile/my-instance-profile"
          },
          "anthropic_config": {
            "anthropic_api_key": "{{secrets/my_scope/my_anthropic_api_key}}",
            "anthropic_api_key_plaintext": "Your API Key"
          },
          "cohere_config": {
            "cohere_api_base": "https://api.cohere.ai/v1",
            "cohere_api_key": "{{secrets/my_scope/my_cohere_api_key}}",
            "cohere_api_key_plaintext": "Your API Key"
          },
          "custom_provider_config": {
            "api_key_auth": {
              "key": "api-key",
              "value": "{{secrets/my_scope/my_api_key}}",
              "value_plaintext": "Your API Key"
            },
            "bearer_token_auth": {
              "token": "{{secrets/my_scope/my_openai_api_key}}",
              "token_plaintext": "Your API Key"
            },
            "custom_provider_url": "https://custom-provider.com"
          },
          "databricks_model_serving_config": {
            "databricks_api_token": "{{secrets/my_scope/my_databricks_api_token}}",
            "databricks_api_token_plaintext": "Your Databricks API Token",
            "databricks_workspace_url": "https://my-databricks-workspace.com"
          },
          "google_cloud_vertex_ai_config": {
            "private_key": "{{secrets/my_scope/my_google_cloud_vertex_ai_api_key}}",
            "private_key_plaintext": "Your API Key",
            "project_id": "your-project-id",
            "region": "us-central1"
          },
          "name": "gpt-4",
          "openai_config": {
            "microsoft_entra_client_id": "12345678-abcd-1234-5678-12345678abcd",
            "microsoft_entra_client_secret": "{{secrets/my_scope/my_microsoft_entra_client_secret}}",
            "microsoft_entra_client_secret_plaintext": "Your Microsoft Entra Client Secret",
            "microsoft_entra_tenant_id": "12345678-abcd-1234-5678-12345678abcd",
            "openai_api_base": "https://api.openai.com/v1",
            "openai_api_key": "{{secrets/my_scope/my_openai_api_key}}",
            "openai_api_key_plaintext": "Your API Key",
            "openai_api_type": "azure",
            "openai_api_version": "2023-11-01",
            "openai_deployment_name": "my_deployment_resource",
            "openai_organization": "Databricks"
          },
          "palm_config": {
            "palm_api_key": "{{secrets/my_scope/my_palm_api_key}}",
            "palm_api_key_plaintext": "Your API Key"
          },
          "provider": "ai21labs",
          "task": "llm/v1/chat"
        },
        "foundation_model": {
          "description": "string",
          "display_name": "string",
          "docs": "string",
          "name": "string"
        },
        "instance_profile_arn": "string",
        "max_provisioned_concurrency": 32,
        "max_provisioned_throughput": 1960,
        "min_provisioned_concurrency": 8,
        "min_provisioned_throughput": 970,
        "name": "ads-model-3",
        "provisioned_model_units": 100,
        "scale_to_zero_enabled": "false",
        "state": {
          "deployment": "DEPLOYMENT_CREATING",
          "deployment_state_message": "string"
        },
        "workload_size": "string",
        "workload_type": "CPU"
      }
    ],
    "served_models": [
      {
        "creation_timestamp": 0,
        "creator": "string",
        "environment_vars": {
          "property1": "string",
          "property2": "string"
        },
        "instance_profile_arn": "string",
        "max_provisioned_concurrency": 32,
        "min_provisioned_concurrency": 8,
        "model_name": "string",
        "model_version": "string",
        "name": "ads-model-3",
        "provisioned_model_units": 100,
        "scale_to_zero_enabled": "false",
        "state": {
          "deployment": "DEPLOYMENT_CREATING",
          "deployment_state_message": "string"
        },
        "workload_size": "string",
        "workload_type": "CPU"
      }
    ],
    "traffic_config": {
      "routes": [
        {
          "served_entity_name": "ads-model-3",
          "served_model_name": "ads-model-3",
          "traffic_percentage": "100"
        }
      ]
    }
  },
  "creation_timestamp": 0,
  "creator": "alice@company.com",
  "data_plane_info": {
    "query_info": {
      "authorization_details": "string",
      "endpoint_url": "string"
    }
  },
  "description": "string",
  "email_notifications": {
    "on_update_failure": [
      "user.name@databricks.com"
    ],
    "on_update_success": [
      "user.name@databricks.com"
    ]
  },
  "endpoint_url": "string",
  "id": "88fd3f75a0d24b0380ddc40484d7a31b",
  "last_updated_timestamp": 0,
  "name": "feed-ads",
  "pending_config": {
    "auto_capture_config": {
      "catalog_name": "my-catalog",
      "enabled": true,
      "schema_name": "my-schema",
      "state": {
        "payload_table": {
          "name": "string",
          "status": "string",
          "status_message": "string"
        }
      },
      "table_name_prefix": "my-prefix-"
    },
    "config_version": 0,
    "served_entities": [
      {
        "creation_timestamp": 0,
        "creator": "string",
        "entity_name": "ads-model",
        "entity_version": "3",
        "environment_vars": {
          "property1": "string",
          "property2": "string"
        },
        "external_model": {
          "ai21labs_config": {
            "ai21labs_api_key": "{{secrets/my_scope/my_ai21labs_api_key}}",
            "ai21labs_api_key_plaintext": "Your API Key"
          },
          "amazon_bedrock_config": {
            "aws_access_key_id": "{{secrets/my_scope/my_aws_access_key_id}}",
            "aws_access_key_id_plaintext": "Your AWS Access Key ID",
            "aws_region": "myAwsRegion",
            "aws_secret_access_key": "{{secrets/my_scope/my_aws_secret_access_key}}",
            "aws_secret_access_key_plaintext": "Your AWS Secret Access Key",
            "bedrock_provider": "anthropic",
            "instance_profile_arn": "arn:aws:iam::123456789012:instance-profile/my-instance-profile"
          },
          "anthropic_config": {
            "anthropic_api_key": "{{secrets/my_scope/my_anthropic_api_key}}",
            "anthropic_api_key_plaintext": "Your API Key"
          },
          "cohere_config": {
            "cohere_api_base": "https://api.cohere.ai/v1",
            "cohere_api_key": "{{secrets/my_scope/my_cohere_api_key}}",
            "cohere_api_key_plaintext": "Your API Key"
          },
          "custom_provider_config": {
            "api_key_auth": {
              "key": "api-key",
              "value": "{{secrets/my_scope/my_api_key}}",
              "value_plaintext": "Your API Key"
            },
            "bearer_token_auth": {
              "token": "{{secrets/my_scope/my_openai_api_key}}",
              "token_plaintext": "Your API Key"
            },
            "custom_provider_url": "https://custom-provider.com"
          },
          "databricks_model_serving_config": {
            "databricks_api_token": "{{secrets/my_scope/my_databricks_api_token}}",
            "databricks_api_token_plaintext": "Your Databricks API Token",
            "databricks_workspace_url": "https://my-databricks-workspace.com"
          },
          "google_cloud_vertex_ai_config": {
            "private_key": "{{secrets/my_scope/my_google_cloud_vertex_ai_api_key}}",
            "private_key_plaintext": "Your API Key",
            "project_id": "your-project-id",
            "region": "us-central1"
          },
          "name": "gpt-4",
          "openai_config": {
            "microsoft_entra_client_id": "12345678-abcd-1234-5678-12345678abcd",
            "microsoft_entra_client_secret": "{{secrets/my_scope/my_microsoft_entra_client_secret}}",
            "microsoft_entra_client_secret_plaintext": "Your Microsoft Entra Client Secret",
            "microsoft_entra_tenant_id": "12345678-abcd-1234-5678-12345678abcd",
            "openai_api_base": "https://api.openai.com/v1",
            "openai_api_key": "{{secrets/my_scope/my_openai_api_key}}",
            "openai_api_key_plaintext": "Your API Key",
            "openai_api_type": "azure",
            "openai_api_version": "2023-11-01",
            "openai_deployment_name": "my_deployment_resource",
            "openai_organization": "Databricks"
          },
          "palm_config": {
            "palm_api_key": "{{secrets/my_scope/my_palm_api_key}}",
            "palm_api_key_plaintext": "Your API Key"
          },
          "provider": "ai21labs",
          "task": "llm/v1/chat"
        },
        "foundation_model": {
          "description": "string",
          "display_name": "string",
          "docs": "string",
          "name": "string"
        },
        "instance_profile_arn": "string",
        "max_provisioned_concurrency": 32,
        "max_provisioned_throughput": 1960,
        "min_provisioned_concurrency": 8,
        "min_provisioned_throughput": 970,
        "name": "ads-model-3",
        "provisioned_model_units": 100,
        "scale_to_zero_enabled": "false",
        "state": {
          "deployment": "DEPLOYMENT_CREATING",
          "deployment_state_message": "string"
        },
        "workload_size": "string",
        "workload_type": "CPU"
      }
    ],
    "served_models": [
      {
        "creation_timestamp": 0,
        "creator": "string",
        "environment_vars": {
          "property1": "string",
          "property2": "string"
        },
        "instance_profile_arn": "string",
        "max_provisioned_concurrency": 32,
        "min_provisioned_concurrency": 8,
        "model_name": "string",
        "model_version": "string",
        "name": "ads-model-3",
        "provisioned_model_units": 100,
        "scale_to_zero_enabled": "false",
        "state": {
          "deployment": "DEPLOYMENT_CREATING",
          "deployment_state_message": "string"
        },
        "workload_size": "string",
        "workload_type": "CPU"
      }
    ],
    "start_time": 0,
    "traffic_config": {
      "routes": [
        {
          "served_entity_name": "ads-model-3",
          "served_model_name": "ads-model-3",
          "traffic_percentage": "100"
        }
      ]
    }
  },
  "permission_level": "CAN_MANAGE",
  "route_optimized": true,
  "state": {
    "config_update": "NOT_UPDATING",
    "ready": "READY"
  },
  "tags": [
    {
      "key": "team",
      "value": "data science"
    }
  ],
  "task": "model-serving-task"
}

### Get the schema for a serving endpoint
Public preview
GET
/api/2.0/serving-endpoints/{name}/openapi
Get the query schema of the serving endpoint in OpenAPI format. The schema contains information for the supported paths, input and output format and datatypes.
API scope: 
serving.serving-endpoints
Path parameters
name
required
string
[ 1 .. 63 ] characters
Example "feed-ads"
The name of the serving endpoint that the served model belongs to. This field is required.
Responses
200 
Request completed successfully.
Request completed successfully.
This method might return the following HTTP codes: 401, 500

### Query a serving endpoint
POST
/serving-endpoints/{name}/invocations
Query a serving endpoint
API scope: 
serving.serving-endpoints
Path parameters
name
required
string
The name of the serving endpoint. This field is required and is provided via the path parameter.
Request body
client_request_id
string
Optional user-provided request identifier that will be recorded in the inference table and the usage tracking table.
dataframe_records
Array of object
Pandas Dataframe input in the records orientation.
dataframe_split
object
Pandas Dataframe input in the split orientation.
extra_params
object
Public preview
The extra parameters field used ONLY for completions, chat, and embeddings external & foundation model serving endpoints. This is a map of strings and should only be used with other external/foundation model query fields.
input
object
Public preview
The input string (or array of strings) field used ONLY for embeddings external & foundation model serving endpoints and is the only field (along with extra_params if needed) used by embeddings queries.
inputs
object
Tensor-based input in columnar format.
instances
Array of object
Tensor-based input in row format.
max_tokens
int32
Public preview
Example 100
The max tokens field used ONLY for completions and chat external & foundation model serving endpoints. This is an integer and should only be used with other chat/completions query fields.
messages
Array of object
Public preview
The messages field used ONLY for chat external & foundation model serving endpoints. This is an array of ChatMessage objects and should only be used with other chat query fields.
n
int32
Public preview
Example 5
The n (number of candidates) field used ONLY for completions and chat external & foundation model serving endpoints. This is an integer between 1 and 5 with a default of 1 and should only be used with other chat/completions query fields.
prompt
object
Public preview
The prompt string (or array of strings) field used ONLY for completions external & foundation model serving endpoints and should only be used with other completions query fields.
stop
Array of string
Public preview
The stop sequences field used ONLY for completions and chat external & foundation model serving endpoints. This is a list of strings and should only be used with other chat/completions query fields.
stream
boolean
Public preview
Example true
The stream field used ONLY for completions and chat external & foundation model serving endpoints. This is a boolean defaulting to false and should only be used with other chat/completions query fields.
temperature
double
Public preview
Example 0.5
The temperature field used ONLY for completions and chat external & foundation model serving endpoints. This is a float between 0.0 and 2.0 with a default of 1.0 and should only be used with other chat/completions query fields.
usage_context
object
Optional user-provided context that will be recorded in the usage tracking table.
Responses
200 
Request completed successfully.
Request completed successfully.
Response Headers
served-model-name
string
The name of the served model that served the request. This is useful when there are multiple models behind the same endpoint with traffic split.
choices
Array of object
Public preview
The list of choices returned by the chat or completions external/foundation model serving endpoint.
created
int64
Public preview
Example 1699617587
The timestamp in seconds when the query was created in Unix time returned by a completions or chat external/foundation model serving endpoint.
data
Array of object
Public preview
The list of the embeddings returned by the embeddings external/foundation model serving endpoint.
id
string
Public preview
Example "88fd3f75a0d24b0380ddc40484d7a31b"
The ID of the query that may be returned by a completions or chat external/foundation model serving endpoint.
model
string
Public preview
Example "gpt-4"
The name of the external/foundation model used for querying. This is the name of the model that was specified in the endpoint config.
object
string
Public preview
Enum: text_completion | chat.completion | list
The type of object returned by the external/foundation model serving endpoint, one of [text_completion, chat.completion, list (of embeddings)].
predictions
Array of object
The predictions returned by the serving endpoint.
usage
object
Public preview
The usage object that may be returned by the external/foundation model serving endpoint. This contains information about the number of tokens used in the prompt and response.
This method might return the following HTTP codes: 401, 403, 404, 500
Request samples
JSON

Dataframe input in split orientation
{
  "dataframe_split": {
    "columns": [
      "sepal length (cm)",
      "sepal width (cm)",
      "petal length (cm)",
      "petal width (cm)"
    ],
    "data": [
      [
        5.1,
        3.5,
        1.4,
        0.2
      ],
      [
        4.9,
        3,
        1.4,
        0.2
      ]
    ],
    "index": [
      0,
      1
    ]
  }
}
Response samples
200

Chat External/Foundation Model Endpoint
{
  "choices": [
    {
      "finish_reason": null,
      "index": 0,
      "message": {
        "content": "MLflow is an open-source platform for managing the end-to-end machine learning (ML) lifecycle. It helps data scientists and ML engineers to manage and track experiments, reproduce and share results, and deploy ML models. MLflow was created by LinkedIn and is now a part of the Linux Foundation's AI and Machine Learning projects.\n\nMLflow provides a set of tools and services that enable data scientists and ML engineers to manage the entire",
        "role": "assistant"
      }
    }
  ],
  "created": 1698824353,
  "id": null,
  "model": "llama2-70b-chat",
  "object": "chat.completion",
  "usage": {
    "completion_tokens": 74,
    "prompt_tokens": 7,
    "total_tokens": 81
  }
}

# Vector Search
## Endpoints
Endpoint: Represents the compute resources to host vector search indexes.
### List all endpoints
GET
/api/2.0/vector-search/endpoints
List all vector search endpoints in the workspace.
API scope: 
vectorsearch.vector-search-endpoints
Query parameters
page_token
string
Token for pagination
Responses
200 
Request completed successfully. The response includes a list of items and pagination information. If `next_page_token` is set, there are more results.
Request completed successfully.
The response includes a list of items and pagination information. If next_page_token is set, there are more results.
endpoints
Array of object
An array of Endpoint objects
next_page_token
string
A token that can be used to get the next page of results. If not present, there are no more results to show.
Response samples
200
{
  "endpoints": [
    {
      "creation_timestamp": 1702013512061,
      "creator": "john@example.com",
      "endpoint_status": {
        "message": "string",
        "state": "PROVISIONING"
      },
      "endpoint_type": "STANDARD",
      "id": "c56bf0a9-4929-4bd4-8bd5-d82ca62f9c76",
      "last_updated_timestamp": 1702013512061,
      "last_updated_user": "john@example.com",
      "name": "docs-endpoint",
      "num_indexes": 0
    }
  ],
  "next_page_token": "string"
}

### Get an endpoint
GET
/api/2.0/vector-search/endpoints/{endpoint_name}
Get details for a single vector search endpoint.
API scope: 
vectorsearch.vector-search-endpoints
Path parameters
endpoint_name
required
string
Name of the endpoint
Responses
200 
Request completed successfully.
Request completed successfully.
creation_timestamp
int64
Example 1702013512061
Timestamp of endpoint creation
creator
string
Example "john@example.com"
Creator of the endpoint
endpoint_status
object
Current status of the endpoint
endpoint_type
string
Enum: STANDARD
Type of endpoint
id
string
Example "c56bf0a9-4929-4bd4-8bd5-d82ca62f9c76"
Unique identifier of the endpoint
last_updated_timestamp
int64
Example 1702013512061
Timestamp of last update to the endpoint
last_updated_user
string
Example "john@example.com"
User who last updated the endpoint
name
string
Example "docs-endpoint"
Name of the vector search endpoint
num_indexes
int32
Number of indexes on the endpoint
This method might return the following HTTP codes: 401, 404, 500
Response samples
200
{
  "creation_timestamp": 1702013512061,
  "creator": "john@example.com",
  "endpoint_status": {
    "message": "string",
    "state": "PROVISIONING"
  },
  "endpoint_type": "STANDARD",
  "id": "c56bf0a9-4929-4bd4-8bd5-d82ca62f9c76",
  "last_updated_timestamp": 1702013512061,
  "last_updated_user": "john@example.com",
  "name": "docs-endpoint",
  "num_indexes": 0
}

## Indexes
Index: An efficient representation of your embedding vectors that supports real-time and efficient approximate nearest neighbor (ANN) search queries.
There are 2 types of Vector Search indexes:
Delta Sync Index: An index that automatically syncs with a source Delta Table, automatically and incrementally updating the index as the underlying data in the Delta Table changes.
Direct Vector Access Index: An index that supports direct read and write of vectors and metadata through our REST and SDK APIs. With this model, the user manages index updates.
### List indexes
GET
/api/2.0/vector-search/indexes
List all indexes in the given endpoint.
API scope: 
vectorsearch.vector-search-indexes
Query parameters
endpoint_name
required
string
Name of the endpoint
page_token
string
Token for pagination
Responses
200 
Request completed successfully.
Request completed successfully.
next_page_token
string
A token that can be used to get the next page of results. If not present, there are no more results to show.
vector_indexes
Array of object
This method might return the following HTTP codes: 401, 404, 500
Response samples
200
{
  "next_page_token": "string",
  "vector_indexes": [
    {
      "creator": "string",
      "endpoint_name": "string",
      "index_type": "DELTA_SYNC",
      "name": "string",
      "primary_key": "string"
    }
  ]
}

### Get an index
GET
/api/2.0/vector-search/indexes/{index_name}
Get an index.
API scope: 
vectorsearch.vector-search-indexes
Path parameters
index_name
required
string
Name of the index
Responses
200 
Request completed successfully.
Request completed successfully.
creator
string
The user who created the index.
delta_sync_index_spec
object
direct_access_index_spec
object
endpoint_name
string
Name of the endpoint associated with the index
index_type
string
Enum: DELTA_SYNC | DIRECT_ACCESS
There are 2 types of Vector Search indexes:
DELTA_SYNC: An index that automatically syncs with a source Delta Table, automatically and incrementally updating the index as the underlying data in the Delta Table changes.
DIRECT_ACCESS: An index that supports direct read and write of vectors and metadata through our REST and SDK APIs. With this model, the user manages index updates.
name
string
Name of the index
primary_key
string
Primary key of the index
status
object
This method might return the following HTTP codes: 400, 401, 404, 500
Response samples
200

Successful response for Delta Sync Index
{
  "creator": "john@example.com",
  "delta_sync_index_spec": {
    "embedding_source_columns": [
      {
        "embedding_model_endpoint_name": "e5-small-v2",
        "name": "text"
      }
    ],
    "pipeline_id": "f4eaf1c8-28f9-4ad7-a2f2-a6c8f9eb0b0e",
    "pipeline_type": "TRIGGERED",
    "source_table": "main_catalog.docs.en_wiki"
  },
  "endpoint_name": "docs-endpoint",
  "index_type": "DELTA_SYNC",
  "name": "main_catalog.docs.en_wiki_index",
  "primary_key": "id",
  "status": {
    "index_url": "demo.cloud.databricks.com/api/2.0/vector-search/endpoints/docs-endpoint/indexes/main_catalog.docs.en_wiki_index",
    "indexed_row_count": 0,
    "message": "Delta sync Index creation is pending. Check latest status in Delta Live Tables: https://demo.cloud.databricks.com#joblist/pipelines/f4eaf1c8-28f9-4ad7-a2f2-a6c8f9eb0b0e",
    "ready": false
  }
}

### Query an index
POST
/api/2.0/vector-search/indexes/{index_name}/query
Query the specified vector index.
API scope: 
vectorsearch.vector-search-indexes
Path parameters
index_name
required
string
Name of the vector index to query.
Request body
columns
required
Array of string
List of column names to include in the response.
filters_json
string
JSON string representing query filters.
Example filters:
{"id <": 5}: Filter for id less than 5.
{"id >": 5}: Filter for id greater than 5.
{"id <=": 5}: Filter for id less than equal to 5.
{"id >=": 5}: Filter for id greater than equal to 5.
{"id": 5}: Filter for id equal to 5.
num_results
int32
Number of results to return. Defaults to 10.
query_text
string
Query text. Required for Delta Sync Index using model endpoint.
query_type
string
The query type to use. Choices are ANN and HYBRID. Defaults to ANN.
query_vector
Array of double
Query vector. Required for Direct Vector Access Index and Delta Sync Index using self-managed vectors.
score_threshold
double
Threshold for the approximate nearest neighbor search. Defaults to 0.0.
Responses
200 
Request completed successfully.
Request completed successfully.
manifest
object
Metadata about the result set.
next_page_token
string
[Optional] Token that can be used in QueryVectorIndexNextPage API to get next page of results. If more than 1000 results satisfy the query, they are returned in groups of 1000. Empty value means no more results. The maximum number of results that can be returned is 10,000.
result
object
Data returned in the query result.
This method might return the following HTTP codes: 400, 401, 404, 500
Request samples
JSON

Query using text
{
  "columns": [
    "id"
  ],
  "num_results": 20,
  "query_text": "Databricks Vector Search"
}
Response samples
200
{
  "manifest": {
    "column_count": 3,
    "columns": [
      {
        "name": "id"
      },
      {
        "name": "text"
      },
      {
        "name": "text_vector"
      }
    ]
  },
  "next_page_token": "dummy-next-page-token",
  "result": {
    "data_array": [
      [
        "1",
        "Databricks Vector Search",
        [
          1,
          2,
          3
        ]
      ]
    ],
    "row_count": 1
  }
}

### Query next page
POST
/api/2.0/vector-search/indexes/{index_name}/query-next-page
Use next_page_token returned from previous QueryVectorIndex or QueryVectorIndexNextPage request to fetch next page of results.
API scope: 
vectorsearch.vector-search-indexes
Path parameters
index_name
required
string
Name of the vector index to query.
Request body
Request payload for getting next page of results.
endpoint_name
string
Name of the endpoint.
page_token
string
Page token returned from previous QueryVectorIndex or QueryVectorIndexNextPage API.
Responses
200 
Request completed successfully.
Request completed successfully.
manifest
object
Metadata about the result set.
next_page_token
string
[Optional] Token that can be used in QueryVectorIndexNextPage API to get next page of results. If more than 1000 results satisfy the query, they are returned in groups of 1000. Empty value means no more results. The maximum number of results that can be returned is 10,000.
result
object
Data returned in the query result.
This method might return the following HTTP codes: 400, 401, 404, 500
Request samples
JSON
{
  "endpoint_name": "demo-endpoint",
  "page_token": "dummy-page-token"
}
Response samples
200
{
  "manifest": {
    "column_count": 3,
    "columns": [
      {
        "name": "id"
      },
      {
        "name": "text"
      },
      {
        "name": "text_vector"
      }
    ]
  },
  "next_page_token": "dummy-next-page-token",
  "result": {
    "data_array": [
      [
        "1",
        "Databricks Vector Search",
        [
          1,
          2,
          3
        ]
      ]
    ],
    "row_count": 1
  }
}

### Scan an index
POST
/api/2.0/vector-search/indexes/{index_name}/scan
Scan the specified vector index and return the first num_results entries after the exclusive primary_key.
API scope: 
vectorsearch.vector-search-indexes
Path parameters
index_name
required
string
Name of the vector index to scan.
Request body
last_primary_key
string
Primary key of the last entry returned in the previous scan.
num_results
int32
Number of results to return. Defaults to 10.
Responses
200 
Request completed successfully.
Request completed successfully.
data
Array of object
List of data entries
last_primary_key
string
Primary key of the last entry.
This method might return the following HTTP codes: 400, 401, 404, 500
Request samples
JSON

First scan request
{
  "num_results": 2
}
Response samples
200
{
  "data": [
    {
      "fields": [
        {
          "key": "id",
          "value": {
            "number_value": 1
          }
        },
        {
          "key": "text",
          "value": {
            "string_value": "foo"
          }
        },
        {
          "key": "embedding",
          "value": {
            "list_value": {
              "values": [
                {
                  "number_value": 0.1
                },
                {
                  "number_value": 0.2
                },
                {
                  "number_value": 0.3
                }
              ]
            }
          }
        }
      ]
    },
    {
      "fields": [
        {
          "key": "id",
          "value": {
            "number_value": 2
          }
        },
        {
          "key": "text",
          "value": {
            "string_value": "bar"
          }
        },
        {
          "key": "embedding",
          "value": {
            "list_value": {
              "values": [
                {
                  "number_value": 1
                },
                {
                  "number_value": 2
                },
                {
                  "number_value": 3
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "last_primary_key": "2"
}

# Databricks SQL
## Queries
The queries API can be used to perform CRUD operations on queries. A query is a Databricks SQL object that includes the target SQL warehouse, query text, name, description, tags, and parameters. Queries can be scheduled using the sql_task type of the Jobs API, e.g. jobs/create.
### List queries
GET
/api/2.0/sql/queries
Gets a list of queries accessible to the user, ordered by creation time. Warning: Calling this API concurrently 10 or more times could result in throttling, service degradation, or a temporary ban.
API scope: 
sql.queries
Query parameters
page_token
string
page_size
int32
<= 100
Default 20
Responses
200 
Request completed successfully. The response includes a list of items and pagination information. If `next_page_token` is set, there are more results.
Request completed successfully.
The response includes a list of items and pagination information. If next_page_token is set, there are more results.
next_page_token
string
results
Array of object
This method might return the following HTTP codes: 400, 401, 500
Response samples
200
{
  "next_page_token": "eDg",
  "results": [
    {
      "create_time": "2019-08-24T14:15:22Z",
      "description": "Example description",
      "display_name": "Example query 1",
      "id": "ae25e731-92f2-4838-9fb2-1ca364320a3d",
      "last_modifier_user_name": "user@acme.com",
      "lifecycle_state": "ACTIVE",
      "owner_user_name": "user@acme.com",
      "parameters": [
        {
          "name": "foo",
          "text_value": {
            "value": "bar"
          },
          "title": "foo"
        }
      ],
      "query_text": "SELECT 1",
      "run_as_mode": "OWNER",
      "tags": [
        "Tag 1"
      ],
      "update_time": "2019-08-24T14:15:22Z",
      "warehouse_id": "a7066a8ef796be84"
    },
    {
      "create_time": "2019-08-24T14:15:22Z",
      "description": "Example description",
      "display_name": "Example query 2",
      "id": "be25e731-92f2-4838-9fb2-1ca364320a3d",
      "last_modifier_user_name": "user@acme.com",
      "lifecycle_state": "ACTIVE",
      "owner_user_name": "user@acme.com",
      "parameters": [
        {
          "name": "foo",
          "text_value": {
            "value": "bar"
          },
          "title": "foo"
        }
      ],
      "query_text": "SELECT 1",
      "run_as_mode": "OWNER",
      "tags": [
        "Tag 1"
      ],
      "update_time": "2019-08-24T14:15:22Z",
      "warehouse_id": "a7066a8ef796be84"
    }
  ]
}

### Get a query
GET
/api/2.0/sql/queries/{id}
Gets a query.
API scope: 
sql.queries
Path parameters
id
required
string
Responses
200 
Request completed successfully.
Request completed successfully.
apply_auto_limit
boolean
Whether to apply a 1000 row limit to the query result.
catalog
string
Name of the catalog where this query will be executed.
create_time
date-time
Timestamp when this query was created.
description
string
Example "Example description"
General description that conveys additional information about this query such as usage notes.
display_name
string
Example "Example query"
Display name of the query that appears in list views, widget headings, and on the query page.
id
string
Example "fe25e731-92f2-4838-9fb2-1ca364320a3d"
UUID identifying the query.
last_modifier_user_name
string
Example "user@acme.com"
Username of the user who last saved changes to this query.
lifecycle_state
string
Enum: ACTIVE | TRASHED
Indicates whether the query is trashed.
owner_user_name
string
Example "user@acme.com"
Username of the user that owns the query.
parameters
Array of object
List of query parameter definitions.
parent_path
string
Example "/Users/user@acme.com"
Workspace path of the workspace folder containing the object.
query_text
string
Example "SELECT 1"
Text of the query to be run.
run_as_mode
string
Enum: OWNER | VIEWER
Sets the "Run as" role for the object.
schema
string
Name of the schema where this query will be executed.
tags
Array of string
update_time
date-time
Timestamp when this query was last updated.
warehouse_id
string
Example "a7066a8ef796be84"
ID of the SQL warehouse attached to the query.
This method might return the following HTTP codes: 400, 401, 403, 404, 500
Response samples
200
{
  "create_time": "2019-08-24T14:15:22Z",
  "description": "Example description",
  "display_name": "Example query",
  "id": "fe25e731-92f2-4838-9fb2-1ca364320a3d",
  "last_modifier_user_name": "user@acme.com",
  "lifecycle_state": "ACTIVE",
  "owner_user_name": "user@acme.com",
  "parameters": [
    {
      "name": "foo",
      "text_value": {
        "value": "bar"
      },
      "title": "foo"
    }
  ],
  "parent_path": "/Workspace/Users/user@acme.com",
  "query_text": "SELECT 1",
  "run_as_mode": "OWNER",
  "tags": [
    "Tag 1"
  ],
  "update_time": "2019-08-24T14:15:22Z",
  "warehouse_id": "a7066a8ef796be84"
}

## Statement Execution
The Databricks SQL Statement Execution API can be used to execute SQL statements on a SQL warehouse and fetch the result.
Getting started
We suggest beginning with the Databricks SQL Statement Execution API tutorial.
Overview of statement execution and result fetching
Statement execution begins by issuing a statementexecution/executestatement request with a valid SQL statement and warehouse ID, along with optional parameters such as the data catalog and output format. If no other parameters are specified, the server will wait for up to 10s before returning a response. If the statement has completed within this timespan, the response will include the result data as a JSON array and metadata. Otherwise, if no result is available after the 10s timeout expired, the response will provide the statement ID that can be used to poll for results by using a statementexecution/getstatement request.
You can specify whether the call should behave synchronously, asynchronously or start synchronously with a fallback to asynchronous execution. This is controlled with the wait_timeout and on_wait_timeout settings. If wait_timeout is set between 5-50 seconds (default: 10s), the call waits for results up to the specified timeout; when set to 0s, the call is asynchronous and responds immediately with a statement ID. The on_wait_timeout setting specifies what should happen when the timeout is reached while the statement execution has not yet finished. This can be set to either CONTINUE, to fallback to asynchronous mode, or it can be set to CANCEL, which cancels the statement.
In summary:
Synchronous mode
wait_timeout=30s and on_wait_timeout=CANCEL
The call waits up to 30 seconds; if the statement execution finishes within this time, the result data is returned directly in the response. If the execution takes longer than 30 seconds, the execution is canceled and the call returns with a CANCELED state.
Asynchronous mode
wait_timeout=0s (on_wait_timeout is ignored)
The call doesn't wait for the statement to finish but returns directly with a statement ID. The status of the statement execution can be polled by issuing statementexecution/getstatement with the statement ID. Once the execution has succeeded, this call also returns the result and metadata in the response.
Hybrid mode (default)
wait_timeout=10s and on_wait_timeout=CONTINUE
The call waits for up to 10 seconds; if the statement execution finishes within this time, the result data is returned directly in the response. If the execution takes longer than 10 seconds, a statement ID is returned. The statement ID can be used to fetch status and results in the same way as in the asynchronous mode.
Depending on the size, the result can be split into multiple chunks. If the statement execution is successful, the statement response contains a manifest and the first chunk of the result. The manifest contains schema information and provides metadata for each chunk in the result. Result chunks can be retrieved by index with statementexecution/getstatementresultchunkn which may be called in any order and in parallel. For sequential fetching, each chunk, apart from the last, also contains a next_chunk_index and next_chunk_internal_link that point to the next chunk.
A statement can be canceled with statementexecution/cancelexecution.
Fetching result data: format and disposition
To specify the format of the result data, use the format field, which can be set to one of the following options: JSON_ARRAY (JSON), ARROW_STREAM (Apache Arrow Columnar), or CSV.
There are two ways to receive statement results, controlled by the disposition setting, which can be either INLINE or EXTERNAL_LINKS:
INLINE: In this mode, the result data is directly included in the response. It's best suited for smaller results. This mode can only be used with the JSON_ARRAY format.
EXTERNAL_LINKS: In this mode, the response provides links that can be used to download the result data in chunks separately. This approach is ideal for larger results and offers higher throughput. This mode can be used with all the formats: JSON_ARRAY, ARROW_STREAM, and CSV.
By default, the API uses format=JSON_ARRAY and disposition=INLINE.
Limits and limitations
Note: The byte limit for INLINE disposition is based on internal storage metrics and will not exactly match the byte count of the actual payload.
Statements with disposition=INLINE are limited to 25 MiB and will fail when this limit is exceeded.
Statements with disposition=EXTERNAL_LINKS are limited to 100 GiB. Result sets larger than this limit will be truncated. Truncation is indicated by the truncated field in the result manifest.
The maximum query text size is 16 MiB.
Cancelation might silently fail. A successful response from a cancel request indicates that the cancel request was successfully received and sent to the processing engine. However, an outstanding statement might have already completed execution when the cancel request arrives. Polling for status until a terminal state is reached is a reliable way to determine the final state.
Wait timeouts are approximate, occur server-side, and cannot account for things such as caller delays and network latency from caller to service.
To guarantee that the statement is kept alive, you must poll at least once every 15 minutes.
The results are only available for one hour after success; polling does not extend this.
The SQL Execution API must be used for the entire lifecycle of the statement. For example, you cannot use the Jobs API to execute the command, and then the SQL Execution API to cancel it.
### Execute a SQL statement
POST
/api/2.0/sql/statements/
Execute a SQL statement and optionally await its results for a specified time.
Use case: small result sets with INLINE + JSON_ARRAY
For flows that generate small and predictable result sets (<= 25 MiB), INLINE responses of JSON_ARRAY result data are typically the simplest way to execute and fetch result data.
Use case: large result sets with EXTERNAL_LINKS
Using EXTERNAL_LINKS to fetch result data allows you to fetch large result sets efficiently. The main differences from using INLINE disposition are that the result data is accessed with shared access signature (SAS) URLs, and that there are 3 supported formats: JSON_ARRAY, ARROW_STREAM and CSV compared to only JSON_ARRAY with INLINE.
Shared Access Signature URLs
External links point to data stored within your workspace's internal storage, in the form of a SAS URL. The URLs are valid for only a short period, <= 15 minutes. Alongside each external_link is an expiration field indicating the time at which the URL is no longer valid. In EXTERNAL_LINKS mode, chunks can be resolved and fetched multiple times and in parallel.
Warning: Databricks strongly recommends that you protect the URLs that are returned by the EXTERNAL_LINKS disposition.
When you use the EXTERNAL_LINKS disposition, a short-lived, SAS URL is generated, which can be used to download the results directly from Azure storage. As a short-lived SAS token is embedded in this SAS URL, you should protect the URL.
Because SAS URLs are already generated with embedded temporary SAS tokens, you must not set an Authorization header in the download requests.
The EXTERNAL_LINKS disposition can be disabled upon request by creating a support case.
See also Security best practices.
API scope: 
sql.statement-execution
Request body
byte_limit
int64
Applies the given byte limit to the statement's result size. Byte counts are based on internal data representations and might not match the final size in the requested format. If the result was truncated due to the byte limit, then truncated in the response is set to true. When using EXTERNAL_LINKS disposition, a default byte_limit of 100 GiB is applied if byte_limit is not explcitly set.
catalog
string
Sets default catalog for statement execution, similar to USE CATALOG in SQL.
disposition
string
Enum: INLINE | EXTERNAL_LINKS
Default "INLINE"
The fetch disposition provides two modes of fetching results: INLINE and EXTERNAL_LINKS.
Statements executed with INLINE disposition will return result data inline, in JSON_ARRAY format, in a series of chunks. If a given statement produces a result set with a size larger than 25 MiB, that statement execution is aborted, and no result set will be available.
NOTE Byte limits are computed based upon internal representations of the result set data, and might not match the sizes visible in JSON responses.
Statements executed with EXTERNAL_LINKS disposition will return result data as external links: URLs that point to cloud storage internal to the workspace. Using EXTERNAL_LINKS disposition allows statements to generate arbitrarily sized result sets for fetching up to 100 GiB. The resulting links have two important properties:
They point to resources external to the Azure Databricks compute; therefore any associated authentication information (typically a personal access token, OAuth token, or similar) must be removed when fetching from these links.
These are SAS URLs with a specific expiration, indicated in the response. The behavior when attempting to use an expired link is cloud specific.
format
string
Enum: JSON_ARRAY | ARROW_STREAM | CSV
Default "JSON_ARRAY"
Statement execution supports three result formats: JSON_ARRAY (default), ARROW_STREAM, and CSV.
Important: The formats ARROW_STREAM and CSV are supported only with EXTERNAL_LINKS disposition. JSON_ARRAY is supported in INLINE and EXTERNAL_LINKS disposition.
When specifying format=JSON_ARRAY, result data will be formatted as an array of arrays of values, where each value is either the string representation of a value, or null. For example, the output of SELECT concat('id-', id) AS strCol, id AS intCol, null AS nullCol FROM range(3) would look like this:
[
  [ "id-1", "1", null ],
  [ "id-2", "2", null ],
  [ "id-3", "3", null ],
]
When specifying format=JSON_ARRAY and disposition=EXTERNAL_LINKS, each chunk in the result contains compact JSON with no indentation or extra whitespace.
When specifying format=ARROW_STREAM and disposition=EXTERNAL_LINKS, each chunk in the result will be formatted as Apache Arrow Stream. See the Apache Arrow streaming format.
When specifying format=CSV and disposition=EXTERNAL_LINKS, each chunk in the result will be a CSV according to RFC 4180 standard. All the columns values will have string representation similar to the JSON_ARRAY format, and null values will be encoded as “null”. Only the first chunk in the result would contain a header row with column names. For example, the output of SELECT concat('id-', id) AS strCol, id AS intCol, null as nullCol FROM range(3) would look like this:
strCol,intCol,nullCol
id-1,1,null
id-2,2,null
id-3,3,null
on_wait_timeout
string
Enum: CONTINUE | CANCEL
Default "CONTINUE"
When wait_timeout > 0s, the call will block up to the specified time. If the statement execution doesn't finish within this time, on_wait_timeout determines whether the execution should continue or be canceled. When set to CONTINUE, the statement execution continues asynchronously and the call returns a statement ID which can be used for polling with statementexecution/getstatement. When set to CANCEL, the statement execution is canceled and the call returns with a CANCELED state.
parameters
Array of object
A list of parameters to pass into a SQL statement containing parameter markers. A parameter consists of a name, a value, and optionally a type. To represent a NULL value, the value field may be omitted or set to null explicitly. If the type field is omitted, the value is interpreted as a string.
If the type is given, parameters will be checked for type correctness according to the given type. A value is correct if the provided string can be converted to the requested type using the cast function. The exact semantics are described in the section cast function of the SQL language reference.
For example, the following statement contains two parameters, my_name and my_date:
SELECT * FROM my_table WHERE name = :my_name AND date = :my_date
The parameters can be passed in the request body as follows:
{
  ...,
  "statement": "SELECT * FROM my_table WHERE name = :my_name AND date = :my_date",
  "parameters": [
    { "name": "my_name", "value": "the name" },
    { "name": "my_date", "value": "2020-01-01", "type": "DATE" }
  ]
}
Currently, positional parameters denoted by a ? marker are not supported by the Databricks SQL Statement Execution API.
Also see the section Parameter markers of the SQL language reference.
row_limit
int64
Applies the given row limit to the statement's result set, but unlike the LIMIT clause in SQL, it also sets the truncated field in the response to indicate whether the result was trimmed due to the limit or not.
schema
string
Sets default schema for statement execution, similar to USE SCHEMA in SQL.
statement
required
string
Example "SELECT * FROM range(10)"
The SQL statement to execute. The statement can optionally be parameterized, see parameters. The maximum query text size is 16 MiB.
wait_timeout
string
Default "10s"
The time in seconds the call will wait for the statement's result set as Ns, where N can be set to 0 or to a value between 5 and 50.
When set to 0s, the statement will execute in asynchronous mode and the call will not wait for the execution to finish. In this case, the call returns directly with PENDING state and a statement ID which can be used for polling with statementexecution/getstatement.
When set between 5 and 50 seconds, the call will behave synchronously up to this timeout and wait for the statement execution to finish. If the execution finishes within this time, the call returns immediately with a manifest and result data (or a FAILED state in case of an execution error). If the statement takes longer to execute, on_wait_timeout determines what should happen after the timeout is reached.
warehouse_id
required
string
Warehouse upon which to execute a statement. See also What are SQL warehouses?
Responses
200 
StatementResponse contains `statement_id` and `status`; other fields might be absent or present depending on context. If the SQL warehouse fails to execute the provided statement, a 200 response is returned with `status.state` set to `FAILED` (in constract to a failure when accepting the request, which results in a non-200 response). Details of the error can be found at `status.error` in case of execution failures.
StatementResponse contains statement_id and status; other fields might be absent or present depending on context. If the SQL warehouse fails to execute the provided statement, a 200 response is returned with status.state set to FAILED (in constract to a failure when accepting the request, which results in a non-200 response). Details of the error can be found at status.error in case of execution failures.
manifest
object
The result manifest provides schema and metadata for the result set.
result
object
Contains the result data of a single chunk when using INLINE disposition. When using EXTERNAL_LINKS disposition, the array external_links is used instead to provide SAS URLs to the result data in cloud storage. Exactly one of these alternatives is used. (While the external_links array prepares the API to return multiple links in a single response. Currently only a single link is returned.)
statement_id
string
The statement ID is returned upon successfully submitting a SQL statement, and is a required reference for all subsequent calls.
status
object
The status response includes execution state and if relevant, error information.
This method might return the following HTTP codes: 400, 401, 403, 404, 429, 500, 503
Request samples
JSON

Asynchronous execution
{
  "statement": "SELECT * FROM range(100)",
  "wait_timeout": "0s",
  "warehouse_id": "abcdef0123456789"
}
Response samples
200

Statement failed with syntax errror
{
  "statement_id": "01ee48eb-5124-1922-bb90-f98c82f024fe",
  "status": {
    "error": {
      "error_code": "BAD_REQUEST",
      "message": "[PARSE_SYNTAX_ERROR] Syntax error at or near ..."
    },
    "state": "FAILED"
  }
}
### Get status, manifest, and result first chunk
GET
/api/2.0/sql/statements/{statement_id}
This request can be used to poll for the statement's status. When the status.state field is SUCCEEDED it will also return the result manifest and the first chunk of the result data. When the statement is in the terminal states CANCELED, CLOSED or FAILED, it returns HTTP 200 with the state set. After at least 12 hours in terminal state, the statement is removed from the warehouse and further calls will receive an HTTP 404 response.
NOTE This call currently might take up to 5 seconds to get the latest status and result.
API scope: 
sql.statement-execution
Path parameters
statement_id
required
string
The statement ID is returned upon successfully submitting a SQL statement, and is a required reference for all subsequent calls.
Responses
200 
StatementResponse contains `statement_id` and `status`; other fields might be absent or present depending on context. In case of an error during execution of the SQL statement -- as opposed to an error while processing the request -- a 200 response is returned with error details in the `status` field.
StatementResponse contains statement_id and status; other fields might be absent or present depending on context. In case of an error during execution of the SQL statement -- as opposed to an error while processing the request -- a 200 response is returned with error details in the status field.
manifest
object
The result manifest provides schema and metadata for the result set.
result
object
Contains the result data of a single chunk when using INLINE disposition. When using EXTERNAL_LINKS disposition, the array external_links is used instead to provide SAS URLs to the result data in cloud storage. Exactly one of these alternatives is used. (While the external_links array prepares the API to return multiple links in a single response. Currently only a single link is returned.)
statement_id
string
The statement ID is returned upon successfully submitting a SQL statement, and is a required reference for all subsequent calls.
status
object
The status response includes execution state and if relevant, error information.
This method might return the following HTTP codes: 400, 401, 403, 404, 429, 500, 503
Response samples
200

Statement failed with syntax errror
{
  "statement_id": "01ee48eb-5124-1922-bb90-f98c82f024fe",
  "status": {
    "error": {
      "error_code": "BAD_REQUEST",
      "message": "[PARSE_SYNTAX_ERROR] Syntax error at or near ..."
    },
    "state": "FAILED"
  }
}

### Cancel statement execution
POST
/api/2.0/sql/statements/{statement_id}/cancel
Requests that an executing statement be canceled. Callers must poll for status to see the terminal state.
API scope: 
sql.statement-execution
Path parameters
statement_id
required
string
The statement ID is returned upon successfully submitting a SQL statement, and is a required reference for all subsequent calls.
Responses
200 
Cancel response is empty; receiving response indicates successful receipt.
Cancel response is empty; receiving response indicates successful receipt.
This method might return the following HTTP codes: 400, 401, 403, 429, 500, 503

### Get result chunk by index
GET
/api/2.0/sql/statements/{statement_id}/result/chunks/{chunk_index}
After the statement execution has SUCCEEDED, this request can be used to fetch any chunk by index. Whereas the first chunk with chunk_index=0 is typically fetched with statementexecution/executestatement or statementexecution/getstatement, this request can be used to fetch subsequent chunks. The response structure is identical to the nested result element described in the statementexecution/getstatement request, and similarly includes the next_chunk_index and next_chunk_internal_link fields for simple iteration through the result set.
API scope: 
sql.statement-execution
Path parameters
statement_id
required
string
The statement ID is returned upon successfully submitting a SQL statement, and is a required reference for all subsequent calls.
chunk_index
required
int32
Responses
200 
Successful return; depending on `disposition` returns chunks of data either inline, or as links.
Successful return; depending on disposition returns chunks of data either inline, or as links.
byte_count
int64
The number of bytes in the result chunk. This field is not available when using INLINE disposition.
chunk_index
integer
The position within the sequence of result set chunks.
data_array
Array of Array of string
The JSON_ARRAY format is an array of arrays of values, where each non-null value is formatted as a string. Null values are encoded as JSON null.
external_links
Array of object
next_chunk_index
integer
When fetching, provides the chunk_index for the next chunk. If absent, indicates there are no more chunks. The next chunk can be fetched with a statementexecution/getstatementresultchunkn request.
next_chunk_internal_link
string
When fetching, provides a link to fetch the next chunk. If absent, indicates there are no more chunks. This link is an absolute path to be joined with your $DATABRICKS_HOST, and should be treated as an opaque link. This is an alternative to using next_chunk_index.
row_count
int64
The number of rows within the result chunk.
row_offset
int64
The starting row offset within the result set.
This method might return the following HTTP codes: 400, 401, 403, 404, 429, 500, 503
Response samples
200

EXTERNAL_LINKS, has next chunk
{
  "external_links": [
    {
      "byte_count": 24486486,
      "chunk_index": 0,
      "expiration": "2023-01-30T22:23:23.140Z",
      "external_link": "https://someplace.cloud-provider.com/very/long/path/...",
      "next_chunk_index": 1,
      "next_chunk_internal_link": "/api/2.0/sql/statements/01ee4b3f-4f56-1648-825a-c261d31be5f1/result/chunks/1",
      "row_count": 100,
      "row_offset": 0
    }
  ]
}

# AI/BI
## Genie
Public preview
Genie provides a no-code experience for business users, powered by AI/BI. Analysts set up spaces that business users can use to ask questions using natural language. Genie uses data registered to Unity Catalog and requires at least CAN USE permission on a Pro or Serverless SQL warehouse. Also, Databricks Assistant must be enabled.
### List Genie spaces
Public preview
GET
/api/2.0/genie/spaces
Get list of Genie Spaces.
API scope: 
dashboards.genie
Query parameters
page_size
int32
<= 100
Default 20
Maximum number of spaces to return per page
page_token
string
Pagination token for getting the next page of results
Responses
200 
Request completed successfully.
Request completed successfully.
next_page_token
string
Token to get the next page of results
spaces
Array of object
List of Genie spaces
This method might return the following HTTP codes: 400, 401, 403, 404, 500
Response samples
200
{
  "next_page_token": "string",
  "spaces": [
    {
      "description": "string",
      "space_id": "e1ef34712a29169db030324fd0e1df5f",
      "title": "string"
    }
  ]
}

### Get Genie Space
Public preview
GET
/api/2.0/genie/spaces/{space_id}
Get details of a Genie Space.
API scope: 
dashboards.genie
Path parameters
space_id
required
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
The ID associated with the Genie space
Responses
200 
Request completed successfully.
Request completed successfully.
description
string
Description of the Genie Space
space_id
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Genie space ID
title
string
Title of the Genie Space
This method might return the following HTTP codes: 400, 401, 403, 404, 500
Response samples
200
{
  "description": "string",
  "space_id": "e1ef34712a29169db030324fd0e1df5f",
  "title": "string"
}

### List conversations in a Genie Space
Public preview
GET
/api/2.0/genie/spaces/{space_id}/conversations
Get a list of conversations in a Genie Space.
API scope: 
dashboards.genie
Path parameters
space_id
required
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
The ID of the Genie space to retrieve conversations from.
Query parameters
page_size
int32
<= 100
Default 20
Maximum number of conversations to return per page
page_token
string
Token to get the next page of results
Responses
200 
Request completed successfully.
Request completed successfully.
conversations
Array of object
List of conversations in the Genie space
next_page_token
string
Token to get the next page of results
This method might return the following HTTP codes: 400, 401, 403, 404, 500
Response samples
200
{
  "conversations": [
    {
      "conversation_id": "e1ef34712a29169db030324fd0e1df5f",
      "created_timestamp": 0,
      "title": "Biggest open opportunities"
    }
  ],
  "next_page_token": "string"
}

### Create conversation message
Public preview
POST
/api/2.0/genie/spaces/{space_id}/conversations/{conversation_id}/messages
Create new message in a conversation. The AI response uses all previously created messages in the conversation to respond.
API scope: 
dashboards.genie
Path parameters
space_id
required
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
The ID associated with the Genie space where the conversation is started.
conversation_id
required
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
The ID associated with the conversation.
Request body
content
required
string
Example "Biggest open opportunities"
User message content.
Responses
200 
Request completed successfully.
Request completed successfully.
attachments
Array of object
AI-generated response to the message
content
string
Example "Biggest open opportunities"
User message content
conversation_id
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Conversation ID
created_timestamp
int64
Timestamp when the message was created
error
object
Error message if Genie failed to respond to the message
id
uuid
Deprecated
Example "e1ef34712a29169db030324fd0e1df5f"
Message ID. Legacy identifier, use message_id instead
last_updated_timestamp
int64
Timestamp when the message was last updated
message_id
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Message ID
query_result
object
Deprecated
The result of SQL query if the message includes a query attachment. Deprecated. Use query_result_metadata in GenieQueryAttachment instead.
space_id
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Genie space ID
status
string
Enum: FETCHING_METADATA | FILTERING_CONTEXT | ASKING_AI | PENDING_WAREHOUSE | EXECUTING_QUERY | FAILED | COMPLETED | SUBMITTED | QUERY_RESULT_EXPIRED | CANCELLED
Example "ASKING_AI"
MessageStatus. The possible values are:
FETCHING_METADATA: Fetching metadata from the data sources.
FILTERING_CONTEXT: Running smart context step to determine relevant context.
ASKING_AI: Waiting for the LLM to respond to the user's question.
PENDING_WAREHOUSE: Waiting for warehouse before the SQL query can start executing.
EXECUTING_QUERY: Executing a generated SQL query. Get the SQL query result by calling getMessageAttachmentQueryResult API.
FAILED: The response generation or query execution failed. See error field.
COMPLETED: Message processing is completed. Results are in the attachments field. Get the SQL query result by calling getMessageAttachmentQueryResult API.
SUBMITTED: Message has been submitted.
QUERY_RESULT_EXPIRED: SQL result is not available anymore. The user needs to rerun the query. Rerun the SQL query result by calling executeMessageAttachmentQuery API.
CANCELLED: Message has been cancelled.
user_id
int64
ID of the user who created the message
This method might return the following HTTP codes: 400, 401, 403, 404, 500
Request samples
JSON
{
  "content": "Give me top sales for last month"
}
Response samples
200

Message created
{
  "attachments": null,
  "content": "Give me top sales for last month",
  "conversation_id": "6a64adad2e664ee58de08488f986af3e",
  "created_timestamp": 1719769718,
  "error": null,
  "id": "e1ef34712a29169db030324fd0e1df5f",
  "last_updated_timestamp": 1719769718,
  "query_result": null,
  "space_id": "3c409c00b54a44c79f79da06b82460e2",
  "status": "IN_PROGRESS",
  "user_id": 12345
}

### Get conversation message
Public preview
GET
/api/2.0/genie/spaces/{space_id}/conversations/{conversation_id}/messages/{message_id}
Get message from conversation.
API scope: 
dashboards.genie
Path parameters
space_id
required
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
The ID associated with the Genie space where the target conversation is located.
conversation_id
required
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
The ID associated with the target conversation.
message_id
required
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
The ID associated with the target message from the identified conversation.
Responses
200 
Request completed successfully.
Request completed successfully.
attachments
Array of object
AI-generated response to the message
content
string
Example "Biggest open opportunities"
User message content
conversation_id
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Conversation ID
created_timestamp
int64
Timestamp when the message was created
error
object
Error message if Genie failed to respond to the message
id
uuid
Deprecated
Example "e1ef34712a29169db030324fd0e1df5f"
Message ID. Legacy identifier, use message_id instead
last_updated_timestamp
int64
Timestamp when the message was last updated
message_id
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Message ID
query_result
object
Deprecated
The result of SQL query if the message includes a query attachment. Deprecated. Use query_result_metadata in GenieQueryAttachment instead.
space_id
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Genie space ID
status
string
Enum: FETCHING_METADATA | FILTERING_CONTEXT | ASKING_AI | PENDING_WAREHOUSE | EXECUTING_QUERY | FAILED | COMPLETED | SUBMITTED | QUERY_RESULT_EXPIRED | CANCELLED
Example "ASKING_AI"
MessageStatus. The possible values are:
FETCHING_METADATA: Fetching metadata from the data sources.
FILTERING_CONTEXT: Running smart context step to determine relevant context.
ASKING_AI: Waiting for the LLM to respond to the user's question.
PENDING_WAREHOUSE: Waiting for warehouse before the SQL query can start executing.
EXECUTING_QUERY: Executing a generated SQL query. Get the SQL query result by calling getMessageAttachmentQueryResult API.
FAILED: The response generation or query execution failed. See error field.
COMPLETED: Message processing is completed. Results are in the attachments field. Get the SQL query result by calling getMessageAttachmentQueryResult API.
SUBMITTED: Message has been submitted.
QUERY_RESULT_EXPIRED: SQL result is not available anymore. The user needs to rerun the query. Rerun the SQL query result by calling executeMessageAttachmentQuery API.
CANCELLED: Message has been cancelled.
user_id
int64
ID of the user who created the message
This method might return the following HTTP codes: 401, 403, 404, 500
Response samples
200

Message created
{
  "attachments": null,
  "content": "Give me top sales for last month",
  "conversation_id": "6a64adad2e664ee58de08488f986af3e",
  "created_timestamp": 1719769718,
  "error": null,
  "id": "e1ef34712a29169db030324fd0e1df5f",
  "last_updated_timestamp": 1719769718,
  "query_result": null,
  "space_id": "3c409c00b54a44c79f79da06b82460e2",
  "status": "IN_PROGRESS",
  "user_id": 12345
}

### Execute message attachment SQL query
Public preview
POST
/api/2.0/genie/spaces/{space_id}/conversations/{conversation_id}/messages/{message_id}/attachments/{attachment_id}/execute-query
Execute the SQL for a message query attachment. Use this API when the query attachment has expired and needs to be re-executed.
API scope: 
dashboards.genie
Path parameters
space_id
required
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Genie space ID
conversation_id
required
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Conversation ID
message_id
required
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Message ID
attachment_id
required
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Attachment ID
Responses
200 
Request completed successfully.
Request completed successfully.
statement_response
object
SQL Statement Execution response. See Get status, manifest, and result first chunk for more details.
This method might return the following HTTP codes: 400, 401, 403, 404, 500
Response samples
200
{
  "statement_response": {
    "manifest": {
      "chunks": [
        {
          "byte_count": 0,
          "chunk_index": 0,
          "row_count": 0,
          "row_offset": 0
        }
      ],
      "format": "JSON_ARRAY",
      "schema": {
        "column_count": 0,
        "columns": [
          {
            "name": "string",
            "position": 0,
            "type_interval_type": "string",
            "type_name": "BOOLEAN",
            "type_precision": 0,
            "type_scale": 0,
            "type_text": "string"
          }
        ]
      },
      "total_byte_count": 0,
      "total_chunk_count": 0,
      "total_row_count": 0,
      "truncated": true
    },
    "result": {
      "byte_count": 0,
      "chunk_index": 0,
      "data_array": [
        [
          "string"
        ]
      ],
      "external_links": [
        {
          "byte_count": 0,
          "chunk_index": 0,
          "expiration": "2019-08-24T14:15:22Z",
          "external_link": "string",
          "next_chunk_index": 0,
          "next_chunk_internal_link": "string",
          "row_count": 0,
          "row_offset": 0
        }
      ],
      "next_chunk_index": 0,
      "next_chunk_internal_link": "string",
      "row_count": 0,
      "row_offset": 0
    },
    "statement_id": "string",
    "status": {
      "error": {
        "error_code": "UNKNOWN",
        "message": "string"
      },
      "state": "PENDING"
    }
  }
}

### Get message attachment SQL query result
Public preview
GET
/api/2.0/genie/spaces/{space_id}/conversations/{conversation_id}/messages/{message_id}/attachments/{attachment_id}/query-result
Get the result of SQL query if the message has a query attachment. This is only available if a message has a query attachment and the message status is EXECUTING_QUERY OR COMPLETED.
API scope: 
dashboards.genie
Path parameters
space_id
required
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Genie space ID
conversation_id
required
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Conversation ID
message_id
required
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Message ID
attachment_id
required
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Attachment ID
Responses
200 
Request completed successfully.
Request completed successfully.
statement_response
object
SQL Statement Execution response. See Get status, manifest, and result first chunk for more details.
This method might return the following HTTP codes: 400, 401, 403, 404, 500
Response samples
200
{
  "statement_response": {
    "manifest": {
      "chunks": [
        {
          "byte_count": 0,
          "chunk_index": 0,
          "row_count": 0,
          "row_offset": 0
        }
      ],
      "format": "JSON_ARRAY",
      "schema": {
        "column_count": 0,
        "columns": [
          {
            "name": "string",
            "position": 0,
            "type_interval_type": "string",
            "type_name": "BOOLEAN",
            "type_precision": 0,
            "type_scale": 0,
            "type_text": "string"
          }
        ]
      },
      "total_byte_count": 0,
      "total_chunk_count": 0,
      "total_row_count": 0,
      "truncated": true
    },
    "result": {
      "byte_count": 0,
      "chunk_index": 0,
      "data_array": [
        [
          "string"
        ]
      ],
      "external_links": [
        {
          "byte_count": 0,
          "chunk_index": 0,
          "expiration": "2019-08-24T14:15:22Z",
          "external_link": "string",
          "next_chunk_index": 0,
          "next_chunk_internal_link": "string",
          "row_count": 0,
          "row_offset": 0
        }
      ],
      "next_chunk_index": 0,
      "next_chunk_internal_link": "string",
      "row_count": 0,
      "row_offset": 0
    },
    "statement_id": "string",
    "status": {
      "error": {
        "error_code": "UNKNOWN",
        "message": "string"
      },
      "state": "PENDING"
    }
  }
}

### Start conversation
Public preview
POST
/api/2.0/genie/spaces/{space_id}/start-conversation
Start a new conversation.
API scope: 
dashboards.genie
Path parameters
space_id
required
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
The ID associated with the Genie space where you want to start a conversation.
Request body
content
required
string
Example "Biggest open opportunities"
The text of the message that starts the conversation.
Responses
200 
Request completed successfully.
Request completed successfully.
conversation
object
conversation_id
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Conversation ID
message
object
message_id
uuid
Example "e1ef34712a29169db030324fd0e1df5f"
Message ID
This method might return the following HTTP codes: 400, 401, 403, 404, 500
Request samples
JSON
{
  "content": "Give me top sales for last month"
}
Response samples
200
{
  "conversation": {
    "created_timestamp": 1719769718,
    "id": "6a64adad2e664ee58de08488f986af3e",
    "last_updated_timestamp": 1719769718,
    "space_id": "3c409c00b54a44c79f79da06b82460e2",
    "title": "Give me top sales for last month",
    "user_id": 12345
  },
  "message": {
    "attachments": null,
    "content": "Give me top sales for last month",
    "conversation_id": "6a64adad2e664ee58de08488f986af3e",
    "created_timestamp": 1719769718,
    "error": null,
    "id": "e1ef34712a29169db030324fd0e1df5f",
    "last_updated_timestamp": 1719769718,
    "query_result": null,
    "space_id": "3c409c00b54a44c79f79da06b82460e2",
    "status": "IN_PROGRESS",
    "user_id": 12345
  }
}
