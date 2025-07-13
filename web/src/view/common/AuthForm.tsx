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
import { NButton, NForm, NFormItem, NGrid, NGridItem, NInput, NTabPane, NTabs } from 'naive-ui'
import { useAuth } from '@/composables/useAuth'

const AuthForm = defineComponent(
  (props: {
    onLogin?: (e: Event) => void;
    onRegister?: (e: Event) => void;
    onLoginSuccess?: () => void;
  }) => {
    // Create our own refs
    const loginFormRef = ref()
    const registerFormRef = ref()

    const {
      activeTab,
      loginForm,
      registerForm,
      loginRules,
      registerRules,
      handleLogin,
      handleRegister
    } = useAuth(loginFormRef, registerFormRef)

    return () => (
      <NTabs v-model:value={activeTab.value} type="line">
        <NTabPane name="login" tab="Login">
          <NForm
            ref={loginFormRef}
            model={loginForm.value}
            rules={loginRules}
            label-placement="top"
          >
            <NFormItem label="Username" path="username">
              <NInput v-model:value={loginForm.value.username} placeholder="Enter username" />
            </NFormItem>
            <NFormItem label="Password" path="password">
              <NInput
                v-model:value={loginForm.value.password}
                type="password"
                placeholder="Enter password"
              />
            </NFormItem>
            <NFormItem>
              <NButton type="primary" block onClick={(e) => {
                handleLogin(e, () => {
                  props.onLogin?.(e)
                  props.onLoginSuccess?.()
                })
              }} native-type="submit">
                Login
              </NButton>
            </NFormItem>
          </NForm>
        </NTabPane>
        <NTabPane name="register" tab="Register">
          <NForm
            ref={registerFormRef}
            model={registerForm.value}
            rules={registerRules}
            label-placement="top"
          >
            <NGrid cols="1" x-gap="12" y-gap="12">
              <NGridItem>
                <NFormItem label="Username" path="username">
                  <NInput
                    v-model:value={registerForm.value.username}
                    placeholder="Enter username"
                  />
                </NFormItem>
              </NGridItem>
              <NGridItem>
                <NGrid cols="2" x-gap="12">
                  <NGridItem>
                    <NFormItem label="Password" path="password">
                      <NInput
                        v-model:value={registerForm.value.password}
                        type="password"
                        placeholder="Enter password"
                      />
                    </NFormItem>
                  </NGridItem>
                  <NGridItem>
                    <NFormItem label="Confirm Password" path="confirmPassword">
                      <NInput
                        v-model:value={registerForm.value.confirmPassword}
                        type="password"
                        placeholder="Confirm password"
                      />
                    </NFormItem>
                  </NGridItem>
                </NGrid>
              </NGridItem>
              <NGridItem>
                <NGrid cols="2" x-gap="12">
                  <NGridItem>
                    <NFormItem label="First Name" path="firstName">
                      <NInput
                        v-model:value={registerForm.value.firstName}
                        placeholder="Enter first name"
                      />
                    </NFormItem>
                  </NGridItem>
                  <NGridItem>
                    <NFormItem label="Last Name" path="lastName">
                      <NInput
                        v-model:value={registerForm.value.lastName}
                        placeholder="Enter last name"
                      />
                    </NFormItem>
                  </NGridItem>
                </NGrid>
              </NGridItem>
              <NGridItem>
                <NFormItem label="Phone" path="phone">
                  <NInput
                    v-model:value={registerForm.value.phone}
                    placeholder="Enter phone number"
                  />
                </NFormItem>
              </NGridItem>
              <NGridItem>
                <NFormItem label="Address" path="address">
                  <NInput v-model:value={registerForm.value.address} placeholder="Enter address" />
                </NFormItem>
              </NGridItem>
              <NGridItem>
                <NFormItem>
                  <NButton type="primary" block onClick={(e) => {
                    handleRegister(e, () => props.onRegister?.(e))
                  }} native-type="submit">
                    Register
                  </NButton>
                </NFormItem>
              </NGridItem>
            </NGrid>
          </NForm>
        </NTabPane>
      </NTabs>
    )
  },
  {
    props: ['onLogin', 'onRegister', 'onLoginSuccess']
  }
)

export default AuthForm
