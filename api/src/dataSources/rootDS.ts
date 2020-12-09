import { AWSJourneyDataSource } from "./AwsJourneyDS";


export interface Context {
   dataSources: {
      AWSJourney: AWSJourneyDataSource;
   };
}
const dataSources = (): Context['dataSources'] => {
   return {
      AWSJourney: new AWSJourneyDataSource()
   };
};

export { dataSources }
