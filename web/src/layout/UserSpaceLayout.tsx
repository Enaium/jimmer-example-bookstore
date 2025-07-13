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

import { defineComponent, ref, watch } from 'vue'
import { NIcon, NLayout, NLayoutContent, NLayoutSider, NMenu } from 'naive-ui'
import { Heart24Regular, ThumbLike24Regular } from '@vicons/fluent'
import { RouterView, useRoute, useRouter } from 'vue-router'

const UserSpaceLayout = defineComponent(() => {
  const router = useRouter()
  const route = useRoute()
  const activeKey = ref('voted')

  // Update active key based on current route
  watch(
    () => route.path,
    (path) => {
      if (path.includes('/user/favourited')) {
        activeKey.value = 'favourited'
      } else {
        activeKey.value = 'voted'
      }
    },
    { immediate: true }
  )

  const menuOptions = [
    {
      label: 'Voted',
      key: 'voted',
      icon: () => (
        <NIcon>
          <ThumbLike24Regular />
        </NIcon>
      )
    },
    {
      label: 'Favourited',
      key: 'favourited',
      icon: () => (
        <NIcon>
          <Heart24Regular />
        </NIcon>
      )
    }
  ]

  const handleMenuSelect = (key: string) => {
    activeKey.value = key
    if (key === 'voted') {
      router.push('/user/voted')
    } else if (key === 'favourited') {
      router.push('/user/favourited')
    }
  }

  return () => (
    <NLayout class="h-screen" hasSider>
      <NLayoutSider bordered>
        <div class="p-4">
          <h2 class="text-lg font-bold mb-4">User Space</h2>
          <NMenu
            value={activeKey.value}
            options={menuOptions}
            onUpdateValue={handleMenuSelect}
            class="border-none"
          />
        </div>
      </NLayoutSider>
      <NLayoutContent>
        <RouterView />
      </NLayoutContent>
    </NLayout>
  )
})

export default UserSpaceLayout
