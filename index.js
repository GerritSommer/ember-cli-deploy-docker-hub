/* jshint node: true */
'use strict';

const BasePlugin    = require('ember-cli-deploy-plugin');
const child_process = require('child_process');

module.exports = {
  name: 'ember-cli-deploy-docker-hub',

  createDeployPlugin(options) {
    const DeployPlugin = BasePlugin.extend({
      name: options.name,

      defaultConfig:  { dockerFilePath: 'Dockerfile' }, // eslint-disable-line
      requiredConfig: [ 'repository' ],                 // eslint-disable-line

      spawnProcess() {
        let result = child_process.spawnSync(...arguments); // eslint-disable-line
        if(result.status != 0){
          this.log(`Error: ${result.stderr}`, { color: 'red' });
          return
        }
      },

      upload(context) {
        const repositoryName = this.readConfig('repository');
        const revisionKey    = context.revisionData.revisionKey
        const revisionedName = `${repositoryName}:${revisionKey}`;
        const latestName     = `${repositoryName}:latest`;

        this.log(`Generating docker build ${revisionedName}`);
        this.spawnProcess('docker', ['build','-f', this.readConfig('dockerFilePath'), '-t', revisionedName, '.'])

        this.log(`Generating docker build ${latestName}`);
        this.spawnProcess('docker', ['build','-f', this.readConfig('dockerFilePath'), '-t', latestName, '.']);

        this.log(`Pushing image to repository: ${revisionedName}`);
        this.spawnProcess('docker', ['push', revisionedName]);

        this.log(`Pushing image to repository: ${latestName}`);
        this.spawnProcess('docker', ['push', latestName]);

        this.log('All done!');
      }
    });
    return new DeployPlugin();
  }
};
