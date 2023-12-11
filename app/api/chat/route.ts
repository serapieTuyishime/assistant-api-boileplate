import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'

import { nanoid } from '@/lib/utils'
import { Configuration, OpenAIApi } from 'openai-edge'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  console.log('this is the request', req)
}
