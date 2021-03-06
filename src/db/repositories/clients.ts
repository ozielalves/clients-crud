// import db config
import db from "..";

// collection name
const COLLECTION_NAME = "clients";

// mapping the client document
export type Client = {
  id?: string;
  company: string;
  firstname: string;
  lastname: string;
  email: string;
  debt: number;
  credit: number;
};

// retrieve all clients
export const all = async (): Promise<Array<Client> | undefined> => {
  const snapshot = await db
    .collection(COLLECTION_NAME)
    .get()
    .catch((error) => {
      console.log(`Error getting documents from ${COLLECTION_NAME}`, error);
    });
  const data: Array<any> = [];

  if (snapshot) {
    snapshot.docs.map((_data) =>
      data.push({
        id: _data.id, // because id field in separate function in firestore
        ..._data.data(), // the remaining fields
      })
    );

    // return and convert back it array of client
    return data as Array<Client>;
  }
};

// create a client
export const create = async (client: Client): Promise<Client | undefined> => {
  const docRef = await db
    .collection(COLLECTION_NAME)
    .add(client)
    .catch((error) => {
      console.log(`Error creating the document on ${COLLECTION_NAME}`, error);
    });
  if (docRef) {
    // return new created client
    return {
      id: docRef.id,
      ...client,
    } as Client;
  }
};

// update a client
export const update = async (
  id: string,
  client: Client
): Promise<Client | undefined> => {
  await db
    .collection(COLLECTION_NAME)
    .doc(id)
    .update(client)
    .catch((error) => {
      console.log(`Error updating the document from ${COLLECTION_NAME}`, error);
    });

  if (db) {
    // return updated client
    return {
      id: id,
      ...client,
    } as Client;
  }
};

// delete a client
export const remove = async (id: string) => {
  await db
    .collection(COLLECTION_NAME)
    .doc(id)
    .delete()
    .catch((error) => {
      console.log(`Error removing the document from ${COLLECTION_NAME}`, error);
    });
};
