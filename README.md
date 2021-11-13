# Simple Node App

A simple Node application that exposes an endpoint returning a JSON payload with the current timestamp and a static message.

## Deployment

This app is deployed in Azure Kubernetes Service with Github Actions and Helm. It follows a Github flow based branching model.

- On `feature-*` branches:
  - Every commit triggers a build and image push to the registry
  - The app with the new feature is then deployed into the nonprod namespace (`dev` environment) of the AKS cluster under a release name corresponding to the feature. This allows the feature to be independently evaluated for testing
  - Any other subsequent commits will follow the same process and update the Helm release
  - When a pull request is opened upon completion of the feature, a CI check runs to verify that an image can be built and a dry run of the Helm release is outputted against the current state of the `staging` environment for review
  - When these checks are done and the PR is approved, the feature branch can be merged to `main`
- On the `main` branch:
  - When a PR is merged into the branch, an action is triggered to build an image and push it to the registry
  - This image is then deployed into the nonprod namespace (`staging` environment) of the AKS cluster. If a `staging` environment was already present, then the Helm release is upgraded
  - After validating everything is as expected, a Github release can be created. Creating a release also prompts for the creation of a git tag according to semantic versioning
  - An image is built, tagged from this git tag, and pushed -- then a Helm dry run for the `prod` namespace / environment using this release is outputted for review
  - Upon approval, the app is updated with the latest release

Each environment has a specific DNS naming convention that allows the app to be accessed:

- `dev.simple-node-app-{feature-name}.my-dns-zone`
- `staging.simple-node-app.my-dns-zone`
- `prod.simple-node-app.my-dns-zone`

## Local Development

To start the Node application locally
```bash
$ npm run start
```

To build the application image
```bash
$ docker build -t simple-node-app:{some-tag} .
```

## Deploying Locally

Pre-requisites:
- Helm 3 installed
- Kubeconfig with context pointing to cluster to install application in located at `~/.kube/config`

To deploy a feature version of the application via Helm:
```bash
$ helm upgrade simple-node-app-{feature-abc} ./helm/chart \
  --install \
  --create-namespace \
  -n nonprod \
  -f dev.values.yml \
  --set image.tag=simple-node-app:{some-tag} \
  --wait
```

Once the Helm deployment is successful, it will print a URL where the application can be accessed.

The same pattern of the command can be followed if deploying to `staging` or `prod` is desired.

## Cleaning Up

To uninstall the application:
```bash
$ helm uninstall simple-node-app-{feature-abc} -n nonprod
```
