import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { db } from '@/lib/db'

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null
				try {
					const { rows } = await db.query('select id, email, password_hash, name from users_auth where email = $1 limit 1', [credentials.email])
					const user = rows[0]
					if (!user) return null
					const ok = await compare(credentials.password, user.password_hash)
					if (!ok) return null
					return { id: user.id, email: user.email, name: user.name || user.email } as any
				} catch (error) {
					console.error('Auth error:', error)
					return null
				}
			},
		}),
	],
	session: { strategy: 'jwt' },
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.userId = (user as any).id
				token.email = user.email
				token.name = user.name
				// fetch role: admin/manager/viewer from admin_users, else 'user'
				try {
					const { rows } = await db.query(
						`select role from admin_users where user_id = $1 limit 1`,
						[(user as any).id]
					)
					token.role = rows[0]?.role || 'user'
				} catch (error) {
					console.error('Role fetch error:', error)
					token.role = 'user'
				}
			}
			return token as any
		},
		async session({ session, token }) {
			if (token) {
				;(session as any).user.id = (token as any).userId
				session.user!.email = token.email as string
				session.user!.name = token.name as string
				;(session as any).user.role = (token as any).role || 'user'
			}
			return session
		},
	},
	secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
	debug: process.env.NODE_ENV === 'development',
}


