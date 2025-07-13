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
import { NAvatar, NDropdown, NLayout, NLayoutContent, NLayoutHeader, NMenu } from 'naive-ui'
import { RouterView, useRouter } from 'vue-router'
import { authStore } from '@/store/auth'
import AuthModal from '@/view/common/AuthModal'

const menuOptions = [
  { label: 'Books', key: '/books' },
  { label: 'Issuers', key: '/issuers' },
  { label: 'Authors', key: '/authors' }
]

const HomeLayout = defineComponent(() => {
  const router = useRouter()
  const auth = authStore()
  const showAuthModal = ref(false)

  const user = computed(() => auth.get)

  function handleMenuSelect(key: string) {
    router.push(key)
  }

  return () => (
    <NLayout class="h-screen">
      <NLayoutHeader
        class="fixed top-0 left-0 right-0 z-50 w-full bg-white flex items-center justify-between px-8 h-16"
        bordered
      >
        <NMenu
          mode="horizontal"
          options={menuOptions}
          onUpdateValue={handleMenuSelect}
          class="flex-1"
        />
        <div class="ml-auto flex items-center">
          {user.value ? (
            <NDropdown
              options={[
                { label: 'Space', key: 'space' },
                ...(user.value.role === 'MODERATOR' ? [{ label: 'Manage', key: 'manage' }] : []),
                { label: 'Logout', key: 'logout' }
              ]}
              onSelect={(key) => {
                if (key === 'space') {
                  router.push('/user')
                } else if (key === 'manage') {
                  router.push('/manage')
                } else if (key === 'logout') {
                  auth.set(undefined)
                }
              }}
            >
              <div class="flex items-center cursor-pointer">
                <NAvatar size={32} class="mr-2">
                  ?
                </NAvatar>
                <span>User</span>
              </div>
            </NDropdown>
          ) : (
            <span class="cursor-pointer" onClick={() => (showAuthModal.value = true)}>
              Login
            </span>
          )}
        </div>
      </NLayoutHeader>
      <NLayoutContent class="mt-16 p-6">
        <RouterView />
      </NLayoutContent>
      <AuthModal
        show={showAuthModal.value}
        onUpdateShow={(show: boolean) => (showAuthModal.value = show)}
      />
    </NLayout>
  )
})

export default HomeLayout
