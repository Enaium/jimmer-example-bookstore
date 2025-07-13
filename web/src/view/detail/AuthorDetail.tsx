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
import { NAvatar, NButton, NCard, NEmpty, NImage, NPagination, NSpin, useMessage } from 'naive-ui'
import { useQuery } from '@tanstack/vue-query'
import { api, BASE_URL } from '@/common/Api'
import type { RequestOf } from '@/__generated'
import CommentArea from '@/view/common/CommentArea'
import VoteButton from '@/view/common/VoteButton'
import FavouriteButton from '@/view/common/FavouriteButton'

const AuthorDetail = defineComponent(() => {
  const route = useRoute()
  const router = useRouter()
  const message = useMessage()

  const authorId = computed(() => route.params.id as string)
  const currentPage = ref(1)
  const pageSize = 10

  // Author query options
  const authorOptions = ref<RequestOf<typeof api.authorController.getAuthor>>({
    id: authorId.value
  })

  // Books query options
  const booksOptions = ref<RequestOf<typeof api.bookController.getBooks>>({
    index: currentPage.value - 1,
    size: pageSize
  })

  // Fetch author details
  const {
    data: author,
    isPending: isAuthorLoading,
    isError: isAuthorError,
    error: authorError
  } = useQuery({
    queryKey: computed(() => ['author', authorOptions.value]),
    queryFn: () => api.authorController.getAuthor(authorOptions.value),
    enabled: !!authorId.value
  })

  // Fetch books by this author
  const {
    data: booksData,
    isPending: isBooksLoading,
    refetch: refetchBooks
  } = useQuery({
    queryKey: computed(() => ['books', 'author', authorId.value, booksOptions.value]),
    queryFn: () => api.bookController.getBooks(booksOptions.value),
    enabled: !!authorId.value
  })

  // Watch for changes and refetch
  watch([authorId], () => {
    authorOptions.value.id = authorId.value
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
      {isAuthorLoading.value ? (
        <div class="flex justify-center items-center h-64">
          <NSpin size="large" />
        </div>
      ) : isAuthorError.value ? (
        <div class="flex justify-center items-center h-64">
          <NEmpty description={authorError.value?.message || 'Failed to load author'} />
        </div>
      ) : !author.value ? (
        <div class="flex justify-center items-center h-64">
          <NEmpty description="Author not found" />
        </div>
      ) : (
        <div class="max-w-6xl mx-auto">
          {/* Author Info Section */}
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Author Avatar */}
              <div class="lg:col-span-1">
                <div class="sticky top-4">
                  <div class="flex justify-center">
                    <NAvatar
                      round
                      size="large"
                      class="w-48 h-48 text-4xl"
                    >
                      {author.value.firstName.charAt(0)} {author.value.lastName.charAt(0)}
                    </NAvatar>
                  </div>
                </div>
              </div>

              {/* Center: Author Info */}
              <div class="lg:col-span-1">
                <div class="space-y-4">
                  <h1 class="text-3xl font-bold text-gray-900 flex items-center space-x-2">
                    {author.value.firstName} {author.value.lastName}
                  </h1>

                  <div class="space-y-3">
                    <div class="flex items-center space-x-2">
                      <span class="text-gray-600 font-medium">First Name:</span>
                      <span class="text-gray-900">{author.value.firstName}</span>
                    </div>

                    <div class="flex items-center space-x-2">
                      <span class="text-gray-600 font-medium">Last Name:</span>
                      <span class="text-gray-900">{author.value.lastName}</span>
                    </div>

                    <div class="flex items-center space-x-2">
                      <span class="text-gray-600 font-medium">Gender:</span>
                      <span class="text-gray-900 capitalize">{author.value.gender}</span>
                    </div>

                    <VoteButton authorId={authorId.value} count={author.value?.voteCount} />
                    <FavouriteButton
                      authorId={authorId.value}
                      count={author.value?.favouriteCount}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Additional Info */}
              <div class="lg:col-span-1">
                <NCard title="Author Statistics" class="h-full">
                  <div class="space-y-4">
                    <div>
                      <span class="text-gray-600">Books Published:</span>
                      <span class="ml-2 font-medium text-blue-600">{author.value.bookCount}</span>
                    </div>

                    <div>
                      <span class="text-gray-600">Author ID:</span>
                      <span class="ml-2 font-medium text-sm text-gray-500">{author.value.id}</span>
                    </div>
                  </div>
                </NCard>
              </div>
            </div>
          </div>

          {/* Books Section */}
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-2xl font-bold mb-6">Books by {formatAuthorName(author.value)}</h2>

            <div class="space-y-4">
              {isBooksLoading.value ? (
                <div class="flex justify-center py-8">
                  <NSpin size="medium" />
                </div>
              ) : books.value.length === 0 ? (
                <NEmpty description="No books found for this author" />
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
                              Issuer: {book.issuer?.name || 'Unknown'}
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
            entityId={authorId.value}
            entityType="author"
            entityName={formatAuthorName(author.value)}
          />
        </div>
      )}
    </div>
  )
})

export default AuthorDetail
