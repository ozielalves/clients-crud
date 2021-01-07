// import db config
import db from "..";

// collection name
const COLLECTION_NAME = "sales";

// mapping the sale document
export type Sale = {
  id?: string;
  date: Date;
  description: string;
  value: number;
  clientId: string;
};

// retrieve all sales
export const all = async (): Promise<Array<Sale>> => {
  const snapshot = await db.collection(COLLECTION_NAME).get();
  const data: Array<any> = [];

  snapshot.docs.map((_data) =>
    data.push({
      id: _data.id, // because id field in separate function in firestore
      ..._data.data(), // the remaining fields
    })
  );

  // return and convert back it array of sale
  return data as Array<Sale>;
};

// create a sale
export const create = async (sale: Sale): Promise<Sale> => {
  const docRef = await db.collection(COLLECTION_NAME).add(sale);

  // return new created sale
  return {
    id: docRef.id,
    ...sale,
  } as Sale;
};

// update a sale
export const update = async (id: string, sale: Sale): Promise<Sale> => {
  await db.collection(COLLECTION_NAME).doc(id).update(sale);

  // return updated sale
  return {
    id: id,
    ...sale,
  } as Sale;
};

// delete a sale
export const remove = async (id: string) => {
  await db.collection(COLLECTION_NAME).doc(id).delete();
};
