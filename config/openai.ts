import OpenAI from 'openai'
import { Configuration, OpenAIApi } from 'openai-edge'

const configuration = {
  apiKey: process.env.OPENAI_API_KEY
}

export const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
})
