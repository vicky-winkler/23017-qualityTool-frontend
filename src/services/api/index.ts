import qualitySinglesController from "./singleCell";
import boxesController from "./box";
import bootController from "./boot";
import conditionedSensorController from "./conditionedSensor";
import ovenController from "./ovens";
import recalController from "./recal"


export const API = {
  qualitySingle: qualitySinglesController,
  box: boxesController,
  boot: bootController,
  conditionedSensor: conditionedSensorController,
  oven: ovenController,
  recal: recalController,
  
};