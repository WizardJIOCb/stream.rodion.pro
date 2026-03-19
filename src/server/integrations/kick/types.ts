export interface KickChannelData {
  slug: string;
  user: { username: string };
  livestream: {
    is_live: boolean;
    session_title: string;
    categories: Array<{ name: string }>;
    viewer_count: number;
    created_at: string;
  } | null;
}

export interface KickReward {
  id: string;
  title: string;
  description: string;
  cost: number;
  background_color: string;
  is_enabled: boolean;
  is_paused: boolean;
  is_user_input_required: boolean;
  should_skip_request_queue: boolean;
}
