export interface Box {
    id: number;
    orderId: number;
    kitType: String;
    serialNumber: String;
    matrikelNummer: number;
    timeStamp: Date;
    sensorTestIds: number[];
    sensorTestRFIDs: String[];
    sensorSerialNumbers: String[];
    ecuDeviceIds: String[];
    language: String;
    macAddresses: String[];
    version: String;
  };