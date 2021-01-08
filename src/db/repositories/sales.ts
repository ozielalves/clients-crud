// import db config
import db from "..";

// collection name
const COLLECTION_NAME = "sales";

// mapping the sale document
export type Sale = {
  id?: string;
  date: string;
  description: string;
  value: number;
  clientId: string;
};

type CreateOrEditSale = {
  date: Date;
  description: string;
  value: number;
  clientId: string;
};

// retrieve all sales
export const all = async (): Promise<Array<Sale> | undefined> => {
  const snapshot = await db
    .collection(COLLECTION_NAME)
    .get()
    .catch((error) => {
      console.log(`Error getting documents from ${COLLECTION_NAME}`, error);
    });
  const data: Array<any> = [];

  if (snapshot) {
    snapshot.docs.map((_data) => {
      data.push({
        id: _data.id, // because id field in separate function in firestore
        date: _data.data().date.toDate().toString(), // date parsing from firebase format
        description: _data.data().description,
        value: _data.data().value,
        clientId: _data.data().clientId,
      });
      return null;
    });

    // return and convert back it array of sale
    return data as Array<Sale>;
  }
};

// create a sale
export const create = async (
  sale: CreateOrEditSale
): Promise<CreateOrEditSale | undefined> => {
  const docRef = await db
    .collection(COLLECTION_NAME)
    .add(sale)
    .catch((error) => {
      console.log(`Error creating document on ${COLLECTION_NAME}`, error);
    });
  if (docRef) {
    // return new created sale
    return {
      id: docRef.id,
      ...sale,
    } as CreateOrEditSale;
  }
};

// update a sale
export const update = async (
  id: string,
  sale: CreateOrEditSale
): Promise<CreateOrEditSale | undefined> => {
  await db
    .collection(COLLECTION_NAME)
    .doc(id)
    .update(sale)
    .catch((error) => {
      console.log(`Error updating document from ${COLLECTION_NAME}`, error);
    });

  if (db) {
    // return updated sale
    return {
      id: id,
      ...sale,
    } as CreateOrEditSale;
  }
};

// delete a sale
export const remove = async (id: string) => {
  await db
    .collection(COLLECTION_NAME)
    .doc(id)
    .delete()
    .catch((error) => {
      console.log(`Error removing document from ${COLLECTION_NAME}`, error);
    });
};
