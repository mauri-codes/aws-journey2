
const isAlphanumeric = /^[A-Za-z0-9]*$/
const isAwsId = /(?<![A-Z0-9])[A-Z0-9]{20}(?![A-Z0-9])/
const isAwsSecret = /(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/
// const isAwsRegion = /(us(-gov)?|ap|ca|cn|eu|sa|me)-(central|(north|south)?(east|west)?)-\d/
const isAwsRegion = /(^us-east-2$|^us-east-1$|^us-west-1$|^us-west-2$|^af-south-1$|^ap-east-1$|^ap-south-1$|^ap-northeast-3$|^ap-northeast-2$|^ap-southeast-1$|^ap-southeast-2$|^ap-northeast-1$|^ca-central-1$|^cn-north-1$|^cn-northwest-1$|^eu-central-1$|^us-gov-west-1$|^us-gov-east-1$|^sa-east-1$|^me-south-1$|^eu-north-1$|^eu-west-3$|^eu-south-1$|^eu-west-2$|^eu-west-1$)/
export { isAlphanumeric, isAwsId, isAwsSecret, isAwsRegion }
