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

import cn.enaium.bookstore.error.AccountException
import cn.enaium.bookstore.model.AuthResponse
import cn.enaium.bookstore.model.entity.Account
import cn.enaium.bookstore.model.entity.dto.AccountInput
import cn.enaium.bookstore.model.entity.username
import cn.enaium.bookstore.utility.JwtTokenProvider
import org.babyfish.jimmer.sql.ast.mutation.SaveMode
import org.babyfish.jimmer.sql.exception.SaveException
import org.babyfish.jimmer.sql.kt.KSqlClient
import org.babyfish.jimmer.sql.kt.ast.expression.eq
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * @author Enaium
 */
@Service
class AuthService(
    val sql: KSqlClient,
    val authenticationManager: AuthenticationManager,
    val jwtTokenProvider: JwtTokenProvider,
    val passwordEncoder: PasswordEncoder
) {
    fun login(input: AccountInput): AuthResponse {
        val account = sql.createQuery(Account::class) {
            where(table.username eq input.username)
            select(table)
        }.fetchOneOrNull() ?: throw AccountException.usernameDoesNotExist()

        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(
                input.username,
                input.password
            )
        )

        return AuthResponse(
            account.id,
            jwtTokenProvider.generateToken(input.username),
            account.role
        )
    }

    @Transactional
    fun register(input: AccountInput) {
        try {
            sql.save(input.copy(password = passwordEncoder.encode(input.password))) {
                setMode(SaveMode.INSERT_ONLY)
            }
        } catch (e: SaveException.NotUnique) {
            throw AccountException.usernameAlreadyExists()
        }
    }
} 