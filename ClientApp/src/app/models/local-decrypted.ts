export interface LocalDecrypted {
  dbVersion: number; //file format version
  website: string; //website asociated to the request
  initialHashOfContent: string; //hash of tabs
  encryptionKey: string; //set on decrypt
  tabs: string[]; //the content tabs
}
