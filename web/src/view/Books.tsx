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
import { useRouter } from 'vue-router'
import { NButton, NCard, NEmpty, NImage, NInput, NPagination, NSpin, NTag } from 'naive-ui'
import { useQuery } from '@tanstack/vue-query'
import { api, BASE_URL } from '@/common/Api'
import type { RequestOf } from '@/__generated'
import type { BookView } from '@/__generated/model/static'

const PAGE_SIZE = 9

const Books = defineComponent(() => {
  const router = useRouter()
  const keywords = ref('')
  const page = ref(1)
  const input = ref('')

  // Debounce search input
  let debounceTimeout: any
  watch(input, (val) => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      keywords.value = val
      page.value = 1
    }, 400)
  })

  const options = ref<RequestOf<typeof api.bookController.getBooks>>({
    index: page.value - 1,
    size: PAGE_SIZE,
    keywords: keywords.value
  })

  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: computed(() => ['books', options.value]),
    queryFn: () =>
      api.bookController.getBooks({
        index: page.value - 1,
        size: PAGE_SIZE,
        keywords: keywords.value || undefined
      })
  })

  const books = computed(() => data.value?.rows || [])
  const total = computed(() => data.value?.totalRowCount || 0)
  const totalPageCount = computed(() => data.value?.totalPageCount || 1)

  // Refetch when page or keywords change
  watch([page, keywords], () => refetch())

  return () => (
    <div class="flex flex-col h-screen">
      {/* Search input fixed on top */}
      <div class="w-full max-w-xl mx-auto block">
        <NInput v-model:value={input.value} placeholder="Search books..." clearable />
      </div>
      {/* Book list center */}
      <div class="flex-1 overflow-auto flex justify-center items-center">
        {isPending.value ? (
          <NSpin size="large" />
        ) : isError.value ? (
          <NEmpty description={error.value?.message || 'Failed to load books'} />
        ) : books.value.length === 0 ? (
          <NEmpty description="No books found" />
        ) : (
          <div class="w-full max-w-7xl px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.value.map((book: BookView) => (
                <div key={book.id} class="mb-4">
                  <NCard>
                    <div class="flex flex-col items-center">
                      <div class="object-cover rounded mb-3">
                        <NImage
                          src={`${BASE_URL}/images/${book.images?.[0]?.id || ''}`}
                          width="120"
                          height="160"
                          fallback-src="/public/favicon.ico"
                        />
                      </div>
                      <div class="text-center">
                        <div class="font-bold text-lg">{book.name}</div>
                        <div>
                          Issuer:
                          <span
                            class="text-blue-600 hover:text-blue-800 cursor-pointer underline"
                            onClick={() => router.push(`/issuer/${book.issuer?.id}`)}
                          >
                            {book.issuer?.name || '-'}
                          </span>
                        </div>
                        <div>
                          Author:{' '}
                          {book.authors && book.authors.length > 0 ? (
                            book.authors.map((a: any, index: number) => (
                              <span key={a.id}>
                                <span
                                  class="text-blue-600 hover:text-blue-800 cursor-pointer underline"
                                  onClick={() => router.push(`/author/${a.id}`)}
                                >
                                  {`${a.firstName} ${a.lastName}`}
                                </span>
                                {index < book.authors.length - 1 && ', '}
                              </span>
                            ))
                          ) : (
                            '-'
                          )}
                        </div>
                        <div>Price: {book.price != null ? `$${book.price}` : '-'}</div>
                        <div>
                          Tags:{' '}
                          <div class="flex flex-wrap gap-1">
                            {book.tags.map((tag: any) => (
                              <NTag key={tag.id} type="primary" size="small">
                                {tag.name}
                              </NTag>
                            ))}
                          </div>
                        </div>
                        <div class="mt-3">
                          <NButton
                            type="primary"
                            size="small"
                            onClick={() => router.push(`/book/${book.id}`)}
                          >
                            View Details
                          </NButton>
                        </div>
                      </div>
                    </div>
                  </NCard>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Pagination bottom */}
      {totalPageCount.value > 1 && (
        <div class="p-4 flex justify-center bg-white">
          <div class="mx-auto">
            <NPagination
              v-model:page={page.value}
              page-size={PAGE_SIZE}
              item-count={total.value}
              show-size-picker={false}
            />
          </div>
        </div>
      )}
    </div>
  )
})

export default Books
