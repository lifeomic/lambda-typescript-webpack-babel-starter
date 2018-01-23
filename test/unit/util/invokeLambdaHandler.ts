export default async function invokeLambdaHandler (handler: any, event: any, context: AWSLambda.Context) {
  return new Promise((resolve, reject) => {
    handler(event, context, (err: any, result: any) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}
