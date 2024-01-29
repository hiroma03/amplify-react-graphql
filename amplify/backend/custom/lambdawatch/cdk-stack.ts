import * as cdk from 'aws-cdk-lib';
import * as AmplifyHelpers from '@aws-amplify/cli-extensibility-helper';
import { AmplifyDependentResourcesAttributes } from '../../types/amplify-dependent-resources-ref';
import { Construct } from 'constructs';
//import * as iam from 'aws-cdk-lib/aws-iam';
//import * as sns from 'aws-cdk-lib/aws-sns';
//import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
//import * as sqs from 'aws-cdk-lib/aws-sqs';
import { FilterPattern, LogGroup, MetricFilter } from 'aws-cdk-lib/aws-logs';
import * as lambda from "aws-cdk-lib/aws-lambda";


export class cdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps, amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps) {
    super(scope, id, props);
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, 'env', {
      type: 'String',
      description: 'Current Amplify CLI env name',
    });

    const dependencies: AmplifyDependentResourcesAttributes = AmplifyHelpers.addResourceDependency(this, 
      amplifyResourceProps.category,
      amplifyResourceProps.resourceName,
      [
        { category: "function", resourceName: "takenihtest180817f3b" }
      ],
    );

    const samplefunctionName = cdk.Fn.ref(
      dependencies.function.takenihtest180817f3b.Name,
    );

    const logGroupName = `/aws/lambda/${samplefunctionName}`;

    const functionLogGroup = new LogGroup(this, `samplefunctionLogGroup`, {
      logGroupName: logGroupName,
    });

    const metricFilter = new MetricFilter(this, `samplefunctionMetricFilter`, {
      logGroup: functionLogGroup,
      metricNamespace: `RenkinLogMetrics`,
      metricName: `${samplefunctionName}-metric`,
      filterPattern: FilterPattern.literal("?ERROR ?Error"),
      metricValue: "1",
    });
  }
}