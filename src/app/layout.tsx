import { type Metadata } from 'next'
import { FC, ReactNode } from 'react'
import { Roboto } from 'next/font/google'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  weight: ['400', '500', '700', '900'],
})

export const metadata: Metadata = {
  title: 'Meta Town',
  description:
    'Meta Town is a virtual social space where you can interact with friends in real-time, chat, and join multiplayer video meetings. Jump in and start your Metaverse experience now!',
}

interface Props {
  children: ReactNode
}

const RootLayout: FC<Props> = ({ children }) => (
  <html lang="en" className={`${roboto.variable} `}>
    <body>
      {children}
      <div id="modal-root" />
    </body>
  </html>
)

export default RootLayout
