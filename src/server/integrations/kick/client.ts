import type { KickChannelData, KickReward } from './types.js';

/**
 * Stub Kick API client — ready for real implementation in Phase 3+.
 * All methods return null/empty for now.
 */
export class KickClient {
  private clientId: string;
  private clientSecret: string;

  constructor(clientId?: string, clientSecret?: string) {
    this.clientId = clientId || '';
    this.clientSecret = clientSecret || '';
  }

  async getChannel(_slug: string): Promise<KickChannelData | null> {
    // TODO: implement with real Kick API
    return null;
  }

  async getChannelRewards(_channelSlug: string): Promise<KickReward[]> {
    // TODO: implement with real Kick API
    return [];
  }

  async getLivestreamStatus(_slug: string): Promise<{ isLive: boolean; title: string; category: string; viewers: number } | null> {
    // TODO: implement with real Kick API
    return null;
  }
}
