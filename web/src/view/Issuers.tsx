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
import { NButton, NCard, NEmpty, NInput, NPagination, NSpin } from 'naive-ui'
import { useQuery } from '@tanstack/vue-query'
import { api } from '@/common/Api'
import type { IssuerView } from '@/__generated/model/static'

const PAGE_SIZE = 10

const Issuers = defineComponent(() => {
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

  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: computed(() => ['issuers', page.value, keywords.value]),
    queryFn: () =>
      api.issuerController.getIssuers({
        index: page.value - 1,
        size: PAGE_SIZE,
        name: keywords.value || undefined
      })
  })

  const issuers = computed(() => data.value?.rows || [])
  const total = computed(() => data.value?.totalRowCount || 0)
  const totalPageCount = computed(() => data.value?.totalPageCount || 1)

  // Refetch when page or keywords change
  watch([page, keywords], () => refetch())

  return () => (
    <div class="flex flex-col h-screen">
      {/* Search input fixed on top */}
      <div class="w-full max-w-xl mx-auto block p-4">
        <NInput v-model:value={input.value} placeholder="Search issuers..." clearable />
      </div>
      {/* Issuer list center */}
      <div class="flex-1 overflow-auto flex justify-center items-start">
        {isPending.value ? (
          <NSpin size="large" />
        ) : isError.value ? (
          <NEmpty description={error.value?.message || 'Failed to load issuers'} />
        ) : issuers.value.length === 0 ? (
          <NEmpty description="No issuers found" />
        ) : (
          <div class="w-full max-w-2xl px-4">
            <div class="space-y-2">
              {issuers.value.map((issuer: IssuerView) => (
                <div key={issuer.id} class="mb-2">
                  <NCard>
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <div class="font-medium text-lg">
                          {issuer.name}
                        </div>
                      </div>
                      <div class="flex space-x-2">
                        <NButton
                          type="primary"
                          size="small"
                          onClick={() => router.push(`/issuer/${issuer.id}`)}
                        >
                          View Details
                        </NButton>
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

export default Issuers