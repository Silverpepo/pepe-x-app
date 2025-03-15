'use client'
import { useEffect } from 'react'
import Image from 'next/image'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useDebounce } from '@/hooks/useDebounce'
import { useLocalStateContext } from '@/app/context'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Direction, Prediction } from '@/types'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { estimateReward } from '@/lib/prediction-utils'

const formSchema = z.object({
  amount: z.coerce.number().gt(0),
  toWin: z.coerce.number(),
})

export default function PredictionSlipCard({
  prediction,
}: {
  prediction: Prediction
}) {
  const { predictions, setPredictions } = useLocalStateContext()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 1, // Default minimum amount hardcoded
      toWin: 0,
    },
  })
  
  const amount = form.watch('amount')
  const debouncedAmount = useDebounce(amount)
  
  // Calculate reward using our utility function
  useEffect(() => {
    if (debouncedAmount > 0 && prediction) {
      // For placeholder windows, use a simple 1:1 estimation
      const estimatedReward = prediction.window.__isPlaceholder
        ? debouncedAmount // For placeholder windows, just show 1:1 ratio
        : estimateReward(prediction, debouncedAmount)
      
      // Update the form
      form.setValue('toWin', estimatedReward)
      
      // Update prediction in global state
      const newPredictions = [...predictions]
      const index = predictions.findIndex(
        (p) => p.window.windowId === prediction.window.windowId && 
              p.market.id === prediction.market.id,
      )
      
      if (index !== -1) {
        newPredictions[index] = {
          ...prediction,
          amount: debouncedAmount,
          toWin: estimatedReward,
        }
        setPredictions(newPredictions)
      }
    }
  }, [debouncedAmount, prediction, form, predictions, setPredictions])
  
  return (
    <div className="mb-4 flex w-full items-start space-x-[24px] rounded-[8px] border-l-[12px] border-l-[#2FB96C] bg-card py-6 pl-3 pr-4">
      <button
        onClick={() => {
          const index = predictions.findIndex(
            (p) => p.window.windowId === prediction.window.windowId && 
                  p.market.id === prediction.market.id,
          )
          setPredictions([
            ...predictions.slice(0, index),
            ...predictions.slice(index + 1),
          ])
        }}
      >
        <Image src="/bin.svg" width={16} height={16} alt="bin" />
      </button>
      <div>
        <div className="mb-2 flex items-center space-x-[4px]">
          <Image
            src={prediction.market.logo || `/na.webp`}
            width={16}
            height={16}
            className="max-h-[16px] max-w-[16px] object-contain"
            alt={prediction.market.pair}
          />
          <p className="font-[450] leading-4 flex items-center">
            {prediction.predictedDirection === Direction.Up ? (
              <><ArrowUp className="mr-1 h-4 w-4 text-green-400" /> Price Up</>
            ) : (
              <><ArrowDown className="mr-1 h-4 w-4 text-red-400" /> Price Down</>
            )}
          </p>
        </div>
        <p className="text-[12px] leading-4 text-secondary-foreground">
          {`${prediction.market.pair}, Locks: ${format(new Date(prediction.window.lockTime * 1000), 'MMM d @ h:mm aaa')}`}
        </p>
        <Form {...form}>
          <form className="grid w-full grid-flow-col gap-4 md:grid-flow-col md:gap-2">
            <div>
              <span className="mb-2 text-[14px] leading-4">Amount</span>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex space-x-[8px] rounded-[8px] bg-secondary px-4 py-3">
                        <Image
                          src="/tokens/PEPO.svg" 
                          width={16}
                          height={16}
                          alt="PEPO"
                        />
                        <Input
                          type="number"
                          className="h-auto rounded-none border-0 p-0 [appearance:textfield] focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          {...field}
                          onChange={(e) => {
                            if (Number(e.target.value) < 0) {
                              return
                            }
                            field.onChange(e)
                          }}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <span className="mb-2 text-[14px] leading-4">To Win</span>
              <FormField
                control={form.control}
                name="toWin"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex space-x-[8px] rounded-[8px] bg-secondary px-4 py-3">
                        <Image
                          src="/tokens/PEPO.svg" 
                          width={16}
                          height={16}
                          alt="PEPO"
                        />
                        <Input
                          disabled
                          type="number"
                          className="h-auto rounded-none border-0 p-0 [appearance:textfield] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-default disabled:opacity-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
