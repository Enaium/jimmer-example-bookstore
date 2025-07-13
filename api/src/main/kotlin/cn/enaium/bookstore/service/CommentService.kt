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

package cn.enaium.bookstore.service

import cn.enaium.bookstore.error.CommentException
import cn.enaium.bookstore.model.entity.*
import cn.enaium.bookstore.model.entity.dto.CommentInput
import cn.enaium.bookstore.model.entity.dto.CommentView
import cn.enaium.bookstore.utility.getCurrentAccountId
import cn.enaium.bookstore.utility.isCurrentUserModerator
import org.babyfish.jimmer.Page
import org.babyfish.jimmer.sql.ast.mutation.SaveMode
import org.babyfish.jimmer.sql.kt.KSqlClient
import org.babyfish.jimmer.sql.kt.ast.expression.`eq?`
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

/**
 * @author Enaium
 */
@Service
class CommentService(
    val sql: KSqlClient
) {
    fun getComments(
        index: Int = 0,
        size: Int = 10,
        parentId: UUID? = null,
        bookId: UUID? = null,
        authorId: UUID? = null,
        issuerId: UUID? = null,
    ): Page<CommentView> {
        return sql.createQuery(Comment::class) {
            where(table.parentId `eq?` parentId)
            where(table.bookId `eq?` bookId)
            where(table.authorId `eq?` authorId)
            where(table.issuerId `eq?` issuerId)
            select(table.fetch(CommentView::class))
        }.fetchPage(index, size)
    }

    fun getComment(id: UUID): CommentView? {
        return sql.findById(CommentView::class, id)
    }

    @Transactional
    fun save(input: CommentInput) {
        sql.save(input) {
            setMode(SaveMode.NON_IDEMPOTENT_UPSERT)
        }
    }

    @Transactional
    fun delete(id: UUID) {
        val currentAccountId = getCurrentAccountId()
        if (currentAccountId == null) {
            throw CommentException.notAuthenticated()
        }

        val comment = sql.findById(Comment::class, id)
        if (comment == null) {
            throw CommentException.notFound()
        }

        if (!isCurrentUserModerator() && comment.account.id != currentAccountId) {
            throw CommentException.notAuthorized()
        }

        sql.deleteById(Comment::class, id)
    }
} 