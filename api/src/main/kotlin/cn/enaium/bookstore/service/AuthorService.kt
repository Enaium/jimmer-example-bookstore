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

import cn.enaium.bookstore.model.entity.Author
import cn.enaium.bookstore.model.entity.dto.AuthorInput
import cn.enaium.bookstore.model.entity.dto.AuthorView
import cn.enaium.bookstore.model.entity.firstName
import cn.enaium.bookstore.model.entity.lastName
import org.babyfish.jimmer.Page
import org.babyfish.jimmer.sql.kt.KSqlClient
import org.babyfish.jimmer.sql.kt.ast.expression.`ilike?`
import org.babyfish.jimmer.sql.kt.ast.expression.or
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

/**
 * @author Enaium
 */
@Service
class AuthorService(
    val sql: KSqlClient
) {
    fun getAuthors(
        index: Int = 0,
        size: Int = 10,
        name: String? = null,
    ): Page<AuthorView> {
        return sql.createQuery(Author::class) {
            where(or(table.firstName `ilike?` name, table.lastName `ilike?` name))
            select(table.fetch(AuthorView::class))
        }.fetchPage(index, size)
    }

    fun getAuthor(id: UUID): AuthorView? {
        return sql.findById(AuthorView::class, id)
    }

    @Transactional
    fun save(input: AuthorInput) {
        sql.save(input)
    }

    @Transactional
    fun delete(id: UUID) {
        sql.deleteById(Author::class, id)
    }
} 