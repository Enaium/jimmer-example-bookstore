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

import cn.enaium.bookstore.controller.FavouriteController
import cn.enaium.bookstore.model.entity.*
import cn.enaium.bookstore.model.entity.dto.FavouriteInput
import cn.enaium.bookstore.model.entity.dto.FavouriteView
import cn.enaium.bookstore.utility.getCurrentAccountId
import org.babyfish.jimmer.Page
import org.babyfish.jimmer.sql.kt.KSqlClient
import org.babyfish.jimmer.sql.kt.ast.expression.`eq?`
import org.babyfish.jimmer.sql.kt.ast.expression.isNotNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

/**
 * @author Enaium
 */
@Service
class FavouriteService(
    val sql: KSqlClient
) {
    fun getFavourites(
        index: Int = 0,
        size: Int = 10,
        type: FavouriteController.FavouriteType,
    ): Page<FavouriteView> {
        return sql.createQuery(Favourite::class) {
            where(table.accountId `eq?` getCurrentAccountId())
            when (type) {
                FavouriteController.FavouriteType.ISSUER -> where(table.issuerId.isNotNull())
                FavouriteController.FavouriteType.BOOK -> where(table.bookId.isNotNull())
                FavouriteController.FavouriteType.AUTHOR -> where(table.authorId.isNotNull())
            }
            select(table.fetch(FavouriteView::class))
        }.fetchPage(index, size)
    }

    fun state(issuerId: UUID?, bookId: UUID?, authorId: UUID?): FavouriteView? {
        return sql.createQuery(Favourite::class) {
            where(table.issuerId `eq?` issuerId)
            where(table.bookId `eq?` bookId)
            where(table.authorId `eq?` authorId)
            select(table.fetch(FavouriteView::class))
        }.fetchOneOrNull()
    }

    @Transactional
    fun save(input: FavouriteInput) {
        sql.save(input)
    }

    @Transactional
    fun delete(id: UUID) {
        sql.deleteById(Favourite::class, id)
    }
}