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
import { NButton, NCard, NEmpty, NList, NListItem, NPagination, NSpin } from 'naive-ui'
import { useQuery } from '@tanstack/vue-query'
import { api } from '@/common/Api'
import { authStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import type { RequestOf } from '@/__generated'
import type { VoteView } from '@/__generated/model/static'

const VotedItems = defineComponent(() => {
  const auth = authStore()
  const router = useRouter()
  const currentType = ref<'ISSUER' | 'BOOK' | 'AUTHOR' | 'COMMENT'>('ISSUER')
  const page = ref(1)
  const PAGE_SIZE = 10

  const options = ref<RequestOf<typeof api.voteController.getVotes>>({
    index: page.value - 1,
    size: PAGE_SIZE,
    type: currentType.value
  })

  const {
    data: votedData,
    isLoading: isVotedLoading,
    refetch
  } = useQuery({
    queryKey: computed(() => ['user-voted', options.value]),
    queryFn: () => api.voteController.getVotes(options.value),
    enabled: !!auth.get
  })

  const votedItems = computed(() => votedData.value?.rows || [])
  const totalItems = computed(() => votedData.value?.totalRowCount || 0)
  const totalPages = computed(() => Math.ceil(totalItems.value / PAGE_SIZE))

  const navigateToDetail = (type: string, id: string) => {
    switch (type) {
      case 'book':
        router.push(`/book/${id}`)
        break
      case 'author':
        router.push(`/author/${id}`)
        break
      case 'issuer':
        router.push(`/issuer/${id}`)
        break
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const renderVotedItem = (item: VoteView) => {
    const entity = item.book || item.author || item.issuer || item.comment
    const entityType = item.book
      ? 'book'
      : item.author
        ? 'author'
        : item.issuer
          ? 'issuer'
          : 'comment'

    return (
      <NListItem key={item.id} class="border-b border-gray-100 last:border-b-0">
        <div class="flex items-center space-x-4 p-4">
          <div class="flex-1">
            {item.book && <h3 class="font-medium text-gray-900">{item.book.name}</h3>}
            {item.author && (
              <h3 class="font-medium text-gray-900">
                {item.author.firstName} {item.author.lastName}
              </h3>
            )}
            {item.issuer && <h3 class="font-medium text-gray-900">{item.issuer.name}</h3>}
            {item.comment && <h3 class="font-medium text-gray-900">{item.comment.account.username}</h3>}
            <p class="text-sm text-gray-500">
              {entityType.charAt(0).toUpperCase() + entityType.slice(1)} • Voted on{' '}
              {formatDate(item.createdTime)}
            </p>
          </div>
          {entityType !== 'comment' && (
            <NButton
              size="small"
              type="primary"
              ghost
              onClick={() => navigateToDetail(entityType, entity!.id)}
            >
              View
            </NButton>
          )}
        </div>
      </NListItem>
    )
  }

  const switchType = (type: 'ISSUER' | 'BOOK' | 'AUTHOR' | 'COMMENT') => {
    currentType.value = type
    page.value = 1
    options.value = { index: page.value - 1, size: PAGE_SIZE, type }
  }

  const handlePageChange = (newPage: number) => {
    page.value = newPage
    options.value = { index: page.value - 1, size: PAGE_SIZE, type: currentType.value }
  }

  return () => (
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">My Voted Items</h1>

      {/* Type Selector */}
      <div class="mb-6 flex space-x-2">
        <NButton
          size="small"
          type={currentType.value === 'ISSUER' ? 'primary' : 'default'}
          onClick={() => switchType('ISSUER')}
        >
          Issuers
        </NButton>
        <NButton
          size="small"
          type={currentType.value === 'BOOK' ? 'primary' : 'default'}
          onClick={() => switchType('BOOK')}
        >
          Books
        </NButton>
        <NButton
          size="small"
          type={currentType.value === 'AUTHOR' ? 'primary' : 'default'}
          onClick={() => switchType('AUTHOR')}
        >
          Authors
        </NButton>
        <NButton
          size="small"
          type={currentType.value === 'COMMENT' ? 'primary' : 'default'}
          onClick={() => switchType('COMMENT')}
        >
          Comments
        </NButton>
      </div>

      <NCard>
        {isVotedLoading.value ? (
          <div class="flex justify-center py-8">
            <NSpin size="medium" />
          </div>
        ) : votedItems.value.length === 0 ? (
          <NEmpty description="No voted items yet" />
        ) : (
          <>
            <NList>{votedItems.value.map(renderVotedItem)}</NList>

            {/* Pagination */}
            {totalPages.value > 1 && (
              <div class="flex justify-center mt-6">
                <NPagination
                  page={page.value}
                  pageCount={totalPages.value}
                  onUpdatePage={handlePageChange}
                  showSizePicker={false}
                />
              </div>
            )}
          </>
        )}
      </NCard>
    </div>
  )
})

export default VotedItems
