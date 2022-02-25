import { aws_certificatemanager, aws_cloudfront, aws_cloudfront_origins, aws_s3, aws_s3_deployment, CfnOutput, Fn, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';

interface CustomStackProps extends StackProps {
  stage: string;
}

export class CloudfrontDemoStack extends Stack {
  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props);
    
    // Importing ALB domain name
    const loadBalancerDomain = Fn.importValue("loadBalancerUrl");
      
    // Getting external configuration values from cdk.json file
    const config = this.node.tryGetContext("stages")[props.stage];

    // SSL certificate 
    // const certificateArn = aws_certificatemanager.Certificate.fromCertificateArn(this, "tlsCertificate", config.certificateArn);

    // Web hosting bucket
    let websiteBucket = new aws_s3.Bucket(this, "websiteBucket", {
      versioned: false,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Trigger frontend deployment
    new aws_s3_deployment.BucketDeployment(this, "websiteDeployment", {
      sources: [aws_s3_deployment.Source.asset(path.join(__dirname, '../frontend/build/'))],
      destinationBucket: websiteBucket as any
    });

    // Create Origin Access Identity for CloudFront
    const originAccessIdentity = new aws_cloudfront.OriginAccessIdentity(this, "cloudfrontOAI", {
      comment: "OAI for web application cloudfront distribution",
    });

    // Creating CloudFront distribution
    let cloudFrontDist = new aws_cloudfront.Distribution(this, "cloudfrontDist", {
      defaultRootObject: "index.html",
      domainNames: ["jortkulmann.nl"],
    //   certificate: certificateArn,
      defaultBehavior: {
        origin: new aws_cloudfront_origins.S3Origin(websiteBucket as any, {
          originAccessIdentity: originAccessIdentity as any,
        }) as any,
        compress: true,
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
      },
    });

    // Creating custom origin for the application load balancer
    // const loadBalancerOrigin = new aws_cloudfront_origins.HttpOrigin(loadBalancerDomain, {
    //   protocolPolicy: aws_cloudfront.OriginProtocolPolicy.HTTP_ONLY,
    // });

    // // Creating the path pattern to direct to the load balancer origin
    // cloudFrontDist.addBehavior("/generate/*", loadBalancerOrigin as any, {
    //   compress: true,
    //   viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
    //   allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_ALL,
    // });

    new CfnOutput(this, "cloudfrontDomainUrl", {
      value: cloudFrontDist.distributionDomainName,
      exportName: "cloudfrontDomainUrl",
    });
  }
}