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
import { useRoute, useRouter } from 'vue-router'
import { NButton, NCard, NEmpty, NImage, NPagination, NSpin, useMessage } from 'naive-ui'
import { useQuery } from '@tanstack/vue-query'
import { api, BASE_URL } from '@/common/Api'
import type { RequestOf } from '@/__generated'
import CommentArea from '@/view/common/CommentArea'
import VoteButton from '@/view/common/VoteButton'
import FavouriteButton from '@/view/common/FavouriteButton'

const IssuerDetail = defineComponent(() => {
  const route = useRoute()
  const router = useRouter()
  const message = useMessage()

  const issuerId = computed(() => route.params.id as string)
  const currentPage = ref(1)
  const pageSize = 10

  // Issuer query options
  const issuerOptions = ref<RequestOf<typeof api.issuerController.getIssuer>>({
    id: issuerId.value
  })

  // Books query options
  const booksOptions = ref<RequestOf<typeof api.bookController.getBooks>>({
    index: currentPage.value - 1,
    size: pageSize
  })

  // Fetch issuer details
  const {
    data: issuer,
    isPending: isIssuerLoading,
    isError: isIssuerError,
    error: issuerError
  } = useQuery({
    queryKey: computed(() => ['issuer', issuerOptions.value]),
    queryFn: () => api.issuerController.getIssuer(issuerOptions.value),
    enabled: !!issuerId.value
  })

  // Fetch books by this issuer
  const {
    data: booksData,
    isPending: isBooksLoading,
    refetch: refetchBooks
  } = useQuery({
    queryKey: computed(() => ['books', 'issuer', issuerId.value, booksOptions.value]),
    queryFn: () => api.bookController.getBooks(booksOptions.value),
    enabled: !!issuerId.value
  })

  // Watch for changes and refetch
  watch([issuerId], () => {
    issuerOptions.value.id = issuerId.value
    refetchBooks()
  })

  watch([currentPage], () => {
    booksOptions.value.index = currentPage.value - 1
    refetchBooks()
  })

  const books = computed(() => booksData.value?.rows || [])
  const totalBooks = computed(() => booksData.value?.totalRowCount || 0)

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  const formatAuthorName = (author: any) => {
    return `${author.firstName} ${author.lastName}`
  }

  return () => (
    <div class="min-h-screen bg-gray-50 p-4">
      {isIssuerLoading.value ? (
        <div class="flex justify-center items-center h-64">
          <NSpin size="large" />
        </div>
      ) : isIssuerError.value ? (
        <div class="flex justify-center items-center h-64">
          <NEmpty description={issuerError.value?.message || 'Failed to load issuer'} />
        </div>
      ) : !issuer.value ? (
        <div class="flex justify-center items-center h-64">
          <NEmpty description="Issuer not found" />
        </div>
      ) : (
        <div class="max-w-6xl mx-auto">
          {/* Issuer Info Section */}
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Issuer Logo */}
              <div class="lg:col-span-1">
                <div class="sticky top-4">
                  <div class="flex justify-center">
                    <div class="w-48 h-48 bg-blue-100 rounded-lg flex items-center justify-center">
                      <div class="text-6xl font-bold text-blue-600">
                        {issuer.value.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center: Issuer Info */}
              <div class="lg:col-span-1">
                <div class="space-y-4">
                  <h1 class="text-3xl font-bold text-gray-900">{issuer.value.name}</h1>

                  <div class="space-y-3">
                    {issuer.value.website && (
                      <div class="flex items-center space-x-2">
                        <span class="text-gray-600 font-medium">Website:</span>
                        <a
                          href={issuer.value.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-blue-600 hover:text-blue-800 underline"
                        >
                          {issuer.value.website}
                        </a>
                      </div>
                    )}

                    <div class="flex items-center space-x-2">
                      <span class="text-gray-600 font-medium">Books Published:</span>
                      <span class="text-gray-900 font-semibold">{issuer.value.bookCount}</span>
                    </div>
                    <VoteButton issuerId={issuerId.value} count={issuer.value?.voteCount} />
                    <FavouriteButton
                      issuerId={issuerId.value}
                      count={issuer.value?.favouriteCount}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Additional Info */}
              <div class="lg:col-span-1">
                <NCard title="Issuer Statistics" class="h-full">
                  <div class="space-y-4">
                    <div>
                      <span class="text-gray-600">Total Books:</span>
                      <span class="ml-2 font-medium text-blue-600">{issuer.value.bookCount}</span>
                    </div>

                    <div>
                      <span class="text-gray-600">Issuer ID:</span>
                      <span class="ml-2 font-medium text-sm text-gray-500">{issuer.value.id}</span>
                    </div>

                    {issuer.value.website && (
                      <div>
                        <span class="text-gray-600">Website:</span>
                        <span class="ml-2 font-medium text-sm text-blue-600">
                          <a
                            href={issuer.value.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="hover:underline"
                          >
                            Visit Site
                          </a>
                        </span>
                      </div>
                    )}
                  </div>
                </NCard>
              </div>
            </div>
          </div>

          {/* Books Section */}
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-2xl font-bold mb-6">Books by {issuer.value.name}</h2>

            <div class="space-y-4">
              {isBooksLoading.value ? (
                <div class="flex justify-center py-8">
                  <NSpin size="medium" />
                </div>
              ) : books.value.length === 0 ? (
                <NEmpty description="No books found for this issuer" />
              ) : (
                <>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {books.value.map((book: any) => (
                      <NCard key={book.id} class="hover:shadow-lg transition-shadow">
                        <div class="flex flex-col items-center">
                          <div class="mb-3">
                            <NImage
                              src={`${BASE_URL}/images/${book.images?.[0]?.id || ''}`}
                              width="120"
                              height="160"
                              object-fit="cover"
                              fallback-src="/public/favicon.ico"
                              class="rounded"
                            />
                          </div>
                          <div class="text-center">
                            <div class="font-bold text-lg mb-2">{book.name}</div>
                            <div class="text-sm text-gray-600 mb-2">Edition: {book.edition}</div>
                            <div class="text-sm text-gray-600 mb-2">
                              Price: {book.price != null ? formatPrice(book.price) : 'N/A'}
                            </div>
                            <div class="text-sm text-gray-600 mb-3">
                              Authors: {book.authors?.map(formatAuthorName).join(', ') || 'Unknown'}
                            </div>
                            <NButton
                              type="primary"
                              size="small"
                              onClick={() => router.push(`/book/${book.id}`)}
                            >
                              View Details
                            </NButton>
                          </div>
                        </div>
                      </NCard>
                    ))}
                  </div>

                  {/* Pagination for books */}
                  {totalBooks.value > pageSize && (
                    <div class="flex justify-center mt-6">
                      <NPagination
                        v-model:page={currentPage.value}
                        page-size={pageSize}
                        item-count={totalBooks.value}
                        show-size-picker={false}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <CommentArea
            entityId={issuerId.value}
            entityType="issuer"
            entityName={issuer.value.name}
          />
        </div>
      )}
    </div>
  )
})

export default IssuerDetail
