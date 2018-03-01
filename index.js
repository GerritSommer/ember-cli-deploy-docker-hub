/* jshint node: true */
'use strict';

const BasePlugin    = require('ember-cli-deploy-plugin');
const child_process = require('child_process');

module.exports = {
  name: 'ember-cli-deploy-docker-hub',

  createDeployPlugin(options) {
    const DeployPlugin = BasePlugin.extend({
      name: options.name,

      defaultConfig:  { dockerFilePath: 'Dockerfile' },   // eslint-disable-line
      requiredConfig: [ 'repository' ], // eslint-disable-line

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

        this.log('Generating docker build');
        this.spawnProcess('docker', ['build','-f', this.readConfig('dockerFilePath'), '-t', `${repositoryName}:${revisionKey}`, '.'])
        this.spawnProcess('docker', ['build','-f', this.readConfig('dockerFilePath'), '-t', `${repositoryName}:latest`, '.']);

        this.log('Pushing image to repository');
        this.spawnProcess('docker', ['push', `${repositoryName}:${revisionKey}`]);
        this.spawnProcess('docker', ['push', `${repositoryName}:latest`]);

        this.log('All done!');
      }
    });
    return new DeployPlugin();
  }
};
