import { FC } from 'react'
import Chip from '@/components/Chip'
import TeamMemberList from './_components/TeamMemberList'

const AboutTheTeam: FC = () => (
  <>
    <div className="text-center">
      <Chip>Meta Town</Chip>
      <h2 className="mt-2 text-2xl font-bold md:mt-4 md:text-5xl">
        Make Remote Collaboration More Efficient And Fun
      </h2>
    </div>
    <div className="mt-6 md:mt-16">
      <TeamMemberList />
    </div>
  </>
)

export default AboutTheTeam
