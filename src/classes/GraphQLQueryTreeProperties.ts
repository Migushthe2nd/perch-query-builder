import {GraphQLObjectType} from "graphql";
import {DynamicQueryOptions} from "../interfaces";

/**
 * @class GraphQLQueryTreeProperties
 */
export class GraphQLQueryTreeProperties<T> {
    constructor(
        public args: { [key: string]: any },
        public options: DynamicQueryOptions<T>,
        public type: GraphQLObjectType
    ) {}
}