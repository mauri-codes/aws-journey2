import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../dataSources/rootDS';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  getLab?: Maybe<LabResponse>;
  getAWSCredentials?: Maybe<AwsCredentialsResponse>;
  getS3SignedUrl?: Maybe<SigneUrlResponse>;
};


export type QueryGetLabArgs = {
  id: Scalars['ID'];
};


export type QueryGetAwsCredentialsArgs = {
  user?: Maybe<Scalars['String']>;
};


export type QueryGetS3SignedUrlArgs = {
  path?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  setLab?: Maybe<Lab>;
  setAWSCredentials?: Maybe<ResponseState>;
  deleteAWSCredentials?: Maybe<ResponseState>;
};


export type MutationSetLabArgs = {
  lab?: Maybe<SetLabInput>;
  overview?: Maybe<SetOverviewInput>;
  test?: Maybe<SetTestInput>;
};


export type MutationSetAwsCredentialsArgs = {
  credentials?: Maybe<SetCredentialsInput>;
};


export type MutationDeleteAwsCredentialsArgs = {
  credentials?: Maybe<DeleteCredentialsInput>;
};

export type Lab = {
  __typename?: 'Lab';
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  overview?: Maybe<Overview>;
  testSection?: Maybe<TestSection>;
};

export type Overview = {
  __typename?: 'Overview';
  description?: Maybe<Scalars['String']>;
  goals?: Maybe<Array<Maybe<Scalars['String']>>>;
  services?: Maybe<Array<Maybe<Scalars['String']>>>;
  resources?: Maybe<Array<Maybe<Resource>>>;
};

export type Resource = {
  __typename?: 'Resource';
  resource?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  conditions?: Maybe<Array<Maybe<Condition>>>;
};

