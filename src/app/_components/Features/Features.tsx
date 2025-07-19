import { FC } from 'react'
import immersiveClassroomImage from './assets/immersive-classroom.png'
import interactiveClassroomImage from './assets/interactive-class-atmosphere.png'
import faceClassroomImage from './assets/face-to-face-class-experience.png'
import onlineClassroomImage from './assets/online-learning-reduces-loneliness.png'
import Section from './_components/Section'

export const SECTIONS = [
  {
    chip: 'Project practice, job search, interview',
    description: {
      heading: 'Immersive Classroom',
      features: [
        {
          icon: 'clock',
          subHeading: 'Flexible learning and communication time',
          paragraph:
            'Enter the class anytime and anywhere to communicate with teachers and classmates',
        },
        {
          icon: 'book-open',
          subHeading: 'Learning mode combining work and rest',
          paragraph: 'Social experience of mutual entertainment after learning',
        },
        {
          icon: 'settings',
          subHeading: 'Custom avatar, learning desk DIY',
          paragraph:
            'Personalized image display, express the uniqueness of self',
        },
      ],
    },
    image: {
      src: immersiveClassroomImage,
      caption: 'immersive-classroom',
      width: 560,
      height: 448,
    },
  },
  {
    chip: 'Experience the fun of learning',
    description: {
      heading: 'Interactive Class Atmosphere',
      features: [
        {
          icon: 'cloud',
          subHeading: 'Break down remote social barriers',
          paragraph:
            'Interact in real time across geographic and temporal constraints',
        },
        {
          icon: 'book-open',
          subHeading: 'Learning mode combining work and rest',
          paragraph:
            'Social experience with mutual entertainment after learning',
        },
      ],
    },
    image: {
      src: interactiveClassroomImage,
      caption: 'interactive classroom experience',
      width: 560,
      height: 315,
    },
  },
  {
    chip: 'More authentic communication',
    description: {
      heading: 'Face-to-face Class Experience',
      features: [
        {
          icon: 'clock',
          subHeading: 'Flexible learning and communication time',
          paragraph: 'Enter the class anytime and anywhere',
        },
        {
          icon: 'brick-wall',
          subHeading: 'Immersive learning environment',
          paragraph:
            'A highly interactive and immersive learning environment is created through virtual Spaces. Students can interact and collaborate in virtual classrooms, LABS, and conference rooms, enhancing the sense of engagement and actual classroom experience',
        },
        {
          icon: 'square-terminal',
          subHeading: 'Efficient and enjoyable partner programming',
          paragraph:
            'Dialogue in the learning space. Multiple people can share their screens for more efficient code reviews',
        },
      ],
    },
    image: {
      src: faceClassroomImage,
      caption: 'Face to face in a classroom',
      width: 560,
      height: 338,
    },
  },
  {
    chip: 'Instant interaction',
    description: {
      heading: 'Online Learning Reduces Loneliness',
      features: [
        {
          icon: 'user-round',
          subHeading: 'Reduce the loneliness of learning',
          paragraph:
            'See who else is studying with you, find like-minded learning partners, and progress together',
        },
        {
          icon: 'message-square-more',
          subHeading: 'Improve social skills',
          paragraph:
            "In the virtual environment, students are free to make new friends and have social interactions. This helps improve students' social skills and teamwork spirit, especially for introverted or shy students, virtual environments provide a more comfortable platform for communication.",
        },
      ],
    },
    image: {
      src: onlineClassroomImage,
      caption: 'Online learning friendly environment reduces loneliness',
      width: 560,
      height: 409,
    },
  },
] as const

const Features: FC = () => (
  <>
    {SECTIONS.map(({ chip, description, image }) => (
      <Section
        key={chip}
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
    ))}
  </>
)

export default Features
