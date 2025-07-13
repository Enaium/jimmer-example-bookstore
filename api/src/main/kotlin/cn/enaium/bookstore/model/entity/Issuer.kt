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

package cn.enaium.bookstore.model.entity

import cn.enaium.bookstore.model.entity.common.BaseEntity
import org.babyfish.jimmer.Formula
import org.babyfish.jimmer.sql.Entity
import org.babyfish.jimmer.sql.Key
import org.babyfish.jimmer.sql.OneToMany

/**
 * @author Enaium
 */
@Entity
interface Issuer : BaseEntity {

    @Key
    val name: String

    val website: String?

    @OneToMany(mappedBy = "issuer")
    val books: List<Book>

    @Formula(dependencies = ["books"])
    val bookCount: Int
        get() = books.size

    @OneToMany(mappedBy = "issuer")
    val votes: List<Vote>

    @Formula(dependencies = ["votes"])
    val voteCount: Int
        get() = votes.size

    @OneToMany(mappedBy = "issuer")
    val comments: List<Comment>

    @Formula(dependencies = ["comments"])
    val commentCount: Int
        get() = comments.size

    @OneToMany(mappedBy = "issuer")
    val favourites: List<Favourite>

    @Formula(dependencies = ["favourites"])
    val favouriteCount: Int
        get() = favourites.size
}
