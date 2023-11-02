export interface OutboundPayload {
  initialHashContent: string;
  currentHashContent: string | undefined;
  encryptedContent: string;
}
