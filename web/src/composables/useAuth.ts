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

import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { api } from '@/common/Api'
import { authStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import type { ApiErrors } from '@/__generated'
import type { AccountInput } from '@/__generated/model/static'
import { match } from 'ts-pattern'

export function useAuth(loginFormRef?: any, registerFormRef?: any) {
  const activeTab = ref('login')

  // Login form state
  const loginForm = ref({ username: '', password: '' })
  // Register form state
  const registerForm = ref({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  })


  // Naive UI message
  const message = useMessage()
  // Router
  const router = useRouter()
  // Auth store
  const auth = authStore()

  // Validation rules
  const loginRules = {
    username: [{ required: true, message: 'Username is required', trigger: ['input', 'blur'] }],
    password: [{ required: true, message: 'Password is required', trigger: ['input', 'blur'] }]
  }

  const registerRules = {
    username: [{ required: true, message: 'Username is required', trigger: ['input', 'blur'] }],
    password: [{ required: true, message: 'Password is required', trigger: ['input', 'blur'] }],
    confirmPassword: [
      { required: true, message: 'Please confirm your password', trigger: ['input', 'blur'] },
      {
        validator(_rule: any, value: string) {
          return value === registerForm.value.password
        },
        message: 'Passwords do not match',
        trigger: ['input', 'blur']
      }
    ]
  }

  function handleLogin(e: Event, onSuccess?: () => void) {
    e.preventDefault()
    loginFormRef?.value?.validate((errors: any) => {
      if (!errors) {
        api.authController
          .login({ body: loginForm.value })
          .then((res) => {
            auth.set(res)
            message.success('Login successful!')
            activeTab.value = 'login'
            onSuccess?.()
            router.push('/')
          })
          .catch((err: ApiErrors['authController']['login']) => {
            match(err.code)
              .with('USERNAME_DOES_NOT_EXIST', () => {
                message.error('Username does not exist')
              })
              .otherwise(() => {
                message.error('Login failed')
              })
          })
      }
    })
  }

  function handleRegister(e: Event, onSuccess?: () => void) {
    e.preventDefault()
    registerFormRef?.value?.validate((errors: any) => {
      if (!errors) {
        const accountInput: AccountInput = {
          username: registerForm.value.username,
          password: registerForm.value.password,
          profile: {
            firstName: registerForm.value.firstName || undefined,
            lastName: registerForm.value.lastName || undefined,
            phone: registerForm.value.phone || undefined,
            address: registerForm.value.address || undefined
          }
        }

        api.authController
          .register({
            body: accountInput
          })
          .then(() => {
            message.success('Register successful! Please login.')
            activeTab.value = 'login'
            onSuccess?.()
          })
          .catch((err: ApiErrors['authController']['register']) => {
            match(err.code)
              .with('USERNAME_ALREADY_EXISTS', () => {
                message.error('Username already exists')
              })
              .otherwise(() => {
                message.error('Register failed')
              })
          })
      }
    })
  }

  function resetForms() {
    loginForm.value = { username: '', password: '' }
    registerForm.value = {
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: ''
    }
    activeTab.value = 'login'
  }

  return {
    activeTab,
    loginForm,
    registerForm,
    loginRules,
    registerRules,
    handleLogin,
    handleRegister,
    resetForms
  }
} 