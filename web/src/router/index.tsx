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

import { createRouter, createWebHistory } from 'vue-router'
import Auth from '@/view/Auth'
import HomeLayout from '@/layout/HomeLayout'
import Books from '@/view/Books'
import BookDetail from '@/view/detail/BookDetail'
import AuthorDetail from '@/view/detail/AuthorDetail'
import IssuerDetail from '@/view/detail/IssuerDetail'
import ManageLayout from '@/layout/ManageLayout'
import Issuer from '@/view/manage/Issuer'
import Author from '@/view/manage/Author'
import Book from '@/view/manage/Book'
import UserSpaceLayout from '@/layout/UserSpaceLayout'
import VotedItems from '@/view/VotedItems'
import FavouritedItems from '@/view/FavouritedItems'
import Issuers from '@/view/Issuers'
import Authors from '@/view/Authors'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: <HomeLayout />,
      children: [
        { path: '', redirect: '/books' },
        { path: 'books', component: <Books />, meta: { title: 'Books' } },
        { path: 'issuers', component: <Issuers />, meta: { title: 'Issuers' } },
        { path: 'authors', component: <Authors />, meta: { title: 'Authors' } },
        { path: 'book/:id', component: <BookDetail />, meta: { title: 'Book Detail' } },
        { path: 'author/:id', component: <AuthorDetail />, meta: { title: 'Author Detail' } },
        { path: 'issuer/:id', component: <IssuerDetail />, meta: { title: 'Issuer Detail' } },
        {
          path: 'user',
          component: <UserSpaceLayout />,
          children: [
            { path: '', redirect: '/user/voted' },
            { path: 'voted', component: <VotedItems />, meta: { title: 'Voted Items' } },
            {
              path: 'favourited',
              component: <FavouritedItems />,
              meta: { title: 'Favourited Items' }
            }
          ]
        }
      ]
    },
    {
      path: '/manage',
      component: <ManageLayout />,
      children: [
        { path: '', redirect: '/manage/issuer' },
        { path: 'issuer', component: <Issuer />, meta: { title: 'Issuer' } },
        { path: 'author', component: <Author />, meta: { title: 'Author' } },
        { path: 'book', component: <Book />, meta: { title: 'Book' } }
      ]
    },
    { path: '/auth', component: <Auth /> }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string
  next()
})

export default router
