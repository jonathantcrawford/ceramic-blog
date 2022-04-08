let arc = require('@architect/functions')

/**
 * append a timestamp and echo the message back to the connectionId
 */
exports.handler = async function ws(event) {


  // console.log('ws-default called with', event)

  let connectionId = event.requestContext.connectionId

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  await arc.ws.send({
    id: connectionId,
    payload: {
      msg: 'connection open'
    }
  });
  for (var count = 0; count < 6; count++) {
    await sleep(1000);
    if (count < 5) {
      await arc.ws.send({
        id: connectionId,
        payload: {
          timestamp: new Date().toISOString(),
        }
      })
    } else {
      await arc.ws.send({
        id: connectionId,
        payload: {
          msg: 'connection closed'
        }
      })
    }
  }


  return {statusCode: 200}
  
}