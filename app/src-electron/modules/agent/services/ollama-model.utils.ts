export interface OllamaListedModel {
  name: string;
  premium: boolean;
}

export interface OllamaTagModel {
  name: string;
  size?: number;
  remote_host?: string;
  remote_model?: string;
  premium?: boolean;
  required_plan?: string;
}

interface OllamaModelRecommendation {
  model: string;
  required_plan?: string;
}

const CLOUD_HOST = 'https://ollama.com';

export function normalizeCloudModelName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/:cloud$/, '')
    .replace(/-cloud$/, '');
}

export function isPremiumRequiredPlan(requiredPlan?: string | null): boolean {
  const plan = requiredPlan?.trim().toLowerCase();
  return Boolean(plan) && plan !== 'free';
}

export function toListedOllamaModel(
  model: OllamaTagModel,
  allCloud: boolean,
  requiredPlans: Map<string, string> = new Map(),
): OllamaListedModel {
  const isCloud =
    allCloud ||
    model.name.endsWith('-cloud') ||
    Boolean(model.remote_host || model.remote_model);

  if (!isCloud) {
    return { name: model.name, premium: false };
  }

  return {
    name: model.name,
    premium: isPremiumCloudModel(model, requiredPlans),
  };
}

export async function fetchCloudRequiredPlans(
  headers: Record<string, string> = {},
): Promise<Map<string, string>> {
  try {
    const response = await fetch(`${CLOUD_HOST}/api/experimental/model-recommendations`, {
      headers: { Accept: 'application/json', ...headers },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return new Map();
    }

    const data = (await response.json()) as {
      recommendations?: OllamaModelRecommendation[];
    };

    return requiredPlansFromRecommendations(data.recommendations ?? []);
  } catch {
    return new Map();
  }
}

export function requiredPlansFromRecommendations(
  recommendations: OllamaModelRecommendation[],
): Map<string, string> {
  const plans = new Map<string, string>();

  for (const recommendation of recommendations) {
    const name = recommendation.model?.trim();
    if (!name) continue;

    const plan = recommendation.required_plan?.trim() ?? '';
    plans.set(name.toLowerCase(), plan);
    plans.set(normalizeCloudModelName(name), plan);
  }

  return plans;
}

function isPremiumCloudModel(
  model: OllamaTagModel,
  requiredPlans: Map<string, string>,
): boolean {
  if (model.premium === true) return true;
  if (isPremiumRequiredPlan(model.required_plan)) return true;

  return isPremiumRequiredPlan(
    requiredPlans.get(model.name.toLowerCase()) ??
      requiredPlans.get(normalizeCloudModelName(model.name)),
  );
}
