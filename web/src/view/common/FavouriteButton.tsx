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
import { Heart24Filled, Heart24Regular } from '@vicons/fluent'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { authStore } from '@/store/auth'
import { api } from '@/common/Api'

const FavouriteButton = defineComponent(
  (props: { issuerId?: string; authorId?: string; bookId?: string; count?: number }) => {
    const auth = authStore()
    const message = useMessage()
    const queryClient = useQueryClient()
    const voted = ref(false)
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
      return {}
    })

    const input = computed(() => {
      if (props.issuerId) return { issuer: { id: props.issuerId } }
      if (props.authorId) return { author: { id: props.authorId } }
      if (props.bookId) return { book: { id: props.bookId } }
      return {}
    })

    const {
      data: favourite,
      isLoading: isStateLoading,
      refetch
    } = useQuery({
      queryKey: ['favourite', params.value, auth.get?.id],
      queryFn: () => api.favouriteController.state(params.value),
      enabled: computed(() => !!auth.get && !!(props.issuerId || props.authorId || props.bookId))
    })

    // Watch for favourite state changes
    watch(
      favourite,
      (val) => {
        voted.value = !!val?.id
      },
      { immediate: true }
    )

    const addFavouriteMutation = useMutation({
      mutationFn: () => api.favouriteController.save({ body: input.value }),
      onSuccess: () => {
        voted.value = true
        localCount.value += 1
        refetch()
        message.success('Added to favourites')
        queryClient.invalidateQueries({ queryKey: ['favourite', params.value] })
      },
      onError: () => {
        message.error('Failed to add to favourites')
      }
    })

    const removeFavouriteMutation = useMutation({
      mutationFn: () => {
        if (!favourite.value?.id) return Promise.resolve()
        return api.favouriteController.delete({ id: favourite.value.id })
      },
      onSuccess: () => {
        voted.value = false
        localCount.value = Math.max(0, localCount.value - 1)
        refetch()
        message.success('Removed from favourites')
        queryClient.invalidateQueries({ queryKey: ['favourite', params.value] })
      },
      onError: () => {
        message.error('Failed to remove from favourites')
      }
    })

    const handleClick = () => {
      if (!auth.get) {
        message.warning('Please login first')
        return
      }
      if (voted.value) {
        removeFavouriteMutation.mutate()
      } else {
        addFavouriteMutation.mutate()
      }
    }

    return () => (
      <NButton
        size="small"
        type={voted.value ? 'error' : 'default'}
        ghost={!voted.value}
        loading={
          addFavouriteMutation.isPending.value ||
          removeFavouriteMutation.isPending.value ||
          isStateLoading.value
        }
        onClick={handleClick}
        secondary
        strong
        class="flex items-center justify-center"
        renderIcon={() => (
          <NIcon class="mr-1">{voted.value ? <Heart24Filled /> : <Heart24Regular />}</NIcon>
        )}
      >
        {localCount.value > 0 && (
          <span class="ml-1 text-xs text-gray-500">({localCount.value})</span>
        )}
      </NButton>
    )
  },
  {
    props: ['issuerId', 'authorId', 'bookId', 'count']
  }
)

export default FavouriteButton
