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
import { NButton, NIcon, useMessage } from 'naive-ui'
import { ThumbLike24Filled, ThumbLike24Regular } from '@vicons/fluent'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { api } from '@/common/Api'
import { authStore } from '@/store/auth'

const VoteButton = defineComponent(
  (props: {
    issuerId?: string
    authorId?: string
    bookId?: string
    commentId?: string
    count?: number
    onVoted?: (voted: boolean) => void
  }) => {
    const auth = authStore()
    const message = useMessage()
    const queryClient = useQueryClient()
    const voted = ref(false)
    const loading = ref(false)
    const localCount = ref(props.count || 0)

    // Update local count when prop changes
    watch(
      () => props.count,
      (newCount) => {
        localCount.value = newCount || 0
      }
    )

    const params = computed(() => {
      if (props.issuerId) return { issuerId: props.issuerId }
      if (props.authorId) return { authorId: props.authorId }
      if (props.bookId) return { bookId: props.bookId }
      if (props.commentId) return { commentId: props.commentId }
      return {}
    })

    const entityType = computed(() => {
      if (props.issuerId) return 'issuer'
      if (props.authorId) return 'author'
      if (props.bookId) return 'book'
      if (props.commentId) return 'comment'
      return ''
    })

    const entityId = computed(() => {
      return props.issuerId || props.authorId || props.bookId || props.commentId || ''
    })

    // Query for current vote state
    const { data: voteState, refetch } = useQuery({
      queryKey: ['vote', entityType.value, entityId.value, auth.get?.id],
      queryFn: () => {
        return api.voteController.state(params.value)
      },
      enabled: !!auth.get && !!entityId.value
    })

    watch(
      voteState,
      (val) => {
        voted.value = !!val?.id
      },
      { immediate: true }
    )

    // Add vote
    const addVoteMutation = useMutation({
      mutationFn: () => {
        const body: any = {}
        switch (entityType.value) {
          case 'book':
            body.book = { id: entityId.value }
            break
          case 'author':
            body.author = { id: entityId.value }
            break
          case 'issuer':
            body.issuer = { id: entityId.value }
            break
          case 'comment':
            body.comment = { id: entityId.value }
            break
        }
        return api.voteController.save({ body })
      },
      onSuccess: () => {
        voted.value = true
        localCount.value += 1
        refetch()
        props.onVoted && props.onVoted(true)
        queryClient.invalidateQueries({ queryKey: ['vote', entityType.value, entityId.value] })
      },
      onError: () => {
        message.error('Failed to like')
      }
    })

    // Remove vote
    const removeVoteMutation = useMutation({
      mutationFn: () => {
        if (!voteState.value?.id) return Promise.resolve()
        return api.voteController.delete({ id: voteState.value.id })
      },
      onSuccess: () => {
        voted.value = false
        localCount.value = Math.max(0, localCount.value - 1)
        refetch()
        props.onVoted && props.onVoted(false)
        queryClient.invalidateQueries({ queryKey: ['vote', entityType.value, entityId.value] })
      },
      onError: () => {
        message.error('Failed to unlike')
      }
    })

    const handleClick = () => {
      if (!auth.get) {
        message.warning('Please login to like')
        return
      }
      loading.value = true
      if (voted.value) {
        removeVoteMutation.mutate()
      } else {
        addVoteMutation.mutate()
      }
      loading.value = false
    }

    return () => (
      <NButton
        size="small"
        type={voted.value ? 'primary' : 'default'}
        ghost={!voted.value}
        loading={addVoteMutation.isPending.value || removeVoteMutation.isPending.value}
        onClick={handleClick}
        secondary
        strong
        class="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100"
        renderIcon={() => (
          <NIcon class="mr-1">{voted.value ? <ThumbLike24Filled /> : <ThumbLike24Regular />}</NIcon>
        )}
      >
        {localCount.value > 0 && (
          <span class="ml-1 text-xs text-gray-500">({localCount.value})</span>
        )}
      </NButton>
    )
  },
  {
    props: ['issuerId', 'authorId', 'bookId', 'commentId', 'count', 'onVoted']
  }
)

export default VoteButton
