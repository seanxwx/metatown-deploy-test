import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Button from '@/components/Button'
import TextField from '@/components/TextField'
import upsertSpacePosition from '@/db/upsertSpacePosition'
import upsertStageConfig from '@/db/upsertStageConfig'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import useSpacePosition from '@/hooks/useSpacePosition'
import useStageConfig from '@/hooks/useStageConfig'
import prepareEntry from './_utils/prepareEntry'
import prepareWalls from './_utils/prepareWalls'
import prepareGrounds from './_utils/prepareGrounds'

const isValidNumber = z.preprocess(
  (value) => (Number.isNaN(value) ? 0 : value),
  z.number().gt(0, 'Required')
)

const schema = z.object({
  rows: isValidNumber,
  columns: isValidNumber,
})

type Schema = z.infer<typeof schema>

const ConfigDimensionsForm: FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)
  const { data: sessionUser } = useSessionUser()

  const { data: stageConfig, mutate: mutateStageConfig } = useStageConfig(
    space?.id
  )

  const { data: spacePosition, mutate: mutateSpacePosition } = useSpacePosition(
    space?.id
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { rows: stageConfig?.rows, columns: stageConfig?.columns },
  })

  if (!space || !sessionUser) {
    return null
  }

  const onSubmit = async (data: Schema): Promise<void> => {
    const entry = prepareEntry(data, stageConfig?.entry)

    await upsertStageConfig({
      spaceId: space.id,
      rows: data.rows,
      columns: data.columns,
      blocks: prepareWalls(data, stageConfig?.blocks),
      grounds: prepareGrounds(data, stageConfig?.grounds),
      entry,
    })

    if (!spacePosition) {
      await upsertSpacePosition({
        userId: sessionUser.id,
        spaceId: space.id,
        ...entry,
      })

      await mutateSpacePosition()
    }

    await mutateStageConfig()
  }

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit(async (data) => onSubmit(data))(event)
      }
      className="flex items-end space-x-4"
    >
      <div className="w-32">
        <TextField
          label="Rows"
          type="number"
          errorMessage={errors.rows?.message}
          {...register('rows', { valueAsNumber: true })}
        />
      </div>
      <div className="w-32">
        <TextField
          label="Columns"
          type="number"
          errorMessage={errors.columns?.message}
          {...register('columns', { valueAsNumber: true })}
        />
      </div>
      <Button type="submit" isLoading={isSubmitting}>
        Set Dimensions
      </Button>
    </form>
  )
}

export default ConfigDimensionsForm
