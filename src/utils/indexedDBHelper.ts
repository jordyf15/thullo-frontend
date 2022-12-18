import { IDBObjectNotFound } from "../error";
import TokenSet from "../models/tokenSet";

interface StoreTypeMap {
  tokenset: { name: "stored_token_set"; object: TokenSet };
}

const storeKeyForName = <Name extends keyof StoreTypeMap>(name: Name) => {
  switch (name) {
    case "tokenset":
      return "stored_token_set";
    default:
      return "";
  }
};

const callOnStore = <Name extends keyof StoreTypeMap>(name: Name) =>
  new Promise<IDBObjectStore>((resolve, reject) => {
    const openDB = indexedDB.open("thullo", 1);

    openDB.onupgradeneeded = function () {
      const db = openDB.result;
      if (!db.objectStoreNames.contains("tokenset")) {
        const tokenSet = db.createObjectStore("tokenset", { keyPath: "name" });
        tokenSet.createIndex("name", "name", { unique: true });
      }
    };

    openDB.onsuccess = function () {
      const db = openDB.result;
      const tx = db.transaction(name, "readwrite");
      const store = tx.objectStore(name);

      tx.oncomplete = function () {
        db.close();
      };

      resolve(store);
    };

    openDB.onerror = function () {
      reject(openDB.error);
    };
  });

export const getFromIDBStore = <Name extends keyof StoreTypeMap>(
  name: Name
) => {
  return callOnStore(name).then((store) => {
    const query: IDBRequest<StoreTypeMap[Name]> = store.get(
      storeKeyForName(name)
    );

    return new Promise<StoreTypeMap[Name]["object"]>((resolve, reject) => {
      query.onsuccess = () => {
        if (query.result) {
          if (query.result.object) {
            resolve(query.result.object);
          } else {
            removeFromIDBStore(name).then(() => reject(IDBObjectNotFound));
          }
        } else {
          reject(IDBObjectNotFound);
        }
      };
    });
  });
};

export const removeFromIDBStore = <Name extends keyof StoreTypeMap>(
  name: Name
) => {
  const key = storeKeyForName(name);

  return callOnStore(name).then((store) => {
    const query = store.delete(key);

    return new Promise<void>((resolve, reject) => {
      query.onsuccess = () => resolve();
      query.onerror = () => reject(query.error);
    });
  });
};

export const storeInIDBStore = <Name extends keyof StoreTypeMap>(
  name: Name,
  object: StoreTypeMap[Name]["object"]
) => {
  const key = storeKeyForName(name);

  return callOnStore(name).then((store) => {
    let query: IDBRequest;

    switch (name) {
      case "tokenset":
        query = store.put({ name: key, object: object });
    }

    return new Promise<void>((resolve, reject) => {
      query.onsuccess = () => resolve();
      query.onerror = () => reject(query.error);
    });
  });
};
