const IDEOGRAM_API_URL = 'https://api.ideogram.ai/v1/llm/generations';

export interface IdeogramResponse {
  data?: Array<{
    url: string;
    prompt: string;
    resolution: string;
    seed: number;
    is_image_safe: boolean;
  }>;
  error?: {
    code: number;
    message: string;
  };
}

export async function generateIdeogramImage(
  apiKey: string,
  prompt: string,
  options: {
    model?: string;
    aspectRatio?: string;
    style?: string;
    magicPrompt?: boolean;
    seed?: number;
  } = {}
): Promise<IdeogramResponse> {
  const {
    model = 'V_3',
    aspectRatio = 'ASPECT_16_9',
    style = 'AUTO',
    magicPrompt = true,
    seed,
  } = options;

  const body: Record<string, unknown> = {
    model,
    prompt,
    aspect_ratio: aspectRatio,
    style_type: style,
    magic_prompt_option: magicPrompt ? 'AUTO' : 'OFF',
  };

  if (seed !== undefined) {
    body.seed = seed;
  }

  const response = await fetch(IDEOGRAM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.message || `Ideogram API error: ${response.status}`);
  }

  return data as IdeogramResponse;
}

export function mapModelId(model: string): string {
  const map: Record<string, string> = {
    V3: 'V_3',
    V2: 'V_2',
    V2A: 'V_2A',
  };
  return map[model] || 'V_3';
}

export function mapAspectRatio(ratio: string): string {
  const map: Record<string, string> = {
    '16x9': 'ASPECT_16_9',
    '9x16': 'ASPECT_9_16',
    '1x1': 'ASPECT_1_1',
    '4x3': 'ASPECT_4_3',
    '3x4': 'ASPECT_3_4',
  };
  return map[ratio] || 'ASPECT_16_9';
}

export function mapStyleType(style: string): string {
  const map: Record<string, string> = {
    AUTO: 'AUTO',
    REALISTIC: 'REALISTIC',
    DESIGN: 'DESIGN',
    ANIME: 'ANIME',
    '3D': 'RENDER_3D',
  };
  return map[style] || 'AUTO';
}
