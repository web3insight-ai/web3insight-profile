import { createHttpClient } from "@/lib/utils/http";
import type {
  ApiResponse,
  AnalysisRequest,
  AnalysisResponse,
  AnalysisResult,
  ProgressCallback,
  BasicDataCallback
} from "@/lib/types";

// Get API token from environment variables
const getApiToken = (): string => {
  return process.env.NEXT_PUBLIC_DATA_API_TOKEN || process.env.DATA_API_TOKEN || "";
};

// Create HTTP client with authentication
const createAuthenticatedClient = () => {
  const token = getApiToken();
  return createHttpClient(token);
};

/**
 * Initiate user analysis by posting GitHub URLs
 */
export async function analyzeUser(
  githubUrls: string[],
  description: string = "Web3 insight analysis"
): Promise<ApiResponse<AnalysisResponse>> {
  const client = createAuthenticatedClient();

  const requestData: AnalysisRequest = {
    request_data: githubUrls,
    intent: "hackathon",
    description,
  };

  return client.post<AnalysisResponse>("/v1/custom/analysis/users", requestData);
}

/**
 * Fetch analysis result by ID with polling capability
 */
export async function fetchAnalysisResult(
  analysisId: number
): Promise<ApiResponse<AnalysisResult>> {
  const client = createAuthenticatedClient();
  return client.get<AnalysisResult>(`/v1/custom/analysis/users/${analysisId}`);
}

/**
 * Poll for analysis result with retry logic
 */
export async function pollAnalysisResult(
  analysisId: number,
  maxRetries: number = 10,
  interval: number = 10000,
  onProgress?: (attempt: number, data?: Partial<AnalysisResult>) => void
): Promise<ApiResponse<AnalysisResult>> {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const response = await fetchAnalysisResult(analysisId);

            if (onProgress) {
        onProgress(retryCount + 1, response.data);
      }

      // Add detailed debug logging
      console.log(`🔍 Polling attempt ${retryCount + 1}:`, {
        success: response.success,
        hasData: !!response.data,
        hasAI: !!(response.data && response.data.ai),
        aiSuccess: response.data?.ai?.success,
        hasAIData: !!(response.data?.ai?.data),
        timestamp: new Date().toISOString()
      });

      // Check if analysis is complete with AI field
      if (response.success && response.data) {
        const hasBasicData =
          response.data.data &&
          response.data.data.users &&
          Array.isArray(response.data.data.users) &&
          response.data.data.users.length > 0;

        // Check if AI analysis is complete - AI data is at root level
        const hasAIData = !!(response.data.ai &&
          response.data.ai.success &&
          response.data.ai.data);

        console.log(`📊 Analysis status:`, {
          hasBasicData,
          hasAIData,
          aiSuccess: response.data.ai?.success,
          aiTimestamp: response.data.ai?.timestamp
        });

        if (hasBasicData && hasAIData) {
          console.log(`✅ Analysis complete! AI data found with timestamp: ${response.data.ai?.timestamp}`);
          return {
            ...response,
            data: {
              ...response.data,
              status: "completed",
            },
          };
        }

        // If we have basic data but no AI yet, continue polling
        if (hasBasicData && !hasAIData) {
          console.log(`⏳ Polling attempt ${retryCount + 1}: Basic data available, waiting for AI analysis...`);
        }
      }

      // If not complete, wait and retry
      retryCount++;

      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    } catch (error) {
      console.error(`Polling attempt ${retryCount + 1} failed:`, error);
      retryCount++;

      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
  }

  // Max retries reached
  return {
    success: false,
    code: "AI_ANALYSIS_TIMEOUT",
    message: "AI analysis timeout: unable to fetch AI insights after maximum polling attempts. Basic analysis may be available.",
    data: {
      data: { users: [] },
      status: "failed",
    } as AnalysisResult,
  };
}

/**
 * Two-phase analysis function: first show basic info, then poll for AI results
 */
export async function analyzeGitHubUser(
  githubHandle: string,
  onProgress?: ProgressCallback,
  onBasicInfo?: BasicDataCallback
): Promise<ApiResponse<AnalysisResult>> {
  try {
    // Convert handle to full GitHub URL
    const githubUrl = githubHandle.startsWith("https://")
      ? githubHandle
      : `https://github.com/${githubHandle}`;

    if (onProgress) {
      onProgress("Initiating analysis...", 0);
    }

    // Step 1: Start analysis and get basic info
    const analysisResponse = await analyzeUser([githubUrl]);

    if (!analysisResponse.success || !analysisResponse.data) {
      return {
        success: false,
        code: analysisResponse.code,
        message: analysisResponse.message,
        data: {
          data: { users: [] },
          status: "failed",
        } as AnalysisResult,
      };
    }

    const analysisId = analysisResponse.data.id;

    // Step 2: Show basic info immediately
    if (onBasicInfo && analysisResponse.data.users.length > 0) {
      onBasicInfo({
        id: analysisId,
        users: analysisResponse.data.users,
      });
    }

    if (onProgress) {
      onProgress("Basic info loaded, analyzing for AI insights...", 15);
    }

    // Step 3: Poll for AI results
    const result = await pollAnalysisResult(
      analysisId,
      15, // Increase max retries for AI analysis
      15000, // Increase interval to 15 seconds
      (attempt, data) => {
        if (onProgress) {
          const progress = Math.min(15 + (attempt * 5), 90);
          onProgress(`Waiting for AI analysis completion (${attempt}/15)...`, progress, data);
        }
      }
    );

    if (onProgress) {
      onProgress(
        result.success ? "Analysis completed!" : "Analysis failed",
        100,
        result.data
      );
    }

    return result;
  } catch (error) {
    console.error("Analysis workflow error:", error);
    return {
      success: false,
      code: "WORKFLOW_ERROR",
      message: error instanceof Error ? error.message : "Unknown workflow error",
      data: {
        data: { users: [] },
        status: "failed",
      } as AnalysisResult,
    };
  }
}