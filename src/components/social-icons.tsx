'use client'

import { SocialIcon } from 'react-social-icons'

export default function SocialIcons() {
  return (
    <div className="fixed bottom-8 right-8 flex gap-4 z-50">
      <SocialIcon 
        url="https://twitter.com/pepe_xtrad"
        bgColor="transparent"
        fgColor="white"
        className="hover:scale-110 transition-transform"
      />
      <SocialIcon 
        url="https://discord.gg/9zVFrWTDbX"
        bgColor="transparent"
        fgColor="white"
        className="hover:scale-110 transition-transform"
      />
      <SocialIcon 
        url="https://telegram.com/"
        bgColor="transparent"
        fgColor="white"
        className="hover:scale-110 transition-transform"
      />
      <SocialIcon 
        url="https://github.com/"
        bgColor="transparent"
        fgColor="white"
        className="hover:scale-110 transition-transform"
      />
    </div>
  )
}
