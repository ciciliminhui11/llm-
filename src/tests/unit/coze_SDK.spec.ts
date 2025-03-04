import { describe, it, expect, vi } from 'vitest'
import { Chat } from '@/service/coze_SDK'

describe('Chat SDK', () => {
  it('should handle stream response', async () => {
    const mockClient = {
      chat: {
        stream: vi.fn().mockImplementation(() => async function* () {
          yield { event: 'conversation.message.delta', data: { content: 'Hello' } }
        })
      }
    }

    // @ts-ignore
    Chat.prototype.client = mockClient
    
    const chat = new Chat()
    const onDataUpdate = vi.fn()
    
    await chat.create_chat(undefined, 'test-bot', [], onDataUpdate)
    
    expect(onDataUpdate).toHaveBeenCalled()
    expect(mockClient.chat.stream).toHaveBeenCalled()
  })
})