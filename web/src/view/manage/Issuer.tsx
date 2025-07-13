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
import type { DataTableColumns, FormInst, FormItemRule, FormRules } from 'naive-ui'
import {
  NButton,
  NDataTable,
  NEmpty,
  NForm,
  NFormItem,
  NInput,
  NModal,
  NPagination,
  NSpin,
  useDialog,
  useMessage
} from 'naive-ui'
import { useQuery } from '@tanstack/vue-query'
import { api } from '@/common/Api'
import type { IssuerView } from '@/__generated/model/static/IssuerView'
import type { IssuerInput } from '@/__generated/model/static/IssuerInput'
import type { RequestOf } from '@/__generated'

const PAGE_SIZE = 10

export default defineComponent(() => {
  const input = ref('')
  const search = ref('')
  const page = ref(1)

  // Use options ref like Home
  const options = ref<RequestOf<typeof api.issuerController.getIssuers>>({
    index: page.value - 1,
    size: PAGE_SIZE,
    name: search.value || undefined
  })

  // Debounce search input
  let debounceTimeout: any
  watch(input, (val) => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      search.value = val
      page.value = 1
    }, 400)
  })

  // Keep options in sync with page/search
  watch([page, search], () => {
    options.value = {
      index: page.value - 1,
      size: PAGE_SIZE,
      name: search.value || undefined
    }
  })

  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: computed(() => ['issuers', options.value]),
    queryFn: () => api.issuerController.getIssuers(options.value)
  })

  const issuers = computed(() => data.value?.rows || [])
  const total = computed(() => data.value?.totalRowCount || 0)
  const totalPageCount = computed(() => data.value?.totalPageCount || 1)

  // Modal state for new issuer
  const showModal = ref(false)
  const formLoading = ref(false)
  const form = ref<IssuerInput>({ name: '', website: '' })
  const message = useMessage()
  const dialog = useDialog()
  const formRef = ref<FormInst | null>(null)
  const rules: FormRules = {
    name: [
      { required: true, message: 'Name is required', trigger: ['input', 'blur'] }
    ],
    website: [
      {
        validator(rule: FormItemRule, value: any) {
          if (!value) return true
          // Simple URL validation
          return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/.test(value) ? true : new Error('Invalid URL')
        },
        trigger: ['input', 'blur']
      }
    ]
  }
  const isEdit = ref(false)
  const editingIssuerId = ref<string | null>(null)

  function openModal() {
    form.value = { name: '', website: '' }
    showModal.value = true
    isEdit.value = false
    editingIssuerId.value = null
  }

  function openEditModal(row: IssuerView) {
    form.value = { name: row.name, website: row.website }
    showModal.value = true
    isEdit.value = true
    editingIssuerId.value = row.id
  }

  function closeModal() {
    showModal.value = false
    isEdit.value = false
    editingIssuerId.value = null
  }

  function handleSubmit() {
    formRef.value?.validate((errors) => {
      if (errors) return
      formLoading.value = true
      const savePromise = isEdit.value && editingIssuerId.value
        ? api.issuerController.save({ body: { ...form.value, id: editingIssuerId.value } })
        : api.issuerController.save({ body: form.value })
      savePromise
        .then(() => {
          message.success(isEdit.value ? 'Issuer updated' : 'Issuer created')
          closeModal()
          refetch()
        })
        .catch((err: any) => {
          message.error(err?.message || (isEdit.value ? 'Failed to update issuer' : 'Failed to create issuer'))
        })
        .finally(() => {
          formLoading.value = false
        })
    })
  }

  function handleDelete(row: IssuerView) {
    dialog.warning({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete issuer "${row.name}"?`,
      positiveText: 'Delete',
      negativeText: 'Cancel',
      onPositiveClick: () => {
        api.issuerController.delete({ id: row.id })
          .then(() => {
            message.success('Issuer deleted')
            refetch()
          })
          .catch((err: any) => {
            message.error(err?.message || 'Failed to delete issuer')
          })
      }
    })
  }

  // NDataTable columns
  const columns: DataTableColumns<IssuerView> = [
    {
      title: 'Name',
      key: 'name',
      render(row) {
        return row.name
      }
    },
    {
      title: 'Website',
      key: 'website',
      render(row) {
        return row.website
          ? <a href={row.website} class="text-blue-600 hover:underline" target="_blank" rel="noopener">{row.website}</a>
          : '-'
      }
    },
    {
      title: 'Book Count',
      key: 'bookCount',
      render(row) {
        return row.bookCount
      }
    }
    ,
    {
      title: 'Action',
      key: 'action',
      render(row) {
        return (
          <div class="flex gap-2">
            <NButton size="small" type="primary" onClick={() => openEditModal(row)}>Edit</NButton>
            <NButton size="small" type="error" onClick={() => handleDelete(row)}>Delete</NButton>
          </div>
        )
      }
    }
  ]

  return () => (
    <div class="flex flex-col flex-1 min-h-0 min-w-0 h-full w-full">
      {/* Top: Search Bar */}
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white dark:bg-gray-900 flex-shrink-0"
        style={{ minHeight: '64px' }}>
        <div class="flex items-center">
          <NInput
            class="w-64 mr-2"
            placeholder="Search issuer by name"
            v-model:value={input.value}
            clearable
          />
          <NButton type="primary" onClick={() => {
            search.value = input.value
            page.value = 1
            refetch()
          }}>Search</NButton>
        </div>
        <NButton type="success" class="ml-4" onClick={openModal}>Add Issuer</NButton>
      </div>
      {/* Add Issuer Modal */}
      <NModal show={showModal.value} onUpdate:show={v => showModal.value = v} preset="dialog"
              title={isEdit.value ? 'Edit Issuer' : 'Add New Issuer'}>
        <NForm ref={formRef} class="w-80" label-placement="top" rules={rules} model={form.value} onSubmit={e => {
          e.preventDefault()
          handleSubmit()
        }}>
          <NFormItem label="Name" path="name" required>
            <NInput v-model:value={form.value.name} placeholder="Issuer name" autofocus />
          </NFormItem>
          <NFormItem label="Website" path="website">
            <NInput v-model:value={form.value.website} placeholder="https://example.com" />
          </NFormItem>
          <div class="flex justify-end mt-4">
            <NButton class="mr-2" onClick={closeModal} disabled={formLoading.value}>Cancel</NButton>
            <NButton type="primary" loading={formLoading.value}
                     onClick={handleSubmit}>{isEdit.value ? 'Update' : 'Create'}</NButton>
          </div>
        </NForm>
      </NModal>
      {/* Middle: Data Table */}
      <div class="flex-1 min-h-0 overflow-auto bg-gray-50 dark:bg-gray-800">
        {isPending.value ? (
          <div class="flex justify-center items-center h-full"><NSpin size="large" /></div>
        ) : isError.value ? (
          <NEmpty description={error.value?.message || 'Failed to load issuers'} />
        ) : issuers.value.length === 0 ? (
          <NEmpty description="No issuers found" />
        ) : (
          <NDataTable
            columns={columns}
            data={Array.from(issuers.value)}
            striped
            bordered={false}
            class="bg-white dark:bg-gray-900"
          />
        )}
      </div>
      {/* Bottom: Pagination */}
      {totalPageCount.value > 1 && (
        <div class="flex items-center justify-center border-t border-gray-200 bg-white dark:bg-gray-900 flex-shrink-0"
             style={{ minHeight: '64px' }}>
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