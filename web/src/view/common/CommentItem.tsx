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

import { computed, defineComponent, ref } from 'vue'
import { NAvatar, NButton, NImage, NInput, NSpin, useMessage } from 'naive-ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { api, BASE_URL } from '@/common/Api'
import { authStore } from '@/store/auth'
import VoteButton from '@/view/common/VoteButton'
import ImageUpload from './ImageUpload'

const CommentItem = defineComponent(
  (props: {
    comment: any
    level?: number
    entityType: 'book' | 'author' | 'issuer'
    entityId: string
    onReplySubmitted: () => void
  }) => {
    const queryClient = useQueryClient()
    const auth = authStore()
    const message = useMessage()

    const showReplies = ref(false)
    const showReplyForm = ref(false)
    const replyContent = ref('')
    const replyImages = ref<{ id: string }[]>([])

    // Computed property for query enabled condition
    const shouldFetchReplies = computed(() => showReplies.value && props.comment.commentCount > 0)

    // Fetch replies for this comment
    const { data: repliesData, isPending: isRepliesLoading } = useQuery({
      queryKey: ['comments', 'replies', props.comment.id],
      queryFn: () =>
        api.commentController.getComments({
          index: 0,
          size: 10,
          parentId: props.comment.id
        }),
      enabled: shouldFetchReplies
    })

    // Submit reply mutation
    const submitReplyMutation = useMutation({
      mutationFn: (content: string) => {
        const body: any = {
          content,
          images: replyImages.value,
          parent: { id: props.comment.id }
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

        return api.commentController.save({ body })
      },
      onSuccess: () => {
        replyContent.value = ''
        replyImages.value = []
        showReplyForm.value = false
        props.onReplySubmitted()
      },
      onError: () => {
        message.error('Failed to submit reply')
      }
    })

    const handleSubmitReply = () => {
      if (!replyContent.value.trim()) {
        message.warning('Please enter a reply')
        return
      }
      if (!auth.get) {
        message.warning('Please login to reply')
        return
      }
      submitReplyMutation.mutate(replyContent.value)
    }

    const loadReplies = () => {
      if (showReplies.value) {
        // If already showing replies, hide them
        showReplies.value = false
      } else {
        // If not showing replies, show them and trigger query
        showReplies.value = true
        // Invalidate the query to ensure fresh data
        queryClient.invalidateQueries({ queryKey: ['comments', 'replies', props.comment.id] })
      }
    }

    const toggleReplyForm = () => {
      showReplyForm.value = !showReplyForm.value
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString()
    }

    return () => (
      <div
        class={`border-b border-gray-200 pb-4 last:border-b-0 ${props.level && props.level > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}
      >
        <div class="flex items-start space-x-3">
          <NAvatar round size="medium">
            {props.comment.account?.username?.charAt(0)}
          </NAvatar>
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <span class="font-medium text-gray-900">
                {props.comment.account?.username || 'Anonymous'}
              </span>
              <span class="text-sm text-gray-500">
                {formatDate(props.comment.createdTime || new Date().toISOString())}
              </span>
            </div>
            <p class="text-gray-700 whitespace-pre-wrap">{props.comment.content}</p>

            {/* Comment Images */}
            {props.comment.images && props.comment.images.length > 0 && (
              <div class="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                {props.comment.images.map((image: any) => (
                  <NImage
                    key={image.id}
                    src={`${BASE_URL}/images/${image.id}`}
                    width="100"
                    height="100"
                    object-fit="cover"
                    fallback-src="/public/favicon.ico"
                    class="rounded"
                  />
                ))}
              </div>
            )}

            {/* Reply Actions */}
            <div class="mt-3 flex items-center space-x-4">
              <VoteButton commentId={props.comment.id} count={props.comment.voteCount} />
              <NButton size="small" type="primary" ghost onClick={toggleReplyForm}>
                Reply
              </NButton>

              {props.comment.commentCount > 0 && (
                <NButton size="small" type="info" ghost onClick={loadReplies}>
                  {showReplies.value
                    ? 'Hide replies'
                    : `Show ${props.comment.commentCount} replies`}
                </NButton>
              )}
            </div>

            {/* Reply Form */}
            {showReplyForm.value && (
              <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                <div class="space-y-4">
                  <div class="flex space-x-3">
                    <div class="flex-1">
                      <NInput
                        v-model:value={replyContent.value}
                        type="textarea"
                        placeholder="Write your reply..."
                        rows={2}
                        maxlength={300}
                        show-count
                      />
                    </div>
                    <div class="flex items-end space-x-2">
                      <NButton
                        type="primary"
                        size="small"
                        onClick={handleSubmitReply}
                        loading={submitReplyMutation.isPending.value}
                        disabled={!auth.get}
                      >
                        Reply
                      </NButton>
                      <NButton size="small" onClick={toggleReplyForm}>
                        Cancel
                      </NButton>
                    </div>
                  </div>

                  {/* Reply Image Upload */}
                  <div>
                    <div class="text-sm font-medium text-gray-700 mb-2">Add Images (Optional)</div>
                    <ImageUpload
                      value={replyImages.value}
                      onChange={(newImages: { id: string }[]) => {
                        replyImages.value = newImages
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Replies */}
            {showReplies.value && (
              <div class="mt-4">
                {isRepliesLoading.value ? (
                  <div class="flex justify-center py-4">
                    <NSpin size="small" />
                  </div>
                ) : repliesData.value?.rows && repliesData.value.rows.length > 0 ? (
                  <div class="space-y-4">
                    {repliesData.value.rows.map((reply: any) => (
                      <CommentItem
                        key={reply.id}
                        comment={reply}
                        level={(props.level || 0) + 1}
                        entityType={props.entityType}
                        entityId={props.entityId}
                        onReplySubmitted={props.onReplySubmitted}
                      />
                    ))}
                  </div>
                ) : (
                  <div class="text-sm text-gray-500 py-2">No replies yet</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  },
  {
    props: ['comment', 'level', 'entityType', 'entityId', 'onReplySubmitted']
  }
)

export default CommentItem
