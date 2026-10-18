from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.database import db_manager
from app.schema import GraphData, NodeModel, EdgeModel

router = APIRouter(tags=["Graph"])

@router.get("/graph", response_model=GraphData)
def get_graph(limit: int = Query(100, ge=1, le=500)):
    """Retrieves nodes and edges from FalkorDB for visual graph rendering."""
    if not db_manager.is_connected:
        raise HTTPException(
            status_code=503,
            detail="FalkorDB is unreachable. Please verify FalkorDB Docker container is running."
        )

    try:
        # Fetch nodes
        nodes_res = db_manager.query(f"MATCH (n) RETURN n, labels(n)[0] AS type LIMIT {limit}")
        nodes_dict = {}
        if nodes_res and nodes_res.result_set:
            for row in nodes_res.result_set:
                raw_node = row[0]
                label_type = row[1] if len(row) > 1 and row[1] else "Entity"
                props = getattr(raw_node, "properties", {})
                node_id = props.get("id") or str(getattr(raw_node, "id", ""))
                node_name = props.get("name") or props.get("title") or node_id
                nodes_dict[node_id] = NodeModel(
                    id=node_id,
                    label=str(node_name),
                    type=str(label_type),
                    properties=props,
                    degree=0
                )

        # Fetch relationships
        edges_res = db_manager.query(f"""
        MATCH (a)-[r]->(b)
        RETURN a.id, b.id, type(r), r, labels(a)[0], labels(b)[0]
        LIMIT {limit * 2}
        """)
        edges = []
        if edges_res and edges_res.result_set:
            for i, row in enumerate(edges_res.result_set):
                source_id = str(row[0]) if row[0] else None
                target_id = str(row[1]) if row[1] else None
                rel_type = str(row[2]) if row[2] else "RELATED_TO"
                rel_props = getattr(row[3], "properties", {}) if len(row) > 3 and row[3] else {}

                if source_id and target_id and source_id in nodes_dict and target_id in nodes_dict:
                    edges.append(EdgeModel(
                        id=f"e-{i}-{source_id}-{target_id}",
                        source=source_id,
                        target=target_id,
                        type=rel_type,
                        properties=rel_props
                    ))
                    nodes_dict[source_id].degree += 1
                    nodes_dict[target_id].degree += 1

        node_list = list(nodes_dict.values())
        return GraphData(
            nodes=node_list,
            edges=edges,
            total_nodes=len(node_list),
            total_edges=len(edges)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to query FalkorDB graph: {e}")

@router.get("/graph/node/{node_id}")
def get_node_details(node_id: str):
    """Retrieves a single node and its connected 1-hop neighbors."""
    if not db_manager.is_connected:
        raise HTTPException(status_code=503, detail="FalkorDB is unreachable.")

    try:
        res = db_manager.query("""
        MATCH (n)
        WHERE n.id = $id OR toLower(n.name) = toLower($id)
        OPTIONAL MATCH (n)-[r]-(neighbor)
        RETURN n, labels(n)[0] AS type, type(r) AS rel_type, neighbor, labels(neighbor)[0] AS n_type
        """, {"id": node_id})

        if not res or not res.result_set:
            raise HTTPException(status_code=404, detail=f"Node '{node_id}' not found in graph.")

        center_node = None
        neighbors = []
        for row in res.result_set:
            if center_node is None:
                n_props = getattr(row[0], "properties", {})
                center_node = {
                    "id": n_props.get("id", node_id),
                    "label": n_props.get("name") or n_props.get("title") or node_id,
                    "type": row[1] or "Entity",
                    "properties": n_props
                }
            if row[3] is not None:
                neigh_props = getattr(row[3], "properties", {})
                neighbors.append({
                    "id": neigh_props.get("id"),
                    "label": neigh_props.get("name") or neigh_props.get("title"),
                    "type": row[4],
                    "relationship": row[2],
                    "properties": neigh_props
                })

        return {
            "node": center_node,
            "connected_neighbors": neighbors,
            "degree": len(neighbors)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
