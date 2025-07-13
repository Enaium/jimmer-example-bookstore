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

import { defineComponent, ref } from 'vue'
import { NUpload, type UploadCustomRequestOptions, type UploadFileInfo, useMessage } from 'naive-ui'
import { api, BASE_URL } from '@/common/Api'

const ImageUpload = defineComponent(
  (props: {
    value: { id: string }[]
    onChange: (images: { id: string }[]) => void
    onLoadingChange?: (loading: boolean) => void
  }) => {
    const message = useMessage()
    const localLoading = ref(false)

    const handleLoadingChange = (loading: boolean) => {
      localLoading.value = loading
      props.onLoadingChange?.(loading)
    }

    const customRequest = async (options: UploadCustomRequestOptions) => {
      handleLoadingChange(true)
      try {
        const realFile = (options.file as UploadFileInfo).file as File
        const ids = await api.imageController.saveImages({ body: { file: [realFile] } })
        const newImages = props.value.concat(ids.map((id: string) => ({ id })))
        props.onChange(newImages)
        options.onFinish()
        message.success('Image uploaded')
      } catch (err: any) {
        options.onError()
        message.error(err?.message || 'Failed to upload image')
      } finally {
        handleLoadingChange(false)
      }
    }

    const handleRemove = ({ file }: { file: UploadFileInfo }) => {
      const newImages = props.value.filter((img) => img.id !== file.name)
      props.onChange(newImages)
      return true
    }

    return () => (
      <NUpload
        multiple
        accept="image/*"
        listType="image-card"
        defaultFileList={props.value.map(
          (img) =>
            ({
              id: img.id,
              name: `${img.id}.jpeg`,
              status: 'finished',
              url: `${BASE_URL}/images/${img.id}`
            }) as UploadFileInfo
        )}
        customRequest={customRequest}
        onRemove={handleRemove}
      />
    )
  },
  {
    props: ['value', 'onChange', 'onLoadingChange']
  }
)

export default ImageUpload
