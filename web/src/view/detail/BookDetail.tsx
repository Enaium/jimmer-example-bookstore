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

import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NCard, NEmpty, NImage, NSpin, NTag } from 'naive-ui'
import { useQuery } from '@tanstack/vue-query'
import { api, BASE_URL } from '@/common/Api'
import CommentArea from '@/view/common/CommentArea'
import VoteButton from '@/view/common/VoteButton'
import FavouriteButton from '@/view/common/FavouriteButton'

const BookDetail = defineComponent(() => {
  const route = useRoute()
  const router = useRouter()

  const bookId = computed(() => route.params.id as string)

  // Fetch book details
  const {
    data: book,
    isPending: isBookLoading,
    isError: isBookError,
    error: bookError
  } = useQuery({
    queryKey: ['book', bookId.value],
    queryFn: () => api.bookController.getBook({ id: bookId.value }),
    enabled: !!bookId.value
  })

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return () => (
    <div class="min-h-screen bg-gray-50 p-4">
      {isBookLoading.value ? (
        <div class="flex justify-center items-center h-64">
          <NSpin size="large" />
        </div>
      ) : isBookError.value ? (
        <div class="flex justify-center items-center h-64">
          <NEmpty description={bookError.value?.message || 'Failed to load book'} />
        </div>
      ) : !book.value ? (
        <div class="flex justify-center items-center h-64">
          <NEmpty description="Book not found" />
        </div>
      ) : (
        <div class="max-w-6xl mx-auto">
          {/* Book Info Section */}
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: First Image */}
              <div class="lg:col-span-1">
                <div class="sticky top-4">
                  <NImage
                    src={`${BASE_URL}/images/${book.value.images?.[0]?.id || ''}`}
                    width="100%"
                    height="400"
                    object-fit="cover"
                    fallback-src="/public/favicon.ico"
                    class="rounded-lg shadow-md"
                  />
                </div>
              </div>

              {/* Center: Book Info */}
              <div class="lg:col-span-1">
                <div class="space-y-4">
                  <h1 class="text-3xl font-bold text-gray-900">{book.value.name}</h1>

                  <div class="text-2xl font-semibold text-blue-600">
                    {book.value.price != null
                      ? formatPrice(book.value.price)
                      : 'Price not available'}
                  </div>

                  <div class="space-y-3">
                    <div class="flex items-center space-x-2">
                      <span class="text-gray-600 font-medium">Issuer:</span>
                      <span
                        class="text-blue-600 hover:text-blue-800 cursor-pointer underline"
                        onClick={() => router.push(`/issuer/${book.value?.issuer?.id}`)}
                      >
                        {book.value.issuer?.name || 'Unknown'}
                      </span>
                    </div>

                    <div class="flex items-center space-x-2">
                      <span class="text-gray-600 font-medium">Edition:</span>
                      <span class="text-gray-900">{book.value.edition}</span>
                    </div>

                    <div class="flex items-center space-x-2">
                      <span class="text-gray-600 font-medium">Authors:</span>
                      <span class="text-gray-900">
                        {book.value.authors && book.value.authors.length > 0
                          ? book.value.authors.map((a: any, index: number) => (
                            <span key={a.id}>
                                <span
                                  class="text-blue-600 hover:text-blue-800 cursor-pointer underline"
                                  onClick={() => router.push(`/author/${a.id}`)}
                                >
                                  {`${a.firstName} ${a.lastName}`}
                                </span>
                              {index < book.value!.authors.length - 1 && ', '}
                              </span>
                          ))
                          : '-'}
                      </span>
                    </div>

                    {book.value.tags && book.value.tags.length > 0 && (
                      <div class="flex items-center space-x-2">
                        <span class="text-gray-600 font-medium">Tags:</span>
                        <div class="flex flex-wrap gap-1">
                          {book.value.tags.map((tag) => (
                            <NTag key={tag.id} type="primary" size="small">
                              {tag.name}
                            </NTag>
                          ))}
                        </div>
                      </div>
                    )}
                    <VoteButton bookId={bookId.value} count={book.value?.voteCount} />
                    <FavouriteButton bookId={bookId.value} count={book.value?.favouriteCount} />
                  </div>
                </div>
              </div>

              {/* Right: Additional Info */}
              <div class="lg:col-span-1">
                <NCard title="Book Details" class="h-full">
                  <div class="space-y-4">
                    <div>
                      <span class="text-gray-600">Author Count:</span>
                      <span class="ml-2 font-medium">{book.value.authorCount}</span>
                    </div>

                    <div>
                      <span class="text-gray-600">Image Count:</span>
                      <span class="ml-2 font-medium">{book.value.images?.length || 0}</span>
                    </div>

                    <div>
                      <span class="text-gray-600">Tag Count:</span>
                      <span class="ml-2 font-medium">{book.value.tags?.length || 0}</span>
                    </div>
                  </div>
                </NCard>
              </div>
            </div>

            {/* Bottom: Other Images */}
            {book.value.images && book.value.images.length > 1 && (
              <div class="mt-6">
                <h3 class="text-lg font-semibold mb-4">More Images</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {book.value.images.slice(1).map((image, index) => (
                    <div key={image.id} class="aspect-[3/4]">
                      <NImage
                        src={`${BASE_URL}/images/${image.id}`}
                        width="100%"
                        height="100%"
                        object-fit="cover"
                        fallback-src="/public/favicon.ico"
                        class="rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <CommentArea entityId={bookId.value} entityType="book" entityName={book.value.name} />
        </div>
      )}
    </div>
  )
})

export default BookDetail
