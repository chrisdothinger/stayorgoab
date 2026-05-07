import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export interface ScheduleRecord {
  id: string;
  workflow: string;
  cron: string;
  timezone: string;
  purpose: string;
  latest_successful_run?: string;
  allowed_outputs?: string[];
  required_checks?: string[];
  public_log_level: string;
  publish_raw_logs: boolean;
  human_gate: boolean;
}

export interface PublicAgentRun {
  run_id: string;
  agent_id: string;
  agent_name: string;
  trigger: string;
  recorded_at?: string;
  output_summary: string;
}

export interface ReleaseRecord {
  id: string;
  date: string;
  summary: string;
}

export interface AgentRecord {
  id: string;
  name: string;
  level: string;
  purpose: string;
}

export interface PermissionRecord {
  allowed_paths: string[];
}

export interface OpsSnapshot {
  schedules: ScheduleRecord[];
  latestRuns: PublicAgentRun[];
  releases: ReleaseRecord[];
  incidentCount: number;
  agents: AgentRecord[];
  permissionLevels: Record<string, string>;
  permissions: Record<string, PermissionRecord>;
  runbooks: string[];
}

const ROOT = process.cwd();
const SCHEDULES_PATH = path.join(ROOT, 'ops', 'schedules.yml');
const RELEASES_PATH = path.join(ROOT, 'ops', 'releases', 'release-log.yml');
const INCIDENTS_PATH = path.join(ROOT, 'ops', 'incidents', 'incident-log.yml');
const LATEST_RUNS_PATH = path.join(ROOT, 'ops', 'agent-runs', 'latest.public.json');
const RUNBOOKS_DIR = path.join(ROOT, 'ops', 'runbooks');
const AGENT_REGISTRY_PATH = path.join(ROOT, 'agents', 'registry.yml');
const AGENT_PERMISSIONS_PATH = path.join(ROOT, 'agents', 'permissions.yml');

function readYamlFile<T>(absolutePath: string): T {
  return yaml.load(fs.readFileSync(absolutePath, 'utf8')) as T;
}

function readJsonFile<T>(absolutePath: string): T {
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8')) as T;
}

export function loadOpsSnapshot(): OpsSnapshot {
  const schedulesFile = readYamlFile<{ schedules: ScheduleRecord[] }>(SCHEDULES_PATH);
  const releasesFile = readYamlFile<{ releases: ReleaseRecord[] }>(RELEASES_PATH);
  const incidentsFile = readYamlFile<{ incidents?: unknown[] }>(INCIDENTS_PATH);
  const registryFile = readYamlFile<{ agents: AgentRecord[] }>(AGENT_REGISTRY_PATH);
  const permissionsFile = readYamlFile<{
    levels: Record<string, string>;
    agents: Record<string, PermissionRecord>;
  }>(AGENT_PERMISSIONS_PATH);
  const runbooks = fs
    .readdirSync(RUNBOOKS_DIR)
    .filter((file) => file.endsWith('.md'))
    .sort();

  return {
    schedules: schedulesFile.schedules,
    latestRuns: readJsonFile<PublicAgentRun[]>(LATEST_RUNS_PATH),
    releases: releasesFile.releases,
    incidentCount: incidentsFile.incidents?.length ?? 0,
    agents: registryFile.agents,
    permissionLevels: permissionsFile.levels,
    permissions: permissionsFile.agents,
    runbooks
  };
}
