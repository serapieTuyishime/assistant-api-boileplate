import OpenAI from 'openai'
import { Configuration, OpenAIApi } from 'openai-edge'

const configuration = {
  apiKey: process.env.OPENAI_API_KEY
}
export const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
})
