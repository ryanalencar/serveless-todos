import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const { user_id } = event.pathParameters;

  const response = await document.query({
    TableName: 'to-dos',
    KeyConditionExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id": user_id
    }
  }).promise()

  const toDo = response.Items[0]

  if (!toDo) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'To-do does not exist!'
      })
    }
  }

  return {
    statusCode: 201,
    body: JSON.stringify({
      toDo
    })
  }
}
