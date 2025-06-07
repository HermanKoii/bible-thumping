import { describe, it, expect } from 'vitest';
import { ConversationOrchestrator } from '../src/services/conversation-orchestrator';
import { PersonalityProfile } from '../src/services/personality-data-manager';

describe('ConversationOrchestrator', () => {
  const mockAgents: PersonalityProfile[] = [
    {
      id: 'jesus',
      name: 'Jesus of Nazareth',
      tone: 'Compassionate',
      samplePrompts: ['Love thy neighbor']
    },
    {
      id: 'peter',
      name: 'Peter the Apostle',
      tone: 'Zealous',
      samplePrompts: ['Follow me']
    }
  ];

  it('should initialize a new session when handling a message', async () => {
    const orchestrator = new ConversationOrchestrator();
    const responses = await orchestrator.handleMessage(
      'session1', 
      'Hello disciples', 
      mockAgents
    );

    expect(responses.length).toBe(2);
    expect(responses[0].agentId).toBe('jesus');
    expect(responses[1].agentId).toBe('peter');
  });
});