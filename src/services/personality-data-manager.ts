// Personality Data Manager
export interface PersonalityProfile {
  id: string;
  name: string;
  tone: string;
  samplePrompts: string[];
}

export class PersonalityDataManager {
  private profiles: Map<string, PersonalityProfile> = new Map();

  loadProfile(id: string): PersonalityProfile | null {
    return this.profiles.get(id) || null;
  }

  validateProfile(profile: PersonalityProfile): boolean {
    return !!(profile.id && profile.name && profile.tone && profile.samplePrompts.length);
  }

  saveProfile(profile: PersonalityProfile): void {
    if (this.validateProfile(profile)) {
      this.profiles.set(profile.id, profile);
    } else {
      throw new Error('Invalid profile schema');
    }
  }
}