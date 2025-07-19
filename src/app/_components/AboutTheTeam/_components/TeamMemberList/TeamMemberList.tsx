import { FC } from 'react'
import DicebearPixelArtAvatar from './_components/DicebearPixelArtAvatar'
import LinkedinLogo from './assets/linkedin-logo.svg'

export const TEAM_MEMBERS = [
  {
    avatar: 'Amaya',
    displayName: 'Long Zhao',
    role: 'Tech Lead',
    slogan: 'Code the World, Lead the Future.',
    linkedin: 'long-zhao-32a96916a',
  },
  {
    avatar: 'Nolan',
    displayName: 'Joe Ma',
    role: 'Developer',
    slogan: 'Empowering Teams to Connect—No matter where you are.',
    linkedin: 'joe-ma',
  },
  {
    avatar: 'Avery',
    displayName: 'Hansen Tang',
    role: 'Developer',
    slogan: 'Meta Town is cool and I love it!',
    linkedin: 'hansen-tang',
  },
  {
    avatar: 'Chase',
    displayName: 'Jenny Zeng',
    role: 'Developer',
    slogan: 'Meta Town helps us talk freely and connect instantly.',
    linkedin: 'jenny-zeng-au',
  },
  {
    avatar: 'David Z',
    displayName: 'David Zhong',
    role: 'Developer',
    slogan: 'The answer is 42 in Meta Town.',
    linkedin: 'shenghongzhong',
  },
  {
    avatar: 'Oliver',
    displayName: 'Emily Sun',
    role: 'Developer',
    slogan: 'Code with care, build with joy.',
    linkedin: 'emily-sunshine',
  },
  {
    avatar: 'Easton',
    displayName: 'Jack Ye',
    role: 'Developer',
    slogan: 'Work Together, From Anywhere.',
    linkedin: 'zichengye',
  },
  {
    avatar: 'Jameson',
    displayName: 'Jiayi Li',
    role: 'Developer',
    slogan: 'All hail Meta Town!',
    linkedin: 'jiayili-lee',
  },
  {
    avatar: 'Wyatt',
    displayName: 'Bob Zou',
    role: 'Developer',
    slogan: 'This is so meta!',
    linkedin: 'haobozou',
  },
  {
    avatar: 'Leo',
    displayName: 'Tuo Yuan',
    role: 'Developer',
    slogan: 'Where Collaboration Comes Alive',
    linkedin: 'tuo-yuan',
  },
  {
    avatar: 'Destiny',
    displayName: 'Jason Wu',
    role: 'Developer',
    slogan: 'Love & Peace',
    linkedin: 'jason-wu-cj',
  },
] as const

const TeamMemberList: FC = () => (
  <div
    className="grid space-y-6 sm:px-24 md:grid-cols-2 md:gap-12 md:space-y-0 md:px-0 xl:grid-cols-3"
    role="List"
    aria-label="Team members"
  >
    {TEAM_MEMBERS.map(({ avatar, displayName, role, slogan, linkedin }) => (
      <div
        role="listitem"
        aria-label="Team member"
        key={linkedin}
        className="min-h-40 rounded-3xl border border-[#c6c6dd] px-4 py-5 md:min-h-60 md:min-w-80 md:px-8 md:py-10"
      >
        <div className="mb-6 flex items-center gap-3 md:mb-8 md:gap-4">
          <DicebearPixelArtAvatar seed={avatar} />
          <div className="space-y-2">
            <div className="flex items-baseline gap-4 md:gap-5">
              <span className="font-bold md:text-xl">{displayName}</span>
              <span className="text-xs text-gray-500 md:text-sm">@{role}</span>
            </div>
            <a
              href={`https://www.linkedin.com/in/${linkedin}`}
              className="flex items-center gap-2 md:gap-3"
              target="_blank"
            >
              <LinkedinLogo className="h-4 w-4 md:h-6 md:w-6" />
              <p className="text-xs text-gray-500 md:text-sm">{linkedin}</p>
            </a>
          </div>
        </div>
        <span className="md:text-lg">{slogan}</span>
      </div>
    ))}
  </div>
)

export default TeamMemberList
