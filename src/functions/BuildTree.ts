import {FieldNode, GraphQLResolveInfo, SelectionNode} from "graphql";
import {getArgumentValues} from "graphql/execution/values";
import {GraphQLQueryTree} from "../classes";
import {selectionsToFields} from "./SelectionsToFields";
import {getType} from "./GetType";
import {buildQueryProperties} from "./BuildQueryProperties";

/**
 * @description This recursive function builds the entire tree
 * @param parent Parent node
 * @param selections Selections of parent node
 * @param info GraphQLResolveInfo
 */
export function buildTree<T>(
    parent: GraphQLQueryTree<T>,
    selections: readonly FieldNode[] | readonly SelectionNode[],
    info: GraphQLResolveInfo,
): void {

    const childFields: Array<GraphQLQueryTree<any>> = []; // Initialize child trees (fields)
    const fieldNodes = selectionsToFields(selections, info); // Transform SelectionNodes to FieldNodes

    // For each field node
    fieldNodes.forEach((field) => {

        const name = field.name.value;
        if (name === "__typename") {
            return;
        }

        const fieldDef = parent.properties.type.getFields()[name];
        const queryArgs = getArgumentValues(fieldDef, field, info.variableValues);
        const type = getType(fieldDef.type);

        const properties = buildQueryProperties(type, queryArgs);
        const child = new GraphQLQueryTree(name, properties);

        console.log(child);

        childFields.push(child);

        if (field.selectionSet) {
            buildTree(child, field.selectionSet.selections, info);
        }
    });

    parent.setFields(childFields);
}