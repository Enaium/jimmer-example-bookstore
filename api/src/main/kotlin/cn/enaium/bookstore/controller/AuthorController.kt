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

package cn.enaium.bookstore.controller

import cn.enaium.bookstore.model.entity.dto.AuthorInput
import cn.enaium.bookstore.model.entity.dto.AuthorView
import cn.enaium.bookstore.service.AuthorService
import org.babyfish.jimmer.Page
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.*

/**
 * @author Enaium
 */
@RestController
@RequestMapping("/authors")
class AuthorController(
    val authorService: AuthorService
) {
    @GetMapping
    fun getAuthors(
        @RequestParam(value = "index", defaultValue = "0") index: Int = 0,
        @RequestParam(value = "size", defaultValue = "10") size: Int = 10,
        @RequestParam(value = "name", required = false) name: String? = null,
    ): Page<AuthorView> {
        return authorService.getAuthors(index, size, name)
    }

    @GetMapping("/{id}")
    fun getAuthor(@PathVariable id: UUID): AuthorView? {
        return authorService.getAuthor(id)
    }

    @PreAuthorize("hasRole('ROLE_MODERATOR')")
    @PutMapping
    fun save(@RequestBody input: AuthorInput) {
        authorService.save(input)
    }

    @PreAuthorize("hasRole('ROLE_MODERATOR')")
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID) {
        authorService.delete(id)
    }
}