import React from 'react';

import { Section, SectionText, SectionTitle } from '../../styles/GlobalComponents';
import {  LeftSection, ProfileImage, RightSection } from './HeroStyles';
import Button from '../../styles/GlobalComponents/Button';

const Hero = (props) => (
  <Section row nopadding> 
    <LeftSection>
      <ProfileImage src="https://via.placeholder.com/150" alt="Profile" />
    </LeftSection>
    <RightSection>
      <SectionTitle main center>
        Welcome to <br />
        My Personal Portfolio
      </SectionTitle>
      <SectionText> 
        I'm a software engineer with a passion for building scalable and efficient systems. I'm currently a student at the University of California, San Diego, and I'm looking for opportunities to work on exciting projects.
      </SectionText>
      <Button onClick={() => window.location = 'https://google.com'}>Learn More</Button>
    </RightSection>
  </Section>
);

export default Hero;