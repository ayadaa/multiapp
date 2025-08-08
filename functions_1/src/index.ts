// import * as functions from "firebase-functions";
import * as v2 from "firebase-functions/v2";

// export const helloworld = v2.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

type Indexable = {[key: string]: any}

export const helloworld = v2.https.onRequest((request, response) => {
    const name = request.params[0];
    const items: Indexable = { lamp: 'This is a lamp', chair: 'This is a chair' };
    const message = items[name];
    response.send(`<h1>${message}</h1>`);
});
