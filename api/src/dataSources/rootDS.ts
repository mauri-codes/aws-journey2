import { LabSource } from "./LabDS"
import { UserCredentialsSource } from "./UserCredentialsDS";
import { S3Source } from "./S3DS";

export interface Context {
   dataSources: {
      LabSource: LabSource,
      UserCredentialsSource: UserCredentialsSource,
      S3Source: S3Source
   }
}
const dataSources = (): Context['dataSources'] => {
   return {
      LabSource: new LabSource(),
      UserCredentialsSource: new UserCredentialsSource(),
      S3Source: new S3Source()
   };
};

export { dataSources }
