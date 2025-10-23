export interface Boot {
    id: number;
    rfid: String;
    sensorId: number;
    sensorSerialNumber: String;
    macAddress: String;
    ecuDeviceId: String;
    pressure1: number;
    pressure2: number;
    pressure3: number;
    pressure4: number;
    pressure5: number;
    targetPressure: number[];
    status: Boolean[];
    adValues: String;
    timeStamp: Date;
    userMatrikelNumber: number;
    r_Temp_Avg: number;
    externalTemperatureSensorAvg: number;
    minPressure: number[];
    maxPressure: number[];
    r_Fix: number[];

  };