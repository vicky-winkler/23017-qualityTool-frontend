export interface QualitySingles {
    id: number;
    TargetPressures: number[];
    calculatedPressures: number[];
    resultPressures: number[];
    timeStamp: Date;
    userMatrikelNumber: number;
    status: Boolean[];
  };