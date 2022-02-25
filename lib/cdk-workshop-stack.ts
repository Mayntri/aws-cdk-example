import { App, aws_apigateway, aws_lambda, Stack, StackProps } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as fs from 'fs';
import * as path from 'path';

export class CdkWorkshopStack extends Stack {
    constructor(scope: App, id: string, props?: StackProps) {
        super(scope, id, props);

        const lambdaFile = path.join(__dirname, '../lambda/hello')
        const extension = fs.existsSync(lambdaFile + '.ts') ? '.ts' : '.js';
        const entry = path.join(`${lambdaFile}${extension}`)        

        const hello = new NodejsFunction(this, 'HelloHandler', {
            runtime: aws_lambda.Runtime.NODEJS_14_X,
            entry,
            bundling: {
                minify: true,
                externalModules: ['aws-sdk']
            }
        })

        new aws_apigateway.LambdaRestApi(this, 'Endpoint', {
            handler: hello
        });
    }
}