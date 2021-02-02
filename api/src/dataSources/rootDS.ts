import { LabSource } from "./LabDS"
import { UserCredentialsSource } from "./UserCredentialsDS";


export interface Context {
   dataSources: {
      LabSource: LabSource,
      UserCredentialsSource: UserCredentialsSource
   }
}
const dataSources = (): Context['dataSources'] => {
   return {
      LabSource: new LabSource(),
      UserCredentialsSource: new UserCredentialsSource()
   };
};

export { dataSources }
