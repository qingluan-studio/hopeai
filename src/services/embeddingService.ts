export type EmbeddingProvider = 'api' | 'local';

export interface EmbeddingConfig {
  provider: EmbeddingProvider;
  apiKey?: string;
  apiBase?: string;
  model?: string;
  dimensions?: number;
}

const DEFAULT_CONFIG: EmbeddingConfig = {
  provider: 'api',
  apiBase: 'https://api.moonshot.cn/v1',
  model: 'embedding-v1',
  dimensions: 1536,
};

const STORAGE_KEY = 'hopeai_embedding_config';

export class EmbeddingService {
  private config: EmbeddingConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): EmbeddingConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch {}
    return { ...DEFAULT_CONFIG };
  }

  saveConfig(config: Partial<EmbeddingConfig>): void {
    this.config = { ...this.config, ...config };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch {}
  }

  getConfig(): EmbeddingConfig {
    return { ...this.config };
  }

  async embed(text: string): Promise<number[]> {
    return this.embedViaAPI(text);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return this.embedBatchViaAPI(texts);
  }

  private async embedViaAPI(text: string): Promise<number[]> {
    if (!this.config.apiKey) {
      throw new Error('请先配置 Embedding API Key');
    }

    const base = this.config.apiBase?.replace(/\/$/, '') || DEFAULT_CONFIG.apiBase;
    const model = this.config.model || DEFAULT_CONFIG.model;

    const response = await fetch(`${base}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: text,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Embedding API 错误 (${response.status}): ${err}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  }

  private async embedBatchViaAPI(texts: string[]): Promise<number[][]> {
    if (!this.config.apiKey) {
      throw new Error('请先配置 Embedding API Key');
    }

    const base = this.config.apiBase?.replace(/\/$/, '') || DEFAULT_CONFIG.apiBase;
    const model = this.config.model || DEFAULT_CONFIG.model;

    const batchSize = 20;
    const allResults: number[][] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const response = await fetch(`${base}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          input: batch,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Embedding API 错误 (${response.status}): ${err}`);
      }

      const data = await response.json();
      const embeddings = data.data
        .sort((a: any, b: any) => a.index - b.index)
        .map((item: any) => item.embedding);
      allResults.push(...embeddings);
    }

    return allResults;
  }

  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    if (normA === 0 || normB === 0) return 0;
    return dot / (normA * normB);
  }
}

export const embeddingService = new EmbeddingService();
