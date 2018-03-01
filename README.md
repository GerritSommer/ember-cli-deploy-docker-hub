# ember-cli-deploy-docker-hub

> An ember-cli-deploy plugin to build a docker image and upload it to a repository (Docker hub)

## What is an ember-cli-deploy plugin?

A plugin is an addon that can be executed as a part of the ember-cli-deploy pipeline. A plugin will implement one or more of the ember-cli-deploy's pipeline hooks. This plugin will be executed on the 'upload' hook.

For more information on what plugins are and how they work, please refer to the [Plugin Documentation][1].

## Quick Start
To get up and running quickly, do the following:

- Ensure you are logged in with your docker cli: [docs](https://docs.docker.com/engine/reference/commandline/login/)
- Ensure [ember-cli-deploy-build][2] is installed and configured.
- Ensure [ember-cli-deploy-revision-data][3] is installed and configured.
- Install this plugin

```bash
$ ember install ember-cli-docker-hub
```

- Place the following configuration into `config/deploy.js`

```javascript
ENV["docker-hub"] = {
    repository:     'company/repository', // required
    dockerFilePath: 'docker/Dockerfile' // default 'Dockerfile'
}
```

- Run the pipeline

```bash
$ ember deploy
```

## Configuration Options


For detailed information on how configuration of plugins works, please refer to the [Plugin Documentation][1].

### repository

The name of your repository at Docker hub.

*Default:* `undefined`

### dockerFilePath

The path to your Dockerfile relative to your project root.

*Default:* `Dockerfile`

### What does the plugin do?

*ember-cli-deploy-docker-hub* builds your image once with the `revisionKey` from `ember-cli-deploy-revision-data` as a tag and once with the `latest` tag.
Equivalent to:

```bash
$ docker build -f 'dockerFilePath' -t repository:123456 .;
$ docker build -f 'dockerFilePath' -t repository:latest .;
```
Then it simply pushes the images to docker hub.

```bash
$ docker push repository:123456;
$ docker push repository:latest;
```

### When does the plugin execute?

Activation occurs during the `upload` hook of the pipeline.

## Running Tests

- `npm test`

[1]: http://ember-cli.github.io/ember-cli-deploy/plugins "Plugin Documentation"
[2]: https://github.com/ember-cli-deploy/ember-cli-deploy-build "ember-cli-deploy-build"
[3]: https://github.com/ember-cli-deploy/ember-cli-deploy-revision-data "ember-cli-deploy-revision-data"
