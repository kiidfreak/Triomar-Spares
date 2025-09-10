"use client"

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { AuthModalProvider } from './auth/auth-modal-context'

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<SessionProvider>
			<AuthModalProvider>
				{children}
			</AuthModalProvider>
		</SessionProvider>
	)
}
