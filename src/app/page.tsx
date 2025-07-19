'use client'

import { FC } from 'react'
import GradientBackground from '@/components/GradientBackground'
import LayoutContainer from '@/components/LayoutContainer'
import Header from './_components/Header'
import Banner from './_components/Banner'
import AboutTheTeam from './_components/AboutTheTeam'
import Footer from './_components/Footer'
import CTABanner from './_components/CTABanner'
import Functions from './_components/Functions'
import Features from './_components/Features'

const App: FC = () => (
  <>
    <GradientBackground>
      <LayoutContainer className="space-y-6 pb-10 md:space-y-[100px] md:pb-[135px]">
        <Header />
        <Banner />
      </LayoutContainer>
    </GradientBackground>
    <LayoutContainer className="pb-16 pt-12 md:pb-[200px] md:pt-[140px]">
      <Features />
    </LayoutContainer>
    <GradientBackground variant="dark">
      <LayoutContainer className="py-12 md:px-20 md:py-20 lg:py-20 xl:px-64 xl:py-40">
        <Functions />
      </LayoutContainer>
    </GradientBackground>
    <LayoutContainer className="py-16 md:py-[200px]">
      <AboutTheTeam />
    </LayoutContainer>
    <CTABanner />
    <LayoutContainer>
      <Footer />
    </LayoutContainer>
  </>
)

export default App
