#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsCdkExampleProjectStack } from '../lib/aws-cdk-example-project-stack';
import { MyEcsConstructStack } from '../lib/my-ecs-construct-stack'
import { CdkWorkshopStack } from '../lib/cdk-workshop-stack'
import { Fargate } from '../lib/fargate';
import { CloudfrontDemoStack } from '../lib/cloudfront';

const app = new cdk.App();

new AwsCdkExampleProjectStack(app, 'AwsCdkExampleProjectStack');
new MyEcsConstructStack(app, 'ECSFargate')
new CdkWorkshopStack(app, 'WorkshopStack')
new Fargate(app, 'BackendFargate')
new CloudfrontDemoStack(app, 'CloudfrontDemoStack', {
    stage: 'prod',
})