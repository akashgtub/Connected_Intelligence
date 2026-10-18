import logging
from typing import Dict, Any, List
from app.database import db_manager

logger = logging.getLogger("connected_intelligence.seed")

# Repeatable Cypher Seed Queries using MERGE
SEED_CYPHER_STATEMENTS = [
    # 1. Teams
    """
    MERGE (t:Team {id: 'team-payments'})
    ON CREATE SET t.name = 'Payments & Billing Team', t.description = 'Owns Payment Gateway, Billing Engine, and Stripe Relay', t.lead = 'Alex Chen';
    """,
    """
    MERGE (t:Team {id: 'team-infra'})
    ON CREATE SET t.name = 'Core Infrastructure Team', t.description = 'Owns Cloud VPC, PostgreSQL, and Kubernetes Clusters', t.lead = 'Sarah Jenkins';
    """,
    """
    MERGE (t:Team {id: 'team-security'})
    ON CREATE SET t.name = 'Identity & Security Team', t.description = 'Owns Auth Service, OAuth2, and Secret Vault', t.lead = 'Marcus Vance';
    """,

    # 2. People
    """
    MERGE (p:Person {id: 'person-alex'})
    ON CREATE SET p.name = 'Alex Chen', p.role = 'Staff Backend Engineer', p.email = 'alex.chen@company.internal', p.skills = 'Python, Payment APIs, Connection Pooling, Postgres';
    """,
    """
    MERGE (p:Person {id: 'person-sarah'})
    ON CREATE SET p.name = 'Sarah Jenkins', p.role = 'Principal SRE Architect', p.email = 'sarah.j@company.internal', p.skills = 'Kubernetes, High Availability, Database Failover, Disaster Recovery';
    """,
    """
    MERGE (p:Person {id: 'person-marcus'})
    ON CREATE SET p.name = 'Marcus Vance', p.role = 'Lead Security Engineer', p.email = 'marcus.v@company.internal', p.skills = 'OAuth2, JWT, Rate Limiting, Vault, Redis';
    """,
    """
    MERGE (p:Person {id: 'person-elena'})
    ON CREATE SET p.name = 'Elena Rostova', p.role = 'Senior Database Engineer', p.email = 'elena.r@company.internal', p.skills = 'PostgreSQL, Replication, Query Optimization, Connection Pool Tuning';
    """,
    """
    MERGE (p:Person {id: 'person-priyanshu'})
    ON CREATE SET p.name = 'Priyanshu Mehta', p.role = 'Full Stack Engineer', p.email = 'priyanshu.m@company.internal', p.skills = 'Node.js, FastAPI, Webhooks, React, Message Queues';
    """,
    """
    MERGE (p:Person {id: 'person-david'})
    ON CREATE SET p.name = 'David Kim', p.role = 'Senior DevOps Engineer', p.email = 'david.k@company.internal', p.skills = 'Terraform, Docker, CI/CD, Prometheus, Grafana';
    """,

    # Team Memberships
    """
    MATCH (p:Person {id: 'person-alex'}), (t:Team {id: 'team-payments'})
    MERGE (p)-[:MEMBER_OF {role: 'Platform Lead'}]->(t);
    """,
    """
    MATCH (p:Person {id: 'person-priyanshu'}), (t:Team {id: 'team-payments'})
    MERGE (p)-[:MEMBER_OF {role: 'Senior Engineer'}]->(t);
    """,
    """
    MATCH (p:Person {id: 'person-sarah'}), (t:Team {id: 'team-infra'})
    MERGE (p)-[:MEMBER_OF {role: 'Team Lead'}]->(t);
    """,
    """
    MATCH (p:Person {id: 'person-elena'}), (t:Team {id: 'team-infra'})
    MERGE (p)-[:MEMBER_OF {role: 'Staff DBA'}]->(t);
    """,
    """
    MATCH (p:Person {id: 'person-david'}), (t:Team {id: 'team-infra'})
    MERGE (p)-[:MEMBER_OF {role: 'DevOps Specialist'}]->(t);
    """,
    """
    MATCH (p:Person {id: 'person-marcus'}), (t:Team {id: 'team-security'})
    MERGE (p)-[:MEMBER_OF {role: 'Security Lead'}]->(t);
    """,

    # 3. Systems
    """
    MERGE (s:System {id: 'sys-payment'})
    ON CREATE SET s.name = 'Payment Service', s.tier = 'Tier-1', s.status = 'Degraded', s.language = 'Python/FastAPI', s.repo = 'github.com/company/payment-service';
    """,
    """
    MERGE (s:System {id: 'sys-postgres'})
    ON CREATE SET s.name = 'PostgreSQL Cluster', s.tier = 'Tier-0', s.status = 'Healthy', s.version = '15.4', s.host = 'pg-primary.internal';
    """,
    """
    MERGE (s:System {id: 'sys-auth'})
    ON CREATE SET s.name = 'Auth Gateway', s.tier = 'Tier-0', s.status = 'Healthy', s.language = 'Go', s.repo = 'github.com/company/auth-gateway';
    """,
    """
    MERGE (s:System {id: 'sys-billing'})
    ON CREATE SET s.name = 'Billing Engine', s.tier = 'Tier-1', s.status = 'Healthy', s.language = 'Python/Celery', s.repo = 'github.com/company/billing-engine';
    """,
    """
    MERGE (s:System {id: 'sys-notification'})
    ON CREATE SET s.name = 'Notification Service', s.tier = 'Tier-2', s.status = 'Healthy', s.language = 'Node.js', s.repo = 'github.com/company/notification-service';
    """,

    # System Relationships (OWNS, USES, WORKED_ON)
    """
    MATCH (t:Team {id: 'team-payments'}), (s:System {id: 'sys-payment'})
    MERGE (t)-[:OWNS]->(s);
    """,
    """
    MATCH (t:Team {id: 'team-payments'}), (s:System {id: 'sys-billing'})
    MERGE (t)-[:OWNS]->(s);
    """,
    """
    MATCH (t:Team {id: 'team-infra'}), (s:System {id: 'sys-postgres'})
    MERGE (t)-[:OWNS]->(s);
    """,
    """
    MATCH (t:Team {id: 'team-security'}), (s:System {id: 'sys-auth'})
    MERGE (t)-[:OWNS]->(s);
    """,
    """
    MATCH (s1:System {id: 'sys-payment'}), (s2:System {id: 'sys-postgres'})
    MERGE (s1)-[:USES {protocol: 'TCP/5432', pool_size: 40}]->(s2);
    """,
    """
    MATCH (s1:System {id: 'sys-payment'}), (s2:System {id: 'sys-auth'})
    MERGE (s1)-[:USES {protocol: 'gRPC', auth: 'mTLS'}]->(s2);
    """,
    """
    MATCH (s1:System {id: 'sys-billing'}), (s2:System {id: 'sys-payment'})
    MERGE (s1)-[:USES {protocol: 'REST/HTTPS'}]->(s2);
    """,
    """
    MATCH (p:Person {id: 'person-alex'}), (s:System {id: 'sys-payment'})
    MERGE (p)-[:WORKED_ON {years: 3, role: 'Author'}]->(s);
    """,
    """
    MATCH (p:Person {id: 'person-elena'}), (s:System {id: 'sys-postgres'})
    MERGE (p)-[:WORKED_ON {years: 4, role: 'DBA Architect'}]->(s);
    """,
    """
    MATCH (p:Person {id: 'person-marcus'}), (s:System {id: 'sys-auth'})
    MERGE (p)-[:WORKED_ON {years: 2, role: 'Maintainer'}]->(s);
    """,

    # 4. Projects
    """
    MERGE (pr:Project {id: 'proj-titan'})
    ON CREATE SET pr.name = 'Project Titan', pr.description = 'Next-Gen Payment API Modernization', pr.status = 'In Progress';
    """,
    """
    MERGE (pr:Project {id: 'proj-resilience'})
    ON CREATE SET pr.name = 'Project Resilience', pr.description = 'Database High Availability & Zero-Loss Replication', pr.status = 'Completed';
    """,
    """
    MERGE (pr:Project {id: 'proj-aegis'})
    ON CREATE SET pr.name = 'Project Aegis', pr.description = 'Zero-Trust Internal Authentication Framework', pr.status = 'Completed';
    """,
    """
    MERGE (pr:Project {id: 'proj-horizon'})
    ON CREATE SET pr.name = 'Project Horizon', pr.description = 'Multi-Region Event Streaming & Webhook Bus', pr.status = 'In Progress';
    """,

    # Project Links
    """
    MATCH (p:Person {id: 'person-alex'}), (pr:Project {id: 'proj-titan'})
    MERGE (p)-[:WORKED_ON {role: 'Tech Lead'}]->(pr);
    """,
    """
    MATCH (p:Person {id: 'person-elena'}), (pr:Project {id: 'proj-resilience'})
    MERGE (p)-[:WORKED_ON {role: 'Lead Architect'}]->(pr);
    """,
    """
    MATCH (pr:Project {id: 'proj-titan'}), (s:System {id: 'sys-payment'})
    MERGE (pr)-[:AFFECTS]->(s);
    """,
    """
    MATCH (pr:Project {id: 'proj-resilience'}), (s:System {id: 'sys-postgres'})
    MERGE (pr)-[:AFFECTS]->(s);
    """,

    # 5. Incidents
    """
    MERGE (i:Incident {id: 'INC-1042'})
    ON CREATE SET i.title = 'Payment API Outage: Database Connection Timeout',
                  i.severity = 'P0',
                  i.status = 'Resolved',
                  i.affected_system = 'Payment Service',
                  i.created_at = '2025-11-12T14:22:00Z',
                  i.resolved_at = '2025-11-12T15:45:00Z',
                  i.description = 'Payment Service pods threw timeout exceptions connecting to PostgreSQL. Investigation found connection pool exhaustion from unindexed refund queries.',
                  i.resolution = 'Increased max connection pool size from 20 to 50, added composite index on refunds(tenant_id, created_at), and recycled stuck worker threads.';
    """,
    """
    MERGE (i:Incident {id: 'INC-1055'})
    ON CREATE SET i.title = 'Auth Gateway Token Verification Latency Spike',
                  i.severity = 'P1',
                  i.status = 'Resolved',
                  i.affected_system = 'Auth Gateway',
                  i.created_at = '2025-12-04T09:15:00Z',
                  i.resolved_at = '2025-12-04T10:05:00Z',
                  i.description = 'Token verification latency surged to 850ms during morning login spike. Redis cluster eviction policy caused cold cache thrashing.',
                  i.resolution = 'Pre-warmed cache keys, scaled Redis memory allocation by 50%, and pinned frequent public keys in memory.';
    """,
    """
    MERGE (i:Incident {id: 'INC-1078'})
    ON CREATE SET i.title = 'Payment Webhook Retry Storm',
                  i.severity = 'P1',
                  i.status = 'Resolved',
                  i.affected_system = 'Payment Service',
                  i.created_at = '2026-01-18T18:30:00Z',
                  i.resolved_at = '2026-01-18T19:50:00Z',
                  i.description = 'External provider failure caused 40,000 webhook retries without jitter, overwhelming payment ingress.',
                  i.resolution = 'Implemented exponential backoff with full jitter and queued retries into SQS buffer.';
    """,
    """
    MERGE (i:Incident {id: 'INC-1089'})
    ON CREATE SET i.title = 'PostgreSQL Read-Replica Replication Lag',
                  i.severity = 'P2',
                  i.status = 'Resolved',
                  i.affected_system = 'PostgreSQL Cluster',
                  i.created_at = '2026-02-10T11:00:00Z',
                  i.resolved_at = '2026-02-10T12:30:00Z',
                  i.description = 'Analytical queries running against replica blocked WAL application, creating 22 minutes replication lag.',
                  i.resolution = 'Separated analytics queries to dedicated reporting replica with max_standby_streaming_delay tuned.';
    """,
    """
    MERGE (i:Incident {id: 'INC-1102'})
    ON CREATE SET i.title = 'Billing Engine Subscription Renewal Timeout',
                  i.severity = 'P2',
                  i.status = 'Resolved',
                  i.affected_system = 'Billing Engine',
                  i.created_at = '2026-03-01T00:30:00Z',
                  i.resolved_at = '2026-03-01T01:45:00Z',
                  i.description = 'Monthly batch renewal job hit lock contention on customer credit table.',
                  i.resolution = 'Chunked renewal transactions in batches of 200 with row-level skip-locked.';
    """,
    """
    MERGE (i:Incident {id: 'INC-1140'})
    ON CREATE SET i.title = 'Current Incident: Payment Service Degradation & Connection Errors',
                  i.severity = 'P0',
                  i.status = 'Investigating',
                  i.affected_system = 'Payment Service',
                  i.created_at = '2026-10-18T12:00:00Z',
                  i.description = 'Users report 504 Gateway Timeouts on /v2/checkout. Payment Service container logs indicate database pool exhaustion matching INC-1042.',
                  i.assigned_engineer = 'Alex Chen';
    """,

    # Incident Relationships (AFFECTS, RESOLVED_BY, RELATED_TO)
    """
    MATCH (i:Incident {id: 'INC-1042'}), (s:System {id: 'sys-payment'})
    MERGE (i)-[:AFFECTS]->(s);
    """,
    """
    MATCH (i:Incident {id: 'INC-1042'}), (p:Person {id: 'person-alex'})
    MERGE (i)-[:RESOLVED_BY]->(p);
    """,
    """
    MATCH (i:Incident {id: 'INC-1055'}), (s:System {id: 'sys-auth'})
    MERGE (i)-[:AFFECTS]->(s);
    """,
    """
    MATCH (i:Incident {id: 'INC-1055'}), (p:Person {id: 'person-marcus'})
    MERGE (i)-[:RESOLVED_BY]->(p);
    """,
    """
    MATCH (i:Incident {id: 'INC-1078'}), (s:System {id: 'sys-payment'})
    MERGE (i)-[:AFFECTS]->(s);
    """,
    """
    MATCH (i:Incident {id: 'INC-1078'}), (p:Person {id: 'person-priyanshu'})
    MERGE (i)-[:RESOLVED_BY]->(p);
    """,
    """
    MATCH (i:Incident {id: 'INC-1089'}), (s:System {id: 'sys-postgres'})
    MERGE (i)-[:AFFECTS]->(s);
    """,
    """
    MATCH (i:Incident {id: 'INC-1089'}), (p:Person {id: 'person-elena'})
    MERGE (i)-[:RESOLVED_BY]->(p);
    """,
    """
    MATCH (i:Incident {id: 'INC-1140'}), (s:System {id: 'sys-payment'})
    MERGE (i)-[:AFFECTS]->(s);
    """,
    """
    MATCH (i1:Incident {id: 'INC-1140'}), (i2:Incident {id: 'INC-1042'})
    MERGE (i1)-[:RELATED_TO {similarity: 'Identical root cause signature: DB pool timeout'}]->(i2);
    """,

    # 6. Architectural Decisions
    """
    MERGE (d:Decision {id: 'DEC-201'})
    ON CREATE SET d.title = 'Payment Service Connection Pool Hard Limits',
                  d.status = 'Approved',
                  d.date = '2025-11-20',
                  d.rationale = 'Following INC-1042, set HikariCP pool size to 50 max connections per pod with a 5000ms connection timeout to prevent cascade failure.',
                  d.author = 'Alex Chen';
    """,
    """
    MERGE (d:Decision {id: 'DEC-202'})
    ON CREATE SET d.title = 'Database Read Replica Routing for Analytics',
                  d.status = 'Approved',
                  d.date = '2025-12-15',
                  d.rationale = 'Prohibit ad-hoc analytics queries on PostgreSQL primary to protect OLTP transactions.',
                  d.author = 'Elena Rostova';
    """,
    """
    MERGE (d:Decision {id: 'DEC-203'})
    ON CREATE SET d.title = 'Auth Token Caching & Graceful Degradation',
                  d.status = 'Approved',
                  d.date = '2026-01-05',
                  d.rationale = 'Maintain local in-memory token public keys to allow zero-downtime auth even during Redis cache spikes.',
                  d.author = 'Marcus Vance';
    """,
    """
    MERGE (d:Decision {id: 'DEC-204'})
    ON CREATE SET d.title = 'Exponential Backoff on Payment Provider Webhooks',
                  d.status = 'Approved',
                  d.date = '2026-01-25',
                  d.rationale = 'Mandate retry jitter algorithm across all webhook listener endpoints to prevent retry storms.',
                  d.author = 'Alex Chen';
    """,
    """
    MERGE (d:Decision {id: 'DEC-205'})
    ON CREATE SET d.title = 'Automated Primary Database Failover Protocol',
                  d.status = 'Approved',
                  d.date = '2026-02-28',
                  d.rationale = 'Deploy Patroni with Raft consensus for automated 15-second database failover with zero manual intervention.',
                  d.author = 'Sarah Jenkins';
    """,

    # Decision Links (ABOUT, REFERENCES)
    """
    MATCH (d:Decision {id: 'DEC-201'}), (s:System {id: 'sys-payment'})
    MERGE (d)-[:ABOUT]->(s);
    """,
    """
    MATCH (d:Decision {id: 'DEC-201'}), (i:Incident {id: 'INC-1042'})
    MERGE (d)-[:REFERENCES]->(i);
    """,
    """
    MATCH (d:Decision {id: 'DEC-202'}), (s:System {id: 'sys-postgres'})
    MERGE (d)-[:ABOUT]->(s);
    """,
    """
    MATCH (d:Decision {id: 'DEC-203'}), (s:System {id: 'sys-auth'})
    MERGE (d)-[:ABOUT]->(s);
    """,
    """
    MATCH (d:Decision {id: 'DEC-205'}), (s:System {id: 'sys-postgres'})
    MERGE (d)-[:ABOUT]->(s);
    """,

    # 7. Documents & Guides
    """
    MERGE (doc:Document {id: 'DOC-301'})
    ON CREATE SET doc.title = 'Payment Service Runbook & Incident Playbook',
                  doc.category = 'Runbook',
                  doc.last_updated = '2026-02-15',
                  doc.summary = 'Emergency diagnostic steps for Payment Service: verify database connection pool status, check active worker threads, inspect Stripe response codes.';
    """,
    """
    MERGE (doc:Document {id: 'DOC-302'})
    ON CREATE SET doc.title = 'PostgreSQL High Availability & Recovery Runbook',
                  doc.category = 'SRE Guide',
                  doc.last_updated = '2026-03-01',
                  doc.summary = 'Procedures for verifying replica health, checking WAL status, and executing safe manual failover.';
    """,
    """
    MATCH (doc:Document {id: 'DOC-301'}), (s:System {id: 'sys-payment'})
    MERGE (doc)-[:ABOUT]->(s);
    """,
    """
    MATCH (doc:Document {id: 'DOC-302'}), (s:System {id: 'sys-postgres'})
    MERGE (doc)-[:ABOUT]->(s);
    """,

    # 8. Persistent Investigation Memories
    """
    MERGE (m:Memory {id: 'mem-001'})
    ON CREATE SET m.title = 'Payment Outage Resolution Protocol',
                  m.question = 'What happened during the previous payment API outage?',
                  m.summary = 'INC-1042 root cause was connection pool exhaustion caused by unindexed queries. Alex Chen resolved by tuning HikariCP pool and adding compound index.',
                  m.recommendations = '["1. Inspect PostgreSQL connection pool count", "2. Check Payment Service error logs for pool timeout", "3. Page Alex Chen (primary author)", "4. Reference DEC-201 connection pool limits"]',
                  m.timestamp = '2026-10-15T10:30:00Z',
                  m.linked_incident = 'INC-1042',
                  m.linked_system = 'Payment Service';
    """,
    """
    MATCH (m:Memory {id: 'mem-001'}), (i:Incident {id: 'INC-1042'})
    MERGE (m)-[:REFERENCES]->(i);
    """,
    """
    MATCH (m:Memory {id: 'mem-001'}), (s:System {id: 'sys-payment'})
    MERGE (m)-[:ABOUT]->(s);
    """
]

