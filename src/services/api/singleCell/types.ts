export interface QualitySingles {
    id: number;
    targetPressures: number[];
    calculatedPressures: number[];
    resultPressure: number[];
    timeStamp: Date;
    userMatrikelNumber: number;
    status: Boolean[];
  };