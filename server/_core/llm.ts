
export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
};

export type FileContent = {
  type: "file_url";
  file_url: {
    url: string;
    mime_type?: "audio/mpeg" | "audio/wav" | "application/pdf" | "audio/mp4" | "video/mp4";
  };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolChoicePrimitive = "none" | "auto" | "required";
export type ToolChoiceByName = { name: string };
export type ToolChoiceExplicit = {
  type: "function";
  function: {
    name: string;
  };
};
export type ToolChoice = ToolChoicePrimitive | ToolChoiceByName | ToolChoiceExplicit;

export type ResponseFormatText = {
  type: "text";
};

export type ResponseFormatJsonObject = {
  type: "json_object";
};

export type ResponseFormatJsonSchema = {
  type: "json_schema";
  json_schema: {
    name: string;
    description?: string;
    schema?: Record<string, unknown>;
    strict?: boolean;
  };
};

export type ResponseFormat = ResponseFormatText | ResponseFormatJsonObject | ResponseFormatJsonSchema;

export type InvokeOptions = {
  model?: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  maxTokens?: number;
  top_p?: number;
  topP?: number;
  frequency_penalty?: number;
  frequencyPenalty?: number;
  presence_penalty?: number;
  presencePenalty?: number;
  stop?: string | string[];
  tools?: Tool[];
  tool_choice?: ToolChoice;
  toolChoice?: ToolChoice;
  parallel_tool_calls?: boolean;
  parallelToolCalls?: boolean;
  response_format?: ResponseFormat;
  responseFormat?: ResponseFormat;
  output_schema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  stream?: boolean;
  user?: string;
  seed?: number;
  logprobs?: boolean;
  top_logprobs?: number;
  topLogprobs?: number;
  logit_bias?: Record<string, number>;
  logitBias?: Record<string, number>;
  n?: number;
};

export type InvokeResult = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string | null;
      tool_calls?: {
        id: string;
        type: string;
        function: {
          name: string;
          arguments: string;
        };
      }[];
    };
    finish_reason: string;
    logprobs?: {
      content: {
        token: string;
        logprob: number;
        bytes: number[] | null;
        top_logprobs: {
          token: string;
          logprob: number;
          bytes: number[] | null;
        }[];
      }[];
    } | null;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  system_fingerprint?: string;
};

const ENV = {
  forgeApiKey: process.env.OPENAI_API_KEY || "",
  forgeApiUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com",
  forgeApiModel: process.env.OPENAI_MODEL || "gpt-4.1-mini",
};

console.log("[ENV] OPENAI_API_KEY:", ENV.forgeApiKey ? ENV.forgeApiKey.substring(0, 12) + "..." : "NOT SET");
console.log("[ENV] OPENAI_BASE_URL:", ENV.forgeApiUrl || "NOT SET");
console.log("[ENV] OPENAI_MODEL:", ENV.forgeApiModel || "NOT SET");
console.log("[ENV] Final forgeApiKey:", ENV.forgeApiKey ? ENV.forgeApiKey.substring(0, 12) + "..." : "EMPTY");
console.log("[ENV] Final forgeApiUrl:", ENV.forgeApiUrl || "EMPTY (will use default)");

function resolveApiUrl(): string {
  const baseUrl = ENV.forgeApiUrl.replace(/\/$/, "");
  return `${baseUrl}/v1/chat/completions`;
}

function normalizeContent(content: MessageContent | MessageContent[]): string | MessageContent[] {
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content;
  }
  return [content];
}

function normalizeResponseFormat(options: {
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  outputSchema?: Record<string, unknown>;
  output_schema?: Record<string, unknown>;
}): ResponseFormat | undefined {
  const { responseFormat, response_format, outputSchema, output_schema } = options;

  if (responseFormat) return responseFormat;
  if (response_format) return response_format;

  const schema = outputSchema || output_schema;
  if (schema) {
    return {
      type: "json_schema",
      json_schema: {
        name: "output",
        schema,
        strict: true,
      },
    };
  }

  return undefined;
}

