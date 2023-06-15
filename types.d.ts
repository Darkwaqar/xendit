export interface CardInfo {
  bank: string;
  brand: string;
  country: string;
  fingerprint: string;
  type: string;
}
export interface NativeEventData {
  MessageType: string;
  Source: string;
  Type: string;
  Nonce: string;
  Results: Result[];
}

export interface Result {
  DataSource: string;
  Status: boolean;
  ElapsedTime: number;
}
