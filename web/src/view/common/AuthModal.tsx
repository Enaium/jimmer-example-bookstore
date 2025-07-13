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

import { defineComponent } from 'vue'
import { NModal } from 'naive-ui'
import AuthForm from './AuthForm'

const AuthModal = defineComponent(
  (props: { show: boolean; onUpdateShow: (show: boolean) => void }) => {
    function handleClose() {
      props.onUpdateShow(false)
    }

    function onLogin(e: Event) {
      console.log('AuthModal onLogin called')
      // The AuthForm will handle the login internally
      // We just need to close the modal after successful login
    }

    function onRegister(e: Event) {
      // The AuthForm will handle the register internally
    }

    return () => (
      <NModal
        show={props.show}
        onUpdateShow={props.onUpdateShow}
        preset="card"
        title="Authentication"
        class="w-96"
        onClose={handleClose}
      >
        <AuthForm
          onLogin={onLogin}
          onRegister={onRegister}
          onLoginSuccess={() => {
            console.log('AuthModal login success callback')
            props.onUpdateShow(false)
          }}
        />
      </NModal>
    )
  },
  {
    props: ['show', 'onUpdateShow']
  }
)

export default AuthModal
