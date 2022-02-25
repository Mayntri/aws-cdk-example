import { aws_ec2, aws_ecs, aws_ecs_patterns, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';

export class Fargate extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new aws_ec2.Vpc(this, 'BackendVpc', {
      maxAzs: 2,
      natGateways: 1,
  })

    const cluster = new aws_ecs.Cluster(this, 'BackendCluster', {
        vpc
    })

    const backendService = new aws_ecs_patterns.ApplicationLoadBalancedFargateService(this, "backendService", {
        cluster,
        cpu: 512,
        desiredCount: 2,
        taskImageOptions: { 
          image: aws_ecs.ContainerImage.fromAsset(path.join(__dirname, '../backend/')),
          environment: {
            myVar: "variable01"
          },
        },
        memoryLimitMiB: 2048,
    })

    backendService.targetGroup.configureHealthCheck({ path: '/health' })

    new CfnOutput(this, "loadBalancerUrl", {
      value: backendService.loadBalancer.loadBalancerDnsName,
      exportName: "loadBalancerUrl"
    })
  }
}