export async function invokeLLM(options: InvokeOptions): Promise<InvokeResult> {
  const {
    model = ENV.forgeApiModel,
    messages,
    temperature,
    max_tokens,
    maxTokens,
    top_p,
    topP,
    frequency_penalty,
    frequencyPenalty,
    presence_penalty,
    presencePenalty,
    stop,
    tools,
    tool_choice,
    toolChoice,
    parallel_tool_calls,
    parallelToolCalls,
    response_format,
    responseFormat,
    output_schema,
    outputSchema,
    stream = false,
    user,
    seed,
    logprobs,
    top_logprobs,
    topLogprobs,
    logit_bias,
    logitBias,
    n,
  } = options;

  console.log("[LLM] API Key found:", ENV.forgeApiKey ? ENV.forgeApiKey.substring(0, 12) + "..." : "MISSING");

  if (!ENV.forgeApiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const normalizedMessages = messages.map((msg) => ({
    ...msg,
    content: normalizeContent(msg.content),
  }));

  const payload: Record<string, unknown> = {
    model,
    messages: normalizedMessages,
    stream,
  };

  if (temperature !== undefined) payload.temperature = temperature;
  if (max_tokens !== undefined) payload.max_tokens = max_tokens;
  if (maxTokens !== undefined) payload.max_tokens = maxTokens;
  if (top_p !== undefined) payload.top_p = top_p;
  if (topP !== undefined) payload.top_p = topP;
  if (frequency_penalty !== undefined) payload.frequency_penalty = frequency_penalty;
  if (frequencyPenalty !== undefined) payload.frequency_penalty = frequencyPenalty;
  if (presence_penalty !== undefined) payload.presence_penalty = presence_penalty;
  if (presencePenalty !== undefined) payload.presence_penalty = presencePenalty;
  if (stop !== undefined) payload.stop = stop;
  if (tools !== undefined) payload.tools = tools;
  if (tool_choice !== undefined) payload.tool_choice = tool_choice;
  if (toolChoice !== undefined) payload.tool_choice = toolChoice;
  if (parallel_tool_calls !== undefined) payload.parallel_tool_calls = parallel_tool_calls;
  if (parallelToolCalls !== undefined) payload.parallel_tool_calls = parallelToolCalls;
  if (user !== undefined) payload.user = user;
  if (seed !== undefined) payload.seed = seed;
  if (logprobs !== undefined) payload.logprobs = logprobs;
  if (top_logprobs !== undefined) payload.top_logprobs = top_logprobs;
  if (topLogprobs !== undefined) payload.top_logprobs = topLogprobs;
  if (logit_bias !== undefined) payload.logit_bias = logit_bias;
  if (logitBias !== undefined) payload.logit_bias = logitBias;
  if (n !== undefined) payload.n = n;

  // 移除thinking参数,DeepSeek不支持
  // payload.thinking = { budget_tokens: 128 };

  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema,
  });

  if (normalizedResponseFormat) {
    // DeepSeek 只支持 json_object 格式
    if (normalizedResponseFormat.type === "json_schema") {
      payload.response_format = { type: "json_object" };
    } else {
      payload.response_format = normalizedResponseFormat;
    }
  }

  const apiUrl = resolveApiUrl();
  console.log("[LLM] Calling API:", apiUrl);
  console.log("[LLM] Model:", model);
  console.log("[LLM] Payload:", JSON.stringify(payload, null, 2).substring(0, 500));

  // 使用AbortController实现60秒超时
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("[LLM] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[LLM] Error response:", errorText);
      throw new Error(`LLM invoke failed: ${response.status} ${response.statusText} – ${errorText}`);
    }

    const result = await response.json();
    console.log("[LLM] Success! Response:", JSON.stringify(result).substring(0, 200));
    
    return result as InvokeResult;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("[LLM] Fetch error:", error);
    throw error;
  }
}
