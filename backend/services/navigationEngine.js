/**
 * Campus Navigation Engine
 * Uses BFS to find shortest path between navigation nodes.
 */

const db = require('./dataStore');

/**
 * Build adjacency list from edges
 */
function buildGraph(edges) {
  const graph = {};
  for (const edge of edges) {
    if (!graph[edge.from]) graph[edge.from] = [];
    graph[edge.from].push(edge);
  }
  return graph;
}

/**
 * BFS pathfinding between two nodes
 * Returns array of node IDs from start to destination, or null if no path.
 */
function bfs(startId, destId, graph) {
  if (startId === destId) return [startId];

  const visited = new Set();
  const queue = [[startId, [startId]]];

  while (queue.length > 0) {
    const [current, path] = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);

    const neighbors = graph[current] || [];
    for (const edge of neighbors) {
      if (edge.to === destId) return [...path, edge.to];
      if (!visited.has(edge.to)) {
        queue.push([edge.to, [...path, edge.to]]);
      }
    }
  }
  return null; // no path found
}

/**
 * Calculate route from start node to destination node.
 * Returns route object with nodes, instructions, and panorama chain.
 */
function calculateRoute(startNodeId, destNodeId) {
  const nodes   = db.getNavNodes();
  const edges   = db.getNavEdges();
  const panos   = db.getPanoramas();
  const graph   = buildGraph(edges);

  const nodesById = {};
  for (const n of nodes) nodesById[n.id] = n;

  const panosById = {};
  for (const p of panos) panosById[p.nodeId] = p;

  if (!nodesById[startNodeId]) {
    return { error: `Start node "${startNodeId}" not found in navigation graph.` };
  }
  if (!nodesById[destNodeId]) {
    return { error: `Destination node "${destNodeId}" not found in navigation graph.` };
  }

  const path = bfs(startNodeId, destNodeId, graph);

  if (!path) {
    return {
      error: `No route found from "${startNodeId}" to "${destNodeId}". Navigation route is not available for this destination yet.`
    };
  }

  // Build edge map for instructions
  const edgeMap = {};
  for (const edge of edges) {
    edgeMap[`${edge.from}__${edge.to}`] = edge;
  }

  // Build step-by-step instructions
  const instructions = [];
  for (let i = 0; i < path.length - 1; i++) {
    const key = `${path[i]}__${path[i + 1]}`;
    const edge = edgeMap[key];
    if (edge) {
      instructions.push(edge.instruction);
    } else {
      instructions.push(`Proceed to ${nodesById[path[i + 1]]?.name || path[i + 1]}.`);
    }
  }

  // Build panorama sequence
  const panoramaChain = path.map(nodeId => {
    const pano = panosById[nodeId];
    return {
      nodeId,
      nodeName: nodesById[nodeId]?.name || nodeId,
      panoramaId: pano?.id || null,
      imageUrl: pano?.imageUrl || null,
      hasPanorama: !!pano
    };
  });

  const totalDistance = path.reduce((sum, nodeId, i) => {
    if (i === 0) return sum;
    const key = `${path[i - 1]}__${nodeId}`;
    const edge = edgeMap[key];
    return sum + (edge?.distance || 0);
  }, 0);

  return {
    start: startNodeId,
    destination: destNodeId,
    startName: nodesById[startNodeId]?.name,
    destinationName: nodesById[destNodeId]?.name,
    route: path,
    stepCount: path.length,
    estimatedDistance: totalDistance,
    instructions,
    panoramaChain
  };
}

/**
 * Find the navigation node ID for a given location ID.
 */
function getNodeForLocation(locationId) {
  const locations = require('./dataStore').getLocations();
  const loc = locations.find(l => l.id === locationId);
  return loc?.navigationNodeId || null;
}

module.exports = { calculateRoute, getNodeForLocation };
