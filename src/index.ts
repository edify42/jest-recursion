
import * as AWS from 'aws-sdk';

export const listStacks = async (cfn: AWS.CloudFormation, token?: string): Promise<AWS.CloudFormation.Types.StackSummaries> => {
  const params: AWS.CloudFormation.Types.ListStacksInput = {
    NextToken: token,
  }
  let returnValue: AWS.CloudFormation.Types.StackSummaries = [];
  const stacks = await cfn.listStacks(params).promise();

  if (!stacks.StackSummaries) return returnValue;

  returnValue = returnValue.concat(stacks.StackSummaries)

  if (stacks.NextToken) {
    returnValue = returnValue.concat(await listStacks(cfn, stacks.NextToken))
  }

  console.log(stacks)

  return returnValue;
}