def seed_database() -> Dict[str, Any]:
    """Runs repeatable MERGE queries to seed the FalkorDB company brain."""
    if not db_manager.is_connected:
        return {
            "success": False,
            "error": "FalkorDB is not connected. Start FalkorDB Docker container or configure FALKORDB_URL.",
            "details": db_manager.last_error
        }
    
    executed = 0
    errors = []
    for stmt in SEED_CYPHER_STATEMENTS:
        clean_stmt = stmt.strip()
        if not clean_stmt:
            continue
        try:
            db_manager.query(clean_stmt)
            executed += 1
        except Exception as e:
            errors.append(f"Statement failed: {clean_stmt[:40]}... Error: {e}")
            logger.error(f"Error seeding statement: {e}")
    
    # Retrieve total counts
    try:
        n_res = db_manager.query("MATCH (n) RETURN count(n) AS cnt")
        r_res = db_manager.query("MATCH ()-[r]->() RETURN count(r) AS cnt")
        node_count = n_res.result_set[0][0] if n_res.result_set else 0
        rel_count = r_res.result_set[0][0] if r_res.result_set else 0
    except Exception:
        node_count = 0
        rel_count = 0

    return {
        "success": len(errors) == 0,
        "executed_queries": executed,
        "errors": errors,
        "total_nodes": node_count,
        "total_relationships": rel_count
    }
