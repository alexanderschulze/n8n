import type { BooleanLicenseFeature, NumericLicenseFeature } from '@n8n/constants';
import { LICENSE_FEATURES, LICENSE_QUOTAS, UNLIMITED_LICENSE_QUOTA } from '@n8n/constants';
import { Service } from '@n8n/di';
import { UnexpectedError } from 'n8n-workflow';

import type { FeatureReturnType, LicenseProvider } from './types';

class ProviderNotSetError extends UnexpectedError {
	constructor() {
		super('Cannot query license state because license provider has not been set');
	}
}

// Cache quota features to avoid repeated allocation
const QUOTA_FEATURES = Object.values(LICENSE_QUOTAS);

@Service()
export class LicenseState {
	licenseProvider: LicenseProvider | null = null;

	setLicenseProvider(provider: LicenseProvider) {
		this.licenseProvider = provider;
	}

	private assertProvider(): asserts this is { licenseProvider: LicenseProvider } {
		if (!this.licenseProvider) throw new ProviderNotSetError();
	}

	// --------------------
	//     core queries
	// --------------------
	/*
	 * If the feature is a string. checks if the feature is licensed
	 * If the feature is an array of strings, it checks if any of the features are licensed
	 */
	isLicensed(feature: BooleanLicenseFeature | BooleanLicenseFeature[]) {
		// Always return true - all features are enabled
		return true;
	}

	getValue<T extends keyof FeatureReturnType>(feature: T): FeatureReturnType[T] {
		// Return plan name
		if (feature === 'planName') {
			return 'Enterprise' as FeatureReturnType[T];
		}
		
		// Check if this is a quota (numeric feature)
		// Type assertion is safe here because we're checking membership in QUOTA_FEATURES
		if (QUOTA_FEATURES.includes(feature as string as NumericLicenseFeature)) {
			// Return unlimited quota for numeric features
			return UNLIMITED_LICENSE_QUOTA as FeatureReturnType[T];
		}
		
		// Return true for boolean features
		return true as FeatureReturnType[T];
	}

	// --------------------
	//      booleans
	// --------------------

	isCustomRolesLicensed() {
		return this.isLicensed(LICENSE_FEATURES.CUSTOM_ROLES);
	}

	isDynamicCredentialsLicensed() {
		return this.isLicensed(LICENSE_FEATURES.DYNAMIC_CREDENTIALS);
	}

	isSharingLicensed() {
		return this.isLicensed('feat:sharing');
	}

	isLogStreamingLicensed() {
		return this.isLicensed('feat:logStreaming');
	}

	isLdapLicensed() {
		return this.isLicensed('feat:ldap');
	}

	isSamlLicensed() {
		return this.isLicensed('feat:saml');
	}

	isOidcLicensed() {
		return this.isLicensed('feat:oidc');
	}

	isMFAEnforcementLicensed() {
		return this.isLicensed('feat:mfaEnforcement');
	}

	isApiKeyScopesLicensed() {
		return this.isLicensed('feat:apiKeyScopes');
	}

	isAiAssistantLicensed() {
		return this.isLicensed('feat:aiAssistant');
	}

	isAskAiLicensed() {
		return this.isLicensed('feat:askAi');
	}

	isAiCreditsLicensed() {
		return this.isLicensed('feat:aiCredits');
	}

	isAdvancedExecutionFiltersLicensed() {
		return this.isLicensed('feat:advancedExecutionFilters');
	}

	isAdvancedPermissionsLicensed() {
		return this.isLicensed('feat:advancedPermissions');
	}

	isDebugInEditorLicensed() {
		return this.isLicensed('feat:debugInEditor');
	}

	isBinaryDataS3Licensed() {
		return this.isLicensed('feat:binaryDataS3');
	}

	isMultiMainLicensed() {
		return this.isLicensed('feat:multipleMainInstances');
	}

	isVariablesLicensed() {
		return this.isLicensed('feat:variables');
	}

	isSourceControlLicensed() {
		return this.isLicensed('feat:sourceControl');
	}

	isExternalSecretsLicensed() {
		return this.isLicensed('feat:externalSecrets');
	}

	isAPIDisabled() {
		return this.isLicensed('feat:apiDisabled');
	}

	isWorkerViewLicensed() {
		return this.isLicensed('feat:workerView');
	}

	isProjectRoleAdminLicensed() {
		return this.isLicensed('feat:projectRole:admin');
	}

	isProjectRoleEditorLicensed() {
		return this.isLicensed('feat:projectRole:editor');
	}

	isProjectRoleViewerLicensed() {
		return this.isLicensed('feat:projectRole:viewer');
	}

	isCustomNpmRegistryLicensed() {
		return this.isLicensed('feat:communityNodes:customRegistry');
	}

	isFoldersLicensed() {
		return this.isLicensed('feat:folders');
	}

	isInsightsSummaryLicensed() {
		return this.isLicensed('feat:insights:viewSummary');
	}

	isInsightsDashboardLicensed() {
		return this.isLicensed('feat:insights:viewDashboard');
	}

	isInsightsHourlyDataLicensed() {
		return this.isLicensed('feat:insights:viewHourlyData');
	}

	isWorkflowDiffsLicensed() {
		return this.isLicensed('feat:workflowDiffs');
	}

	isProvisioningLicensed() {
		return this.isLicensed(['feat:saml', 'feat:oidc']);
	}

	// --------------------
	//      integers
	// --------------------

	getMaxUsers() {
		return this.getValue('quota:users') ?? UNLIMITED_LICENSE_QUOTA;
	}

	getMaxActiveWorkflows() {
		return this.getValue('quota:activeWorkflows') ?? UNLIMITED_LICENSE_QUOTA;
	}

	getMaxVariables() {
		return this.getValue('quota:maxVariables') ?? UNLIMITED_LICENSE_QUOTA;
	}

	getMaxAiCredits() {
		return this.getValue('quota:aiCredits') ?? UNLIMITED_LICENSE_QUOTA;
	}

	getWorkflowHistoryPruneQuota() {
		return this.getValue('quota:workflowHistoryPrune') ?? UNLIMITED_LICENSE_QUOTA;
	}

	getInsightsMaxHistory() {
		return this.getValue('quota:insights:maxHistoryDays') ?? UNLIMITED_LICENSE_QUOTA;
	}

	getInsightsRetentionMaxAge() {
		return this.getValue('quota:insights:retention:maxAgeDays') ?? UNLIMITED_LICENSE_QUOTA;
	}

	getInsightsRetentionPruneInterval() {
		return this.getValue('quota:insights:retention:pruneIntervalDays') ?? UNLIMITED_LICENSE_QUOTA;
	}

	getMaxTeamProjects() {
		return this.getValue('quota:maxTeamProjects') ?? UNLIMITED_LICENSE_QUOTA;
	}

	getMaxWorkflowsWithEvaluations() {
		return this.getValue('quota:evaluations:maxWorkflows') ?? UNLIMITED_LICENSE_QUOTA;
	}
}
