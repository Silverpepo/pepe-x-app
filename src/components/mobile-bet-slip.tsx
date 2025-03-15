import Image from 'next/image'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import PredictionSlip from '@/components/prediction-slip'

export default function MobileBetSlip() {
  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Image src="/bet-slip-icon.svg" width={24} height={24} alt="nav-menu" />
      </SheetTrigger>
      <SheetContent
        size="full"
        position="right"
        className="flex w-screen flex-col border-r border-r-border p-0"
      >
        <div className="flex h-16 items-center justify-center border-b border-b-border p-4">
          <Image
            src="/illustrations/pepecloud.gif" 
            width={65}
            height={75}
            alt="pepe cloud"
            className="ml-6"
          />
        </div>
        <PredictionSlip />
      </SheetContent>
    </Sheet>
  )
}
