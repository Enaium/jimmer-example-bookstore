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

import { defineComponent, ref } from 'vue'
import { NButton, NInput, useMessage } from 'naive-ui'
import { useMutation } from '@tanstack/vue-query'
import { api } from '@/common/Api'
import { authStore } from '@/store/auth'
import ImageUpload from './ImageUpload'

interface CommentInputProps {
  entityId: string
  entityType: 'book' | 'author' | 'issuer'
  commentId?: string // For replies
  placeholder?: string
  buttonText?: string
  maxLength?: number
  rows?: number
  onSuccess?: () => void
  onCancel?: () => void
  showCancel?: boolean
}

const CommentInput = defineComponent(
  (props: CommentInputProps) => {
    const auth = authStore()
    const message = useMessage()
    const content = ref('')
    const images = ref<{ id: string }[]>([])

    // Submit comment/reply mutation
    const submitMutation = useMutation({
      mutationFn: (content: string) => {
        const body: any = {
          content,
          images: images.value
        }
        // Add the appropriate entity reference based on type
        switch (props.entityType) {
          case 'book':
            body.book = { id: props.entityId }
            break
          case 'author':
            body.author = { id: props.entityId }
            break
          case 'issuer':
            body.issuer = { id: props.entityId }
            break
        }
        // Add parent reference for replies
        if (props.commentId) {
          body.parent = { id: props.commentId }
        }
        return api.commentController.save({ body })
      },
      onSuccess: () => {
        content.value = ''
        images.value = []
        props.onSuccess?.()
      },
      onError: () => {
        message.error(props.commentId ? 'Failed to submit reply' : 'Failed to submit comment')
      }
    })

    const handleSubmit = () => {
      if (!content.value.trim()) {
        message.warning('Please enter some content')
        return
      }
      if (!auth.get) {
        message.warning('Please login to comment')
        return
      }
      submitMutation.mutate(content.value)
    }

    return () => (
      <div class="space-y-4">
        {/* Text Input */}
        <div class="flex space-x-3">
          <div class="flex-1">
            <NInput
              v-model:value={content.value}
              type="textarea"
              placeholder={props.placeholder || 'Write your comment...'}
              rows={props.rows || 3}
              maxlength={props.maxLength || 500}
              show-count
            />
          </div>
          <div class="flex items-end space-x-2">
            <NButton
              type="primary"
              size={props.commentId ? 'small' : 'medium'}
              onClick={handleSubmit}
              loading={submitMutation.isPending.value}
              disabled={!auth.get}
            >
              {props.buttonText || 'Submit'}
            </NButton>
            {props.showCancel && (
              <NButton size={props.commentId ? 'small' : 'medium'} onClick={props.onCancel}>
                Cancel
              </NButton>
            )}
          </div>
        </div>
        {/* Image Upload */}
        <div>
          <div class="text-sm font-medium text-gray-700 mb-2">Add Images (Optional)</div>
          <ImageUpload
            value={images.value}
            onChange={(newImages) => {
              images.value = newImages
            }}
          />
        </div>
        {!auth.get && <div class="text-sm text-gray-500">Please login to leave a comment</div>}
      </div>
    )
  },
  {
    props: [
      'entityId',
      'entityType',
      'commentId',
      'placeholder',
      'buttonText',
      'maxLength',
      'rows',
      'onSuccess',
      'onCancel',
      'showCancel'
    ]
  }
)

export default CommentInput
