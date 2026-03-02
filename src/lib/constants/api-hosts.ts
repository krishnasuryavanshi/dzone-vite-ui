const ApiUrl = import.meta.env.VITE_API_URL || '';
const LoggerUrl = import.meta.env.VITE_LOGGER_URL || '';

const BackendService = '';
const CampaignService = ApiUrl + '/api/campaign-service';
const ReportingService = ApiUrl + '/api/reporting-service';
const FileService = ApiUrl + '/api/file-service';
const AuthService = ApiUrl + '/api/rbac-service';
const LeadOrchestrationService = ApiUrl + '/api/lead-orchestration-service';
const CampaignDeliveryService = ApiUrl + '/api/campaign-delivery-service';
const TransformationService = ApiUrl + '/api/transformation-service';
const RecommendationService = ApiUrl + '/api/recommendation-service';
const AuditService = ApiUrl + '/api/audit-service';
const RBACService = ApiUrl + '/api/rbac-service';
const OrganizationService = ApiUrl + '/api/organization-service';
const AICopilotService = ApiUrl + '/api/ai-copilot';
const PlatformService = ApiUrl + '/api/platform-service';
const CommonService = ApiUrl + '/api/common-service';
const AnalyticsService = ApiUrl + '/api/analytics-service';
const JobMonitoringService = ApiUrl + '/api/job-monitoring';
const AICoworkerService = ApiUrl + '/api/coworker';
const LoggerService = LoggerUrl;

export const ApiHost = {
  BackendService,
  CampaignService,
  ReportingService,
  FileService,
  AuthService,
  LeadOrchestrationService,
  PlatformService,
  CommonService,
  CampaignDeliveryService,
  TransformationService,
  LoggerService,
  RecommendationService,
  AuditService,
  RBACService,
  OrganizationService,
  AICopilotService,
  AnalyticsService,
  JobMonitoringService,
  AICoworkerService,
};
