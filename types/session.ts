export interface Session {
  expiresAt: string; // ISO timestamp
}

export interface SessionValidationResult {
  valid: boolean;
  expiresAt?: string;
}
