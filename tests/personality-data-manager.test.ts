import { describe, it, expect } from 'vitest';
import { PersonalityDataManager } from '../src/services/personality-data-manager';

describe('PersonalityDataManager', () => {
  const validProfile = {
    id: 'jesus',
    name: 'Jesus of Nazareth',
    tone: 'Compassionate',
    samplePrompts: ['Love thy neighbor', 'Forgiveness is key']
  };

  it('should validate a correct profile', () => {
    const manager = new PersonalityDataManager();
    expect(manager.validateProfile(validProfile)).toBe(true);
  });

  it('should fail to validate an incomplete profile', () => {
    const manager = new PersonalityDataManager();
    const invalidProfile = { ...validProfile, name: '' };
    expect(() => manager.saveProfile(invalidProfile)).toThrow('Invalid profile schema');
  });

  it('should save and load a valid profile', () => {
    const manager = new PersonalityDataManager();
    manager.saveProfile(validProfile);
    const loadedProfile = manager.loadProfile('jesus');
    expect(loadedProfile).toEqual(validProfile);
  });
});