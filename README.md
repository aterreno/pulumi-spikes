# Spikes

Various Spikes to experiment potential solutions using Polumi, AWS, Lambdas

## TODO

- Doc: Install Pulumi with M1 Macs quirks
- Doc: how to instantiate an infra with Pulumi
- Code: DMS (perhaps try from a Postgres to Dynamo?)
- Code: ES but that costs
- Testing infra (nice to have )
- Testing code (like refactor and isolate handler)

## Querying with GraphQL DynamoDB

```bash

curl --location --request POST "$(pulumi stack output endpoint)" \
    --header 'Content-Type: application/graphql' \
    --header "x-api-key: $(pulumi stack output key  --show-secrets)" \
    --data-raw '{
        "query": "mutation AddProfile { addProfile(id: \"123\", name: \"Antonio\") { id name } }"
    }'
```

```bash

curl --location --request POST "$(pulumi stack output endpoint)" \
    --header 'Content-Type: application/graphql' \
    --header "x-api-key: $(pulumi stack output key  --show-secrets)" \
    --data-raw '{
        "query": "query GetProfile { getProfileById(id: \"123\") { id name } }"
    }'
```

## Querying with Rest/API Gateway DynamoDB

```bash

curl --location --request GET "$(pulumi stack output endpointApiGW)/profiles/123"

```

```bash text
pulumi config set --secret github-token YOUR_SECRET_PERSONAL_ACCESS_TOKEN
pulumi config set --secret pulumi-access-token YOUR_PULUMI_ACCESS_TOKEN
```