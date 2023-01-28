import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { randomUUID } from "crypto";
import { document } from "src/utils/dynamodbClient";

interface ICreateToDo {
  title: string
  deadline: Date
}

interface IToDoDTO {
  id: string
  user_id: string
  title: string
  deadline: Date | number | string
  done: boolean
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const { user_id } = event.pathParameters;
  const { deadline, title } = JSON.parse(event.body) as ICreateToDo;

  const toDo = {
    id: randomUUID(),
    user_id,
    title,
    deadline: new Date(deadline).getTime(),
    done: false
  } as IToDoDTO

  await document.put({
    TableName: 'to-dos',
    Item: toDo
  }).promise()

  const response = await document.query({
    TableName: 'to-dos',
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": toDo.id
    }
  }).promise()

  const createdToDo = response.Items[0]

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'To-do creted successfully!',
      toDo: createdToDo
    })
  }
}
