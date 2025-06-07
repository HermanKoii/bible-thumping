// Conversation Orchestrator
import { PersonalityProfile } from './personality-data-manager';
import { ChatbotEngineAdapter, ChatbotResponse } from './chatbot-engine-adapter';

export interface ConversationSession {
  id: string;
  agents: PersonalityProfile[];
  history: string[];
}

export class ConversationOrchestrator {
  private sessions: Map<string, ConversationSession> = new Map();
  private chatbotAdapter: ChatbotEngineAdapter;

  constructor() {
    this.chatbotAdapter = new ChatbotEngineAdapter();
  }

  async handleMessage(
    sessionId: string, 
    userMessage: string, 
    selectedAgents: PersonalityProfile[]
  ): Promise<ChatbotResponse[]> {
    // Ensure session exists
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        id: sessionId,
        agents: selectedAgents,
        history: []
      });
    }

    const session = this.sessions.get(sessionId)!;
    session.history.push(userMessage);

    // Generate responses from selected agents
    const responses = await Promise.all(
      session.agents.map(agent => 
        this.chatbotAdapter.generateResponse(agent, session.history)
      )
    );

    // Update session history
    responses.forEach(response => {
      session.history.push(response.response);
    });

    return responses;
  }
}