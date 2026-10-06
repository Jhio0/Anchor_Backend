import { WorkflowState } from "../types/workflow.types";

// nodeId -> screen name
export type NodeToScreenMap<T extends string> = Record<string, T>;

/** Returns the screen name from the given nodeId using the provided map */
export function getScreenFromNodeId<T extends string>(
  map: NodeToScreenMap<T>,
  nodeId: string,
): T {
  return map[nodeId];
}

/** Returns the current screen based on the current state and map */
export function getCurrentScreen<T extends string>(
  map: NodeToScreenMap<T>,
  state: WorkflowState,
): T {
  return getScreenFromNodeId(map, state.currentNodeId);
}

export function invertMap<T extends string>(
  map: Record<T, string>,
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(map).map(([key, value]) => [value, key]),
  ) as Record<string, T>;
}
