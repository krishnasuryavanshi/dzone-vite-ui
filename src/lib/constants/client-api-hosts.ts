const ApiHost = import.meta.env.VITE_API_URL;
export const JobMonitoringService = `${ApiHost}/api/job-monitoring`;
const AICoworkerApiHost = import.meta.env.VITE_AI_COWORKER_API_URL || ApiHost;
export const AIAgentService = `${AICoworkerApiHost}/api/coworker`;
