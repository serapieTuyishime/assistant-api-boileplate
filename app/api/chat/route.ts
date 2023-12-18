import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'

import { nanoid } from '@/lib/utils'
import { Configuration, OpenAIApi } from 'openai-edge'

export async function POST(req: Request) {
  console.log('this is the request', req)
}
