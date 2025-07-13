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

import cn.enaium.bookstore.model.entity.*
import cn.enaium.bookstore.model.entity.dto.BookInput
import cn.enaium.bookstore.model.entity.dto.BookView
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
class BookService(
    val sql: KSqlClient
) {
    fun getBooks(
        index: Int = 0,
        size: Int = 10,
        keywords: String? = null,
    ): Page<BookView> {
        return sql.createQuery(Book::class) {
            if (!keywords.isNullOrBlank()) {
                where(
                    or(
                        table.name `ilike?` keywords,
                        table.issuer.name `ilike?` keywords,
                        table.authors {
                            or(firstName `ilike?` keywords, lastName `ilike?` keywords)
                        },
                        table.tags {
                            name `ilike?` keywords
                        }
                    )
                )
            }
            select(table.fetch(BookView::class))
        }.fetchPage(index, size)
    }

    fun getBook(id: UUID): BookView? {
        return sql.findById(BookView::class, id)
    }

    @Transactional
    fun save(input: BookInput) {
        sql.save(input)
    }

    @Transactional
    fun delete(id: UUID) {
        sql.deleteById(Book::class, id)
    }
} 