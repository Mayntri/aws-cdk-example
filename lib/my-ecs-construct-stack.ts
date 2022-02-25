import { App, aws_ec2, aws_ecs, aws_ecs_patterns, Stack, StackProps } from 'aws-cdk-lib';

export class MyEcsConstructStack extends Stack {
    constructor(scope: App, id: string, props?: StackProps) {
        super(scope, id, props);

        const vpc = new aws_ec2.Vpc(this, 'MyVpc', {
            maxAzs: 3
        })

        const cluster = new aws_ecs.Cluster(this, 'MyEcsCluster', {
            vpc
        })

        new aws_ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyFargateService", {
            cluster,
            cpu: 512,
            desiredCount: 6,
            taskImageOptions: { image: aws_ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample') },
            memoryLimitMiB: 2048
        })
    }
}