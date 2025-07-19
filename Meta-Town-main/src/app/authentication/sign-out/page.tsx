'use client'

import { FC, useEffect } from 'react'
import signOut from '@/db/signOut'
import useSession from '@/hooks/useSession'
import navigate from '@/utils/navigate'
import GlobalLoading from '@/components/GlobalLoading'

const SignOut: FC = () => {
  const { mutate } = useSession(true)

  useEffect(() => {
    const handleSignOut = async (): Promise<void> => {
      await signOut()

      await mutate()

      navigate('/authentication/login')
    }

    void handleSignOut()
  })

  return <GlobalLoading />
}

export default SignOut
