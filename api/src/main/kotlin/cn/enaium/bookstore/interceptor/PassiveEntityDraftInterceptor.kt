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

package cn.enaium.bookstore.interceptor

import cn.enaium.bookstore.model.IdUserDetails
import cn.enaium.bookstore.model.entity.common.PassiveEntity
import cn.enaium.bookstore.model.entity.common.PassiveEntityDraft
import org.babyfish.jimmer.kt.isLoaded
import org.babyfish.jimmer.sql.DraftInterceptor
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component

/**
 * @author Enaium
 */
@Component
class PassiveEntityDraftInterceptor : DraftInterceptor<PassiveEntity, PassiveEntityDraft> {
    override fun beforeSave(draft: PassiveEntityDraft, original: PassiveEntity?) {
        val userDetails = SecurityContextHolder.getContext().authentication.principal as IdUserDetails
        if (!isLoaded(draft, PassiveEntity::account)) {
            draft.account {
                id = userDetails.id
            }
        }

        if (original === null) {
            if (!isLoaded(draft, PassiveEntity::account)) {
                draft.account {
                    id = userDetails.id
                }
            }
        }
    }
}