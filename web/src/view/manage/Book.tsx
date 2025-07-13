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

import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import type { DataTableColumns, FormInst, FormRules } from 'naive-ui'
import {
  NButton,
  NDataTable,
  NEmpty,
  NForm,
  NFormItem,
  NGrid,
  NGridItem,
  NInput,
  NModal,
  NPagination,
  NRadio,
  NRadioGroup,
  NSelect,
  NSpin,
  useDialog,
  useMessage
} from 'naive-ui'
import ImageUpload from '@/view/common/ImageUpload'
import { useQuery } from '@tanstack/vue-query'
import { api } from '@/common/Api'
import type { BookView } from '@/__generated/model/static/BookView'
import type { BookInput } from '@/__generated/model/static/BookInput'
import type { RequestOf } from '@/__generated'
import { debounce } from 'lodash-es'

const PAGE_SIZE = 10

export default defineComponent(() => {
  // Search and pagination
  const input = ref('')
  const search = ref('')
  const page = ref(1)
  const options = ref<RequestOf<typeof api.bookController.getBooks>>({
    index: page.value - 1,
    size: PAGE_SIZE,
    keywords: search.value || undefined
  })
  let debounceTimeout: any
  watch(input, (val) => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      search.value = val
      page.value = 1
    }, 400)
  })
  watch([page, search], () => {
    options.value = {
      index: page.value - 1,
      size: PAGE_SIZE,
      keywords: search.value || undefined
    }
  })

  // Book list query
  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: computed(() => ['books', options.value]),
    queryFn: () => api.bookController.getBooks(options.value)
  })
  const books = computed(() => data.value?.rows || [])
  const total = computed(() => data.value?.totalRowCount || 0)
  const totalPageCount = computed(() => data.value?.totalPageCount || 1)

  // Modal state and form
  const showModal = ref(false)
  const formLoading = ref(false)
  const form = ref<BookInput>({
    name: '',
    edition: 1,
    price: 0,
    issuer: { name: '', website: '' },
    authors: [] as { firstName: string; lastName: string; gender: string }[],
    tags: [] as { name: string }[],
    images: [] as { id: string }[]
  })
  const message = useMessage()
  const dialog = useDialog()
  const formRef = ref<FormInst | null>(null)
  const isEdit = ref(false)
  const editingId = ref<string | null>(null)

  // Add issuer and tag options state
  const issuerOptions = ref<{ label: string; value: string }[]>([])
  const tagOptions = ref<{ label: string; value: string }[]>([])

  // Debounce timers for remote search
  let issuerSearchTimeout: any = null
  let tagSearchTimeout: any = null

  function debouncedFetchIssuerOptions(keyword = '') {
    if (issuerSearchTimeout) clearTimeout(issuerSearchTimeout)
    issuerSearchTimeout = setTimeout(() => {
      fetchIssuerOptions(keyword)
    }, 300)
  }

  function debouncedFetchTagOptions(keyword = '') {
    if (tagSearchTimeout) clearTimeout(tagSearchTimeout)
    tagSearchTimeout = setTimeout(() => {
      fetchTagOptions(keyword)
    }, 300)
  }

  // Fetch options when modal opens
  function fetchIssuerOptions(keyword = '') {
    return api.issuerController
      .getIssuers({ index: 0, size: 100, name: keyword || undefined })
      .then((res) => {
        issuerOptions.value = (res.rows || []).map((i: any) => ({ label: i.name, value: i.name }))
      })
  }

  function fetchTagOptions(keyword = '') {
    return api.tagController
      .getTags({ index: 0, size: 100, name: keyword || undefined })
      .then((res) => {
        tagOptions.value = (res.rows || []).map((t: any) => ({ label: t.name, value: t.name }))
      })
  }

  // Issuer search logic
  const handleIssuerSearch = debounce(async (query: string) => {
    const res = await api.issuerController.getIssuers({
      index: 0,
      size: 100,
      name: query || undefined
    })
    const remoteOptions = (res.rows || []).map((i: any) => ({ label: i.name, value: i.name }))
    const queryExists = remoteOptions.some((option) => option.label === query)
    if (query && !queryExists) {
      issuerOptions.value = [...remoteOptions, { label: query, value: query }]
    } else {
      issuerOptions.value = remoteOptions
    }
  }, 300)

  // Tag search logic
  const handleTagSearch = debounce(async (query: string) => {
    const res = await api.tagController.getTags({ index: 0, size: 100, name: query || undefined })
    const remoteOptions = (res.rows || []).map((t: any) => ({ label: t.name, value: t.name }))
    const queryExists = remoteOptions.some((option) => option.label === query)
    if (query && !queryExists) {
      tagOptions.value = [...remoteOptions, { label: query, value: query }]
    } else {
      tagOptions.value = remoteOptions
    }
  }, 300)

  // Update openModal and openEditModal to fetch options
  function openModal() {
    form.value = {
      name: '',
      edition: 1,
      price: 0,
      issuer: { name: '', website: '' },
      authors: [],
      tags: [],
      images: []
    }
    showModal.value = true
    isEdit.value = false
    editingId.value = null
    fetchIssuerOptions()
    fetchTagOptions()

    // Clear validation errors when opening modal
    nextTick(() => {
      formRef.value?.restoreValidation()
    })
  }

  function openEditModal(row: BookView) {
    form.value = {
      id: row.id,
      name: row.name,
      edition: row.edition,
      price: row.price,
      issuer: row.issuer
        ? { name: row.issuer.name, website: row.issuer.website || '' }
        : { name: '', website: '' },
      authors: (row.authors || []).map((a) => ({
        firstName: a.firstName,
        lastName: a.lastName,
        gender: a.gender
      })),
      tags: (row.tags || []).map((t) => ({ name: t.name })),
      images: (row.images || []).map((img) => ({ id: img.id }))
    }
    showModal.value = true
    isEdit.value = true
    editingId.value = row.id
    fetchIssuerOptions()
    fetchTagOptions()

    // Trigger validation after form data is set
    nextTick(() => {
      formRef.value?.validate()
    })
  }

  function closeModal() {
    showModal.value = false
    isEdit.value = false
    editingId.value = null
  }

  function handleSubmit() {
    formRef.value?.validate((errors) => {
      if (errors) return
      formLoading.value = true
      const savePromise = api.bookController.save({ body: form.value })
      savePromise
        .then(() => {
          message.success(isEdit.value ? 'Book updated' : 'Book created')
          closeModal()
          refetch()
        })
        .catch((err: any) => {
          message.error(
            err?.message || (isEdit.value ? 'Failed to update book' : 'Failed to create book')
          )
        })
        .finally(() => {
          formLoading.value = false
        })
    })
  }

  function handleDelete(row: BookView) {
    dialog.warning({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete book "${row.name}"?`,
      positiveText: 'Delete',
      negativeText: 'Cancel',
      onPositiveClick: () => {
        api.bookController
          .delete({ id: row.id })
          .then(() => {
            message.success('Book deleted')
            refetch()
          })
          .catch((err: any) => {
            message.error(err?.message || 'Failed to delete book')
          })
      }
    })
  }

  // Table columns
  const columns: DataTableColumns<BookView> = [
    { title: 'Name', key: 'name', render: (row) => row.name },
    { title: 'Edition', key: 'edition', render: (row) => row.edition },
    { title: 'Price', key: 'price', render: (row) => row.price },
    { title: 'Issuer', key: 'issuer', render: (row) => row.issuer?.name || '-' },
    {
      title: 'Authors',
      key: 'authors',
      render: (row) => (row.authors || []).map((a) => a.firstName + ' ' + a.lastName).join(', ')
    },
    { title: 'Tags', key: 'tags', render: (row) => (row.tags || []).map((t) => t.name).join(', ') },
    {
      title: 'Action',
      key: 'action',
      render(row) {
        return (
          <div class="flex gap-2">
            <NButton size="small" type="primary" onClick={() => openEditModal(row)}>
              Edit
            </NButton>
            <NButton size="small" type="error" onClick={() => handleDelete(row)}>
              Delete
            </NButton>
          </div>
        )
      }
    }
  ]

  // Form rules
  const rules = computed<FormRules>(() => {
    const baseRules: FormRules = {
      name: [{ required: true, message: 'Name is required', trigger: ['input', 'blur'] }],
      edition: [
        {
          required: true,
          message: 'Edition is required',
          trigger: ['input', 'blur'],
          validator: (rule, value) => {
            if (!value && value !== 0) {
              return new Error('Edition is required')
            }
            if (typeof value === 'string' && value.trim() === '') {
              return new Error('Edition is required')
            }
            return true
          }
        }
      ],
      price: [
        {
          required: true,
          message: 'Price is required',
          trigger: ['input', 'blur'],
          validator: (rule, value) => {
            if (!value && value !== 0) {
              return new Error('Price is required')
            }
            if (typeof value === 'string' && value.trim() === '') {
              return new Error('Price is required')
            }
            return true
          }
        }
      ],
      'issuer.name': [
        { required: true, message: 'Issuer name is required', trigger: ['input', 'blur'] }
      ],
      images: [
        {
          required: true,
          type: 'array',
          message: 'At least one image is required',
          trigger: ['change']
        }
      ]
    }

    // Add author rules
    form.value.authors.forEach((_, idx) => {
      baseRules[`authors[${idx}].firstName`] = [
        { required: true, message: 'First name is required', trigger: ['input', 'blur'] }
      ]
      baseRules[`authors[${idx}].lastName`] = [
        { required: true, message: 'Last name is required', trigger: ['input', 'blur'] }
      ]
      baseRules[`authors[${idx}].gender`] = [
        { required: true, message: 'Gender is required', trigger: ['input', 'blur'] }
      ]
    })

    return baseRules
  })

  return () => (
    <div class="flex flex-col flex-1 min-h-0 min-w-0 h-full w-full">
      {/* Top: Search Bar */}
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white dark:bg-gray-900 flex-shrink-0"
        style={{ minHeight: '64px' }}
      >
        <div class="flex items-center">
          <NInput
            class="w-64 mr-2"
            placeholder="Search book by name or keyword"
            v-model:value={input.value}
            clearable
          />
          <NButton
            type="primary"
            onClick={() => {
              search.value = input.value
              page.value = 1
              refetch()
            }}
          >
            Search
          </NButton>
        </div>
        <NButton type="success" class="ml-4" onClick={openModal}>
          Add Book
        </NButton>
      </div>
      {/* Add/Edit Book Modal */}
      <NModal
        show={showModal.value}
        onUpdate:show={(v) => (showModal.value = v)}
        preset="card"
        title={isEdit.value ? 'Edit Book' : 'Add New Book'}
      >
        <NForm
          ref={formRef}
          label-placement="top"
          rules={rules.value}
          model={form.value}
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <NGrid cols={5} xGap={16} yGap={8}>
            <NGridItem>
              <NFormItem label="Name" path="name" required>
                <NInput v-model:value={form.value.name} placeholder="Book name" autofocus />
              </NFormItem>
            </NGridItem>
            <NGridItem>
              <NFormItem label="Edition" path="edition" required>
                <NInput
                  v-model:value={form.value.edition}
                  type="text"
                  placeholder="Edition"
                  onUpdateValue={(val) => {
                    const numVal = val === '' ? undefined : Number(val)
                    form.value = Object.assign({}, form.value, { edition: numVal })
                  }}
                />
              </NFormItem>
            </NGridItem>
            <NGridItem>
              <NFormItem label="Price" path="price" required>
                <NInput
                  v-model:value={form.value.price}
                  type="text"
                  placeholder="Price"
                  onUpdateValue={(val) => {
                    const numVal = val === '' ? undefined : Number(val)
                    form.value = Object.assign({}, form.value, { price: numVal })
                  }}
                />
              </NFormItem>
            </NGridItem>
            <NGridItem>
              <NFormItem label="Issuer Name" path="issuer.name" required>
                <NSelect
                  filterable
                  allow-create
                  remote
                  onSearch={handleIssuerSearch}
                  options={issuerOptions.value}
                  value={form.value.issuer.name}
                  onUpdateValue={(val) => {
                    form.value = Object.assign({}, form.value, {
                      issuer: Object.assign({}, form.value.issuer, { name: val })
                    })
                  }}
                  onCreate={(val) => {
                    const option = { label: val, value: val }
                    issuerOptions.value = [...issuerOptions.value, option]
                    return option
                  }}
                  placeholder="Select or enter issuer"
                />
              </NFormItem>
            </NGridItem>
            <NGridItem>
              <NFormItem label="Issuer Website" path="issuer.website">
                <NInput v-model:value={form.value.issuer.website} placeholder="Issuer website" />
              </NFormItem>
            </NGridItem>
          </NGrid>
          {/* Images section full width */}
          <NFormItem label="Images" path="images">
            <ImageUpload
              value={form.value.images as { id: string }[]}
              onChange={(images: { id: string }[]) => {
                form.value = Object.assign({}, form.value, { images })
              }}
              loading={formLoading.value}
              onLoadingChange={(loading: boolean) => {
                formLoading.value = loading
              }}
            />
          </NFormItem>
          {/* Authors/Tags left-right layout */}
          <NGrid cols={2} xGap={16} yGap={8} class="mt-2">
            <NGridItem>
              <div>
                <div class="font-medium mb-1">Authors</div>
                {form.value.authors.map((author, idx) => (
                  <NGrid cols={4} xGap={8} yGap={4} key={idx}>
                    <NGridItem>
                      <NFormItem
                        label="First Name"
                        path={`authors[${idx}].firstName`}
                        showLabel={false}
                        required
                      >
                        <NInput
                          class="w-full"
                          v-model:value={author.firstName}
                          placeholder="First name"
                        />
                      </NFormItem>
                    </NGridItem>
                    <NGridItem>
                      <NFormItem
                        label="Last Name"
                        path={`authors[${idx}].lastName`}
                        showLabel={false}
                        required
                      >
                        <NInput
                          class="w-full"
                          v-model:value={author.lastName}
                          placeholder="Last name"
                        />
                      </NFormItem>
                    </NGridItem>
                    <NGridItem>
                      <NFormItem
                        label="Gender"
                        path={`authors[${idx}].gender`}
                        showLabel={false}
                        required
                      >
                        <NRadioGroup v-model:value={author.gender} class="w-full">
                          <NRadio value="M">Male</NRadio>
                          <NRadio value="F">Female</NRadio>
                        </NRadioGroup>
                      </NFormItem>
                    </NGridItem>
                    <NGridItem>
                      <NButton
                        type="error"
                        onClick={() => {
                          const newAuthors = form.value.authors.slice()
                          newAuthors.splice(idx, 1)
                          form.value = Object.assign({}, form.value, { authors: newAuthors })
                        }}
                        disabled={form.value.authors.length === 1}
                      >
                        Remove
                      </NButton>
                    </NGridItem>
                  </NGrid>
                ))}
                <NButton
                  size="small"
                  type="success"
                  class="mt-1"
                  onClick={() => {
                    const newAuthors = form.value.authors.concat([
                      { firstName: '', lastName: '', gender: '' }
                    ])
                    form.value = Object.assign({}, form.value, { authors: newAuthors })
                  }}
                >
                  Add Author
                </NButton>
              </div>
            </NGridItem>
            <NGridItem>
              <div>
                <div class="font-medium mb-1">Tags</div>
                {(form.value.tags as { name: string }[]).map((tag, idx) => (
                  <NGrid cols={2} xGap={8} yGap={4} class="mb-1 items-center" key={idx}>
                    <NGridItem>
                      <NSelect
                        filterable
                        allow-create
                        remote
                        onSearch={handleTagSearch}
                        options={tagOptions.value}
                        value={tag.name}
                        onUpdateValue={(val) => {
                          const newTags = (form.value.tags as { name: string }[]).slice()
                          newTags[idx] = { name: val }
                          form.value = Object.assign({}, form.value, { tags: newTags })
                        }}
                        onCreate={(val) => {
                          const option = { label: val, value: val }
                          tagOptions.value = [...tagOptions.value, option]
                          return option
                        }}
                        placeholder="Select or enter tag"
                      />
                    </NGridItem>
                    <NGridItem>
                      <NButton
                        type="error"
                        onClick={() => {
                          const newTags = (form.value.tags as { name: string }[]).slice()
                          newTags.splice(idx, 1)
                          form.value = Object.assign({}, form.value, { tags: newTags })
                        }}
                      >
                        Remove
                      </NButton>
                    </NGridItem>
                  </NGrid>
                ))}
                <NButton
                  size="small"
                  type="success"
                  class="mt-1"
                  onClick={() => {
                    const newTags = (form.value.tags as { name: string }[]).concat([{ name: '' }])
                    form.value = Object.assign({}, form.value, { tags: newTags })
                  }}
                >
                  Add Tag
                </NButton>
              </div>
            </NGridItem>
          </NGrid>
          <div class="flex justify-end mt-4">
            <NButton class="mr-2" onClick={closeModal} disabled={formLoading.value}>
              Cancel
            </NButton>
            <NButton type="primary" loading={formLoading.value} onClick={handleSubmit}>
              {isEdit.value ? 'Update' : 'Create'}
            </NButton>
          </div>
        </NForm>
      </NModal>
      {/* Middle: Data Table */}
      <div class="flex-1 min-h-0 overflow-auto bg-gray-50 dark:bg-gray-800">
        {isPending.value ? (
          <div class="flex justify-center items-center h-full">
            <NSpin size="large" />
          </div>
        ) : isError.value ? (
          <NEmpty description={error.value?.message || 'Failed to load books'} />
        ) : books.value.length === 0 ? (
          <NEmpty description="No books found" />
        ) : (
          <NDataTable
            columns={columns}
            data={Array.from(books.value)}
            striped
            bordered={false}
            class="bg-white dark:bg-gray-900"
          />
        )}
      </div>
      {/* Bottom: Pagination */}
      {totalPageCount.value > 1 && (
        <div
          class="flex items-center justify-center border-t border-gray-200 bg-white dark:bg-gray-900 flex-shrink-0"
          style={{ minHeight: '64px' }}
        >
          <NPagination
            v-model:page={page.value}
            page-count={totalPageCount.value}
            page-size={PAGE_SIZE}
            item-count={total.value}
            show-size-picker={false}
          />
        </div>
      )}
    </div>
  )
})