export type Condition = {
  __typename?: 'Condition';
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type TestSection = {
  __typename?: 'TestSection';
  testGroups?: Maybe<Array<Maybe<TestGroup>>>;
  testData?: Maybe<TestData>;
};

export type TestData = {
  __typename?: 'TestData';
  tag?: Maybe<Scalars['String']>;
  testParams?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type TestError = {
  __typename?: 'TestError';
  code?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type Test = {
  __typename?: 'Test';
  id?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<TestError>>>;
};

export type TestGroup = {
  __typename?: 'TestGroup';
  id?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  tests?: Maybe<Array<Maybe<Test>>>;
  errors?: Maybe<Array<Maybe<TestError>>>;
};

export type SetCredentialsInput = {
  accessKeyId?: Maybe<Scalars['String']>;
  secret?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  mainRegion?: Maybe<Scalars['String']>;
  secondaryRegion?: Maybe<Scalars['String']>;
};

export type DeleteCredentialsInput = {
  name?: Maybe<Scalars['String']>;
};

export type SigneUrlResponse = {
  __typename?: 'SigneUrlResponse';
  success?: Maybe<Scalars['Boolean']>;
  signedUrl?: Maybe<Scalars['String']>;
};

export type AwsCredentialsResponse = {
  __typename?: 'AWSCredentialsResponse';
  success?: Maybe<Scalars['Boolean']>;
  credentialsGroup?: Maybe<Array<Maybe<AwsCredentials>>>;
};

export type AwsCredentials = {
  __typename?: 'AWSCredentials';
  accessKeyId?: Maybe<Scalars['String']>;
  secret?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  mainRegion?: Maybe<Scalars['String']>;
  secondaryRegion?: Maybe<Scalars['String']>;
};

export type ResponseState = {
  __typename?: 'ResponseState';
  success?: Maybe<Scalars['Boolean']>;
  message?: Maybe<Scalars['String']>;
  data?: Maybe<Scalars['String']>;
};

export type SetLabInput = {
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
};

export type SetOverviewInput = {
  description?: Maybe<Scalars['String']>;
  goals?: Maybe<Array<Maybe<Scalars['String']>>>;
  services?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type SetTestInput = {
  testGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type LabResponse = {
  __typename?: 'LabResponse';
  success?: Maybe<Scalars['Boolean']>;
  lab?: Maybe<Lab>;
  message?: Maybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Mutation: ResolverTypeWrapper<{}>;
  Lab: ResolverTypeWrapper<Lab>;
  Overview: ResolverTypeWrapper<Overview>;
  Resource: ResolverTypeWrapper<Resource>;
  Condition: ResolverTypeWrapper<Condition>;
  TestSection: ResolverTypeWrapper<TestSection>;
  TestData: ResolverTypeWrapper<TestData>;
  TestError: ResolverTypeWrapper<TestError>;
  Test: ResolverTypeWrapper<Test>;
  TestGroup: ResolverTypeWrapper<TestGroup>;
  SetCredentialsInput: SetCredentialsInput;
  DeleteCredentialsInput: DeleteCredentialsInput;
  SigneUrlResponse: ResolverTypeWrapper<SigneUrlResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  AWSCredentialsResponse: ResolverTypeWrapper<AwsCredentialsResponse>;
  AWSCredentials: ResolverTypeWrapper<AwsCredentials>;
  ResponseState: ResolverTypeWrapper<ResponseState>;
  setLabInput: SetLabInput;
  setOverviewInput: SetOverviewInput;
  setTestInput: SetTestInput;
  LabResponse: ResolverTypeWrapper<LabResponse>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  ID: Scalars['ID'];
  String: Scalars['String'];
  Mutation: {};
  Lab: Lab;
  Overview: Overview;
  Resource: Resource;
  Condition: Condition;
  TestSection: TestSection;
  TestData: TestData;
  TestError: TestError;
  Test: Test;
  TestGroup: TestGroup;
  SetCredentialsInput: SetCredentialsInput;
  DeleteCredentialsInput: DeleteCredentialsInput;
  SigneUrlResponse: SigneUrlResponse;
  Boolean: Scalars['Boolean'];
  AWSCredentialsResponse: AwsCredentialsResponse;
  AWSCredentials: AwsCredentials;
  ResponseState: ResponseState;
  setLabInput: SetLabInput;
  setOverviewInput: SetOverviewInput;
  setTestInput: SetTestInput;
  LabResponse: LabResponse;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getLab?: Resolver<Maybe<ResolversTypes['LabResponse']>, ParentType, ContextType, RequireFields<QueryGetLabArgs, 'id'>>;
  getAWSCredentials?: Resolver<Maybe<ResolversTypes['AWSCredentialsResponse']>, ParentType, ContextType, RequireFields<QueryGetAwsCredentialsArgs, never>>;
  getS3SignedUrl?: Resolver<Maybe<ResolversTypes['SigneUrlResponse']>, ParentType, ContextType, RequireFields<QueryGetS3SignedUrlArgs, never>>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  setLab?: Resolver<Maybe<ResolversTypes['Lab']>, ParentType, ContextType, RequireFields<MutationSetLabArgs, never>>;
  setAWSCredentials?: Resolver<Maybe<ResolversTypes['ResponseState']>, ParentType, ContextType, RequireFields<MutationSetAwsCredentialsArgs, never>>;
  deleteAWSCredentials?: Resolver<Maybe<ResolversTypes['ResponseState']>, ParentType, ContextType, RequireFields<MutationDeleteAwsCredentialsArgs, never>>;
};

export type LabResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Lab'] = ResolversParentTypes['Lab']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  overview?: Resolver<Maybe<ResolversTypes['Overview']>, ParentType, ContextType>;
  testSection?: Resolver<Maybe<ResolversTypes['TestSection']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OverviewResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Overview'] = ResolversParentTypes['Overview']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  goals?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  services?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  resources?: Resolver<Maybe<Array<Maybe<ResolversTypes['Resource']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResourceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Resource'] = ResolversParentTypes['Resource']> = {
  resource?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  conditions?: Resolver<Maybe<Array<Maybe<ResolversTypes['Condition']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConditionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Condition'] = ResolversParentTypes['Condition']> = {
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TestSectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TestSection'] = ResolversParentTypes['TestSection']> = {
  testGroups?: Resolver<Maybe<Array<Maybe<ResolversTypes['TestGroup']>>>, ParentType, ContextType>;
  testData?: Resolver<Maybe<ResolversTypes['TestData']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TestDataResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TestData'] = ResolversParentTypes['TestData']> = {
  tag?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  testParams?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TestErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TestError'] = ResolversParentTypes['TestError']> = {
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TestResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Test'] = ResolversParentTypes['Test']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['TestError']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TestGroupResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TestGroup'] = ResolversParentTypes['TestGroup']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tests?: Resolver<Maybe<Array<Maybe<ResolversTypes['Test']>>>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['TestError']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SigneUrlResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SigneUrlResponse'] = ResolversParentTypes['SigneUrlResponse']> = {
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  signedUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AwsCredentialsResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AWSCredentialsResponse'] = ResolversParentTypes['AWSCredentialsResponse']> = {
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  credentialsGroup?: Resolver<Maybe<Array<Maybe<ResolversTypes['AWSCredentials']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AwsCredentialsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AWSCredentials'] = ResolversParentTypes['AWSCredentials']> = {
  accessKeyId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  secret?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mainRegion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  secondaryRegion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResponseStateResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ResponseState'] = ResolversParentTypes['ResponseState']> = {
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LabResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LabResponse'] = ResolversParentTypes['LabResponse']> = {
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lab?: Resolver<Maybe<ResolversTypes['Lab']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Lab?: LabResolvers<ContextType>;
  Overview?: OverviewResolvers<ContextType>;
  Resource?: ResourceResolvers<ContextType>;
  Condition?: ConditionResolvers<ContextType>;
  TestSection?: TestSectionResolvers<ContextType>;
  TestData?: TestDataResolvers<ContextType>;
  TestError?: TestErrorResolvers<ContextType>;
  Test?: TestResolvers<ContextType>;
  TestGroup?: TestGroupResolvers<ContextType>;
  SigneUrlResponse?: SigneUrlResponseResolvers<ContextType>;
  AWSCredentialsResponse?: AwsCredentialsResponseResolvers<ContextType>;
  AWSCredentials?: AwsCredentialsResolvers<ContextType>;
  ResponseState?: ResponseStateResolvers<ContextType>;
  LabResponse?: LabResponseResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
