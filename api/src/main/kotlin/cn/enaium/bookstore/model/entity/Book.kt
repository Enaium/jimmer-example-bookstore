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
import org.babyfish.jimmer.sql.*
import java.math.BigDecimal

/**
 * @author Enaium
 */
@Entity
interface Book : BaseEntity {

    @Key
    val name: String

    @Key
    val edition: Int

    val price: BigDecimal

    @ManyToOne
    val issuer: Issuer

    @OneToMany(mappedBy = "book")
    val comments: List<Comment>

    @Formula(dependencies = ["comments"])
    val commentCount: Int
        get() = comments.size

    @OneToMany(mappedBy = "book")
    val votes: List<Vote>

    @Formula(dependencies = ["votes"])
    val voteCount: Int
        get() = votes.size

    @OneToMany(mappedBy = "book")
    val favourites: List<Favourite>

    @Formula(dependencies = ["favourites"])
    val favouriteCount: Int
        get() = favourites.size

    @ManyToMany(mappedBy = "books")
    val authors: List<Author>

    @Formula(dependencies = ["authors"])
    val authorCount: Int
        get() = authors.size

    @ManyToMany
    @JoinTable(
        name = "book_tag_mapping",
        joinColumns = [JoinColumn(name = "book_id")],
        inverseJoinColumns = [JoinColumn(name = "tag_id")],
    )
    val tags: List<Tag>

    @ManyToMany
    @JoinTable(
        name = "book_image_mapping",
        joinColumns = [JoinColumn(name = "book_id")],
        inverseJoinColumns = [JoinColumn(name = "image_id")],
    )
    val images: List<Image>
}
