'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Button from '@/components/Button'
import TextField from '@/components/TextField'
import login from '@/db/login'
import useSession from '@/hooks/useSession'
import navigate from '@/utils/navigate'

const schema = z.object({
  email: z.string().nonempty('Please enter your email address'),
  password: z.string().nonempty('Please enter a password'),
}) satisfies z.ZodType<{
  email: string
  password: string
}>

type ServerError = Awaited<ReturnType<typeof login>>['error']
type Schema = z.infer<typeof schema>

export const getServerErrorMessage = (
  error: ServerError
): string | undefined => {
  if (!error) {
    return
  }

  if (error.code === 'invalid_credentials') {
    return 'Incorrect email or password. Please try again.'
  }

  return 'Something wrong, please try again later.'
}

const Form: FC = () => {
  const { mutate } = useSession(true)

  const [serverError, setServerError] = useState<ServerError>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email, password }: Schema): Promise<void> => {
    const { error } = await login({ email, password })

    if (error) {
      setServerError(error)

      return
    }

    await mutate()
    navigate('/spaces')
  }

  return (
    <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
      <div className="relative space-y-9">
        <TextField
          label="Email"
          type="email"
          errorMessage={errors.email?.message}
          {...register('email')}
        />
        <div className="relative">
          <TextField
            label="Password"
            type="password"
            errorMessage={errors.password?.message}
            {...register('password')}
          />

          <a
            aria-label="forgotPassword"
            href=""
            className="absolute right-0 top-0 text-sm font-bold text-[#6459e5]"
          >
            Forgot Password?
          </a>
        </div>

        {serverError && (
          <p className="absolute mb-2 text-xs text-rose-500">
            {getServerErrorMessage(serverError)}
          </p>
        )}
      </div>

      <Button
        className="mt-14 w-full"
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        Login
      </Button>
    </form>
  )
}

export default Form
