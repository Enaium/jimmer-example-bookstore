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

import { computed, defineComponent, ref, watch } from 'vue'
import { NDivider, NEmpty, NPagination, NSpin, useMessage } from 'naive-ui'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { api } from '@/common/Api'
import type { RequestOf } from '@/__generated'
import { authStore } from '@/store/auth'
import CommentItem from '@/view/common/CommentItem'
import CommentInput from '@/view/common/CommentInput'

const CommentArea = defineComponent(
  (props: { entityId: string; entityType: 'book' | 'author' | 'issuer'; entityName: string }) => {
    const queryClient = useQueryClient()
    const auth = authStore()
    const message = useMessage()

    const currentPage = ref(1)
    const pageSize = 10

    // Comment query options
    const commentOptions = computed<RequestOf<typeof api.commentController.getComments>>(() => {
      const options: any = {
        index: currentPage.value - 1,
        size: pageSize
      }

      // Add the appropriate entity filter based on type
      switch (props.entityType) {
        case 'book':
          options.bookId = props.entityId
          break
        case 'author':
          options.authorId = props.entityId
          break
        case 'issuer':
          options.issuerId = props.entityId
          break
      }

      return options
    })

    // Fetch main comments
    const {
      data: commentsData,
      isPending: isCommentsLoading,
      refetch: refetchComments
    } = useQuery({
      queryKey: computed(() => ['comments', props.entityType, props.entityId, commentOptions.value]),
      queryFn: () => api.commentController.getComments(commentOptions.value),
      enabled: !!props.entityId
    })

    // Watch for changes and refetch
    watch([currentPage, () => props.entityId], () => {
      refetchComments()
    })

    const comments = computed(() => commentsData.value?.rows || [])
    const totalComments = computed(() => commentsData.value?.totalRowCount || 0)

    const handleCommentSubmitted = () => {
      refetchComments()
      queryClient.invalidateQueries({ queryKey: ['comments', props.entityType, props.entityId] })
    }

    const handleReplySubmitted = () => {
      refetchComments()
      queryClient.invalidateQueries({ queryKey: ['comments', props.entityType, props.entityId] })
    }

    return () => (
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-6">Comments about {props.entityName}</h2>

        {/* Comment Input */}
        <div class="mb-6">
          <CommentInput
            entityId={props.entityId}
            entityType={props.entityType}
            placeholder="Write your comment..."
            buttonText="Submit"
            maxLength={500}
            rows={3}
            onSuccess={handleCommentSubmitted}
          />
        </div>

        <NDivider />

        {/* Comments List */}
        <div class="space-y-4">
          {isCommentsLoading.value ? (
            <div class="flex justify-center py-8">
              <NSpin size="medium" />
            </div>
          ) : comments.value.length === 0 ? (
            <NEmpty description="No comments yet" />
          ) : (
            <>
              {comments.value.map((comment: any) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  entityType={props.entityType}
                  entityId={props.entityId}
                  onReplySubmitted={handleReplySubmitted}
                />
              ))}

              {/* Pagination for comments */}
              {Math.ceil(totalComments.value / pageSize) > 1 && (
                <div class="flex justify-center mt-6">
                  <NPagination
                    v-model:page={currentPage.value}
                    page-size={pageSize}
                    item-count={totalComments.value}
                    show-size-picker={false}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  },
  {
    props: ['entityId', 'entityType', 'entityName']
  }
)

export default CommentArea 