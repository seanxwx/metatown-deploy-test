import { render, screen } from '@testing-library/react'
import immersiveClassroomImage from '../../assets/immersive-classroom.png'
import Section from './Section'

describe('Section', () => {
  test('renders section that displays chip, description and image', async () => {
    const { chip, description, image } = {
      chip: 'Project practice, job search, interview',
      description: {
        heading: 'Immersive Classroom',
        features: [
          {
            icon: 'clock' as const,
            subHeading: 'Flexible learning and communication time',
            paragraph:
              'Enter the class anytime and anywhere to communicate with teachers and classmates',
          },
        ],
      },
      image: {
        src: immersiveClassroomImage,
        caption: 'immersive-classroom',
        width: 560,
        height: 448,
      },
    }
    render(
      <Section
        chip={chip}
        description={{
          heading: description.heading,
          features: description.features.map(
            ({ icon, subHeading, paragraph }) => ({
              icon,
              subHeading,
              paragraph,
            })
          ),
        }}
        image={image}
      />
    )

    expect(screen.getByRole('status', { name: chip })).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: description.heading,
      })
    ).toBeInTheDocument()

    expect(
      await screen.findByLabelText(description.features[0].icon)
    ).toBeInTheDocument()

    expect(
      screen.getByText(description.features[0].subHeading)
    ).toBeInTheDocument()

    expect(
      screen.getByText(description.features[0].paragraph)
    ).toBeInTheDocument()

    expect(
      screen.getByRole<HTMLImageElement>('img', { name: image.caption }).src
    ).toContain('immersive-classroom.png')

    expect(screen.getByRole('img', { name: image.caption })).toBeInTheDocument()

    expect(screen.getByRole('img', { name: image.caption })).toHaveAttribute(
      'width',
      String(image.width)
    )

    expect(screen.getByRole('img', { name: image.caption })).toHaveAttribute(
      'height',
      String(image.height)
    )
  })
})
