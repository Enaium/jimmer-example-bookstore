/*
 * Copyright (c) 2025 Enaium
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Api } from '@/__generated'
import { authStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'

export const BASE_URL = 'http://localhost:8080'

export const api = new Api(async ({ uri, method, body }) => {
  const session = authStore()
  const router = useRouter()
  const message = useMessage()

  const isFormData = body instanceof FormData

  const response = await fetch(`${BASE_URL}${uri}`, {
    method,
    body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(session.get ? { Authorization: `Bearer ${session.get.token}` } : {})
    }
  })

  if (response.status === 401) {
    session.set(undefined)
    await router.push('/login')
    return
  }

  if (response.status === 403) {
    message.error('You are not authorized to access this resource')
    await router.push('/')
    return
  }

  if (response.status === 400) {
    throw 'Input error'
  }

  if (!response.ok) {
    throw JSON.parse(await response.text())
  }

  const text = await response.text()

  if (text.length === 0) {
    return undefined
  }

  return JSON.parse(text)
})
