
const isAlphanumeric = /^[A-Za-z0-9]*$/
const isAwsId = /(?<![A-Z0-9])[A-Z0-9]{20}(?![A-Z0-9])/
const isAwsSecret = /(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/

export { isAlphanumeric, isAwsId, isAwsSecret }
