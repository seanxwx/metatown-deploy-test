import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Button from '@/components/Button'
import IconButton from '@/components/IconButton'
import TextField from '@/components/TextField'
import upsertZone from '@/db/upsertZone'
import useSpace from '@/hooks/useSpace'
import useZones from '@/hooks/useZones'
import getDeterministicColorStyle from '@/utils/getDeterministicColorStyle'

type Schema = z.infer<typeof schema>

interface Props {
  selectedId?: string
  onSelect: (id: string) => void
}

const schema = z.object({
  name: z.string().nonempty('Required'),
  size: z.number().optional(),
})

const MeetingZone: FC<Props> = ({ selectedId = undefined, onSelect }) => {
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)
  const { data: zones, mutate } = useZones(spaceId)

  const {
    register,
    unregister,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const [showSize, setShowSize] = useState(false)

  if (!space) {
    return null
  }

  const onSubmit = async ({ name, size }: Schema): Promise<void> => {
    const zone = await upsertZone({
      spaceId: space.id,
      name,
      type: 'MEETING',
      size,
    })

    await mutate()

    if (!zone) {
      return
    }

    onSelect(zone.id)

    reset()
  }

  return (
    <div className="space-y-4">
      <p>Meeting Zone</p>
      <form
        className="flex items-end space-x-4"
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      >
        <TextField
          label="Name"
          type="text"
          errorMessage={errors.name?.message}
          {...register('name')}
        />
        {showSize && (
          <div className="w-24">
            <TextField
              label="Size"
              type="number"
              {...register('size', { valueAsNumber: true })}
            />
          </div>
        )}
        {showSize ? (
          <IconButton
            icon="x"
            label="Remove size"
            variant="naked"
            onClick={() => {
              setShowSize(false)
              unregister('size')
            }}
          />
        ) : (
          <Button variant="naked" onClick={() => setShowSize(true)}>
            Add Size
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          Create
        </Button>
      </form>
      {!!zones?.length && (
        <div role="group" aria-label="Zones" className="flex flex-wrap gap-2">
          {zones.map((zone) => (
            <Button
              key={zone.id}
              style={
                selectedId === zone.id
                  ? getDeterministicColorStyle(zone.id)
                  : undefined
              }
              variant={selectedId === zone.id ? 'success' : 'secondary'}
              size="small"
              onClick={() => onSelect(zone.id)}
              className="text-left"
            >
              {zone.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

export default MeetingZone
